import { cache } from "react";
import { fetchSanity } from "./live";
import { type Post, QUERIES } from "./sanity";

export const getPosts = cache(async (): Promise<Post[]> => {
	try {
		const posts = await fetchSanity<Post[]>(QUERIES.posts, {}, ["post"]);
		if (posts && Array.isArray(posts)) {
			return posts;
		}
	} catch (error) {
		console.error("Error fetching posts from Sanity:", error);
	}
	return [];
});

export const getPostBySlug = cache(
	async (slug: string, opts?: { stega?: boolean }): Promise<Post | null> => {
		try {
			const post = await fetchSanity<Post>(
				QUERIES.postBySlug,
				{ slug },
				[`post:${slug}`],
				opts,
			);
			return post || null;
		} catch (error) {
			console.error(`Error fetching post with slug ${slug}:`, error);
		}
		return null;
	},
);
