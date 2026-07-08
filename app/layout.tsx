import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { preconnect } from "react-dom";
import { ReactTempus } from "tempus/react";
import { CookieConsentBanner } from "~/components/cookie-consent";
import { IntroPreloader } from "~/components/intro-preloader";
import { Providers } from "~/components/providers";
import { RouterTransitionProvider } from "~/components/route-transition";
import { VisualEditingWrapper } from "~/components/visual-editing";
import { SanityLive } from "~/libs/live";
import { Orchestra } from "~/orchestra";
import AppData from "~/package.json";

const switzer = localFont({
	src: [
		{
			path: "../public/fonts/Switzer-Variable.woff2",
			style: "normal",
			weight: "100 900",
		},
		{
			path: "../public/fonts/Switzer-VariableItalic.woff2",
			style: "italic",
			weight: "100 900",
		},
	],
	variable: "--font-switzer",
	display: "swap",
});

import { generatePageMetadata } from "~/libs/metadata";
import { getEnv } from "~/libs/validate-env";

const env = getEnv();
const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
	...generatePageMetadata({
		title: "Untab Studio - Digital Product Studio Warsaw",
		description:
			"The details are the work. Untab is an independent software studio in Warsaw building brand-led websites, platforms, and digital products for ambitious teams worldwide.",
	}),
	// Child pages pass a bare title (e.g. "About") — the template appends the
	// brand so every <title> reads "About | Untab Studio" without hardcoding.
	title: {
		default: "Untab Studio - Digital Product Studio Warsaw",
		template: "%s | Untab Studio",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
		{ media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Warm the TCP/TLS connection to Sanity's image CDN before the first
	// <Image> requests it, shaving connection-setup latency off the LCP path.
	preconnect("https://cdn.sanity.io", { crossOrigin: "anonymous" });

	return (
		<html lang="en" className={switzer.variable} suppressHydrationWarning>
			<Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
			<body
				className="antialiased w-full font-normal font-sans"
				suppressHydrationWarning
			>
				<Providers>
					<RouterTransitionProvider>{children}</RouterTransitionProvider>
					<IntroPreloader />
					<div className="fixed inset-0 pointer-events-none z-[9999]">
						<Orchestra />
						<VisualEditingWrapper />
					</div>
					<CookieConsentBanner />
				</Providers>
				<SanityLive includeDrafts={false} />
				<ReactTempus patch />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting static SEO schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@graph": [
								{
									"@type": ["Organization", "ProfessionalService"],
									"@id": `${baseUrl}/#organization`,
									name: "Untab Studio",
									url: baseUrl,
									logo: `${baseUrl}/logo.png`,
									image: `${baseUrl}/opengraph-image.png`,
									email: "contact@untabstudio.com",
									address: {
										"@type": "PostalAddress",
										addressLocality: "Warsaw",
										addressCountry: "PL",
									},
									areaServed: "Worldwide",
									knowsAbout: [
										"Web design",
										"Next.js development",
										"Brand design",
										"Motion design",
										"Digital product development",
									],
									description:
										"An independent software studio in Warsaw building brand-led websites, platforms, and digital products for ambitious teams worldwide.",
								},
								{
									"@type": "WebSite",
									"@id": `${baseUrl}/#website`,
									url: baseUrl,
									name: "Untab Studio",
									publisher: { "@id": `${baseUrl}/#organization` },
								},
							],
						}),
					}}
				/>
			</body>
		</html>
	);
}
