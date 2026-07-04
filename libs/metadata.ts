import type { Metadata } from "next";
import { urlFor } from "./sanity";

/**
 * Metadata Generation Utilities
 *
 * Helpers to generate consistent metadata across pages,
 * reducing duplication and ensuring SEO best practices.
 */

interface GenerateMetadataOptions {
	title?: string;
	description?: string;
	keywords?: string[];
	image?: {
		url?: string;
		width?: number;
		height?: number;
		alt?: string;
	};
	url?: string;
	siteName?: string;
	noIndex?: boolean;
	type?: "website" | "article";
	publishedTime?: string;
	modifiedTime?: string;
	authors?: string[];
}

const DEFAULT_KEYWORDS = [
	"Digital Agency Warsaw",
	"Warsaw Web Design Studio",
	"Next.js Development Agency",
	"Premium UI/UX Design",
	"Digital Product Studio",
	"Software House Poland",
	"Creative Agency Warsaw",
];

// Get base URL from environment, fail fast if missing in production
function getBaseUrl(): string {
	const url = process.env.NEXT_PUBLIC_BASE_URL;
	if (!url) {
		if (
			process.env.NODE_ENV === "production" &&
			process.env.SKIP_ENV_VALIDATION !== "true"
		) {
			throw new Error(
				"NEXT_PUBLIC_BASE_URL environment variable is required in production. Please set it to your production URL.",
			);
		}
		// Dev/CI fallback
		return "http://localhost:3000";
	}
	return url;
}

const APP_BASE_URL = getBaseUrl();

/**
 * Generate complete metadata object for pages
 *
 * @example
 * ```ts
 * export async function generateMetadata({ params }) {
 *   const page = await fetchPage(params.slug)
 *
 *   return generatePageMetadata({
 *     title: page.metadata?.title || page.title,
 *     description: page.metadata?.description,
 *     image: { url: page.metadata?.image?.asset?.url },
 *     url: `/page/${params.slug}`,
 *     noIndex: page.metadata?.noIndex,
 *   })
 * }
 * ```
 */
export function generatePageMetadata(
	options: GenerateMetadataOptions,
): Metadata {
	const {
		title,
		description,
		keywords = DEFAULT_KEYWORDS,
		image,
		url,
		siteName = "Untab Studio",
		noIndex = false,
		type = "website",
		publishedTime,
		modifiedTime,
		authors,
	} = options;

	const fullUrl = url ? `${APP_BASE_URL}${url}` : APP_BASE_URL;
	// Only set explicit og/twitter images when the page provides one (e.g.
	// Sanity documents). Otherwise omit `images` entirely so Next's
	// file-convention app/opengraph-image.png / twitter-image.png (correct
	// 1200x630-ratio cards) are used instead of a distorted logo fallback.
	const ogImages = image?.url
		? [
				{
					url: image.url,
					width: image.width || 1200,
					height: image.height || 630,
					alt: image.alt || title || siteName,
				},
			]
		: undefined;

	const metadata: Metadata = {
		metadataBase: new URL(APP_BASE_URL),
		title,
		description,
		keywords,
		alternates: {
			canonical: url || "/",
		},
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName,
			locale: "en_US",
			type,
			...(ogImages && { images: ogImages }),
			...(publishedTime && { publishedTime }),
			...(modifiedTime && { modifiedTime }),
			...(authors && { authors }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(ogImages && { images: ogImages }),
		},
		other: {
			"fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
		},
	};

	if (noIndex) {
		metadata.robots = {
			index: false,
			follow: false,
		};
	}

	return metadata;
}

/**
 * Generate metadata specifically for Sanity CMS pages
 *
 * @example
 * ```ts
 * export async function generateMetadata({ params }) {
 *   const { data } = await sanityFetch({ query: pageQuery, params })
 *
 *   return generateSanityMetadata({
 *     document: data,
 *     url: `/sanity/${params.slug}`,
 *   })
 * }
 * ```
 */
export function generateSanityMetadata(options: {
	document: {
		title?: string;
		seo?: {
			title?: string;
			description?: string;
			image?: string | { asset?: { url?: string }; [key: string]: unknown };
			keywords?: string[];
			noIndex?: boolean;
		};
		metadata?: {
			title?: string;
			description?: string;
			keywords?: string[];
			image?: { asset?: { url?: string } };
			noIndex?: boolean;
		};
		_updatedAt?: string;
		publishedAt?: string;
	};
	url?: string;
	type?: "website" | "article";
}): Metadata {
	const { document, url, type = "website" } = options;
	const seo = document.seo || document.metadata;

	if (!seo) {
		return generatePageMetadata({
			title: document.title,
			url,
			type,
		});
	}

	const imageUrl =
		typeof seo.image === "string"
			? seo.image
			: seo.image?.asset?.url ||
				(seo.image ? urlFor(seo.image).url() : undefined);

	return generatePageMetadata({
		title: seo.title || document.title,
		description: seo.description,
		keywords: seo.keywords,
		image: {
			url: imageUrl,
		},
		url,
		noIndex: seo.noIndex,
		type,
		publishedTime: document.publishedAt,
		modifiedTime: document._updatedAt,
	});
}
