import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export default defineType({
	name: "post",
	title: "Blog Post",
	type: "document",
	icon: DocumentsIcon,
	groups: [
		{ name: "content", title: "Content" },
		{ name: "settings", title: "Settings" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			group: "content",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "content",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "featured",
			title: "Featured Post",
			type: "boolean",
			group: "settings",
			initialValue: false,
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "reference",
			to: [{ type: "author" }],
			group: "settings",
		}),
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [{ type: "reference", to: [{ type: "category" }] }],
			group: "settings",
		}),
		defineField({
			name: "mainImage",
			title: "Main Image",
			type: "image",
			group: "content",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
			group: "settings",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "readingTime",
			title: "Reading Time",
			type: "string",
			group: "content",
			description: "e.g. 5 min read",
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			group: "content",
			rows: 3,
			description: "Summary for blog cards and SEO.",
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			group: "content",
			of: [
				{
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H1", value: "h1" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "Quote", value: "blockquote" },
					],
				},
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative Text",
						},
						{
							name: "caption",
							type: "string",
							title: "Caption",
						},
					],
				},
			],
		}),
		defineField({
			name: "seo",
			title: "SEO",
			type: "seo",
			group: "seo",
		}),
	],
	preview: {
		select: {
			title: "title",
			author: "author.name",
			media: "mainImage",
		},
		prepare(selection) {
			const { author } = selection;
			return { ...selection, subtitle: author && `by ${author}` };
		},
	},
});
