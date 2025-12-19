import { client, QUERIES } from "~/libs/sanity";
import { notFound } from "next/navigation";
import { PostView } from "./_components/post-view";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await client.fetch(QUERIES.postBySlug, { slug });

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
