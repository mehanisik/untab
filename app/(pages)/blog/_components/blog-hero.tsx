"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function BlogHero() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				gsap.from(root.querySelectorAll(".hero-line"), {
					y: 100,
					opacity: 0,
					duration: 1.2,
					ease: "expo.out",
					stagger: 0.08,
				});
			}),
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="w-full bg-background px-5 pt-32 sm:px-6 sm:pt-40 md:px-8 md:pt-48 lg:px-12 lg:pt-52"
		>
			<div className="mx-auto max-w-[1440px]">
				<div className="overflow-hidden">
					<h1 className="font-medium uppercase leading-[0.92] tracking-[-0.04em] text-foreground text-[clamp(3.5rem,11vw,10rem)]">
						<span className="hero-line block">Insights,</span>
						<span className="hero-line block">notes &amp; articles.</span>
					</h1>
				</div>
			</div>
		</section>
	);
}
