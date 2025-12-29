import { cache } from "react";
import { fetchSanity, QUERIES, urlFor } from "./sanity";
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
		const sanityProjects = await fetchSanity<Project[]>(QUERIES.projects, {}, [
			"project",
		]);
		if (sanityProjects && sanityProjects.length > 0) {
			return sanityProjects.map((p) => {
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
				const slugVal = project.slug;
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
		} catch (error) {
			console.error(`Error fetching project with slug ${slug}:`, error);
		}
		return null;
	},
);
