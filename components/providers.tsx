"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAPRuntime } from "~/components/gsap/runtime";
import { Lenis } from "~/components/lenis-provider";
import { ThemeProvider } from "~/components/theme-provider";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
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
