import { cache } from "react";
import { fetchSanity } from "./live";
import { type About, QUERIES } from "./sanity";

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
			value: "2024",
			label: "Shipping client work end-to-end since.",
		},
		{
			value: "01",
			label: "One team, from the kickoff call to the ship date.",
		},
	],
};

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

export const getAbout = cache(async (): Promise<About> => {
	try {
		const about = await fetchSanity<About | null>(QUERIES.about, {}, ["about"]);
		if (about) return { ...ABOUT_FALLBACK, ...pruneEmpty(about) };
	} catch (error) {
		console.error("Error fetching about from Sanity:", error);
	}
	return ABOUT_FALLBACK;
});

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
