"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

interface StudioFrame {
	src: string;
	alt: string;
}

const FRAMES: StudioFrame[] = [
	{ src: "/studio/01.jpg", alt: "Studio interior with plants and artwork" },
	{ src: "/studio/02.jpg", alt: "The team gathered around the lounge" },
	{
		src: "/studio/03.jpg",
		alt: "Working session reflected in the glass partition",
	},
	{ src: "/studio/04.jpg", alt: "Reading corner with the orange armchair" },
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
						toggleActions: "play none none none",
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
			aria-label="Inside the studio"
			className="w-full bg-background py-20 md:py-28 lg:py-32"
		>
			<div className="grid w-full grid-cols-2 gap-1 px-1 md:grid-cols-4 md:gap-1.5 md:px-1.5">
				{FRAMES.map((frame) => (
					<figure
						key={frame.src}
						className="studio-frame relative aspect-[4/5] overflow-hidden bg-muted"
					>
						<Image
							src={frame.src}
							alt={frame.alt}
							fill
							sizes="(min-width: 768px) 25vw, 50vw"
							className="object-cover"
						/>
					</figure>
				))}
			</div>
		</section>
	);
}
