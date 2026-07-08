import { cache } from "react";
import { fetchSanity } from "./live";
import { QUERIES, type Service } from "./sanity";

/**
 * Grounded defaults mirroring the studio's disciplines. Used when Sanity has
 * no `service` documents yet or the fetch fails, so both the landing accordion
 * and the /services cards always render.
 */
export const SERVICES_FALLBACK: Service[] = [
	{
		title: "Strategy",
		mark: "strategy",
		lead: "Strategic",
		main: "Direction",
		cardDescription:
			"We map the market, audience, and goals into a clear direction your team can act on.",
		summary:
			"Clarity and direction before anything gets built. Insight, not assumptions.",
		meta: "Discovery · Positioning · Workshops",
	},
	{
		title: "Brand",
		mark: "brand",
		lead: "Brand",
		main: "Identity",
		cardDescription:
			"Identity systems that make the company easier to recognize and trust.",
		summary:
			"Visual and verbal systems that resonate and endure, across every touchpoint.",
		meta: "Identity · Naming · Motion",
	},
	{
		title: "Website",
		mark: "website",
		lead: "Website",
		main: "Design",
		cardDescription:
			"Marketing sites that explain the offer and turn attention into action.",
		summary:
			"Brand-led marketing sites that work hard, with guardrails your team can trust.",
		meta: "Architecture · Interface · Animation",
	},
	{
		title: "Product",
		mark: "product",
		lead: "Product",
		main: "Experience",
		cardDescription:
			"Digital products shaped around real user flows, not static screens.",
		summary:
			"Digital products that solve real problems and adapt as things change.",
		meta: "Flows · Prototyping · Design systems",
	},
	{
		title: "Development",
		mark: "development",
		lead: "Engineering",
		main: "& Build",
		cardDescription:
			"We engineer the build with care for speed, accessibility, and longevity.",
		summary:
			"Robust builds for growth, performance, and long-term flexibility.",
		meta: "Backend · Front-end · Mobile",
	},
	{
		title: "Cloud",
		mark: "cloud",
		lead: "Cloud",
		main: "& Infra",
		cardDescription:
			"Deploy, scale, and observe with confidence. Infrastructure that stays out of the way.",
		summary:
			"Deploy, scale, and observe with confidence. Infrastructure that stays out of the way.",
		meta: "Infrastructure · Deployment · Observability",
	},
];

/**
 * Fetches the ordered service list. Falls back to SERVICES_FALLBACK when the
 * dataset has no services yet, so the landing and /services pages never empty.
 */
export const getServices = cache(async (): Promise<Service[]> => {
	try {
		const services = await fetchSanity<Service[]>(QUERIES.services, {}, [
			"service",
		]);
		if (Array.isArray(services) && services.length > 0) return services;
	} catch (error) {
		console.error("Error fetching services from Sanity:", error);
	}
	return SERVICES_FALLBACK;
});
