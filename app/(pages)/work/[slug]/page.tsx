import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "~/libs/projects";
import { ProjectView } from "./_components/project-view";

interface PageProps {
	params: Promise<{ slug: string }>;
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
	const projects = await getProjects();
	return projects.map((project) => ({
		slug: project.slug,
	}));
}
