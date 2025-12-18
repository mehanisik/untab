import { createClient } from "@sanity/client";
import { staticProjects } from "../libs/projects";

// Sample blog posts since none were found in the codebase
const samplePosts = [
	{
		_type: "post",
		title: "The Future of Minimalist Design",
		slug: { _type: "slug", current: "future-of-minimalist-design" },
		author: "Untab Studio",
		publishedAt: new Date().toISOString(),
		excerpt:
			"Exploring how 'less is more' continues to shape the digital landscape in 2024 and beyond.",
		body: [
			{
				_type: "block",
				children: [
					{
						_type: "span",
						text: "Minimalism isn't just an aesthetic; it's a philosophy of intentionality...",
					},
				],
			},
		],
	},
	{
		_type: "post",
		title: "Building Scalable AI Products",
		slug: { _type: "slug", current: "building-scalable-ai-products" },
		author: "Untab Technical Team",
		publishedAt: new Date().toISOString(),
		excerpt:
			"A deep dive into the architecture and design patterns required for modern AI integrations.",
		body: [
			{
				_type: "block",
				children: [
					{
						_type: "span",
						text: "When we built Trip, we realized that AI latency is the biggest hurdle to a perfect experience...",
					},
				],
			},
		],
	},
];

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	token: process.env.SANITY_API_TOKEN,
	useCdn: false,
});

async function migrate() {
	if (!process.env.SANITY_API_TOKEN) {
		console.error("error: SANITY_API_TOKEN is required for migration.");
		return;
	}

	console.log("Starting migration...");

	// Migrate Projects
	for (const project of staticProjects) {
		console.log(`Migrating project: ${project.title}`);
		const doc = {
			_type: "project",
			title: project.title,
			slug: { _type: "slug", current: project.slug },
			category: project.category,
			year: project.year,
			description: project.description,
			techStack: project.techStack,
			tools: project.tools,
			branding: project.branding,
			content: project.content,
			// Image handling: We use the static path for now, as uploading requires asset creation
			// In a real migration, we'd upload images to Sanity and reference the asset ID
		};

		try {
			await client.createOrReplace({ _id: `project-${project.slug}`, ...doc });
			console.log(`Successfully migrated ${project.title}`);
		} catch (err) {
			console.error(`Failed to migrate project ${project.title}:`, err);
		}
	}

	// Migrate Posts
	for (const post of samplePosts) {
		console.log(`Creating post: ${post.title}`);
		try {
			await client.createOrReplace({
				_id: `post-${post.slug.current}`,
				...post,
			});
			console.log(`Successfully created ${post.title}`);
		} catch (err) {
			console.error(`Failed to create post ${post.title}:`, err);
		}
	}

	console.log("Migration finished.");
}

migrate();
