import { client, QUERIES } from "~/libs/sanity";
import { BlogView } from "./_components/blog-view";

export default async function BlogPage() {
	const posts = await client.fetch(QUERIES.posts);

	return <BlogView posts={posts} />;
}
