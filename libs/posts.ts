import { cache } from "react";
import { fetchSanity } from "./live";
import { type Post, QUERIES } from "./sanity";

/**
 * Fetches all blog posts, ordered by publishedAt desc.
 * Uses fetchSanity with revalidation tags for efficient caching.
 */
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

/**
 * Fetches a single blog post by its slug.
 * Uses fetchSanity with revalidation tags for efficient caching.
 */
export const getPostBySlug = cache(
	async (slug: string): Promise<Post | null> => {
		try {
			const post = await fetchSanity<Post>(QUERIES.postBySlug, { slug }, [
				`post:${slug}`,
			]);
			return post || null;
		} catch (error) {
			console.error(`Error fetching post with slug ${slug}:`, error);
		}
		return null;
	},
);
