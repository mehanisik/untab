import { cacheSignal } from "react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { getEnv } from "./validate-env";
import type { PortableTextBlock } from "next-sanity";

export interface Post {
	_id: string;
	title: string;
	slug: string;
	author: {
		name: string;
		image: string;
		bio?: PortableTextBlock[];
	};
	mainImage: string;
	publishedAt: string;
	body?: PortableTextBlock[];
	excerpt: string;
	readingTime?: string;
	categories?: { title: string }[];
	featured?: boolean;
	seo?: {
		title: string;
		description: string;
		image: string;
		keywords: string[];
	};
}

const env = getEnv();

export const client = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	useCdn: process.env.NODE_ENV === "production",
	stega: {
		enabled: process.env.NODE_ENV === "development",
		studioUrl: "/studio",
	},
});

const builder = createImageUrlBuilder(client);

// biome-ignore lint/suspicious/noExplicitAny: Sanity image sources are polymorphic
export function urlFor(source: any) {
	return builder.image(source);
}

export async function fetchSanity<T>(
	query: string,
	params: Record<string, unknown> = {},
	tags?: string[],
): Promise<T> {
	const signal = cacheSignal();

	return client.fetch<T>(query, params, {
		next: { tags, revalidate: 3600 },
		// biome-ignore lint/suspicious/noExplicitAny: cacheSignal cast is required for fetch compatibility
		signal: signal as any,
	});
}

export async function getSettings() {
	return fetchSanity<{ logo: string }>(`*[_type == "settings"][0]{
    ...,
    "logo": logo.asset->url
  }`);
}

export const QUERIES = {
	projects: `*[_type == "project"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "category": category->title,
    year,
    description,
    client {
      name,
      "logo": logo.asset->url,
      website
    },
    metrics,
    featured,
    content,
    techStack,
    accentColor
  }`,
	projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "category": category->title,
    year,
    description,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    client {
      name,
      "logo": logo.asset->url,
      website
    },
    metrics,
    content,
    branding,
    testimonial {
      quote,
      author,
      role,
      "avatar": avatar.asset->url
    },
    links,
    techStack,
    tools,
    "author": {
      "name": author->name,
      "image": author->image.asset->url,
      "bio": author->bio
    },
    seo
  }`,
	posts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "author": {
      "name": author->name,
      "image": author->image.asset->url
    },
    "mainImage": mainImage.asset->url,
    publishedAt,
    excerpt,
    readingTime,
    "categories": categories[]->{title},
    featured,
    seo
  }`,
	postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "author": {
      "name": author->name,
      "image": author->image.asset->url,
      "bio": author->bio
    },
    "mainImage": mainImage.asset->url,
    publishedAt,
    body,
    excerpt,
    readingTime,
    "categories": categories[]->{title},
    featured,
    seo
  }`,
	settings: `*[_type == "settings"][0] {
    title,
    "logo": logo.asset->url,
    socials,
    footerText,
    copyright
  }`,
};
