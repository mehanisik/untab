"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

const FALLBACK_IMAGE = "/brand/about/brand-collage.webp";

export function Studio({ image }: { image?: string }) {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const media = root.querySelector<HTMLElement>(".studio-media");
				if (!media) return;

				gsap.from(media, {
					y: 48,
					opacity: 0,
					duration: 1.1,
					ease: "expo.out",
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
			<div className="container px-4 md:px-8 lg:px-12">
				<div className="studio-media relative aspect-[1448/1086] w-full overflow-hidden rounded-xl bg-[var(--dark)]">
					<Image
						src={image ?? FALLBACK_IMAGE}
						alt="The Untab brand system in use — logo, notebook and business cards, laptop and tablet mockups, tote bag, shopping bag, and stickers."
						fill
						sizes="(min-width: 1024px) 90vw, 100vw"
						className="size-full object-cover"
					/>
				</div>
			</div>
		</section>
	);
}
