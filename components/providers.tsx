"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAPRuntime } from "~/components/gsap/runtime";
import { Lenis } from "~/components/lenis-provider";
import { ThemeProvider } from "~/components/theme-provider";

if (typeof window !== "undefined") {
	// Register useGSAP so tree-shaking keeps the hook in production builds, per
	// the @gsap/react docs. ScrollTrigger is the one plugin used app-wide.
	gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<ThemeProvider>
			<GSAPRuntime />
			<Lenis root syncScrollTrigger />
			{children}
		</ThemeProvider>
	);
}
