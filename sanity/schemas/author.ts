import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
	name: "author",
	title: "Author",
	type: "document",
	icon: UserIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "image",
			title: "Avatar",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "socials",
			title: "Social Links",
			type: "array",
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
	],
});
