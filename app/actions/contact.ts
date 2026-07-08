"use server";

import { isSpoofedBot } from "@arcjet/inspect";
import { request } from "@arcjet/next";
import { Resend } from "resend";
import { UntabConfirmationEmail } from "~/emails/untab-confirmation";
import { UntabContactEmail } from "~/emails/untab-contact";
import { aj } from "~/libs/arcjet";
import { PROJECT_TYPES } from "~/libs/contact";
import { isValidEmail, sanitizeInput } from "~/libs/escape-html";
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
const MAX_COMPANY_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;

const ALLOWED_PROJECT_TYPES = new Set<string>(PROJECT_TYPES);

const MIN_SUBMIT_TIME_MS = 2000;

// Local backstop rate limit so abuse protection never depends solely on
// Arcjet availability (its block fails open by design). Per-instance
// memory resets on cold starts, which is fine for a backstop.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 8;
const recentSends: number[] = [];
const lastSendByEmail = new Map<string, number>();

function localRateLimited(email: string): boolean {
	const now = Date.now();
	while (
		recentSends.length &&
		now - (recentSends[0] as number) > RATE_WINDOW_MS
	) {
		recentSends.shift();
	}
	if (recentSends.length >= RATE_MAX_PER_WINDOW) return true;
	const last = lastSendByEmail.get(email);
	if (last && now - last < RATE_WINDOW_MS) return true;
	recentSends.push(now);
	if (lastSendByEmail.size > 1000) lastSendByEmail.clear();
	lastSendByEmail.set(email, now);
	return false;
}

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
	const rawCompany = formData.get("company") as string;
	const rawPhone = formData.get("phone") as string;

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
	const company = rawCompany
		? sanitizeInput(rawCompany, MAX_COMPANY_LENGTH)
		: "";
	const phone = rawPhone ? sanitizeInput(rawPhone, MAX_PHONE_LENGTH) : "";
	const message = sanitizeInput(rawMessage, MAX_MESSAGE_LENGTH);

	if (name.length < 2) {
		return { error: "Name must be at least 2 characters long." };
	}

	// Hard format gate, independent of Arcjet: this address becomes replyTo
	// and the confirmation recipient, so it must be a plausible email.
	if (!isValidEmail(email)) {
		return { error: "Please provide a valid email address." };
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

	if (localRateLimited(email)) {
		return {
			error: "You've sent too many messages. Please try again in a minute.",
		};
	}

	try {
		// Company/phone are optional, so fold them into the message body (the
		// email template renders it with `whitespace-pre-wrap`, preserving the
		// newlines) rather than widening the email template's props.
		const detailLines = [
			company ? `Company: ${company}` : null,
			phone ? `Phone: ${phone}` : null,
		].filter(Boolean);
		const fullMessage = detailLines.length
			? `${detailLines.join("\n")}\n\n${message}`
			: message;

		const recipientEmail = CONTACT_EMAIL!;

		const { error } = await resend.emails.send({
			from: SENDER_EMAIL,
			to: [recipientEmail],
			subject: `New Contact Form Submission: ${name}`,
			replyTo: email,
			react: UntabContactEmail({
				name,
				email,
				projectType: projectType || "General inquiry",
				message: fullMessage,
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

		// Confirmation receipt to the sender. Deliberately does not echo the
		// message body, so the form cannot be used to relay content to third
		// parties. A failure here never fails the submission.
		try {
			await resend.emails.send({
				from: SENDER_EMAIL,
				to: [email],
				subject: "We received your message",
				react: UntabConfirmationEmail({ name }),
			});
		} catch (confirmationError) {
			console.error("Confirmation email error:", confirmationError);
		}

		return { success: true };
	} catch (error) {
		console.error("Server action error:", error);
		return { error: "Internal server error. Please try again later." };
	}
}
