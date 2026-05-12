import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "~/libs/projects";
import { ProjectView } from "./_components/project-view";
import { generateSanityMetadata } from "~/libs/metadata";
import type { Metadata } from "next";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);

	if (!project) return {};

	return generateSanityMetadata({
		document: project,
		url: `/work/${slug}`,
		type: "website",
	});
}

export default async function ProjectPage({ params }: PageProps) {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);

	if (!project) {
		notFound();
	}

	const projects = await getProjects();
	const nextProject =
		projects[
			(projects.findIndex((p) => p.slug === slug) + 1) % projects.length
		];

	return <ProjectView project={project} nextProject={nextProject} />;
}

export async function generateStaticParams() {
	// Cache Components requires at least one result. When Sanity is unreachable
	// at build time (e.g. CI without real credentials) we fall back to a single
	// placeholder slug; the page handler 404s anything it can't resolve anyway.
	const fallback = [{ slug: "_" }];
	try {
		const projects = await getProjects();
		return projects.length > 0
			? projects.map((project) => ({ slug: project.slug }))
			: fallback;
	} catch {
		return fallback;
	}
}
