import type { MetadataRoute } from "next";
import { fetchSanity } from "~/libs/sanity";

const APP_BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Fetch projects and posts slugs for dynamic routes
	const [projects, posts] = await Promise.all([
		fetchSanity<{ slug: string }[]>(
			'*[_type == "project"] { "slug": slug.current }',
		),
		fetchSanity<{ slug: string }[]>(
			'*[_type == "post"] { "slug": slug.current }',
		),
	]);

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
