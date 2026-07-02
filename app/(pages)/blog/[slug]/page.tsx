import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "~/libs/metadata";
import { getPostBySlug, getPosts } from "~/libs/posts";
import { Article } from "./_components";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	// Cache Components requires generateStaticParams to return at least one
	// entry. When Sanity has no posts (unseeded dataset) or is unreachable at
	// build time (CI without real credentials), emit a placeholder slug the
	// page resolves to notFound(), so the route still builds.
	// Mirrors darkroomengineering/satus.
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
	const post = await getPostBySlug(slug);

	if (!post) {
		return generatePageMetadata({ title: "Article | Untab Studio" });
	}

	const cover = post.seo?.image ?? post.mainImage;

	return generatePageMetadata({
		title: `${post.seo?.title ?? post.title} | Untab Studio`,
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

	return (
		<main className="grow bg-background pt-14">
			<Article post={post} />
		</main>
	);
}
