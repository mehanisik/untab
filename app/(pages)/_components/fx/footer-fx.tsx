"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentPropsWithoutRef, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

export function FooterFx(props: ComponentPropsWithoutRef<"footer">) {
	const footerRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = footerRef.current;
				if (!root) return;

				gsap.fromTo(
					root.querySelector(".fx-inner"),
					{ yPercent: -10 },
					{
						yPercent: 0,
						ease: "none",
						scrollTrigger: {
							trigger: root,
							start: "clamp(top bottom)",
							end: "clamp(top 25%)",
							scrub: true,
						},
					},
				);

				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 85%",
						toggleActions: "play none none reverse",
					},
				});

				tl.from(
					root.querySelectorAll(".fx-logo"),
					{ y: 24, autoAlpha: 0, duration: 0.9 },
					0,
				)
					.from(
						root.querySelectorAll(".fx-tagline-line"),
						{ y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08 },
						0.1,
					)
					.from(
						root.querySelectorAll(".fx-col-label"),
						{ y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.06 },
						0.15,
					)
					.from(
						root.querySelectorAll(".fx-link"),
						{ y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.04 },
						0.25,
					)
					.from(
						root.querySelector(".fx-divider"),
						{
							scaleX: 0,
							transformOrigin: "left center",
							duration: 1,
						},
						0.35,
					)
					.from(
						root.querySelectorAll(".fx-meta"),
						{ y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
						0.45,
					);
			}),
		{ scope: footerRef },
	);

	return <footer ref={footerRef} {...props} />;
}
