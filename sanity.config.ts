import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
	basePath: "/studio",
	name: "untab-studio",
	title: "Untab Studio",
	projectId,
	dataset,
	plugins: [deskTool(), visionTool()],
	schema: {
		types: schemaTypes,
	},
});
