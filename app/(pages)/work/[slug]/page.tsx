import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { getProjectBySlug, getProjects } from "~/libs/projects";
import { Footer, Navbar } from "../../_components";
import { CaseStudy } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	// Cache Components requires generateStaticParams to return at least one
	// entry. When Sanity has no projects (unseeded dataset, or CI without
	// network), emit a placeholder slug the page resolves to notFound(), so the
	// route still builds. Mirrors darkroomengineering/satus.
	const projects = await getProjects();
	const params = projects.map((p) => ({ slug: p.slug }));
	return params.length > 0 ? params : [{ slug: "project-not-found" }];
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
		<Wrapper>
			<Navbar />
			<main className="grow bg-background pt-14">
				<CaseStudy study={study} />
			</main>
			<Footer />
		</Wrapper>
	);
}
