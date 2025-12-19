"use server";

import { Resend } from "resend";

import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 3; // Max 3 requests
const WINDOW = 60 * 60 * 1000; // per hour

export async function sendContactEmail(formData: FormData) {
	// Honeypot check
	const _honeypot = formData.get("_honeypot") as string;
	if (_honeypot) {
		console.warn("Honeypot triggered");
		return { success: true }; // Silently fail for bots
	}

	// Rate limiting
	const headerList = await headers();
	const ip = headerList.get("x-forwarded-for") || "unknown";
	const now = Date.now();
	const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

	if (now - userLimit.lastReset > WINDOW) {
		userLimit.count = 0;
		userLimit.lastReset = now;
	}

	if (userLimit.count >= LIMIT) {
		return {
			error:
				"Whoa there, eager beaver! You've sent enough messages for now. Try again in an hour!",
		};
	}

	userLimit.count++;
	rateLimitMap.set(ip, userLimit);

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const projectType = formData.get("projectType") as string;
	const message = formData.get("message") as string;

	if (!(name && email && message)) {
		return { error: "Please fill in all required fields." };
	}

	try {
		const { data, error } = await resend.emails.send({
			from: "Untab Studio <onboarding@resend.dev>",
			to: ["mehmethanifiisik64@gmail.com"], // Using the verified testing email for now
			subject: `New Contact Form Submission: ${name}`,
			replyTo: email,
			html: `
				<h1>New Contact Form Submission</h1>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
				<p><strong>Message:</strong></p>
				<p>${message}</p>
			`,
		});

		if (error) {
			console.error("Resend error:", error);
			return { error: "Failed to send email" };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Server action error:", error);
		return { error: "Internal server error" };
	}
}
