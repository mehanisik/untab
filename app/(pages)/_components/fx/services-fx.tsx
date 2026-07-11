"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function ServicesFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const intro = root.querySelectorAll(".svc-intro");
				if (intro.length) {
					gsap.from(intro, {
						y: 28,
						autoAlpha: 0,
						duration: 0.9,
						ease: "expo.out",
						stagger: 0.1,
						scrollTrigger: {
							trigger: root,
							start: "top 75%",
							toggleActions: "play reverse play reverse",
						},
					});
				}

				const rows = root.querySelectorAll(".svc-row");
				if (rows.length) {
					gsap.from(rows, {
						y: 32,
						autoAlpha: 0,
						duration: 0.8,
						ease: "expo.out",
						stagger: 0.08,
						scrollTrigger: {
							trigger: rows[0] as Element,
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
				}
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
