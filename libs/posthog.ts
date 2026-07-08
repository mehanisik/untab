import type { PostHog } from "posthog-js";

// posthog-js is ~55KB. Keeping it out of the initial bundle and loading it
// only after the visitor accepts analytics means the tracker is never
// downloaded or parsed for anyone who declines or hasn't decided yet.

let instance: PostHog | null = null;
let loading: Promise<PostHog> | null = null;

/**
 * Dynamically import and initialise posthog-js. Safe to call repeatedly — the
 * SDK is imported and `init()` runs at most once. Resolves to the live client.
 */
export function loadPostHog(): Promise<PostHog> {
	if (instance) return Promise.resolve(instance);
	if (loading) return loading;

	loading = import("posthog-js").then(({ default: posthog }) => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
			api_host: "/ingest",
			ui_host: "https://eu.posthog.com",
			defaults: "2026-01-30",
			// Honor the browser's Do Not Track signal.
			respect_dnt: true,
			// Never create anonymous person profiles; only identified users get one.
			person_profiles: "identified_only",
			// Mask PII in session replays at the source, not just via CSS classes.
			session_recording: {
				maskAllInputs: true,
				maskTextSelector: "*",
			},
		});
		instance = posthog;
		return posthog;
	});

	return loading;
}

/**
 * The initialised client, or null if it was never loaded (visitor declined or
 * hasn't consented). Use for optional calls that must not force-load the SDK,
 * e.g. reporting an exception from an error boundary.
 */
export function getPostHog(): PostHog | null {
	return instance;
}
