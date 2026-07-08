import { createImageUrlBuilder } from "@sanity/image-url";
import type { PortableTextBlock } from "next-sanity";
import { createClient } from "next-sanity";
import { getEnv } from "./validate-env";

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

export type ServiceMark =
	| "strategy"
	| "brand"
	| "website"
	| "product"
	| "development"
	| "cloud";

export interface Service {
	title: string;
	mark: ServiceMark;
	lead?: string;
	main?: string;
	cardDescription?: string;
	summary?: string;
	meta?: string;
}

export interface Settings {
	logo?: string;
	heroVideo?: string;
	contactEmail?: string;
	studioCity?: string;
	timezone?: string;
	footerTagline?: string;
	studioTypeLabel?: string;
	blogHeroTitle?: string[];
	journalLabel?: string;
}

export interface ContactInfoBlock {
	title: string;
	body?: string;
	email?: string;
	detailText?: string;
	detailSubtext?: string;
}

export interface Contact {
	headingLines?: string[];
	intro?: string;
	infoBlocks?: ContactInfoBlock[];
}

export interface HomepageFeatureItem {
	title: string;
	description: string;
	location?: string;
	stat?: string;
	caption?: string;
}

export interface HomepagePillar {
	title: string;
	description: string;
}

export interface Homepage {
	intro?: { eyebrow?: string; headingLines?: string[] };
	showcase?: { title?: string; headingLines?: string[]; description?: string };
	features?: { title?: string; items?: HomepageFeatureItem[] };
	collaboration?: {
		title?: string;
		quote?: string;
		attribution?: string;
		note?: string;
		pillars?: HomepagePillar[];
	};
	vision?: {
		kicker?: string;
		description?: string;
		linkText?: string;
		heading?: string;
	};
}

export interface AboutStat {
	value: string;
	label: string;
}

export interface About {
	brandImage?: string;
	eyebrow?: string;
	headingLines?: string[];
	intro?: string[];
	studioStatement?: string;
	studioLinkLabel?: string;
	statsEyebrow?: string;
	statsTitle?: string;
	stats?: AboutStat[];
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

export const QUERIES = {
	authors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    "imageUrl": image.asset->url,
    bio,
    socials
  }`,
	projects: `*[_type == "project"] | order(orderRank asc, year desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "imageAlt": image.alt,
    "imageHotspot": image.hotspot{x, y},
    "cardImage": cardImage.asset->url,
    "cardImageAlt": cardImage.alt,
    "cardImageHotspot": cardImage.hotspot{x, y},
    "previewVideo": previewVideo.asset->url,
    "gallery": gallery[].asset->url,
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
    about,
    services,
    timeline,
    honors,
    "image": image.asset->url,
    "imageAlt": image.alt,
    "cardImage": cardImage.asset->url,
    "cardImageAlt": cardImage.alt,
    "previewVideo": previewVideo.asset->url,
    "gallery": gallery[].asset->url,
    "galleryAlt": gallery[].alt,
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
    "heroVideo": heroVideo.asset->url,
    socials,
    footerText,
    copyright
  }`,
	about: `*[_type == "about"][0] {
    "brandImage": brandImage.asset->url,
    eyebrow,
    headingLines,
    intro,
    studioStatement,
    studioLinkLabel,
    statsEyebrow,
    statsTitle,
    stats[] { value, label }
  }`,
	projectCount: `count(*[_type == "project"])`,
	contact: `*[_id == "contact"][0] {
    headingLines,
    intro,
    infoBlocks[] { title, body, email, detailText, detailSubtext }
  }`,
	homepage: `*[_id == "homepage"][0] {
    intro { eyebrow, headingLines },
    showcase { title, headingLines, description },
    features {
      title,
      items[] { title, description, location, stat, caption }
    },
    collaboration {
      title,
      quote,
      attribution,
      note,
      pillars[] { title, description }
    },
    vision { kicker, description, linkText, heading }
  }`,
	services: `*[_type == "service"] | order(order asc) {
    title,
    mark,
    lead,
    main,
    cardDescription,
    summary,
    meta
  }`,
};
