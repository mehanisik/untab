import { CaseIcon } from "@sanity/icons";
import {
	orderRankField,
	orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "project",
	title: "Project",
	type: "document",
	icon: CaseIcon,
	// Enables manual drag-and-drop ordering in the Studio "Projects" list.
	orderings: [orderRankOrdering],
	groups: [
		{ name: "general", title: "General" },
		{ name: "client", title: "Client" },
		{ name: "content", title: "Content" },
		{ name: "caseStudy", title: "Case Study" },
		{ name: "media", title: "Media" },
		{ name: "branding", title: "Branding" },
		{ name: "tech", title: "Tech & Tools" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		// Hidden rank field that stores the manual drag-and-drop order.
		orderRankField({ type: "project" }),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			group: "general",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "general",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			to: [{ type: "category" }],
			group: "general",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "year",
			title: "Year",
			type: "string",
			group: "general",
		}),
		defineField({
			name: "author",
			title: "Project Lead",
			type: "reference",
			to: [{ type: "author" }],
			group: "general",
		}),
		defineField({
			name: "description",
			title: "Short Description",
			type: "text",
			rows: 3,
			group: "general",
			description: "Quick summary of the project for cards and lists.",
		}),
		defineField({
			name: "client",
			title: "Client Details",
			type: "object",
			group: "client",
			fields: [
				{ name: "name", title: "Client Name", type: "string" },
				{ name: "logo", title: "Client Logo", type: "image" },
				{ name: "website", title: "Website URL", type: "url" },
			],
		}),
		defineField({
			name: "metrics",
			title: "Project Metrics",
			type: "object",
			group: "general",
			fields: [
				{
					name: "duration",
					title: "Duration",
					type: "string",
					description: "e.g. 3 Months",
				},
				{ name: "industry", title: "Industry", type: "string" },
				{ name: "role", title: "Our Role", type: "string" },
			],
		}),
		defineField({
			name: "image",
			title: "Hero Image",
			type: "image",
			group: "media",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					title: "Alt text",
					type: "string",
					description:
						"Describe the image for search engines and screen readers. Falls back to the project title.",
				},
			],
		}),
		defineField({
			name: "cardImage",
			title: "Work Card Image",
			type: "image",
			group: "media",
			options: {
				hotspot: true,
			},
			description:
				"Curated image for homepage/work cards. Use a polished browser, app, or poster composition. Falls back to Hero Image.",
			fields: [
				{
					name: "alt",
					title: "Alt text",
					type: "string",
					description:
						"Describe the image for search engines and screen readers. Falls back to the project title.",
				},
			],
		}),
		defineField({
			name: "previewVideo",
			title: "Hover Preview Video",
			type: "file",
			group: "media",
			options: {
				accept: "video/mp4,video/webm",
			},
			description:
				"Optional short, muted loop for animated projects. Keep it lightweight; the Work Card Image is used as the poster/fallback.",
		}),
		defineField({
			name: "gallery",
			title: "Project Gallery",
			type: "array",
			group: "media",
			of: [
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							title: "Alt text",
							type: "string",
							description:
								"Describe the image for search engines and screen readers.",
						},
					],
				},
			],
			description:
				"Shown as the case study media column, after the hero image.",
		}),
		defineField({
			name: "content",
			title: "Project Content",
			type: "object",
			group: "content",
			fields: [
				defineField({
					name: "mission",
					title: "The Mission",
					type: "text",
					rows: 4,
				}),
				defineField({
					name: "approach",
					title: "Our Approach",
					type: "array",
					of: [{ type: "block" }],
				}),
				defineField({
					name: "result",
					title: "The Result",
					type: "array",
					of: [{ type: "block" }],
				}),
				defineField({
					name: "features",
					title: "Key Features",
					type: "array",
					of: [{ type: "string" }],
				}),
			],
		}),
		defineField({
			name: "about",
			title: "About (paragraphs)",
			type: "array",
			group: "caseStudy",
			of: [{ type: "string" }],
			description:
				"Each entry is one paragraph shown in the case study sidebar.",
		}),
		defineField({
			name: "services",
			title: "Services",
			type: "array",
			group: "caseStudy",
			of: [{ type: "string" }],
			description: "e.g. Design Site, Animations, Webflow.",
		}),
		defineField({
			name: "timeline",
			title: "Timeline",
			type: "string",
			group: "caseStudy",
			description: "e.g. 2 months.",
		}),
		defineField({
			name: "honors",
			title: "Honors / Awards",
			type: "array",
			group: "caseStudy",
			of: [{ type: "string" }],
			description: "e.g. Awwwards x 1, CSSDA x 1.",
		}),
		defineField({
			name: "testimonial",
			title: "Client Testimonial",
			type: "object",
			group: "content",
			fields: [
				{ name: "quote", title: "Quote", type: "text" },
				{ name: "author", title: "Author", type: "string" },
				{ name: "role", title: "Role", type: "string" },
				{ name: "avatar", title: "Avatar", type: "image" },
			],
		}),
		defineField({
			name: "branding",
			title: "Branding",
			type: "object",
			group: "branding",
			fields: [
				defineField({
					name: "colors",
					title: "Colors",
					type: "array",
					of: [
						{
							name: "colorItem",
							type: "object",
							fields: [
								{ name: "hex", title: "Hex", type: "string" },
								{ name: "label", title: "Label", type: "string" },
							],
						},
					],
				}),
				defineField({
					name: "typography",
					title: "Typography",
					type: "array",
					of: [
						{
							name: "typeItem",
							type: "object",
							fields: [
								{ name: "name", title: "Name", type: "string" },
								{ name: "category", title: "Category", type: "string" },
							],
						},
					],
				}),
			],
		}),
		defineField({
			name: "links",
			title: "Project Links",
			type: "object",
			group: "general",
			fields: [
				{ name: "live", title: "Live URL", type: "url" },
				{ name: "github", title: "GitHub Repository", type: "url" },
				{ name: "appStore", title: "App Store Link", type: "url" },
			],
		}),
		defineField({
			name: "techStack",
			title: "Tech Stack",
			type: "array",
			group: "tech",
			of: [{ type: "string" }],
			description:
				'Powers the case study "Stack" list and the featured-work tags.',
		}),
		defineField({
			name: "tools",
			title: "Tools",
			type: "array",
			group: "tech",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
			group: "seo",
		}),
	],
});
