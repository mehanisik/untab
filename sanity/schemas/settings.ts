import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "settings",
	title: "Global Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{ name: "general", title: "General" },
		{ name: "contact", title: "Contact" },
		{ name: "social", title: "Social Media" },
		{ name: "footer", title: "Footer" },
		{ name: "labels", title: "Section Labels" },
	],
	fields: [
		defineField({
			name: "contactEmail",
			title: "Contact Email",
			type: "string",
			group: "contact",
			description: "Shared across the footer and contact page.",
			validation: (rule) => rule.email(),
		}),
		defineField({
			name: "studioCity",
			title: "Studio City",
			type: "string",
			group: "contact",
			description: 'e.g. "Warsaw, Poland".',
		}),
		defineField({
			name: "timezone",
			title: "Timezone",
			type: "string",
			group: "contact",
			description: 'e.g. "CET · UTC+1".',
		}),
		defineField({
			name: "footerTagline",
			title: "Footer Tagline",
			type: "text",
			rows: 3,
			group: "footer",
		}),
		defineField({
			name: "studioTypeLabel",
			title: "Studio Type Label",
			type: "string",
			group: "footer",
			description: 'Small label under the tagline, e.g. "Software Studio".',
		}),
		defineField({
			name: "blogHeroTitle",
			title: "Blog Hero Title",
			type: "array",
			of: [{ type: "string" }],
			group: "labels",
			description: "Blog page hero, one entry per line.",
		}),
		defineField({
			name: "journalLabel",
			title: "Journal Section Label",
			type: "string",
			group: "labels",
			description: 'Homepage journal heading, e.g. "Journal".',
		}),
		defineField({
			name: "title",
			title: "Site Title",
			type: "string",
			group: "general",
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			group: "general",
		}),
		defineField({
			name: "heroVideo",
			title: "Hero Loop Video",
			type: "file",
			group: "general",
			options: {
				accept: "video/mp4,video/webm",
			},
			description:
				"Muted looping animation for the homepage hero. Keep it lightweight; the site falls back to the bundled loop when unset.",
		}),
		defineField({
			name: "socials",
			title: "Social Media Links",
			type: "array",
			group: "social",
			of: [
				{
					type: "object",
					fields: [
						{ name: "platform", type: "string", title: "Platform" },
						{ name: "url", type: "url", title: "URL" },
					],
				},
			],
		}),
		defineField({
			name: "footerText",
			title: "Footer Text",
			type: "text",
			rows: 2,
			group: "footer",
		}),
		defineField({
			name: "copyright",
			title: "Copyright Text",
			type: "string",
			group: "footer",
		}),
	],
});
