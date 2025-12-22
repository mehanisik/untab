import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

export default defineType({
	name: "project",
	title: "Project",
	type: "document",
	icon: CaseIcon,
	groups: [
		{ name: "general", title: "General" },
		{ name: "client", title: "Client" },
		{ name: "content", title: "Content" },
		{ name: "media", title: "Media" },
		{ name: "branding", title: "Branding" },
		{ name: "tech", title: "Tech & Tools" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
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
		}),
		defineField({
			name: "gallery",
			title: "Project Gallery",
			type: "array",
			group: "media",
			of: [{ type: "image", options: { hotspot: true } }],
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
