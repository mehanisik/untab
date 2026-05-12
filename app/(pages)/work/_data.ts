import type { Project } from "~/libs/projects";

const placeholder = (seed: string, w = 1600, h = 1200) =>
	`https://picsum.photos/seed/${seed}/${w}/${h}`;

export type MediaItem =
	| { kind: "image"; src: string; alt?: string; aspect?: number }
	| { kind: "video"; src: string; poster?: string; aspect?: number };

export interface CaseStudy extends Project {
	about: string[];
	services: string[];
	timeline: string;
	honors: string[];
	stack: string[];
	visitUrl?: string;
	media: MediaItem[];
}

const make = (
	title: string,
	category: string,
	year: string,
	seed: string,
	options: {
		about?: string[];
		services?: string[];
		timeline?: string;
		honors?: string[];
		stack?: string[];
		visitUrl?: string;
	} = {},
): CaseStudy => {
	const cover = placeholder(seed);
	return {
		_id: seed,
		title,
		slug: seed,
		href: `/work/${seed}`,
		category,
		year,
		description: "",
		image: cover,
		techStack: [],
		tools: [],
		branding: { colors: [], typography: [] },
		content: { mission: "", approach: "", result: "", features: [] },
		about: options.about ?? [
			`${title} is a ${category.toLowerCase()} project we shipped in ${year}. Built end to end with care for craft, motion, and clarity.`,
			"We led the brand-led design and engineering, focusing on tight typography, fluid motion, and a calm, considered interaction model.",
		],
		services: options.services ?? ["Design Site", "Animations", "Webflow"],
		timeline: options.timeline ?? "2 months",
		honors: options.honors ?? ["Awwwards x 1", "CSSDA x 1"],
		stack: options.stack ?? ["Webflow", "GSAP", "Lenis", "JS + CSS"],
		visitUrl: options.visitUrl,
		media: [
			{ kind: "image", src: cover, alt: `${title} hero` },
			{ kind: "image", src: placeholder(`${seed}-2`), alt: `${title} 02` },
			{ kind: "image", src: placeholder(`${seed}-3`), alt: `${title} 03` },
			{ kind: "image", src: placeholder(`${seed}-4`), alt: `${title} 04` },
			{ kind: "image", src: placeholder(`${seed}-5`), alt: `${title} 05` },
		],
	};
};

export const SAMPLE_PROJECTS: CaseStudy[] = [
	make("Jason Bergh", "Portfolio", "2025", "untab-jason-bergh"),
	make("San Fang", "Industrial Tech", "2025", "untab-san-fang"),
	make("Dawn Audio", "AI Sound Platform", "2025", "untab-dawn-audio"),
	make("Nite Riot", "Celebrity Production", "2024", "untab-nite-riot"),
	make("WarholArts", "Art Gallery", "2024", "untab-warhol-arts", {
		about: [
			"Warhol Arts started as a cheeky Dribbble brainstorm and exploded into a pop-art web experience. We poured bright colors, daring layouts, and punchy animations into a Webflow canvas, then turbocharged it with GSAP magic.",
			"The site reacts, moves, dances — like an interactive homage to Andy Warhol himself. It's not just a gallery; it's a digital playground where every scroll, hover, and click tells a loud, playful story.",
		],
		honors: [
			"FWA x 1",
			"Muzli x 1",
			"CSSDA x 1",
			"Orpetron x 2",
			"Awwwards x 2",
			"CSS Winner x 1",
		],
		stack: ["Webflow", "GSAP", "Barba.js", "Lenis", "JS + CSS"],
	}),
	make("Shihiko", "Fashion E-commerce", "2024", "untab-shihiko"),
	make("DecideAI", "Web3.0", "2024", "untab-decide-ai"),
	make("Zalu", "Coffee Shop", "2023", "untab-zalu"),
	make("Kinki", "Confectionery Product", "2023", "untab-kinki"),
	make("FUUL", "Confectionery Product", "2023", "untab-fuul"),
	make("DICH™ Fashion", "Interactive Website", "2023", "untab-dich-fashion"),
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined =>
	SAMPLE_PROJECTS.find((p) => p.slug === slug);
