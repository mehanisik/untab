"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function VisionFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 70%",
						toggleActions: "play reverse play reverse",
					},
				});

				tl.from(
					root.querySelector(".vision-kicker"),
					{ y: 16, autoAlpha: 0, duration: 0.6 },
					0,
				)
					.from(
						root.querySelectorAll(".vision-word"),
						{ yPercent: 115, duration: 0.8, stagger: 0.018 },
						0.05,
					)
					.from(
						root.querySelectorAll(".vision-line"),
						{ yPercent: 115, duration: 1, stagger: 0.14 },
						0.3,
					)
					.fromTo(
						root.querySelector(".vision-underline"),
						{ scaleX: 0 },
						{ scaleX: 1, duration: 0.9, ease: "power3.inOut" },
						0.8,
					);

				gsap.fromTo(
					root.querySelector(".vision-arcs"),
					{ y: 90, rotate: 2 },
					{
						y: -50,
						rotate: 0,
						ease: "none",
						scrollTrigger: {
							trigger: root,
							start: "clamp(top bottom)",
							end: "clamp(bottom top)",
							scrub: true,
						},
					},
				);
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
