import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export default defineType({
	name: "settings",
	title: "Global Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{ name: "general", title: "General" },
		{ name: "social", title: "Social Media" },
		{ name: "footer", title: "Footer" },
	],
	fields: [
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
