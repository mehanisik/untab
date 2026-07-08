"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { type RefObject, useEffect, useRef, useState } from "react";
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
 * Isolates the `useLenis` store subscription so the async arrival of the
 * Lenis instance re-renders only this empty component, never the animated
 * overlay tree. Holds scroll for as long as the intro is covering.
 */
function LenisHold({
	lenisRef,
	doneRef,
}: {
	lenisRef: RefObject<Lenis | undefined>;
	doneRef: RefObject<boolean>;
}) {
	const lenis = useLenis();

	useEffect(() => {
		lenisRef.current = lenis;
		if (!doneRef.current) lenis?.stop();
	}, [lenis, lenisRef, doneRef]);

	return null;
}

/**
 * One-time intro shown on the initial (hard) page load. Client-side route
 * changes never remount the root layout, so this plays once per visit.
 */
export function IntroPreloader() {
	const [done, setDone] = useState(false);
	const doneRef = useRef(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const finalRef = useRef<HTMLDivElement>(null);
	const pieceRefs = useRef<Array<HTMLDivElement | null>>([]);
	const lenisRef = useRef<Lenis | undefined>(undefined);

	useGSAP(
		() =>
			withMotion(
				() => {
					const finish = () => {
						doneRef.current = true;
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

					gsap.set(finalRef.current, { opacity: 0 });

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

					tl.to(
						pieces,
						{
							x: 0,
							y: 0,
							rotate: 0,
							opacity: 1,
							scale: 1,
							duration: 0.9,
							ease: "expo.out",
							stagger: { each: 0.05, from: "edges" },
							force3D: true,
						},
						0.15,
					)
						// Swap the clipped quadrants for one whole logo so no
						// hairline seams show along the clip edges.
						.to(finalRef.current, { opacity: 1, duration: 0.2 }, 0.95)
						.to(pieces, { opacity: 0, duration: 0.15 }, 1)
						.to(
							contentRef.current,
							{
								y: -28,
								opacity: 0,
								duration: 0.4,
								ease: "power3.in",
							},
							"+=0.25",
						)
						.to(
							overlayRef.current,
							{ yPercent: -100, duration: 0.8, ease: "expo.inOut" },
							"<0.08",
						);
				},
				// Reduced motion: skip the intro entirely.
				() => {
					doneRef.current = true;
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
			className="fixed inset-0 z-210 flex items-center justify-center overflow-hidden bg-background text-foreground"
		>
			<LenisHold lenisRef={lenisRef} doneRef={doneRef} />

			<div
				ref={contentRef}
				className="relative h-28 w-[6.875rem] [contain:layout_paint_style] md:h-32 md:w-[7.875rem]"
			>
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
					className="absolute inset-0 h-full w-full opacity-0"
				>
					<LogoMark className="h-full w-full text-primary" />
				</div>
			</div>
		</div>
	);
}
