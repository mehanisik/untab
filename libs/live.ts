import { defineLive } from "next-sanity/live";
import { type Author, client, QUERIES } from "./sanity";

// Read token lets sanityFetch use stega in dev for Visual Editing overlays.
// Live updates of published content work without it (public dataset). Only a
// VALID token may be sent — Sanity 401s an invalid/revoked token even on a
// public dataset, which silently empties every authed read. The known-good
// token goes first. Stays server-side only (browserToken: false).
const token =
	process.env.SANITY_ADMIN_TOKEN ||
	process.env.SANITY_API_READ_TOKEN ||
	process.env.SANITY_API_TOKEN;

export const { SanityLive, sanityFetch } = defineLive({
	client,
	serverToken: token,
	// No draft preview outside dev, so never ship a token to the browser.
	browserToken: false,
	strict: true,
});

const stega = process.env.NODE_ENV === "development" && Boolean(token);

/**
 * Cached Sanity fetch. Sanity Live revalidates the cache via syncTags as
 * content changes; the optional custom tags keep the /api/revalidate webhook
 * working as a manual fallback.
 */
export async function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	tags?: string[],
): Promise<T> {
	"use cache";
	const { data } = await sanityFetch({
		query,
		params,
		perspective: "published",
		stega,
		tags,
	});
	return data as T;
}

export async function getSettings() {
	return fetchSanity<{ logo: string; heroVideo?: string }>(
		`*[_type == "settings"][0]{
    ...,
    "logo": logo.asset->url,
    "heroVideo": heroVideo.asset->url
  }`,
	);
}

export async function getAuthors() {
	return fetchSanity<Author[]>(QUERIES.authors);
}
