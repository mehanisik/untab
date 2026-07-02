import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "~/libs/metadata";
import { getProjectBySlug, getProjects } from "~/libs/projects";
import { CaseStudy } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	// Cache Components requires generateStaticParams to return at least one
	// entry. When Sanity has no projects (unseeded dataset) or is unreachable at
	// build time (CI without real credentials), emit a placeholder slug the page
	// resolves to notFound(), so the route still builds.
	// Mirrors darkroomengineering/satus.
	const fallback = [{ slug: "project-not-found" }];
	try {
		const projects = await getProjects();
		const params = projects.map((p) => ({ slug: p.slug }));
		return params.length > 0 ? params : fallback;
	} catch {
		return fallback;
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const study = await getProjectBySlug(slug);
	if (!study)
		return generatePageMetadata({ title: "Case study | Untab Studio" });
	return generatePageMetadata({
		title: `${study.title} | Untab Studio`,
		description:
			study.description ||
			study.about?.[0] ||
			`${study.title} case study by Untab Studio.`,
		url: `/work/${study.slug}`,
	});
}

export default async function CaseStudyPage({ params }: PageProps) {
	const { slug } = await params;
	const study = await getProjectBySlug(slug);
	if (!study) notFound();

	return (
		<main className="grow bg-background pt-14">
			<CaseStudy study={study} />
		</main>
	);
}
