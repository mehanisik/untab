import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "~/components/json-ld";
import { generatePageMetadata, SITE_URL } from "~/libs/metadata";
import { getPostBySlug, getPosts } from "~/libs/posts";
import { Article } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const fallback = [{ slug: "post-not-found" }];
	try {
		const posts = await getPosts();
		const params = posts.map((post) => ({ slug: post.slug }));
		return params.length > 0 ? params : fallback;
	} catch {
		return fallback;
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug, { stega: false });

	if (!post) {
		return generatePageMetadata({ title: "Article" });
	}

	const cover = post.seo?.image ?? post.mainImage;

	return generatePageMetadata({
		title: post.seo?.title ?? post.title,
		description: post.seo?.description ?? post.excerpt,
		url: `/blog/${post.slug}`,
		type: "article",
		publishedTime: post.publishedAt,
		authors: post.author?.name ? [post.author.name] : undefined,
		keywords: post.seo?.keywords,
		image: cover ? { url: cover, alt: post.title } : undefined,
	});
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) notFound();

	const url = `${SITE_URL}/blog/${post.slug}`;

	return (
		<main className="grow bg-background pt-14">
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.title,
					description: post.seo?.description ?? post.excerpt,
					image: post.seo?.image ?? post.mainImage,
					datePublished: post.publishedAt,
					author: post.author?.name
						? { "@type": "Person", name: post.author.name }
						: undefined,
					publisher: {
						"@type": "Organization",
						name: "Untab Studio",
						logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
					},
					mainEntityOfPage: url,
					url,
				}}
			/>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Blog",
							item: `${SITE_URL}/blog`,
						},
						{ "@type": "ListItem", position: 2, name: post.title, item: url },
					],
				}}
			/>
			<Article post={post} />
		</main>
	);
}
