import { getStoredPreferences } from "~/components/cookie-consent";
import { loadPostHog } from "~/libs/posthog";

// Only pull in and initialise posthog-js if this visitor has already accepted
// analytics on a previous visit. Everyone else pays zero bytes for it until
// (and unless) they consent via the cookie banner.
const prefs = getStoredPreferences();
if (prefs?.analytics) {
	void loadPostHog();
}
