"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function IntroFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const eyebrow = root.querySelector<HTMLElement>(".intro-eyebrow");
				const lines = root.querySelectorAll<HTMLElement>(".intro-line");

				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 75%",
						toggleActions: "play reverse play reverse",
					},
				});

				if (eyebrow) {
					tl.from(eyebrow, { y: 16, autoAlpha: 0, duration: 0.7 }, 0);
				}

				if (lines.length) {
					tl.from(
						lines,
						{ y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.07 },
						0.1,
					);
				}
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
