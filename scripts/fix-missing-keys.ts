import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	token: process.env.SANITY_API_TOKEN,
	useCdn: false,
});

function addKeysToArray<T extends object>(
	arr: T[] | undefined,
): (T & { _key: string })[] {
	if (!arr) return [];
	return arr.map((item) => ({
		...item,
		_key: (item as { _key?: string })._key || uuidv4(),
	}));
}

function addKeysToBlockContent(blocks: object[] | undefined): object[] {
	if (!blocks) return [];
	return blocks.map((block) => {
		const typedBlock = block as {
			_key?: string;
			_type?: string;
			children?: object[];
			markDefs?: object[];
		};

		const keyedBlock = {
			...typedBlock,
			_key: typedBlock._key || uuidv4(),
		};

		if (typedBlock.children) {
			keyedBlock.children = typedBlock.children.map((child) => ({
				...child,
				_key: (child as { _key?: string })._key || uuidv4(),
			}));
		}

		if (typedBlock.markDefs) {
			keyedBlock.markDefs = typedBlock.markDefs.map((mark) => ({
				...mark,
				_key: (mark as { _key?: string })._key || uuidv4(),
			}));
		}

		return keyedBlock;
	});
}

async function fixProjectKeys() {
	console.log("Fetching projects...");
	const projects = await client.fetch(`*[_type == "project"]`);

	for (const project of projects) {
		console.log(`Fixing keys for project: ${project.title}`);

		const patches: Record<string, object[]> = {};

		if (project.branding?.colors?.length > 0) {
			patches["branding.colors"] = addKeysToArray(project.branding.colors);
		}

		if (project.branding?.typography?.length > 0) {
			patches["branding.typography"] = addKeysToArray(
				project.branding.typography,
			);
		}

		if (Object.keys(patches).length > 0) {
			try {
				await client.patch(project._id).set(patches).commit();
				console.log(`✓ Fixed keys for ${project.title}`);
			} catch (err) {
				console.error(`✗ Failed to fix ${project.title}:`, err);
			}
		} else {
			console.log(`- No fixes needed for ${project.title}`);
		}
	}
}

async function fixPostKeys() {
	console.log("Fetching posts...");
	const posts = await client.fetch(`*[_type == "post"]`);

	for (const post of posts) {
		console.log(`Fixing keys for post: ${post.title}`);

		if (post.body?.length > 0) {
			try {
				const fixedBody = addKeysToBlockContent(post.body);
				await client.patch(post._id).set({ body: fixedBody }).commit();
				console.log(`✓ Fixed keys for ${post.title}`);
			} catch (err) {
				console.error(`✗ Failed to fix ${post.title}:`, err);
			}
		} else {
			console.log(`- No body content for ${post.title}`);
		}
	}
}

async function main() {
	if (!process.env.SANITY_API_TOKEN) {
		console.error("Error: SANITY_API_TOKEN is required.");
		console.log("Set it with: export SANITY_API_TOKEN=your_token");
		process.exit(1);
	}

	console.log("Starting key fix migration...\n");

	await fixProjectKeys();
	console.log("");
	await fixPostKeys();

	console.log("\n✓ Migration complete!");
}

main();
