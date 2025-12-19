import { cacheSignal } from "react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	useCdn: process.env.NODE_ENV === "production",
	stega: {
		enabled: process.env.NODE_ENV === "development",
		studioUrl: "/studio",
	},
});

const builder = createImageUrlBuilder(client);

// biome-ignore lint/suspicious/noExplicitAny: sanity image source can be any valid source
export function urlFor(source: any) {
	return builder.image(source);
}

/**
 * Enhanced fetcher with React 19 cacheSignal support
 */
export async function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	tags?: string[],
): Promise<T> {
	const signal = cacheSignal();

	return client.fetch<T>(query, params, {
		next: { tags, revalidate: 3600 }, // Default 1hr cache
		// biome-ignore lint/suspicious/noExplicitAny: cacheSignal returns a type incompatible with AbortSignal in current types
		signal: signal as any,
	});
}

export const QUERIES = {
	projects: `*[_type == "project"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    description,
    "image": image.asset->url,
    content,
    branding,
    techStack,
    tools
  }`,
	projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    description,
    "image": image.asset->url,
    content,
    branding,
    techStack,
    tools
  }`,
	posts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    "mainImage": mainImage.asset->url,
    publishedAt,
    excerpt
  }`,
	postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    "mainImage": mainImage.asset->url,
    publishedAt,
    body,
    excerpt
  }`,
};
