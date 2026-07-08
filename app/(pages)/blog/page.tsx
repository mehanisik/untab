import type { Metadata } from "next";
import { getSettings } from "~/libs/live";
import { generatePageMetadata } from "~/libs/metadata";
import { getPosts } from "~/libs/posts";
import { BlogFeed, BlogHero } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Blog",
	description:
		"Notes from the studio. Design, engineering, and everything in between.",
	url: "/blog",
});

export default async function BlogPage() {
	const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

	return (
		<main className="grow">
			<BlogHero title={settings?.blogHeroTitle} />
			{posts.length > 0 ? <BlogFeed posts={posts} /> : null}
		</main>
	);
}
