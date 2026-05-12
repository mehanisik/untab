import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../../_components";
import { SAMPLE_PROJECTS, getCaseStudyBySlug } from "../_data";
import { CaseStudy } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return SAMPLE_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const study = getCaseStudyBySlug(slug);
	if (!study)
		return generatePageMetadata({ title: "Case study — Untab Studio" });
	return generatePageMetadata({
		title: `${study.title} — Untab Studio`,
		description:
			study.about?.[0] ?? `${study.title} case study by Untab Studio.`,
		url: `/work/${study.slug}`,
	});
}

export default async function CaseStudyPage({ params }: PageProps) {
	const { slug } = await params;
	const study = getCaseStudyBySlug(slug);
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
