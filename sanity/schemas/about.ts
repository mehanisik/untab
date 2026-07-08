import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "about",
	title: "About Page",
	type: "document",
	icon: UsersIcon,
	groups: [
		{ name: "manifesto", title: "Manifesto" },
		{ name: "studio", title: "Studio" },
		{ name: "stats", title: "Facts" },
	],
	fields: [
		defineField({
			name: "brandImage",
			title: "Studio Brand Image",
			type: "image",
			group: "studio",
			options: { hotspot: true },
			description:
				"Large brand collage shown in the Studio section. Falls back to the bundled image when empty.",
		}),
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			group: "manifesto",
			description: 'Small label above the intro, e.g. "About Untab".',
		}),
		defineField({
			name: "headingLines",
			title: "Heading Lines",
			type: "array",
			of: [{ type: "string" }],
			group: "manifesto",
			description:
				"Each entry renders as one line of the large heading. Keep 2–4 short lines.",
		}),
		defineField({
			name: "intro",
			title: "Intro Paragraphs",
			type: "array",
			of: [{ type: "text", rows: 4 }],
			group: "manifesto",
			description: "One or two paragraphs of positioning copy.",
		}),
		defineField({
			name: "studioStatement",
			title: "Studio Card Statement",
			type: "text",
			rows: 2,
			group: "manifesto",
		}),
		defineField({
			name: "studioLinkLabel",
			title: "Studio Card Link Label",
			type: "string",
			group: "manifesto",
		}),
		defineField({
			name: "statsEyebrow",
			title: "Facts Eyebrow",
			type: "string",
			group: "stats",
		}),
		defineField({
			name: "statsTitle",
			title: "Facts Title",
			type: "string",
			group: "stats",
		}),
		defineField({
			name: "stats",
			title: "Facts",
			type: "array",
			group: "stats",
			description:
				"Keep every entry verifiable. The live project count is prepended automatically.",
			of: [
				{
					type: "object",
					fields: [
						defineField({ name: "value", title: "Value", type: "string" }),
						defineField({
							name: "label",
							title: "Label",
							type: "text",
							rows: 2,
						}),
					],
					preview: {
						select: { title: "value", subtitle: "label" },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: "About Page" }),
	},
});
