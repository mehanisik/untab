"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { REVEAL, withMotion } from "~/libs/gsap/presets";

export function ShowcaseFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const title = root.querySelector<HTMLElement>(".showcase-reveal-title");
				const content = root.querySelector<HTMLElement>(
					".showcase-reveal-content",
				);

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

				if (title) reveal(title, 0);
				if (content) reveal(content, 0.4);
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
