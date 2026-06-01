import posthog from "posthog-js";
import { getStoredPreferences } from "~/components/cookie-consent";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
	api_host: "/ingest",
	ui_host: "https://eu.posthog.com",
	defaults: "2026-01-30",
	opt_out_capturing_by_default: true,
});

const prefs = getStoredPreferences();
if (prefs?.analytics) {
	posthog.opt_in_capturing();
}
