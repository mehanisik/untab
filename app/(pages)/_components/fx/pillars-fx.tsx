"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function PillarsFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const quoteWords = gsap.utils.toArray<HTMLElement>("[data-word]", root);
				if (quoteWords.length) {
					gsap.fromTo(
						quoteWords,
						{ yPercent: 115 },
						{
							yPercent: 0,
							duration: 0.9,
							ease: "expo.out",
							stagger: 0.03,
							scrollTrigger: {
								trigger: root,
								start: "top 70%",
								toggleActions: "play reverse play reverse",
							},
						},
					);
				}

				const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", root);
				if (fades.length) {
					gsap.fromTo(
						fades,
						{ y: 24, autoAlpha: 0 },
						{
							y: 0,
							autoAlpha: 1,
							duration: 0.9,
							ease: "expo.out",
							stagger: 0.12,
							delay: 0.35,
							scrollTrigger: {
								trigger: root,
								start: "top 70%",
								toggleActions: "play reverse play reverse",
							},
						},
					);
				}

				const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
				rows.forEach((row) => {
					const shapes = Array.from(
						row.querySelectorAll<SVGGeometryElement>("[stroke]"),
					);
					for (const shape of shapes) {
						const len = shape.getTotalLength();
						shape.style.strokeDasharray = `${len}`;
						shape.style.strokeDashoffset = `${len}`;
					}

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: row,
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
					tl.fromTo(
						row,
						{ y: 32, autoAlpha: 0 },
						{ y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" },
					).to(
						shapes,
						{
							strokeDashoffset: 0,
							duration: 0.9,
							ease: "power2.inOut",
							stagger: 0.15,
						},
						0.1,
					);
				});
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
