"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LogoMark } from "~/components/logo-mark";
import { withMotion } from "~/libs/gsap/presets";

export default function Loading() {
	const containerRef = useRef<HTMLDivElement>(null);
	const barRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				gsap.to(barRef.current, {
					scaleX: 1,
					duration: 1.6,
					ease: "power2.inOut",
					repeat: -1,
					yoyo: true,
				});
			}),
		{ scope: containerRef },
	);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background text-foreground"
		>
			<div className="flex flex-col items-center gap-7">
				<LogoMark
					aria-label="Untab Studio"
					className="size-9 text-[var(--brand-coral-accent)]"
				/>

				<div className="relative h-px w-40 overflow-hidden bg-foreground/10">
					<div
						ref={barRef}
						className="absolute inset-0 origin-left scale-x-0 bg-[var(--brand-coral-accent)]"
					/>
				</div>

				<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
					Loading
				</p>
			</div>
		</div>
	);
}
