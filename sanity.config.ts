import { CogIcon, EnvelopeIcon, HomeIcon, UsersIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { structureTool } from "sanity/structure";
import { getEnv } from "./libs/validate-env";
import { schemaTypes } from "./sanity/schemas";

const env = getEnv();

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["settings", "homepage", "about", "contact"]);

export default defineConfig({
	basePath: "/studio",
	name: "untab-studio",
	title: "Untab Studio",
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
	plugins: [
		structureTool({
			structure: (S: StructureBuilder) =>
				S.list()
					.title("Content")
					.items([
						S.listItem()
							.title("Global Settings")
							.id("settings")
							.icon(CogIcon)
							.child(
								S.document().schemaType("settings").documentId("settings"),
							),
						S.listItem()
							.title("Homepage")
							.id("homepage")
							.icon(HomeIcon)
							.child(
								S.document().schemaType("homepage").documentId("homepage"),
							),
						S.listItem()
							.title("About Page")
							.id("about")
							.icon(UsersIcon)
							.child(S.document().schemaType("about").documentId("about")),
						S.listItem()
							.title("Contact Page")
							.id("contact")
							.icon(EnvelopeIcon)
							.child(S.document().schemaType("contact").documentId("contact")),
						S.divider(),
						...S.documentTypeListItems().filter(
							(listItem: ListItemBuilder) =>
								!singletonTypes.has(listItem.getId() || ""),
						),
					]),
		}),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter((template) => !singletonTypes.has(template.schemaType)),
	},
	document: {
		actions: (input, context) =>
			singletonTypes.has(context.schemaType)
				? input.filter(({ action }) => action && singletonActions.has(action))
				: input,
	},
});
