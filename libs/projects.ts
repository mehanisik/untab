import { cache } from "react";
import { client, QUERIES } from "./sanity";

export interface Project {
	_id?: string;
	title: string;
	slug: string;
	category: string;
	year: string;
	href?: string;
	gradient?: string;
	description: string;
	accentColor?: string;
	image: string;
	techStack: string[];
	tools: string[];
	branding: {
		colors: { hex: string; label: string }[];
		typography: { name: string; category: string }[];
	};
	content: {
		mission: string;
		approach: string;
		result: string;
		features: string[];
	};
}

export const staticProjects: Project[] = [
	{
		title: "Trip",
		slug: "trip",
		category: "Mobile App",
		year: "2024",
		href: "/work/trip",
		gradient: "from-violet-600 via-purple-600 to-indigo-700",
		accentColor: "violet",
		image: "/projects/trip.png",
		description:
			"Next-generation travel planning with AI-driven itineraries and seamless booking.",
		techStack: ["React Native", "GraphQL", "Node.js", "AWS", "OpenAI"],
		tools: ["Figma", "After Effects", "Blender", "Jira"],
		branding: {
			colors: [
				{ hex: "#6366F1", label: "Primary Indigo" },
				{ hex: "#8B5CF6", label: "Accent Violet" },
				{ hex: "#4F46E1", label: "Deep Indigo" },
			],
			typography: [
				{ name: "Inter", category: "Sans Serif" },
				{ name: "Geist Mono", category: "Monospace" },
			],
		},
		content: {
			mission:
				"To revolutionize how travelers plan and experience their journeys by providing personalized, AI-driven itineraries that adapt to real-time changes.",
			approach:
				"We focused on a clean, intuitive interface that hides complex AI logic behind a simple user flow. Integrating global travel APIs and machine learning models to provide accurate recommendations.",
			result:
				"A highly engaging mobile app that reduced travel planning time by 60% and saw a 40% increase in repeat users within the first three months of launch.",
			features: [
				"AI-Driven Itineraries",
				"Real-time Flight & Hotel Updates",
				"Smart Budget Tracking",
				"Offline Map Access",
			],
		},
	},
	{
		title: "Hey Barista",
		slug: "hey-barista",
		category: "Mobile App",
		year: "2024",
		href: "/work/hey-barista",
		gradient: "from-amber-500 via-orange-500 to-red-600",
		accentColor: "amber",
		image: "/projects/hey-barista.png",
		description:
			"Connecting coffee enthusiasts with local baristas and unique specialty coffee experiences.",
		techStack: ["Flutter", "Firebase", "Google Cloud", "Stripe"],
		tools: ["Figma", "Illustrator", "Miro", "Slack"],
		branding: {
			colors: [
				{ hex: "#F59E0B", label: "Amber Sun" },
				{ hex: "#F97316", label: "Orange Zest" },
				{ hex: "#DC2626", label: "Barista Red" },
			],
			typography: [
				{ name: "Outfit", category: "Geometric Sans" },
				{ name: "Playfair Display", category: "Serif" },
			],
		},
		content: {
			mission:
				"To create a community-driven platform that elevates the specialty coffee experience for both baristas and consumers.",
			approach:
				"Leveraging geolocation and social features to create a 'discovery' engine for coffee lovers. We built a robust booking system for coffee workshops and tastings.",
			result:
				"Created a vibrant community of over 50,000 coffee enthusiasts across 10 major cities, significantly boosting revenue for local partner cafes.",
			features: [
				"Artisan Cafe Discovery",
				"Barista-Led Workshops",
				"Social Bean Reviews",
				"Direct Ordering & Loyalty",
			],
		},
	},
	{
		title: "Habits",
		slug: "habits",
		category: "Mobile App",
		year: "2023",
		href: "/work/habits",
		gradient: "from-emerald-500 via-teal-500 to-cyan-600",
		accentColor: "emerald",
		image: "/projects/habits.png",
		description:
			"A gamified habit tracker that turns daily routines into rewarding personal journeys.",
		techStack: ["Swift", "SwiftUI", "Firebase", "RevenueCat"],
		tools: ["Figma", "Linear", "Photoshop", "Procreate"],
		branding: {
			colors: [
				{ hex: "#10B981", label: "Emerald Green" },
				{ hex: "#14B8A6", label: "Teal Growth" },
				{ hex: "#0891B2", label: "Cyan Energy" },
			],
			typography: [
				{ name: "Space Grotesk", category: "Grotesque Sans" },
				{ name: "Lexend", category: "Reading Sans" },
			],
		},
		content: {
			mission:
				"To make personal growth fun and sustainable through gamification and social accountability.",
			approach:
				"We implemented RPG-like progression systems and social 'guilds' to keep users motivated. The UI was designed to be vibrant and encouraging.",
			result:
				"Achieved a 75% habit retention rate among active users, with over 1 million habits tracked in the first six months.",
			features: [
				"RPG Progression System",
				"Social Accountability Guilds",
				"Customizable Habit Quests",
				"Detailed Progress Analytics",
			],
		},
	},
	{
		title: "Marble",
		slug: "marble",
		category: "Web Platform",
		year: "2023",
		href: "/work/marble",
		gradient: "from-blue-600 via-indigo-600 to-violet-700",
		accentColor: "blue",
		image: "/projects/marble.png",
		description:
			"A secure, institutional-grade platform for managing digital asset portfolios at scale.",
		techStack: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"PostgreSQL",
			"Vercel",
		],
		tools: ["Figma", "Framer", "InDesign", "Trello"],
		branding: {
			colors: [
				{ hex: "#2563EB", label: "Royal Blue" },
				{ hex: "#4F46E1", label: "Indigo Depth" },
				{ hex: "#7C3AED", label: "Institutional Violet" },
			],
			typography: [
				{ name: "Manrope", category: "Humanist Sans" },
				{ name: "Bricolage Grotesque", category: "Display Grotesque" },
			],
		},
		content: {
			mission:
				"To provide institutional investors with a secure, transparent, and easy-to-use platform for managing diverse digital asset portfolios.",
			approach:
				"We prioritized security and compliance, integrating multi-signature wallets and real-time auditing. The dashboard was built for high-density data visualization.",
			result:
				"Managed over $2B in assets within the first year, becoming a trusted platform for several major hedge funds and family offices.",
			features: [
				"Institutional-Grade Security",
				"Real-time Portfolio Analytics",
				"Automated Compliance Reporting",
				"Multi-Signature Wallet Support",
			],
		},
	},
];

