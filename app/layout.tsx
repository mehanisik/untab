import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { GSAPRuntime } from "~/components/gsap/runtime";
import AppData from "~/package.json";

import { ThemeProvider } from "~/components/theme-provider";
import { Orchestra } from "~/orchestra";
import { VisualEditingWrapper } from "~/components/visual-editing";
import { Analytics } from "~/components/analytics";
import { Toaster } from "sonner";

const satoshi = localFont({
	src: [
		{
			path: "../public/fonts/Satoshi-VariableItalic.woff2",
			style: "italic",
		},
		{
			path: "../public/fonts/Satoshi-Regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-satoshi",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

import { generatePageMetadata } from "~/libs/metadata";

export const metadata: Metadata = generatePageMetadata({
	title: "Untab Studio - Digital Product Studio Warsaw",
	description:
		"Untab Studio is a passionate digital agency in Warsaw specializing in premium design and Next.js development. We build high-performance webapps, mobile apps, and brands for global success.",
});

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={satoshi.variable} suppressHydrationWarning>
			<Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<GSAPRuntime />
					{children}
					<Orchestra />
					<VisualEditingWrapper />
					<Analytics />
					<Toaster closeButton position="bottom-right" />
					<script
						type="application/ld+json"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting static SEO schema
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								"@context": "https://schema.org",
								"@type": "Organization",
								name: "Untab Studio",
								url: "https://untab.studio",
								logo: "https://untab.studio/logo.png",
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
				</ThemeProvider>
			</body>
		</html>
	);
}
