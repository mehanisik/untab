import { cache } from "react";
import { fetchSanity, QUERIES, urlFor } from "./sanity";
import type { PortableTextBlock } from "next-sanity";

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
					image: p.image ? urlFor(p.image).url() : "/projects/placeholder.png",
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
				return {
					...clean,
					slug: slugVal,
					href: `/work/${slugVal}`,
					image: clean.image
						? urlFor(clean.image).url()
						: "/projects/placeholder.png",
					gradient: clean.gradient || "from-zinc-900 to-zinc-800",
					accentColor: clean.accentColor || "zinc",
					branding: clean.branding || { colors: [], typography: [] },
				};
			}
		} catch (error) {
			console.error(`Error fetching project with slug ${slug}:`, error);
		}
		return null;
	},
);
