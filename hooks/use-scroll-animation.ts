"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { REVEAL, withMotion } from "~/libs/gsap/presets";

export function useFadeInOnScroll<T extends HTMLElement = HTMLDivElement>(
	options: { delay?: number } = {},
) {
	const { delay = 0 } = options;
	const elementRef = useRef<T>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const el = elementRef.current;
				if (!el) return;
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
			}),
		{ scope: elementRef, dependencies: [delay] },
	);

	return elementRef;
}
