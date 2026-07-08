import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Homepage singleton. The homepage is a fixed, designed layout (not a
 * reorderable page builder), so each section is a nested object modelled by
 * what it IS, not how it looks. Presentation-only values (poster colours,
 * rotation, grid config) stay in code.
 */
export default defineType({
	name: "homepage",
	title: "Homepage",
	type: "document",
	icon: HomeIcon,
	groups: [
		{ name: "intro", title: "Intro" },
		{ name: "showcase", title: "Showcase" },
		{ name: "features", title: "Features" },
		{ name: "collaboration", title: "Collaboration" },
		{ name: "vision", title: "Vision" },
	],
	fields: [
		defineField({
			name: "intro",
			title: "Intro",
			type: "object",
			group: "intro",
			fields: [
				defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
				defineField({
					name: "headingLines",
					title: "Heading Lines",
					type: "array",
					of: [defineArrayMember({ type: "string" })],
					description: "Each entry is one line of the large heading.",
				}),
			],
		}),
		defineField({
			name: "showcase",
			title: "Showcase",
			type: "object",
			group: "showcase",
			fields: [
				defineField({ name: "title", title: "Section Title", type: "string" }),
				defineField({
					name: "headingLines",
					title: "Heading Lines",
					type: "array",
					of: [defineArrayMember({ type: "string" })],
				}),
				defineField({
					name: "description",
					title: "Description",
					type: "text",
					rows: 3,
				}),
			],
		}),
		defineField({
			name: "features",
			title: "Features",
			type: "object",
			group: "features",
			fields: [
				defineField({ name: "title", title: "Section Title", type: "string" }),
				defineField({
					name: "items",
					title: "Feature Cards",
					type: "array",
					of: [
						defineArrayMember({
							type: "object",
							fields: [
								defineField({ name: "title", title: "Title", type: "string" }),
								defineField({
									name: "description",
									title: "Description",
									type: "text",
									rows: 3,
								}),
								defineField({
									name: "location",
									title: "Poster Location Tag",
									type: "string",
									description: 'Small mono tag, e.g. "WARSAW, PL".',
								}),
								defineField({
									name: "stat",
									title: "Poster Stat",
									type: "string",
									description: 'Big figure, e.g. "99%".',
								}),
								defineField({
									name: "caption",
									title: "Poster Caption",
									type: "string",
								}),
							],
							preview: { select: { title: "title", subtitle: "stat" } },
						}),
					],
				}),
			],
		}),
		defineField({
			name: "collaboration",
			title: "Collaboration",
			type: "object",
			group: "collaboration",
			fields: [
				defineField({ name: "title", title: "Section Title", type: "string" }),
				defineField({ name: "quote", title: "Quote", type: "text", rows: 2 }),
				defineField({
					name: "attribution",
					title: "Attribution",
					type: "string",
				}),
				defineField({ name: "note", title: "Note", type: "text", rows: 3 }),
				defineField({
					name: "pillars",
					title: "Pillars",
					type: "array",
					of: [
						defineArrayMember({
							type: "object",
							fields: [
								defineField({ name: "title", title: "Title", type: "string" }),
								defineField({
									name: "description",
									title: "Description",
									type: "text",
									rows: 3,
								}),
							],
							preview: { select: { title: "title" } },
						}),
					],
				}),
			],
		}),
		defineField({
			name: "vision",
			title: "Vision",
			type: "object",
			group: "vision",
			fields: [
				defineField({ name: "kicker", title: "Kicker", type: "string" }),
				defineField({
					name: "description",
					title: "Description",
					type: "text",
					rows: 3,
				}),
				defineField({ name: "linkText", title: "Link Text", type: "string" }),
				defineField({ name: "heading", title: "Heading", type: "string" }),
			],
		}),
	],
	preview: { prepare: () => ({ title: "Homepage" }) },
});
