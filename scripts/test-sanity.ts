import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "next-sanity";

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	useCdn: false,
});

const QUERY = `*[_type == "project"] | order(year desc) { _id, title, "slug": slug.current, "image": image.asset->url }`;

async function main() {
	const projects = await client.fetch(QUERY);
	console.log("Sanity projects response:");
	console.log(JSON.stringify(projects, null, 2));
}

main();
