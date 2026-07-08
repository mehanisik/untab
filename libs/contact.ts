/**
 * Single source of truth for the contact form's project types. Consumed by
 * the client form (pill options) and the server action (allowlist), so the
 * two can never drift apart.
 *
 * NOTE: keep this file client-safe — the client form imports it. The CMS
 * loader lives in `contact-page.ts` (server-only) so `"use cache"` code from
 * ./live never leaks into the client bundle.
 */
export const PROJECT_TYPES = [
	"Website & Platform",
	"Brand Strategy",
	"Branding",
	"Creative Content",
	"Design System",
	"Other",
] as const;
