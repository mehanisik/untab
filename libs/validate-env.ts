interface EnvConfig {
	NEXT_PUBLIC_SANITY_PROJECT_ID: string;
	NEXT_PUBLIC_SANITY_DATASET?: string;
	NEXT_PUBLIC_BASE_URL: string;
	RESEND_API_KEY?: string;
	CONTACT_EMAIL?: string;
	NEXT_PUBLIC_UMAMI_WEBSITE_ID?: string;
	ARCJET_API_KEY?: string;
}

export function validateEnv(): EnvConfig {
	const errors: string[] = [];

	const NEXT_PUBLIC_SANITY_PROJECT_ID =
		process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

	if (!NEXT_PUBLIC_SANITY_PROJECT_ID) {
		errors.push("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
	}

	if (!NEXT_PUBLIC_BASE_URL && process.env.NODE_ENV === "production") {
		errors.push("NEXT_PUBLIC_BASE_URL is required in production");
	}

	if (NEXT_PUBLIC_BASE_URL) {
		try {
			new URL(NEXT_PUBLIC_BASE_URL);
		} catch {
			errors.push(
				"NEXT_PUBLIC_BASE_URL must be a valid URL (e.g., https://untab.studio)",
			);
		}
	}

	const RESEND_API_KEY = process.env.RESEND_API_KEY;
	const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

	const isServer = typeof window === "undefined";

	if (isServer && process.env.NODE_ENV === "production") {
		if (!RESEND_API_KEY) {
			errors.push(
				"RESEND_API_KEY is required in production for contact form functionality",
			);
		}

		if (!CONTACT_EMAIL) {
			errors.push(
				"CONTACT_EMAIL is required in production for contact form functionality",
			);
		}

		if (!process.env.ARCJET_API_KEY) {
			errors.push(
				"ARCJET_API_KEY is required in production for action protection",
			);
		}
	}

	if (errors.length > 0) {
		throw new Error(
			`Environment variable validation failed:\n${errors.join("\n")}\n\nPlease check your .env file or environment configuration.`,
		);
	}

	return {
		NEXT_PUBLIC_SANITY_PROJECT_ID: NEXT_PUBLIC_SANITY_PROJECT_ID!,
		NEXT_PUBLIC_SANITY_DATASET:
			process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
		NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
		RESEND_API_KEY,
		CONTACT_EMAIL,
		NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		ARCJET_API_KEY: process.env.ARCJET_API_KEY,
	};
}

export function getEnv(): EnvConfig {
	return validateEnv();
}
