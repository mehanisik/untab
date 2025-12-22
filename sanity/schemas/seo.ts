import { defineField } from "sanity";

export const seo = {
	name: "seo",
	title: "SEO & Metadata",
	type: "object",
	fields: [
		defineField({
			name: "title",
			title: "Meta Title",
			type: "string",
			description: "Title used for search engines and social media.",
			validation: (Rule) =>
				Rule.max(60).warning("Should be under 60 characters"),
		}),
		defineField({
			name: "description",
			title: "Meta Description",
			type: "text",
			rows: 3,
			description: "Description used for search engines and social media.",
			validation: (Rule) =>
				Rule.max(160).warning("Should be under 160 characters"),
		}),
		defineField({
			name: "image",
			title: "Open Graph Image",
			type: "image",
			description: "Image for social media sharing (1200x630 recommended).",
			options: { hotspot: true },
		}),
		defineField({
			name: "keywords",
			title: "Keywords",
			type: "array",
			of: [{ type: "string" }],
			options: { layout: "tags" },
		}),
	],
};
