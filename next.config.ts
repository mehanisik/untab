import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	poweredByHeader: false,
	productionBrowserSourceMaps:
		process.env.SOURCE_MAPS === "true" && typeof Bun === "undefined",
	typedRoutes: true,
	turbopack: {
		rules: {
			"*.svg": {
				loaders: [
					{
						loader: "@svgr/webpack",
						options: {
							memo: true,
							dimensions: false,
							svgoConfig: {
								multipass: true,
								plugins: [
									"removeDimensions",
									"removeOffCanvasPaths",
									"reusePaths",
									"removeElementsByAttr",
									"removeStyleElement",
									"removeScriptElement",
									"prefixIds",
									"cleanupIds",
									{
										name: "cleanupNumericValues",
										params: {
											floatPrecision: 1,
										},
									},
									{
										name: "convertPathData",
										params: {
											floatPrecision: 1,
										},
									},
									{
										name: "convertTransform",
										params: {
											floatPrecision: 1,
										},
									},
									{
										name: "cleanupListOfValues",
										params: {
											floatPrecision: 1,
										},
									},
								],
							},
						},
					},
				],
				as: "*.js",
			},
		},
	},
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
		reactRemoveProperties: true,
	},
	cacheComponents: true,
	// Sanity Live revalidates on demand, so cached Sanity data can live long.
	cacheLife: { default: sanity },
	compress: true,
	logging: {
		browserToTerminal: true,
	},
	experimental: {
		turbopackFileSystemCacheForDev: process.env.NODE_ENV !== "production",
		taint: true,
		// isolatedDevBuild: true,
		optimizePackageImports: ["gsap", "@base-ui/react", "lenis"],
	},
	devIndicators: false,
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
			{
				protocol: "https",
				hostname: "cdn.shopify.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
			{
				protocol: "https",
				hostname: "fastly.picsum.photos",
			},
			{
				protocol: "https",
				hostname: "cdn.prod.website-files.com",
			},
		],
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
		// 75 is the wrapper default (AVIF q75 is visually near-lossless for
		// photos); 90 stays allowlisted for hero/detail shots that opt in.
		qualities: [75, 90],
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "Content-Security-Policy",
					value: "frame-ancestors 'self';",
				},
				{
					key: "X-Frame-Options",
					value: "SAMEORIGIN",
				},
				{
					key: "X-XSS-Protection",
					value: "1; mode=block",
				},
				{
					key: "X-DNS-Prefetch-Control",
					value: "on",
				},
				{
					key: "Strict-Transport-Security",
					value: "max-age=63072000; includeSubDomains; preload",
				},
			],
		},
	],
	skipTrailingSlashRedirect: true,
	rewrites: async () => [
		{
			source: "/ingest/static/:path*",
			destination: "https://eu-assets.i.posthog.com/static/:path*",
		},
		{
			source: "/ingest/array/:path*",
			destination: "https://eu-assets.i.posthog.com/array/:path*",
		},
		{
			source: "/ingest/:path*",
			destination: "https://eu.i.posthog.com/:path*",
		},
	],
	redirects: async () => [
		{
			source: "/home",
			destination: "/",
			permanent: true,
		},
	],
};

export default nextConfig;
