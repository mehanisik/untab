import type { PostHog } from "posthog-js";

let instance: PostHog | null = null;
let loading: Promise<PostHog> | null = null;

export function loadPostHog(): Promise<PostHog> | null {
	if (instance) return Promise.resolve(instance);
	if (loading) return loading;
	if (process.env.NODE_ENV === "development") return null;

	const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
	if (!token) return null;

	loading = import("posthog-js").then(({ default: posthog }) => {
		posthog.init(token, {
			api_host: "/ingest",
			ui_host: "https://eu.posthog.com",
			defaults: "2026-01-30",
			respect_dnt: true,
			person_profiles: "identified_only",
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

export function getPostHog(): PostHog | null {
	return instance;
}
