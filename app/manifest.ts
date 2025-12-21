import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Untab Studio",
		short_name: "Untab Studio",
		description:
			"Untab Studio is a passionate digital agency in Warsaw specializing in premium design and Next.js development. We build high-performance webapps, mobile apps, and brands for global success.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [
			{
				src: "/icon.png",
				sizes: "any",
				type: "image/png",
			},
			{
				src: "/icon.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
