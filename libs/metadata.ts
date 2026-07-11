import type { Metadata } from "next";

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
		return "http://localhost:3000";
	}
	return url;
}

const APP_BASE_URL = getBaseUrl();

export const SITE_URL = APP_BASE_URL;

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
