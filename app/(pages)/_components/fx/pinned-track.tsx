"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

interface PinnedTrackProps {
	header: ReactNode;
	itemCount: number;
	children: ReactNode;
}

export function PinnedTrack({ header, itemCount, children }: PinnedTrackProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const section = sectionRef.current;
				const viewport = viewportRef.current;
				const track = trackRef.current;
				if (!(section && viewport && track)) return;

				if (!window.matchMedia("(min-width: 768px)").matches) return;

				const distance = () =>
					Math.max(0, track.scrollWidth - viewport.clientWidth);

				gsap.set(viewport, { overflow: "hidden" });

				const tween = gsap.to(track, {
					x: () => -distance(),
					ease: "none",
					scrollTrigger: {
						trigger: section,
						start: "top top",
						end: () => `+=${distance()}`,
						pin: true,
						scrub: 1,
						anticipatePin: 1,
						invalidateOnRefresh: true,
					},
				});

				return () => {
					tween.scrollTrigger?.kill();
					tween.kill();
					gsap.set(viewport, { clearProps: "overflow" });
				};
			}),
		{ scope: sectionRef, dependencies: [itemCount] },
	);

	return (
		<section
			ref={sectionRef}
			id="work"
			className="relative w-full overflow-hidden bg-background py-20 md:py-0"
		>
			{header}

			<div className="container flex flex-col justify-center px-6 md:h-[100svh] md:px-12 md:pt-16 lg:px-24">
				<div
					ref={viewportRef}
					className="w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:snap-none"
				>
					<div ref={trackRef} className="flex w-max items-start gap-5 md:gap-8">
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}
