import arcjet, {
	detectBot,
	shield,
	tokenBucket,
	validateEmail,
} from "@arcjet/next";

const AJ_KEY = process.env.ARCJET_API_KEY;

/**
 * Centralized Arcjet client configuration
 * Provides protection against bots, rate limiting, and email validation
 * Includes Shield (WAF) and Filters for added security
 */
export const aj = arcjet({
	key: AJ_KEY!,
	rules: [
		// Shield is a WAF-like protection for common attacks
		shield({
			mode: "LIVE",
		}),
		// Bot detection to block automated submissions
		detectBot({
			mode: "LIVE",
			allow: [
				"CATEGORY:SEARCH_ENGINE",
				"CATEGORY:PREVIEW",
				"CATEGORY:MONITOR",
			],
		}),
		// Token bucket rate limiting for more flexible control
		tokenBucket({
			mode: "LIVE",
			characteristics: ["ip.src"], // Track requests by IP address
			refillRate: 5, // Refill 5 tokens per interval
			interval: 10, // Refill every 10 seconds
			capacity: 10, // Bucket capacity of 10 tokens
		}),
		// Email validation for production-grade deliverability
		validateEmail({
			mode: "LIVE",
			block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
		}),
	],
});
