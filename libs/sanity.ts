import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: "2023-05-03",
	useCdn: process.env.NODE_ENV === "production",
});

const builder = createImageUrlBuilder(client);

// biome-ignore lint/suspicious/noExplicitAny: sanity image source can be any valid source
export function urlFor(source: any) {
	return builder.image(source);
}

export const QUERIES = {
	projects: `*[_type == "project"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    description,
    "image": image.asset->url,
    content,
    branding,
    techStack,
    tools
  }`,
	projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    description,
    "image": image.asset->url,
    content,
    branding,
    techStack,
    tools
  }`,
	posts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    "mainImage": mainImage.asset->url,
    publishedAt,
    excerpt
  }`,
	postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    "mainImage": mainImage.asset->url,
    publishedAt,
    body,
    excerpt
  }`,
};
