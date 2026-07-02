import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { ReactTempus } from "tempus/react";
import { CookieConsentBanner } from "~/components/cookie-consent";
import { IntroPreloader } from "~/components/intro-preloader";
import { PostHogProvider } from "~/components/posthog-provider";
import { Providers } from "~/components/providers";
import { RouterTransitionProvider } from "~/components/route-transition";
import { VisualEditingWrapper } from "~/components/visual-editing";
import { SanityLive } from "~/libs/live";
import { Orchestra } from "~/orchestra";
import AppData from "~/package.json";

const satoshi = localFont({
	src: [
		{
			path: "../public/fonts/Satoshi-Variable.woff2",
			style: "normal",
			weight: "300 900",
		},
		{
			path: "../public/fonts/Satoshi-VariableItalic.woff2",
			style: "italic",
			weight: "300 900",
		},
	],
	variable: "--font-satoshi",
});

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

export const metadata: Metadata = generatePageMetadata({
	title: "Untab Studio - Digital Product Studio Warsaw",
	description:
		"Untab Studio is a passionate digital agency in Warsaw specializing in premium design and Next.js development. We build high-performance webapps, mobile apps, and brands for global success.",
});

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
	return (
		<html
			lang="en"
			className={`${satoshi.variable} ${switzer.variable}`}
			suppressHydrationWarning
		>
			<Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
			<body
				className="antialiased w-full font-normal font-[family-name:var(--font-switzer),sans-serif]"
				suppressHydrationWarning
			>
				<PostHogProvider>
					<Providers>
						<RouterTransitionProvider>{children}</RouterTransitionProvider>
						<IntroPreloader />
						<div className="fixed inset-0 pointer-events-none z-[9999]">
							<Orchestra />
							<VisualEditingWrapper />
							<Toaster closeButton position="bottom-right" />
						</div>
						<CookieConsentBanner />
					</Providers>
				</PostHogProvider>
				<SanityLive includeDrafts={false} />
				<ReactTempus patch />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting static SEO schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Untab Studio",
							url: baseUrl,
							logo: `${baseUrl}/logo.png`,
							address: {
								"@type": "PostalAddress",
								addressLocality: "Warsaw",
								addressCountry: "PL",
							},
							description:
								"A passionate digital agency based in Warsaw specializing in high-end design and development.",
							sameAs: [
								"https://twitter.com/untab_studio",
								"https://instagram.com/untab_studio",
								"https://linkedin.com/company/untab-studio",
							],
						}),
					}}
				/>
			</body>
		</html>
	);
}
