import { getPostBySlug } from "~/libs/posts";
import { client } from "~/libs/sanity";
import { notFound } from "next/navigation";
import { PostView } from "./_components/post-view";
import { generateSanityMetadata } from "~/libs/metadata";
import type { Metadata } from "next";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) return {};

	return generateSanityMetadata({
		document: post,
		url: `/blog/${slug}`,
		type: "article",
	});
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return <PostView post={post} />;
}

export async function generateStaticParams() {
	// Cache Components requires at least one result. When Sanity is unreachable
	// at build time (e.g. CI without real credentials) we fall back to a single
	// placeholder slug; the page handler 404s anything it can't resolve anyway.
	const fallback = [{ slug: "_" }];
	try {
		const posts = await client.fetch<{ slug: string }[]>(
			`*[_type == "post"]{ "slug": slug.current }`,
		);
		return posts.length > 0
			? posts.map((post) => ({ slug: post.slug }))
			: fallback;
	} catch {
		return fallback;
	}
}
