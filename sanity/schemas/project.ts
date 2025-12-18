import { defineField, defineType } from "sanity";

export default defineType({
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "year",
			title: "Year",
			type: "string",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
		}),
		defineField({
			name: "image",
			title: "Hero Image",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "object",
			fields: [
				defineField({ name: "mission", title: "Mission", type: "text" }),
				defineField({ name: "approach", title: "Text Block 1", type: "text" }),
				defineField({ name: "result", title: "Text Block 2", type: "text" }),
				defineField({
					name: "features",
					title: "Features",
					type: "array",
					of: [{ type: "string" }],
				}),
			],
		}),
		defineField({
			name: "branding",
			title: "Branding",
			type: "object",
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
			name: "techStack",
			title: "Tech Stack",
			type: "array",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "tools",
			title: "Tools",
			type: "array",
			of: [{ type: "string" }],
		}),
	],
});
