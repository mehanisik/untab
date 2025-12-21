import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { getEnv } from "./libs/validate-env";

// Validate environment variables
const env = getEnv();

export default defineConfig({
	basePath: "/studio",
	name: "untab-studio",
	title: "Untab Studio",
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes,
	},
});
