import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { Providers } from "~/components/providers";
import AppData from "~/package.json";

import { Orchestra } from "~/orchestra";
import { VisualEditingWrapper } from "~/components/visual-editing";
import { Analytics } from "~/components/analytics";
import { Toaster } from "sonner";
import { ReactTempus } from "tempus/react";

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

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
		<html lang="en" className={satoshi.variable} suppressHydrationWarning>
			<Script async>{`window.satusVersion = '${AppData.version}';`}</Script>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
				suppressHydrationWarning
			>
				<Providers>
					{children}
					<div className="fixed inset-0 pointer-events-none z-[9999]">
						<Orchestra />
						<VisualEditingWrapper />
						<Analytics />
						<Toaster closeButton position="bottom-right" />
					</div>
				</Providers>
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
