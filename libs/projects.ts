import type { PortableTextBlock } from "next-sanity";
import { cache } from "react";
import { fetchSanity } from "./live";
import { QUERIES } from "./sanity";

// Strip zero-width / invisible Unicode characters that Sanity content sometimes
// carries (ZWSP, ZWNJ, ZWJ, word joiner, BOM, combining grapheme joiner, etc.).
// These corrupt rendered widths and break tight layouts.
const INVISIBLE_CHARS = /­|͏|؜|឴|឵|᠎|[​-‏]|[‪-‮]|[⁠-⁤]|[⁪-⁯]|﻿/g;

const cleanString = (value: unknown): unknown => {
	if (typeof value === "string") return value.replace(INVISIBLE_CHARS, "");
	if (Array.isArray(value)) return value.map(cleanString);
	if (value && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			out[k] = cleanString(v);
		}
		return out;
	}
	return value;
};

const sanitize = <T>(value: T): T => cleanString(value) as T;

export type MediaItem =
	| { kind: "image"; src: string; alt?: string; aspect?: number }
	| { kind: "video"; src: string; poster?: string; aspect?: number };

export interface Project {
	_id?: string;
	title: string;
	slug: string;
	category: string;
	year: string;
	href?: string;
	gradient?: string;
	description: string;
	accentColor?: string;
	image: string;
	// Normalised 0–1 focal point set in Sanity Studio. When present the hero
	// mosaic crops around it; otherwise it falls back to a content-aware crop.
	imageHotspot?: { x: number; y: number };
	gallery?: string[];
	client?: {
		name?: string;
		logo?: string;
		website?: string;
	};
	metrics?: {
		duration?: string;
		industry?: string;
		role?: string;
	};
	techStack: string[];
	tools: string[];
	branding: {
		colors: { hex: string; label: string }[];
		typography: { name: string; category: string }[];
	};
	content: {
		mission: string;
		approach: string | PortableTextBlock[];
		result: string | PortableTextBlock[];
		features: string[];
	};
	testimonial?: {
		quote: string;
		author: string;
		role: string;
		avatar?: string;
	};
	links?: {
		live?: string;
		github?: string;
		appStore?: string;
	};
	featured?: boolean;
	// Case study (detail page) fields. `about`/`services`/`timeline`/`honors`
	// come straight from Sanity; `stack`/`visitUrl`/`media` are derived from
	// existing fields (techStack, links/client, image+gallery) in the loader.
	about?: string[];
	services?: string[];
	timeline?: string;
	honors?: string[];
	stack?: string[];
	visitUrl?: string;
	media?: MediaItem[];
}

export const getProjects = cache(async (): Promise<Project[]> => {
	try {
		const sanityProjects = await fetchSanity<Project[]>(QUERIES.projects, {}, [
			"project",
		]);
		if (sanityProjects && sanityProjects.length > 0) {
			return sanityProjects.map((raw) => {
				const p = sanitize(raw);
				const slug = p.slug;
				return {
					...p,
					slug,
					href: `/work/${slug}`,
					// GROQ already resolves image to a URL string (image.asset->url).
					image: p.image || "/projects/placeholder.png",
					gradient: p.gradient || "from-zinc-900 to-zinc-800",
					accentColor: p.accentColor || "zinc",
					branding: p.branding || { colors: [], typography: [] },
				};
			});
		}
	} catch (error) {
		console.error("Error fetching projects from Sanity:", error);
	}
	return [];
});

export const getProjectBySlug = cache(
	async (slug: string): Promise<Project | null> => {
		try {
			const project = await fetchSanity<Project>(
				QUERIES.projectBySlug,
				{ slug },
				[`project:${slug}`],
			);
			if (project) {
				const clean = sanitize(project);
				const slugVal = clean.slug;
				// GROQ already resolves image/gallery to URL strings.
				const image = clean.image || "/projects/placeholder.png";
				const gallery = clean.gallery ?? [];
				const media: MediaItem[] = [
					{ kind: "image", src: image, alt: `${clean.title} hero` },
					...gallery.map((src, i) => ({
						kind: "image" as const,
						src,
						alt: `${clean.title} ${String(i + 2).padStart(2, "0")}`,
					})),
				];
				return {
					...clean,
					slug: slugVal,
					href: `/work/${slugVal}`,
					image,
					gradient: clean.gradient || "from-zinc-900 to-zinc-800",
					accentColor: clean.accentColor || "zinc",
					branding: clean.branding || { colors: [], typography: [] },
					stack: clean.techStack ?? [],
					visitUrl: clean.links?.live ?? clean.client?.website,
					media,
				};
			}
		} catch (error) {
			console.error(`Error fetching project with slug ${slug}:`, error);
		}
		return null;
	},
);
