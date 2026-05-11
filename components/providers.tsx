"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionRouter } from "next-transition-router";
import { useEffect, useRef } from "react";
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
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = overlayRef.current;
		if (!el) return;
		gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
	}, []);

	return (
		<ThemeProvider>
			<GSAPRuntime />
			<Lenis root syncScrollTrigger />
			<TransitionRouter
				auto
				leave={(next) => {
					const el = overlayRef.current;
					if (!el) {
						next();
						return;
					}
					gsap.set(el, { autoAlpha: 0, pointerEvents: "auto" });
					const tween = gsap.to(el, {
						autoAlpha: 1,
						duration: 0.4,
						ease: "power2.in",
						onComplete: () => {
							window.scrollTo(0, 0);
							next();
						},
					});
					return () => tween.kill();
				}}
				enter={(next) => {
					const el = overlayRef.current;
					if (!el) {
						next();
						return;
					}
					gsap.set(el, { autoAlpha: 1 });
					const tween = gsap.to(el, {
						autoAlpha: 0,
						duration: 0.5,
						ease: "power2.out",
						onComplete: () => {
							gsap.set(el, { pointerEvents: "none" });
							next();
						},
					});
					return () => tween.kill();
				}}
			>
				{children}
				<div
					ref={overlayRef}
					aria-hidden
					className="page-transition-overlay fixed inset-0 z-[100] bg-background opacity-0"
				/>
			</TransitionRouter>
		</ThemeProvider>
	);
}
