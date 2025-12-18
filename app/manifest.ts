import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Untab Studio",
		short_name: "Untab Studio",
		description: "Untab Studio is a platform for creating and managing tabs.",
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
			{
				src: "/apple-icon.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
		],
	};
}
