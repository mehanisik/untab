import arcjet, {
	cloudflare,
	detectBot,
	filter,
	sensitiveInfo,
	shield,
	tokenBucket,
	validateEmail,
} from "@arcjet/next";

const AJ_KEY = process.env.ARCJET_API_KEY;

export const aj = arcjet({
	key: AJ_KEY!,
	proxies: [cloudflare()],
	rules: [
		shield({
			mode: "LIVE",
		}),
		detectBot({
			mode: "LIVE",
			allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
		}),
		tokenBucket({
			mode: "LIVE",
			characteristics: ["ip.src"],
			refillRate: 5,
			interval: 10,
			capacity: 10,
		}),
		validateEmail({
			mode: "LIVE",
			deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
		}),
		sensitiveInfo({
			mode: "LIVE",
			deny: ["CREDIT_CARD_NUMBER"],
		}),
		filter({
			mode: "LIVE",
			deny: ["ip.src.vpn", "ip.src.tor", "ip.src.proxy"],
		}),
	],
});
