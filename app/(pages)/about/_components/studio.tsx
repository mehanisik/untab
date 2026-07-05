"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

interface StudioFrame {
	src: string;
	alt: string;
	title: string;
	description: string;
	className: string;
	imageClassName: string;
	sizes: string;
}

// Tile geometry is deterministic: every tile carries an aspect ratio that
// matches its grid span, so rows always align instead of fighting the grid.
// Lockup tiles pin their surface to the brand ink/cream tokens so the right
// contrast variant of each asset stays legible in both themes.
const FRAMES: StudioFrame[] = [
	{
		// Native 2400x1260 (~1.9): the 2-col span at aspect 2/1 crops only a
		// few pixels, so the composed social frame reads intact.
		src: "/brand/og/og-image-dark.png",
		alt: "Untab Studio social share image on an ink background",
		title: "Positioning",
		description: "A concise public-facing line for the studio.",
		className: "col-span-2 aspect-[40/21] md:aspect-[2/1] bg-muted",
		imageClassName: "object-cover",
		sizes: "(min-width: 768px) 50vw, 100vw",
	},
	{
		src: "/brand/app-icon/app-icon-1024.png",
		alt: "Untab app icon with the studio mark",
		title: "App icon",
		description: "The mark packaged for product surfaces.",
		className: "aspect-square bg-muted",
		imageClassName: "object-cover",
		sizes: "(min-width: 768px) 25vw, 50vw",
	},
	{
		src: "/brand/lockups/untab-stacked-light-1200.png",
		alt: "Untab stacked logo lockup, ink on cream",
		title: "Lockup",
		description: "Stacked identity for compact brand moments.",
		className: "aspect-square bg-[var(--light)]",
		imageClassName: "object-contain p-7 md:p-9",
		sizes: "(min-width: 768px) 25vw, 50vw",
	},
	{
		// Light-glyph variant needs an ink surface in BOTH themes — on the
		// theme-aware muted token it disappears in light mode.
		src: "/brand/lockups/untab-horizontal-dark-1600.png",
		alt: "Untab horizontal logo lockup, cream on ink",
		title: "Wordmark",
		description: "Horizontal lockup for wide digital placements.",
		className: "col-span-2 md:col-span-4 aspect-[25/8] bg-[var(--dark)]",
		imageClassName: "object-contain px-10 py-6 md:px-24 md:py-10",
		sizes: "100vw",
	},
];

export function Studio() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const frames = root.querySelectorAll<HTMLElement>(".studio-frame");
				if (!frames.length) return;

				gsap.from(frames, {
					y: 48,
					opacity: 0,
					duration: 1.1,
					ease: "expo.out",
					stagger: 0.09,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});
			});

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			id="about-studio"
			aria-label="Untab public brand system"
			className="w-full bg-background py-20 md:py-28 lg:py-32"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
					<div className="md:col-span-3">
						<p className="studio-frame text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
							Public system
						</p>
					</div>
					<div className="md:col-span-9 lg:col-span-7">
						<h2 className="studio-frame text-balance text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl">
							A studio identity built to move cleanly across product, web, and
							social surfaces.
						</h2>
					</div>
				</div>
			</div>

			{/* Stays in the container like every other section. Mobile: social
			    frame full width, the two square tiles pair up, wordmark band
			    full width. Desktop: one row of frame + squares, wordmark band
			    beneath spanning all four columns. */}
			<div className="container px-6 md:px-12 lg:px-24">
				<div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
					{FRAMES.map((frame) => (
						<figure
							key={frame.src}
							className={`studio-frame group relative overflow-hidden ${frame.className}`}
						>
							<Image
								src={frame.src}
								alt={frame.alt}
								fill
								sizes={frame.sizes}
								className={frame.imageClassName}
							/>
							<figcaption className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-[var(--dark)]/85 to-transparent p-4 pt-14 text-[var(--light)] sm:block md:p-5">
								<p className="text-[10px] font-medium uppercase tracking-[0.22em] md:text-xs">
									{frame.title}
								</p>
								<p className="mt-1 max-w-xs text-xs leading-relaxed opacity-70">
									{frame.description}
								</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
