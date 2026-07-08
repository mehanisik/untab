import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Untab Studio",
		short_name: "Untab Studio",
		description:
			"Untab Studio is a passionate digital agency in Warsaw specializing in premium design and Next.js development. We build high-performance webapps, mobile apps, and brands for global success.",
		start_url: "/",
		display: "standalone",
		background_color: "#0A0A0A",
		theme_color: "#0A0A0A",
		icons: [
			{
				src: "/brand/favicon/favicon.svg",
				sizes: "any",
				type: "image/svg+xml",
				purpose: "any",
			},
			{
				src: "/brand/favicon/favicon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/brand/favicon/favicon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "/brand/app-icon/app-icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
