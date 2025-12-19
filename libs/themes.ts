/**
 * Adaptive Theme Registry
 * Maps project categories or specific IDs to UI tokens.
 */

export interface ThemeTokens {
	primary: string;
	accent?: string;
	background?: string;
}

export const THEME_REGISTRY: Record<string, ThemeTokens> = {
	fintech: {
		primary: "oklch(0.65 0.2 150)", // Emerald Green
		accent: "oklch(0.8 0.1 140)",
	},
	ecommerce: {
		primary: "oklch(0.6 0.25 30)", // Vibrant Orange
		accent: "oklch(0.7 0.15 40)",
	},
	branding: {
		primary: "oklch(0.6 0.2 250)", // Deep Sky Blue
		accent: "oklch(0.7 0.1 240)",
	},
	ai: {
		primary: "oklch(0.67 0.26 322)", // Original Purple
		accent: "oklch(0.8 0.1 310)",
	},
};

export const DEFAULT_THEME: ThemeTokens = THEME_REGISTRY["ai"];
