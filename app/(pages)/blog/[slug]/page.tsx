import { getPostBySlug } from "~/libs/posts";
import { client } from "~/libs/sanity";
import { notFound } from "next/navigation";
import { PostView } from "./_components/post-view";
import { generateSanityMetadata } from "~/libs/metadata";
import type { Metadata } from "next";

interface PageProps {
	params: Promise<{ slug: string }>;
}

const CI_PLACEHOLDER_SLUG = "__ci_placeholder__";

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	if (slug === CI_PLACEHOLDER_SLUG) return {};
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

	if (slug === CI_PLACEHOLDER_SLUG) {
		notFound();
	}

	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return <PostView post={post} />;
}

export async function generateStaticParams() {
	try {
		const posts = await client.fetch<{ slug: string }[]>(
			`*[_type == "post"]{ "slug": slug.current }`,
		);
		if (!posts || posts.length === 0) {
			return [{ slug: CI_PLACEHOLDER_SLUG }];
		}
		return posts.map((post) => ({ slug: post.slug }));
	} catch {
		// Sanity unreachable (e.g. CI without real credentials)
		return [{ slug: CI_PLACEHOLDER_SLUG }];
	}
}
