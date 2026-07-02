"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "~/components/logo-mark";
import { withMotion } from "~/libs/gsap/presets";

const FILL_VISIBLE = "inset(0% 0 0 0)";
const FILL_HIDDEN = "inset(100% 0 0 0)";

/**
 * One-time intro shown on the initial (hard) page load: a single liquid-fill
 * of the logo mark, then the overlay slides away and unmounts. Client-side
 * route changes never remount the root layout, so this plays once per visit.
 */
export function IntroPreloader() {
	const [done, setDone] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const fillRef = useRef<HTMLDivElement>(null);
	const lenis = useLenis();
	const lenisRef = useRef(lenis);

	// Lenis arrives async; hold scroll for as long as the intro is covering.
	useEffect(() => {
		lenisRef.current = lenis;
		if (!done) lenis?.stop();
	}, [lenis, done]);

	useGSAP(
		() =>
			withMotion(
				() => {
					const finish = () => {
						lenisRef.current?.start();
						setDone(true);
					};

					const tl = gsap.timeline({ onComplete: finish });

					tl.fromTo(
						contentRef.current,
						{ opacity: 0, scale: 0.96 },
						{ opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
					)
						// Liquid fill: the solid mark rises once inside the ghost mark.
						.fromTo(
							fillRef.current,
							{ clipPath: FILL_HIDDEN },
							{ clipPath: FILL_VISIBLE, duration: 1.1, ease: "power2.inOut" },
							0.15,
						)
						// Lift the mark out, then sweep the cover up to reveal the page.
						.to(
							contentRef.current,
							{ yPercent: -60, opacity: 0, duration: 0.45, ease: "power2.in" },
							"+=0.2",
						)
						.to(
							overlayRef.current,
							{ yPercent: -100, duration: 0.8, ease: "expo.inOut" },
							"<0.1",
						);
				},
				// Reduced motion: skip the intro entirely.
				() => {
					lenisRef.current?.start();
					setDone(true);
				},
			),
		{ scope: overlayRef },
	);

	if (done) return null;

	return (
		<div
			ref={overlayRef}
			role="status"
			aria-label="Loading"
			className="fixed inset-0 z-[210] flex items-center justify-center bg-background text-foreground"
		>
			<div
				className="grain-bg pointer-events-none absolute inset-0 opacity-5 dark:opacity-10"
				style={{
					backgroundImage:
						'url("https://grainy-gradients.vercel.app/noise.svg")',
				}}
			/>

			<div
				ref={contentRef}
				className="relative z-10 flex flex-col items-center gap-6"
			>
				<div className="relative">
					<LogoMark className="h-20 w-auto text-foreground/10" />
					<div
						ref={fillRef}
						className="absolute inset-0"
						style={{ clipPath: FILL_HIDDEN }}
					>
						<LogoMark className="h-20 w-auto text-primary" />
					</div>
				</div>

				<span className="text-[10px] font-medium lowercase tracking-[0.3em] text-muted-foreground">
					untab studio
				</span>
			</div>
		</div>
	);
}
