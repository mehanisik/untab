import { cacheTag } from "next/cache";
import { defineLive } from "next-sanity/live";
import { client, type Settings } from "./sanity";

const token =
	process.env.SANITY_ADMIN_TOKEN ||
	process.env.SANITY_API_READ_TOKEN ||
	process.env.SANITY_API_TOKEN;

const { SanityLive, sanityFetch } = defineLive({
	client,
	serverToken: token,
	browserToken: false,
	strict: true,
});

export { SanityLive };

const stega = process.env.NODE_ENV === "development" && Boolean(token);

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
