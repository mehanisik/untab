import { getPosts } from "~/libs/posts";
import { BlogView } from "./_components/blog-view";

export default async function BlogPage() {
	const posts = await getPosts();

	return <BlogView posts={posts} />;
}
