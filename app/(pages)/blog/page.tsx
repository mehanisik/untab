import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { getPosts } from "~/libs/posts";
import { Footer, Navbar } from "../_components";
import { BlogFeed, BlogHero } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Blog",
	description:
		"Notes from the studio. Design, engineering, and everything in between.",
});

export default async function BlogPage() {
	const posts = await getPosts();

	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<BlogHero />
				{posts.length > 0 ? <BlogFeed posts={posts} /> : null}
			</main>
			<Footer />
		</Wrapper>
	);
}
