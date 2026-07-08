import { cache } from "react";
import { fetchSanity } from "./live";
import { type About, QUERIES } from "./sanity";

/**
 * Grounded, verifiable defaults for the About page. Every stat here is
 * defensible from the real project data — no invented team sizes, funding
 * totals, or reach figures. The live project count is prepended at render
 * time (see the About page), so it is intentionally not listed as a stat.
 */
export const ABOUT_FALLBACK: About = {
	eyebrow: "About Untab",
	headingLines: ["We exist between", "what is and what", "is emerging."],
	intro: [
		"Most companies work with separate agencies and teams. Then, when everything needs to come together, nothing quite fits. Here at Untab, strategy, design, and development work at the same table. One team. One conversation. From day one.",
		"We start where you are, beginning with your constraints, your complexity, your teams. Discovery and research ground our decisions in insight, not assumptions. We interrogate the brief, identify what's actually possible, and create a common thread that runs through the entire partnership. The result: systems that work now and adapt as your future unfolds.",
	],
	studioStatement:
		"A small, senior team. Same names on the kickoff call and the ship date.",
	studioLinkLabel: "Read the story",
	statsEyebrow: "The studio, in facts",
	statsTitle: "Measured by what we actually ship",
	stats: [
		{
			value: "05",
			label:
				"Disciplines under one roof — strategy, brand, website, product, and development.",
		},
		{
			// Earliest project year in the live Sanity dataset. Re-derive from
			// *[_type=="project"]|order(year asc)[0] if the backlog changes.
			value: "2024",
			label: "Shipping client work end-to-end since.",
		},
		{
			value: "01",
			label: "One team, from the kickoff call to the ship date.",
		},
	],
};

/** Removes null/undefined/empty values so a partial CMS doc falls back per-field. */
function pruneEmpty(input: About): Partial<About> {
	const out: Partial<About> = {};
	for (const [key, value] of Object.entries(input)) {
		if (value == null) continue;
		if (typeof value === "string" && value.trim() === "") continue;
		if (Array.isArray(value) && value.length === 0) continue;
		(out as Record<string, unknown>)[key] = value;
	}
	return out;
}

/**
 * Fetches the About singleton, merging any CMS content over the grounded
 * fallback so the page always renders real, defensible copy.
 */
export const getAbout = cache(async (): Promise<About> => {
	try {
		const about = await fetchSanity<About | null>(QUERIES.about, {}, ["about"]);
		if (about) return { ...ABOUT_FALLBACK, ...pruneEmpty(about) };
	} catch (error) {
		console.error("Error fetching about from Sanity:", error);
	}
	return ABOUT_FALLBACK;
});

/** Live count of published projects — the one stat we never hardcode. */
export const getProjectCount = cache(async (): Promise<number> => {
	try {
		const count = await fetchSanity<number>(QUERIES.projectCount, {}, [
			"project",
		]);
		if (typeof count === "number" && count > 0) return count;
	} catch (error) {
		console.error("Error fetching project count from Sanity:", error);
	}
	return 0;
});
