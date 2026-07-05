import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Generates seeded-random poster covers for blog posts in the same visual
// language as the landing page "How we work" posters (features.tsx): solid
// poster-color grounds, halftone dot circles, thin rules, and film grain.
// Uploads each PNG to Sanity and points the post's mainImage at it.
//
//   node scripts/generate-blog-posters.mjs            # generate + upload + patch
//   node scripts/generate-blog-posters.mjs --dry-run  # write local PNGs only
//   node scripts/generate-blog-posters.mjs --verify   # list posts + image refs

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, ".env.local");
const OUT_DIR = path.join(ROOT, ".posters-preview");
const API_VERSION = "v2023-05-03";

// The exact poster palette from app/(pages)/_components/features.tsx.
const PALETTE = ["#f15c7e", "#7c8df0", "#d8e85e", "#a892ff"];

// SVG canvas; rasterized at 2.5x to 1250x1500 (matches the 5:6 card crop).
const W = 500;
const H = 600;
const SCALE = 2.5;

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

async function sanityFetch(url, options = {}) {
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

// Deterministic RNG so re-running regenerates identical art per slug.
function hashSeed(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mulberry32(seed) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const between = (rnd, min, max) => min + rnd() * (max - min);
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

// Halftone lattice: every dot is emitted individually on one shared 4-unit
// grid, so nothing is ever a clipped half-dot and overlapping discs merge
// into a single clean field (per lattice point the largest radius wins).
const GRID = 4;
const MAX_DOT = 1.72; // < GRID/2 so dots never touch
const MIN_DOT = 0.24; // below this a dot reads as noise, skip it

// Dot-size profiles as a function of normalized distance t = d / R.
const FALLOFFS = {
	// Dense centre thinning to the rim, like a printed sphere highlight.
	sphere: (t) => Math.sqrt(Math.max(0, 1 - t * t)) ** 0.72,
	// Straight linear fade.
	fade: (t) => 1 - t,
	// Hollow centre, dense rim: reads as a halftone ring.
	rim: (t) => t ** 1.5,
	// Band that peaks mid-radius, airy centre and edge.
	halo: (t) => Math.sin(Math.PI * Math.min(1, t)) ** 1.3,
};

function posterSvg({ slug, bg }) {
	const rnd = mulberry32(hashSeed(slug));
	const ink = "rgba(0,0,0,0.92)";
	const snap = (v) => Math.round(v / GRID) * GRID + GRID / 2;

	// The anchor disc (always a sphere, always substantial) sits in one
	// vertical half; the companion disc is forced into the other half so a
	// composition never clumps and leaves half the canvas dead. A small
	// satellite adds rhythm, tucked toward whichever side has more air.
	const discs = [];
	const anchorTop = rnd() > 0.5;
	const anchorCx = snap(between(rnd, 150, 350));
	const anchorCy = snap(
		anchorTop ? between(rnd, 150, 260) : between(rnd, 340, 460),
	);
	discs.push({
		cx: anchorCx,
		cy: anchorCy,
		R: between(rnd, 130, 185),
		falloff: FALLOFFS.sphere,
		weight: 1,
	});

	discs.push({
		cx: snap(between(rnd, 120, 380)),
		cy: snap(anchorTop ? between(rnd, 370, 490) : between(rnd, 110, 230)),
		R: between(rnd, 90, 150),
		falloff: FALLOFFS[pick(rnd, ["fade", "rim", "halo"])],
		// Slight per-disc weight so overlaps keep depth instead of
		// flattening into one even texture.
		weight: between(rnd, 0.8, 0.95),
	});

	// Satellite: small, airy, pulled to the horizontal side the anchor
	// left open.
	const satelliteLeft = anchorCx > W / 2;
	discs.push({
		cx: snap(
			satelliteLeft ? between(rnd, 70, 170) : between(rnd, 330, 430),
		),
		cy: snap(between(rnd, 90, 510)),
		R: between(rnd, 38, 68),
		falloff: FALLOFFS[pick(rnd, ["sphere", "halo"])],
		weight: between(rnd, 0.7, 0.9),
	});

	// Walk the shared lattice once; each point takes the strongest disc.
	const dots = [];
	for (let x = GRID / 2; x < W; x += GRID) {
		for (let y = GRID / 2; y < H; y += GRID) {
			let size = 0;
			for (const disc of discs) {
				const d = Math.hypot(x - disc.cx, y - disc.cy);
				if (d > disc.R) continue;
				const s = disc.falloff(d / disc.R) * disc.weight;
				if (s > size) size = s;
			}
			const r = size * MAX_DOT;
			if (r >= MIN_DOT) {
				dots.push(`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}"/>`);
			}
		}
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="grain">
      <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
    </filter>
    <radialGradient id="sheen" cx="30%" cy="0%" r="110%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="shade" cx="82%" cy="100%" r="110%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  <g fill="${ink}">
    ${dots.join("\n    ")}
  </g>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.7"/>
  <rect width="100%" height="100%" fill="url(#sheen)"/>
  <rect width="100%" height="100%" fill="url(#shade)"/>
</svg>`;
}

async function fetchPosts({ projectId, dataset }) {
	const query =
		'*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {_id, title, "slug": slug.current, "imageRef": mainImage.asset._ref}';
	const url = new URL(
		`https://${projectId}.api.sanity.io/${API_VERSION}/data/query/${dataset}`,
	);
	url.searchParams.set("query", query);
	const response = await sanityFetch(url, { method: "GET" });
	return response.result ?? [];
}

async function uploadPoster({ projectId, dataset, slug, png }) {
	const url = new URL(
		`https://${projectId}.api.sanity.io/${API_VERSION}/assets/images/${dataset}`,
	);
	url.searchParams.set("filename", `poster-${slug}.png`);
	const response = await sanityFetch(url, {
		method: "POST",
		headers: { "Content-Type": "image/png" },
		body: png,
	});
	const assetId = response.document?._id;
	if (!assetId) throw new Error(`No asset id returned for ${slug}`);
	return assetId;
}

async function patchPosts({ projectId, dataset, patches }) {
	const url = `https://${projectId}.api.sanity.io/${API_VERSION}/data/mutate/${dataset}`;
	return sanityFetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			mutations: patches.map(({ id, assetId }) => ({
				patch: {
					id,
					set: {
						mainImage: {
							_type: "image",
							asset: { _type: "reference", _ref: assetId },
						},
					},
				},
			})),
		}),
	});
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

	const posts = await fetchPosts({ projectId, dataset });
	if (process.argv.includes("--verify")) {
		for (const post of posts) {
			console.log(`${post.imageRef ?? "none"}  ${post.slug}`);
		}
		return;
	}

	const dryRun = process.argv.includes("--dry-run");
	await mkdir(OUT_DIR, { recursive: true });

	const patches = [];
	for (const [index, post] of posts.entries()) {
		// Palette cycles in feed order (publishedAt desc), so neighbouring
		// cards never repeat a colour.
		const bg = PALETTE[index % PALETTE.length];
		const svg = posterSvg({ slug: post.slug, bg });
		const png = await sharp(Buffer.from(svg)).png().toBuffer();
		const outPath = path.join(OUT_DIR, `${post.slug}.png`);
		await writeFile(outPath, png);
		console.log(`generated ${post.slug} (${bg}) -> ${outPath}`);

		if (!dryRun) {
			const assetId = await uploadPoster({
				projectId,
				dataset,
				slug: post.slug,
				png,
			});
			patches.push({ id: post._id, assetId });
			console.log(`uploaded ${post.slug} -> ${assetId}`);
		}
	}

	if (!dryRun && patches.length) {
		await patchPosts({ projectId, dataset, patches });
		console.log(`\npatched mainImage on ${patches.length} posts`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
