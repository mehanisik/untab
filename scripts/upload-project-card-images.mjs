import { access, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, ".env.local");
const PROJECTS_FILE = path.join(ROOT, "sanity/seed/projects.ndjson");
const IMAGE_ROOT = path.join(ROOT, "sanity/seed/images");
const API_VERSION = "v2023-05-03";

function unquote(value) {
	return value.replace(/^['"]|['"]$/g, "");
}

async function loadEnv() {
	const raw = await readFile(ENV_FILE, "utf8");
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;

		const key = trimmed.slice(0, eq).trim();
		const value = unquote(trimmed.slice(eq + 1).trim());
		if (!process.env[key]) process.env[key] = value;
	}
}

async function loadProjects() {
	const raw = await readFile(PROJECTS_FILE, "utf8");
	return raw
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => JSON.parse(line))
		.map((project) => ({
			id: project._id,
			title: project.title,
			slug: project.slug?.current,
		}))
		.filter((project) => project.id && project.slug);
}

async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function sanityFetch(url, options) {
	const response = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${process.env.SANITY_ADMIN_TOKEN}`,
			...(options.headers ?? {}),
		},
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`${response.status} ${response.statusText}: ${body}`);
	}

	return response.json();
}

async function uploadImage({ projectId, dataset, slug }) {
	const filename = "card.png";
	const filePath = path.join(IMAGE_ROOT, slug, filename);
	const file = await readFile(filePath);
	const url = new URL(
		`https://${projectId}.api.sanity.io/${API_VERSION}/assets/images/${dataset}`,
	);
	url.searchParams.set("filename", `${slug}-${filename}`);

	const response = await sanityFetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "image/png",
		},
		body: file,
	});

	const assetId = response.document?._id;
	if (!assetId) {
		throw new Error(
			`Sanity upload response did not include an asset id for ${slug}`,
		);
	}

	return assetId;
}

async function patchProjects({ projectId, dataset, patches, unsets = [] }) {
	const url = `https://${projectId}.api.sanity.io/${API_VERSION}/data/mutate/${dataset}`;
	return sanityFetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			mutations: [
				...patches.map(({ id, assetId }) => ({
					patch: {
						id,
						set: {
							cardImage: {
								_type: "image",
								asset: {
									_type: "reference",
									_ref: assetId,
								},
							},
						},
					},
				})),
				...unsets.map(({ id }) => ({
					patch: {
						id,
						unset: ["cardImage"],
					},
				})),
			],
		}),
	});
}

async function verifyProjects({ projectId, dataset }) {
	const query = [
		'*[_type == "project" && !(_id in path("drafts.**"))]',
		"| order(title asc)",
		'{_id,title,"slug":slug.current,"hasCardImage":defined(cardImage.asset),"cardRef":cardImage.asset._ref}',
	].join(" ");

	const url = new URL(
		`https://${projectId}.api.sanity.io/${API_VERSION}/data/query/${dataset}`,
	);
	url.searchParams.set("query", query);

	const response = await sanityFetch(url, { method: "GET" });
	return response.result ?? [];
}

async function main() {
	await loadEnv();

	const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
	const token = process.env.SANITY_ADMIN_TOKEN;

	if (!(projectId && dataset && token)) {
		throw new Error(
			"Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_ADMIN_TOKEN",
		);
	}

	if (process.argv.includes("--verify")) {
		const projects = await verifyProjects({ projectId, dataset });
		for (const project of projects) {
			const status = project.hasCardImage ? "yes" : "no ";
			console.log(
				`${status}  ${project.title}  ${project.cardRef ?? "fallback"}`,
			);
		}
		return;
	}

	const projects = await loadProjects();
	const patches = [];
	const unsets = [];
	const unsetMissing = process.argv.includes("--unset-missing");

	for (const project of projects) {
		const filePath = path.join(IMAGE_ROOT, project.slug, "card.png");
		if (!(await fileExists(filePath))) {
			if (unsetMissing) unsets.push(project);
			console.log(`skipped ${project.slug} (no card.png)`);
			continue;
		}

		const assetId = await uploadImage({
			projectId,
			dataset,
			slug: project.slug,
		});
		patches.push({
			id: project.id,
			assetId,
			title: project.title,
			slug: project.slug,
		});
		console.log(`uploaded ${project.slug} -> ${assetId}`);
	}

	await patchProjects({ projectId, dataset, patches, unsets });

	console.log("");
	console.log("patched cardImage:");
	for (const patch of patches) {
		console.log(`- ${patch.id} (${patch.title})`);
	}
	for (const unset of unsets) {
		console.log(`- ${unset.id} (${unset.title}) cleared`);
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