export const getProjects = cache(async (): Promise<Project[]> => {
	try {
		const sanityProjects = await client.fetch(QUERIES.projects);
		if (sanityProjects && sanityProjects.length > 0) {
			// biome-ignore lint/suspicious/noExplicitAny: sanity results are dynamic
			return sanityProjects.map((p: any) => {
				const staticProject = staticProjects.find((sp) => sp.slug === p.slug);
				return {
					...p,
					href: `/work/${p.slug}`,
					image: p.image || staticProject?.image || "/projects/placeholder.png",
					gradient:
						p.gradient ||
						staticProject?.gradient ||
						"from-zinc-900 to-zinc-800",
					accentColor: p.accentColor || staticProject?.accentColor || "zinc",
				};
			});
		}
	} catch (error) {
		console.error("Error fetching projects from Sanity:", error);
	}
	return staticProjects;
});

export const getProjectBySlug = cache(
	async (slug: string): Promise<Project | null> => {
		try {
			const project = await client.fetch(QUERIES.projectBySlug, { slug });
			if (project) {
				const staticProject = staticProjects.find((sp) => sp.slug === slug);
				return {
					...project,
					href: `/work/${project.slug}`,
					image:
						project.image ||
						staticProject?.image ||
						"/projects/placeholder.png",
					gradient:
						project.gradient ||
						staticProject?.gradient ||
						"from-zinc-900 to-zinc-800",
					accentColor:
						project.accentColor || staticProject?.accentColor || "zinc",
				};
			}
		} catch (error) {
			console.error(`Error fetching project with slug ${slug}:`, error);
		}
		return staticProjects.find((p) => p.slug === slug) || null;
	},
);

// Keep the static projects for backward compatibility during transition if needed
export const projects = staticProjects;
