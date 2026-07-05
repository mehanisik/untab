"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "~/components/logo-mark";
import { withMotion } from "~/libs/gsap/presets";

const LOGO_PIECES = [
	{
		id: "top-left",
		clipPath: "inset(0 50% 50% 0)",
		x: -76,
		y: -64,
		rotate: -18,
	},
	{
		id: "top-right",
		clipPath: "inset(0 0 50% 50%)",
		x: 82,
		y: -58,
		rotate: 16,
	},
	{
		id: "bottom-left",
		clipPath: "inset(50% 50% 0 0)",
		x: -70,
		y: 76,
		rotate: 14,
	},
	{
		id: "bottom-right",
		clipPath: "inset(50% 0 0 50%)",
		x: 78,
		y: 70,
		rotate: -15,
	},
] as const;

/**
 * One-time intro shown on the initial (hard) page load. Client-side route
 * changes never remount the root layout, so this plays once per visit.
 */
export function IntroPreloader() {
	const [done, setDone] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<HTMLDivElement>(null);
	const finalRef = useRef<HTMLDivElement>(null);
	const pulseRef = useRef<HTMLDivElement>(null);
	const sheenRef = useRef<HTMLSpanElement>(null);
	const pieceRefs = useRef<Array<HTMLDivElement | null>>([]);
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

					const pieces = pieceRefs.current.filter(
						(piece): piece is HTMLDivElement => piece !== null,
					);
					const tl = gsap.timeline({
						defaults: { ease: "expo.out" },
						onComplete: finish,
					});

					gsap.set(contentRef.current, { opacity: 0, scale: 0.92 });
					gsap.set(ghostRef.current, { opacity: 0, scale: 0.86 });
					gsap.set(finalRef.current, { opacity: 0, scale: 0.94 });
					gsap.set(pulseRef.current, { opacity: 0, scale: 0.62 });
					gsap.set(sheenRef.current, { xPercent: -160, opacity: 0 });

					pieces.forEach((piece, index) => {
						const pieceConfig = LOGO_PIECES[index];
						if (!pieceConfig) return;

						gsap.set(piece, {
							x: pieceConfig.x,
							y: pieceConfig.y,
							rotate: pieceConfig.rotate,
							opacity: 0,
							scale: 0.92,
							transformOrigin: "50% 50%",
							force3D: true,
						});
					});

					tl.fromTo(
						overlayRef.current,
						{ opacity: 0 },
						{ opacity: 1, duration: 0.18, ease: "power1.out" },
					)
						.to(
							contentRef.current,
							{ opacity: 1, scale: 1, duration: 0.45 },
							0.04,
						)
						.to(
							ghostRef.current,
							{ opacity: 0.14, scale: 1, duration: 0.5 },
							0.08,
						)
						.to(
							pieces,
							{
								x: 0,
								y: 0,
								rotate: 0,
								opacity: 1,
								scale: 1,
								duration: 0.9,
								ease: "expo.out",
								stagger: { each: 0.045, from: "edges" },
								force3D: true,
							},
							0.18,
						)
						.to(
							pulseRef.current,
							{
								opacity: 0.42,
								scale: 1.18,
								duration: 0.55,
								ease: "power2.out",
							},
							0.78,
						)
						.to(
							finalRef.current,
							{ opacity: 1, scale: 1, duration: 0.32, ease: "power3.out" },
							0.9,
						)
						.to(
							pieces,
							{ opacity: 0, duration: 0.18, ease: "power1.out" },
							0.96,
						)
						.to(
							sheenRef.current,
							{
								xPercent: 160,
								opacity: 1,
								duration: 0.58,
								ease: "power2.inOut",
							},
							1.02,
						)
						.to(
							pulseRef.current,
							{ opacity: 0, scale: 1.42, duration: 0.45, ease: "power2.out" },
							1.08,
						)
						.to(
							contentRef.current,
							{
								y: -34,
								scale: 0.98,
								opacity: 0,
								duration: 0.42,
								ease: "power3.in",
							},
							"+=0.12",
						)
						.to(
							overlayRef.current,
							{ yPercent: -100, duration: 0.82, ease: "expo.inOut" },
							"<0.08",
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
			className="fixed inset-0 z-[210] flex items-center justify-center overflow-hidden bg-background text-foreground"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(238_123_126_/_0.08),transparent_34rem)]" />

			<div
				ref={contentRef}
				className="relative z-10 grid h-44 w-44 place-items-center opacity-0 [contain:layout_paint_style] md:h-52 md:w-52"
			>
				<div
					ref={pulseRef}
					className="absolute inset-3 border border-[var(--brand-coral)]/45 opacity-0 will-change-transform"
				/>

				<div className="relative h-28 w-[6.875rem] overflow-visible md:h-32 md:w-[7.875rem]">
					<div
						ref={ghostRef}
						className="absolute inset-0 h-full w-full opacity-0 will-change-transform"
					>
						<LogoMark className="h-full w-full text-foreground" />
					</div>

					{LOGO_PIECES.map((piece, index) => (
						<div
							key={piece.id}
							ref={(node) => {
								pieceRefs.current[index] = node;
							}}
							className="absolute inset-0 h-full w-full opacity-0 will-change-transform"
							style={{ clipPath: piece.clipPath }}
						>
							<LogoMark className="h-full w-full text-primary" />
						</div>
					))}

					<div
						ref={finalRef}
						className="absolute inset-0 h-full w-full opacity-0 will-change-transform"
					>
						<LogoMark className="h-full w-full text-primary" />
						<span
							ref={sheenRef}
							className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-background/50 to-transparent opacity-0 will-change-transform"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
