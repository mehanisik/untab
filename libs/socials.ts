/**
 * Single source of truth for social profiles — consumed by the footer,
 * the contact page, and the Organization JSON-LD in the root layout.
 * Edit handles here only, so all three stay in sync.
 *
 * VERIFY BEFORE LAUNCH: confirm each profile actually exists; delete any
 * entry the studio doesn't have — a dead social link is worse than none.
 */
export const SOCIALS = {
	linkedin: "https://linkedin.com/company/untab-studio",
	instagram: "https://instagram.com/untab_studio",
	twitter: "https://twitter.com/untab_studio",
	dribbble: "https://dribbble.com/untab_studio",
	github: "https://github.com/untab-studio",
} as const;

/** JSON-LD `sameAs` array for the Organization schema. */
export const SOCIAL_SAME_AS = Object.values(SOCIALS);
