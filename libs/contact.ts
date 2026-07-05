/**
 * Single source of truth for the contact form's project types. Consumed by
 * the client form (pill options) and the server action (allowlist), so the
 * two can never drift apart.
 */
export const PROJECT_TYPES = [
	"Website & Platform",
	"Brand Strategy",
	"Branding",
	"Creative Content",
	"Design System",
	"Other",
] as const;
