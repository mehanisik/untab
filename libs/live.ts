import { cacheTag } from "next/cache";
import { defineLive } from "next-sanity/live";
import { client, type Settings } from "./sanity";

// Read token lets sanityFetch use stega in dev for Visual Editing overlays.
// Live updates of published content work without it (public dataset). Only a
// VALID token may be sent — Sanity 401s an invalid/revoked token even on a
// public dataset, which silently empties every authed read. The known-good
// token goes first. Stays server-side only (browserToken: false).
const token =
	process.env.SANITY_ADMIN_TOKEN ||
	process.env.SANITY_API_READ_TOKEN ||
	process.env.SANITY_API_TOKEN;

const { SanityLive, sanityFetch } = defineLive({
	client,
	serverToken: token,
	// No draft preview outside dev, so never ship a token to the browser.
	browserToken: false,
	strict: true,
});

export { SanityLive };

const stega = process.env.NODE_ENV === "development" && Boolean(token);

/**
 * Cache-first Sanity read for `cacheComponents`. The "use cache" boundary is
 * tagged with cacheTag(...tags) so the /api/revalidate webhook's
 * revalidateTag() busts exactly the affected pages on publish — inner fetch
 * tags do NOT propagate to a "use cache" entry, so this tagging is required.
 * Cache lifetime comes from the `default` cacheLife profile in next.config.
 */
export async function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	tags?: string[],
	opts?: { stega?: boolean },
): Promise<T> {
	"use cache";
	if (tags?.length) cacheTag(...tags);
	const { data } = await sanityFetch({
		query,
		params,
		perspective: "published",
		// Metadata/SEO reads pass stega:false so invisible Visual-Editing chars
		// never leak into <head>. Body reads keep the dev-only default.
		stega: opts?.stega ?? stega,
		tags,
	});
	return data as T;
}

export async function getSettings() {
	return fetchSanity<Settings>(
		`*[_type == "settings"][0]{
    ...,
    "logo": logo.asset->url,
    "heroVideo": heroVideo.asset->url
  }`,
	);
}
