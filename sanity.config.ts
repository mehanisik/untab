import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { getEnv } from "./libs/validate-env";
import { CogIcon } from "@sanity/icons";

const env = getEnv();

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["settings"]);

export default defineConfig({
	basePath: "/studio",
	name: "untab-studio",
	title: "Untab Studio",
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
	plugins: [
		structureTool({
			structure: (S) =>
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
						S.divider(),
						...S.documentTypeListItems().filter(
							(listItem) => !singletonTypes.has(listItem.getId() || ""),
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
