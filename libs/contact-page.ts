import { cache } from "react";
import { fetchSanity } from "./live";
import { type Contact, QUERIES } from "./sanity";

/**
 * Server-only loader for the contact page singleton. Kept separate from
 * `contact.ts` (which the client form imports) so the `"use cache"` fetch
 * helper from ./live never enters the client bundle.
 */

/** Grounded defaults mirroring the shipped contact page copy. */
export const CONTACT_FALLBACK: Contact = {
	headingLines: ["Got an idea? We've got", "the craft. Let's team up."],
	intro: "Tell us more about yourself and what you've got in mind.",
	infoBlocks: [
		{
			title: "Chat to us",
			body: "Our friendly team is here to help.",
			email: "contact@untabstudio.com",
		},
		{
			title: "Based in",
			body: "Working with teams across Europe and beyond.",
			detailText: "Warsaw, Poland",
			detailSubtext: "CET · UTC+1",
		},
		{
			title: "Availability",
			body: "Mon to Fri, 9am to 5pm CET.",
			detailText: "Replies within one business day",
		},
	],
};

/** Fetches the contact page singleton, falling back to the grounded copy. */
export const getContact = cache(async (): Promise<Contact> => {
	try {
		const contact = await fetchSanity<Contact | null>(QUERIES.contact, {}, [
			"contact",
		]);
		if (contact) return contact;
	} catch (error) {
		console.error("Error fetching contact from Sanity:", error);
	}
	return CONTACT_FALLBACK;
});
