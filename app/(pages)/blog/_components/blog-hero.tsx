"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

const DEFAULT_TITLE = ["Insights,", "notes & articles."];

export function BlogHero({ title }: { title?: string[] }) {
	const sectionRef = useRef<HTMLElement>(null);
	const lines = title && title.length > 0 ? title : DEFAULT_TITLE;

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
			className="w-full bg-background pt-32 sm:pt-40 md:pt-48 lg:pt-52"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<div className="overflow-hidden">
					<h1 className="font-medium uppercase leading-[0.92] tracking-[-0.04em] text-foreground text-[clamp(2.25rem,6vw,4rem)]">
						{lines.map((line) => (
							<span key={line} className="hero-line block">
								{line}
							</span>
						))}
					</h1>
				</div>
			</div>
		</section>
	);
}
