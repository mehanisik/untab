import { CaseIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "service",
	title: "Service",
	type: "document",
	icon: CaseIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: 'Short label, e.g. "Cloud".',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "order",
			title: "Order",
			type: "number",
			description: "Lower numbers appear first.",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "mark",
			title: "Icon Mark",
			type: "string",
			description: "Which built-in geometric mark to render.",
			options: {
				list: [
					{ title: "Strategy", value: "strategy" },
					{ title: "Brand", value: "brand" },
					{ title: "Website", value: "website" },
					{ title: "Product", value: "product" },
					{ title: "Development", value: "development" },
					{ title: "Cloud", value: "cloud" },
				],
				layout: "dropdown",
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "lead",
			title: "Card Title — Lead Line",
			type: "string",
			description: "Lighter top line of the /services card title.",
		}),
		defineField({
			name: "main",
			title: "Card Title — Main Line",
			type: "string",
			description: "Bold bottom line of the /services card title.",
		}),
		defineField({
			name: "cardDescription",
			title: "Card Description",
			type: "text",
			rows: 2,
			description: "Short line shown on the /services card.",
		}),
		defineField({
			name: "summary",
			title: "Landing Summary",
			type: "text",
			rows: 2,
			description: "Terse line shown in the landing accordion.",
		}),
		defineField({
			name: "meta",
			title: "Landing Meta",
			type: "string",
			description:
				'Middot-separated tags, e.g. "Backend · Front-end · Mobile".',
		}),
	],
	orderings: [
		{
			title: "Order",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: { title: "title", subtitle: "mark", order: "order" },
		prepare: ({ title, subtitle, order }) => ({
			title: `${order != null ? `${order}. ` : ""}${title}`,
			subtitle,
		}),
	},
});
