import type { MetadataRoute } from "next";
import { getPosts } from "~/libs/posts";
import { getProjects } from "~/libs/projects";
import { getEnv } from "~/libs/validate-env";

const env = getEnv();
const APP_BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: APP_BASE_URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${APP_BASE_URL}/services`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${APP_BASE_URL}/work`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${APP_BASE_URL}/about`,
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
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${APP_BASE_URL}/blog/${post.slug}`,
		lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
