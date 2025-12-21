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

// Final check for contact dependencies (already validated by getEnv but for type safety)
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

export async function sendContactEmail(formData: FormData) {
	const _honeypot = formData.get("_honeypot") as string;
	if (_honeypot) {
		if (process.env.NODE_ENV === "development") {
			console.warn("Honeypot triggered");
		}
		return { success: true };
	}

	const rawEmail = formData.get("email") as string;

	// Arcjet protection
	try {
		const req = await request();
		const decision = await aj.protect(req, {
			email: rawEmail, // Pass email for validation rule
			requested: 5, // Deduct 5 tokens from the bucket
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
						"Whoa there, eager beaver! You've sent enough messages for now. Try again in an hour!",
				};
			}
			if (decision.reason.isBot()) {
				return { error: "Bots are not allowed." };
			}
			if (decision.reason.isEmail()) {
				return {
					error: "Invalid email address. Please provide a valid one.",
				};
			}
			return { error: "Access denied." };
		}

		// Additional advanced checks
		if (decision.ip.isHosting()) {
			return {
				error: "Forbidden: Requests from hosting providers are not allowed.",
			};
		}

		if (decision.results.some(isSpoofedBot)) {
			return { error: "Forbidden: Spoofed bot detected." };
		}
	} catch (error) {
		// Log error but proceed to avoid blocking users if Arcjet is down
		console.error("Arcjet error:", error);
	}

	const rawName = formData.get("name") as string;
	const rawProjectType = formData.get("projectType") as string;
	const rawMessage = formData.get("message") as string;

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

	try {
		const escapedName = escapeHtml(name);
		const escapedEmail = escapeHtml(email);
		const escapedProjectType = escapeHtml(projectType || "N/A");
		const escapedMessage = escapeHtml(message);

		const recipientEmail = CONTACT_EMAIL!;

		const { data, error } = await resend.emails.send({
			from: "Untab Studio <onboarding@resend.dev>",
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

		return { success: true, data };
	} catch (error) {
		console.error("Server action error:", error);
		return { error: "Internal server error. Please try again later." };
	}
}
