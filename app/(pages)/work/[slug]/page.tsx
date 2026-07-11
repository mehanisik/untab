import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "~/components/json-ld";
import { generatePageMetadata, SITE_URL } from "~/libs/metadata";
import { getProjectBySlug, getProjects } from "~/libs/projects";
import { CaseStudy } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
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
	const study = await getProjectBySlug(slug, { stega: false });
	if (!study) return generatePageMetadata({ title: "Case study" });
	const cover = study.cardImage ?? study.image;
	return generatePageMetadata({
		title: study.title,
		description:
			study.description ||
			study.about?.[0] ||
			`${study.title} case study by Untab Studio.`,
		url: `/work/${study.slug}`,
		type: "article",
		image: cover ? { url: cover, alt: `${study.title} cover` } : undefined,
	});
}

export default async function CaseStudyPage({ params }: PageProps) {
	const { slug } = await params;
	const study = await getProjectBySlug(slug);
	if (!study) notFound();

	const url = `${SITE_URL}/work/${study.slug}`;

	return (
		<main className="grow bg-background pt-14">
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "CreativeWork",
							"@id": `${url}#work`,
							name: study.title,
							description:
								study.description ||
								study.about?.[0] ||
								`${study.title} case study by Untab Studio.`,
							url,
							...(study.image && { image: study.image }),
							...(study.year && { dateCreated: study.year }),
							...(study.category && { genre: study.category }),
							...(study.techStack?.length && {
								keywords: study.techStack.join(", "),
							}),
							...(study.client?.name && { about: study.client.name }),
							creator: {
								"@type": "Organization",
								"@id": `${SITE_URL}/#organization`,
								name: "Untab Studio",
							},
						},
						{
							"@type": "BreadcrumbList",
							itemListElement: [
								{
									"@type": "ListItem",
									position: 1,
									name: "Work",
									item: `${SITE_URL}/work`,
								},
								{
									"@type": "ListItem",
									position: 2,
									name: study.title,
									item: url,
								},
							],
						},
					],
				}}
			/>
			<CaseStudy study={study} />
		</main>
	);
}
