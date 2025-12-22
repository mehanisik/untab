import { cache, cacheSignal } from "react";
import { client as sanityClient, QUERIES, urlFor } from "./sanity";
import type { PortableTextBlock } from "next-sanity";

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
		const signal = cacheSignal();
		const sanityProjects = await sanityClient.fetch(
			QUERIES.projects,
			{},
			{ signal: signal as AbortSignal },
		);
		if (sanityProjects && sanityProjects.length > 0) {
			// biome-ignore lint/suspicious/noExplicitAny: sanity results are dynamic
			return sanityProjects.map((p: any) => {
				const slug = typeof p.slug === "string" ? p.slug : p.slug?.current;
				return {
					...p,
					slug,
					href: `/work/${slug}`,
					// Use Sanity image or placeholder
					image: p.image ? urlFor(p.image).url() : "/projects/placeholder.png",
					// Use Sanity value or default fallback
					gradient: p.gradient || "from-zinc-900 to-zinc-800",
					accentColor: p.accentColor || "zinc",
					branding: p.branding || { colors: [], typography: [] },
				};
			});
		}
	} catch (error: unknown) {
		const err = error as Error & { name?: string; digest?: string };
		if (
			err.name !== "AbortError" &&
			err.digest !== "HANGING_PROMISE_REJECTION"
		) {
			console.error("Error fetching projects from Sanity:", err);
		}
	}
	return [];
});

export const getProjectBySlug = cache(
	async (slug: string): Promise<Project | null> => {
		try {
			const signal = cacheSignal();
			const project = await sanityClient.fetch(
				QUERIES.projectBySlug,
				{ slug },
				{ signal: signal as AbortSignal },
			);
			if (project) {
				const slugVal =
					typeof project.slug === "string"
						? project.slug
						: project.slug?.current;
				return {
					...project,
					slug: slugVal,
					href: `/work/${slugVal}`,
					image: project.image
						? urlFor(project.image).url()
						: "/projects/placeholder.png",
					gradient: project.gradient || "from-zinc-900 to-zinc-800",
					accentColor: project.accentColor || "zinc",
					branding: project.branding || { colors: [], typography: [] },
				};
			}
		} catch (error: unknown) {
			const err = error as Error & { name?: string; digest?: string };
			if (
				err.name !== "AbortError" &&
				err.digest !== "HANGING_PROMISE_REJECTION"
			) {
				console.error(`Error fetching project with slug ${slug}:`, err);
			}
		}
		return null;
	},
);

// Remove static export as it is no longer needed
// export const projects = staticProjects;
