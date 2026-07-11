import { EnvelopeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "contact",
	title: "Contact Page",
	type: "document",
	icon: EnvelopeIcon,
	fields: [
		defineField({
			name: "headingLines",
			title: "Heading Lines",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
			description: "The coral block headline, one entry per line.",
		}),
		defineField({
			name: "intro",
			title: "Intro",
			type: "text",
			rows: 2,
			description: "Line under the headline, above the form.",
		}),
		defineField({
			name: "infoBlocks",
			title: "Info Blocks",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "title",
							title: "Title",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
						defineField({
							name: "email",
							title: "Email",
							type: "string",
							description:
								"If set, the detail renders as a mailto link. Otherwise the text below is shown.",
							validation: (rule) => rule.email(),
						}),
						defineField({
							name: "detailText",
							title: "Detail Text",
							type: "string",
						}),
						defineField({
							name: "detailSubtext",
							title: "Detail Subtext",
							type: "string",
							description: "Smaller line under the detail, e.g. a timezone.",
						}),
					],
					preview: { select: { title: "title", subtitle: "body" } },
				}),
			],
		}),
	],
	preview: { prepare: () => ({ title: "Contact Page" }) },
});
