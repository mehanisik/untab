"use server";

import { Resend } from "resend";
import { escapeHtml, sanitizeInput } from "~/libs/escape-html";

import { aj } from "~/libs/arcjet";
import { request } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

import { UntabContactEmail } from "~/emails/untab-contact";
import { getEnv } from "~/libs/validate-env";

const env = getEnv();
const RESEND_API_KEY = env.RESEND_API_KEY;
const CONTACT_EMAIL = env.CONTACT_EMAIL;
const SENDER_EMAIL = env.SENDER_EMAIL || "Untab <contact@untabstudio.com>";

if (!(RESEND_API_KEY && CONTACT_EMAIL)) {
	throw new Error(
		"Contact form environment variables are missing. Please check your .env file.",
	);
}

const resend = new Resend(RESEND_API_KEY);

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_PROJECT_TYPE_LENGTH = 50;

const ALLOWED_PROJECT_TYPES = new Set([
	"Website & Platform",
	"Brand Strategy",
	"Branding",
	"Creative Content",
	"Design System",
	"Other",
]);

const MIN_SUBMIT_TIME_MS = 2000;

const SPAM_PATTERNS = [
	/https?:\/\//i,
	/<script/i,
	/<iframe/i,
	/\[url=/i,
	/\[link=/i,
];

function looksLikeSpam(value: string): boolean {
	return SPAM_PATTERNS.some((pattern) => pattern.test(value));
}

export async function sendContactEmail(formData: FormData) {
	const honeypot = formData.get("_honeypot") as string;
	if (honeypot) {
		return { success: true };
	}

	const formTimestamp = formData.get("_t") as string;
	if (formTimestamp) {
		const elapsed = Date.now() - Number(formTimestamp);
		if (elapsed < MIN_SUBMIT_TIME_MS) {
			return { success: true };
		}
	}

	const rawEmail = formData.get("email") as string;
	const rawMessage = formData.get("message") as string;

	try {
		const req = await request();
		const decision = await aj.protect(req, {
			email: rawEmail,
			requested: 5,
			sensitiveInfoValue: rawMessage || "",
		});

		if (process.env.NODE_ENV === "development") {
			console.log("✦ Arcjet Decision:", decision.conclusion);
			if (decision.isDenied()) {
				console.log("✦ Arcjet Denied Reason:", decision.reason);
			}
		}

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return {
					error:
						"You've sent too many messages. Please try again in a few minutes.",
				};
			}
			if (decision.reason.isBot()) {
				return { error: "Automated submissions are not allowed." };
			}
			if (decision.reason.isEmail()) {
				return {
					error: "Invalid email address. Please provide a valid one.",
				};
			}
			if (decision.reason.isSensitiveInfo()) {
				return {
					error:
						"Your message contains sensitive information like credit card numbers. Please remove it before sending.",
				};
			}
			return { error: "Access denied." };
		}

		if (decision.ip.isHosting()) {
			return {
				error: "Requests from hosting providers are not allowed.",
			};
		}

		if (decision.results.some(isSpoofedBot)) {
			return { error: "Access denied." };
		}
	} catch (error) {
		console.error("Arcjet error:", error);
	}

	const rawName = formData.get("name") as string;
	const rawProjectType = formData.get("projectType") as string;

	if (!rawName) {
		return { error: "Name is required." };
	}
	if (!rawEmail) {
		return { error: "Email is required." };
	}
	if (!rawMessage) {
		return { error: "Message is required." };
	}

	const name = sanitizeInput(rawName, MAX_NAME_LENGTH);
	const email = sanitizeInput(rawEmail, MAX_EMAIL_LENGTH);
	const projectType = rawProjectType
		? sanitizeInput(rawProjectType, MAX_PROJECT_TYPE_LENGTH)
		: "";
	const message = sanitizeInput(rawMessage, MAX_MESSAGE_LENGTH);

	if (name.length < 2) {
		return { error: "Name must be at least 2 characters long." };
	}

	if (message.length < 10) {
		return { error: "Message must be at least 10 characters long." };
	}

	if (looksLikeSpam(name)) {
		return { error: "Name contains invalid characters." };
	}

	if (projectType && !ALLOWED_PROJECT_TYPES.has(projectType)) {
		return { error: "Invalid project type selected." };
	}

	try {
		const escapedName = escapeHtml(name);
		const escapedEmail = escapeHtml(email);
		const escapedProjectType = escapeHtml(projectType || "N/A");
		const escapedMessage = escapeHtml(message);

		const recipientEmail = CONTACT_EMAIL!;

		const { error } = await resend.emails.send({
			from: SENDER_EMAIL,
			to: [recipientEmail],
			subject: `New Contact Form Submission: ${escapedName}`,
			replyTo: email,
			react: UntabContactEmail({
				name: escapedName,
				email: escapedEmail,
				projectType: escapedProjectType,
				message: escapedMessage,
			}),
		});

		if (error) {
			console.error("Resend error:", error);
			const devError =
				process.env.NODE_ENV === "development"
					? `: ${error.message || JSON.stringify(error)}`
					: "";
			return {
				error: `Failed to send email${devError}. Please try again later.`,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Server action error:", error);
		return { error: "Internal server error. Please try again later." };
	}
}
