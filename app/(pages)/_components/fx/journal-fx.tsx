"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function JournalFx(props: ComponentPropsWithoutRef<"section">) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const title = root.querySelector<HTMLElement>(".journal-title");
				const cta = root.querySelector<HTMLElement>(".journal-cta");
				const cards = root.querySelectorAll<HTMLElement>(".journal-card");

				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 75%",
						toggleActions: "play reverse play reverse",
					},
				});

				if (title) {
					tl.from(title, { y: 24, autoAlpha: 0, duration: 0.8 }, 0);
				}

				if (cards.length) {
					tl.from(
						cards,
						{ y: 56, autoAlpha: 0, duration: 0.9, stagger: 0.1 },
						0.15,
					);
				}

				if (cta) {
					tl.from(cta, { y: 14, autoAlpha: 0, duration: 0.7 }, 0.2);
				}
			}),
		{ scope: sectionRef },
	);

	return <section ref={sectionRef} {...props} />;
}
