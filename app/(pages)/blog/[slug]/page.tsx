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
	const posts = await client.fetch(
		`*[_type == "post"]{ "slug": slug.current }`,
	);
	return posts.map((post: { slug: string }) => ({
		slug: post.slug,
	}));
}
