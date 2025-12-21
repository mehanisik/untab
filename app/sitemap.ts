import type { MetadataRoute } from "next";
import { fetchSanity } from "~/libs/sanity";
import { getEnv } from "~/libs/validate-env";

const env = getEnv();
const APP_BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let projects: { slug: string }[] = [];
	let posts: { slug: string }[] = [];

	try {
		const results = await Promise.allSettled([
			fetchSanity<{ slug: string }[]>(
				'*[_type == "project"] { "slug": slug.current }',
			),
			fetchSanity<{ slug: string }[]>(
				'*[_type == "post"] { "slug": slug.current }',
			),
		]);

		if (results[0].status === "fulfilled") {
			projects = results[0].value;
		} else {
			console.error("Failed to fetch projects for sitemap:", results[0].reason);
		}

		if (results[1].status === "fulfilled") {
			posts = results[1].value;
		} else {
			console.error("Failed to fetch posts for sitemap:", results[1].reason);
		}
	} catch (error) {
		console.error("Error generating sitemap:", error);
	}

	const baseRoutes: MetadataRoute.Sitemap = [
		{
			url: APP_BASE_URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${APP_BASE_URL}/work`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${APP_BASE_URL}/process`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${APP_BASE_URL}/team`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${APP_BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${APP_BASE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];

	const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${APP_BASE_URL}/work/${project.slug}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.6,
	}));

	const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${APP_BASE_URL}/blog/${post.slug}`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 0.6,
	}));

	return [...baseRoutes, ...projectRoutes, ...postRoutes];
}
