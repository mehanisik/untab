"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { REVEAL, withMotion } from "~/libs/gsap/presets";

export function FeaturesFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const heading = root.querySelector<HTMLElement>(".features-heading");
				const cards = gsap.utils.toArray<HTMLElement>(".features-card", root);

				const reveal = (el: HTMLElement, delay: number) => {
					gsap.fromTo(
						el,
						{ y: REVEAL.y, opacity: 0 },
						{
							y: 0,
							opacity: 1,
							duration: REVEAL.duration,
							ease: REVEAL.ease,
							delay,
							scrollTrigger: {
								trigger: el,
								start: REVEAL.start,
								toggleActions: REVEAL.toggleActions,
							},
						},
					);
				};

				if (heading) reveal(heading, 0);
				cards.forEach((card, index) => {
					reveal(card, index * 0.06);
				});
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
