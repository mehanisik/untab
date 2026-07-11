import { cache } from "react";
import { fetchSanity } from "./live";
import { type Homepage, QUERIES } from "./sanity";

export const HOMEPAGE_FALLBACK: Homepage = {
	intro: {
		eyebrow: "Who are we?",
		headingLines: [
			"An independent software",
			"studio in Warsaw who care,",
			"build relationships, sweat",
			"the details, and ship",
			"considered products.",
		],
	},
	showcase: {
		title: "What we deliver",
		headingLines: ["Minimum", "Perfect", "Experiences"],
		description:
			"Digital products, webapps, mobile apps, brands and marketing websites you'll be excited to put in front of your customers and investors.",
	},
	features: {
		title: "How we work",
		items: [
			{
				title: "Strategic Blueprinting",
				description:
					"We turn ambiguous visions into high-performance architectures. A clear plan, a defensible system, foundations designed for scale.",
				location: "WARSAW, PL",
				stat: "99%",
				caption: "of our clients need this",
			},
			{
				title: "Technical Risk Management",
				description:
					"Early identification and mitigation of technical debt, security risk, and operational fragility. The system you ship today is the system that holds tomorrow.",
				location: "AUDIT, OPS",
				stat: "0",
				caption: "incidents in production",
			},
			{
				title: "Technical Pedigree",
				description:
					"Years of shipping production systems, distilled into how we build. Battle-tested patterns and modern tooling, applied with discipline.",
				location: "SHIP, QA",
				stat: "100%",
				caption: "tested before release",
			},
			{
				title: "Transparent Partnership",
				description:
					"An extension of your team. Open communication, shared goals, weekly working sessions. Expert guidance at every step, no black boxes.",
				location: "PARTNER, EU",
				stat: "1:1",
				caption: "with the founders, weekly",
			},
		],
	},
	collaboration: {
		title: "Our collaboration pillars",
		quote: "Great work is a conversation, not a handoff.",
		attribution: "- untab studio",
		note: "To be honest, we'll shape the process around how your team already works. But if you like lists, here are the pillars every collaboration stands on.",
		pillars: [
			{
				title: "Fluent conversation",
				description:
					"We establish a workflow where we can follow our proven process while you enhance the final deliverable with your input and feedback.",
			},
			{
				title: "Iterative decisions",
				description:
					"Product teams make decisions every day, so we work in short cycles with frequent feedback and maximum flexibility.",
			},
			{
				title: "Shared responsibility",
				description:
					"You know your market, we know how to build. We tackle the big risks early and solve the right problems side-by-side.",
			},
		],
	},
	vision: {
		kicker: "Next step",
		description:
			"We have the perfect combination of mindset, skills, processes, and pricing structure. Together, we'll transform your ideas into the best-in-class digital experience.",
		linkText: "Let's talk",
		heading: "about your vision.",
	},
};

export const getHomepage = cache(async (): Promise<Homepage> => {
	try {
		const homepage = await fetchSanity<Homepage | null>(QUERIES.homepage, {}, [
			"homepage",
		]);
		if (homepage) return homepage;
	} catch (error) {
		console.error("Error fetching homepage from Sanity:", error);
	}
	return HOMEPAGE_FALLBACK;
});
