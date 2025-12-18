import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { GSAPRuntime } from "~/components/gsap/runtime";
import AppData from "~/package.json";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-sans",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
	title: "Untab Studio - Digital Product Studio",
	description:
		"The best digital studio you can partner with. We deliver digital products, webapps, mobile apps, brands and marketing websites you'll be excited to put in front of your customers.",
};

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
		<html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
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
				</ThemeProvider>
			</body>
		</html>
	);
}
