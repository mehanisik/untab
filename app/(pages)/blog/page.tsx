import { client, QUERIES, type Post } from "~/libs/sanity";
import { BlogView } from "./_components/blog-view";

export default async function BlogPage() {
	let posts: Post[] = [];

	try {
		posts = await client.fetch(QUERIES.posts);
	} catch (error) {
		console.error("Failed to fetch blog posts:", error);
	}

	if (!Array.isArray(posts)) {
		posts = [];
	}

	return <BlogView posts={posts} />;
}
