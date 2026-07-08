"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Fragment, useRef } from "react";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";

interface VisionProps {
	kicker?: string;
	description?: string;
	linkText?: string;
	heading?: string;
}

/** Dashed concentric arcs sweeping up from the bottom-right of the section. */
function VisionArcs() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 1920 960"
			className="vision-arcs pointer-events-none absolute inset-0 size-full text-foreground"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeDasharray="2 16"
			>
				<path
					transform="translate(1582 1113) scale(1.4)"
					d="M-697.263,-226.536 C-601.739,-520.359 -325.498,-733 0,-733"
				/>
				<path
					transform="translate(1582 1113) rotate(-45) scale(1.4)"
					d="M-599.285,-194.704 C-517.184,-447.239 -279.76,-630 0,-630"
				/>
			</g>
		</svg>
	);
}

export function Vision({
	kicker = "Next step",
	description = "We have the perfect combination of mindset, skills, processes, and pricing structure. Together, we'll transform your ideas into the best-in-class digital experience.",
	linkText = "Let's talk",
	heading = "about your vision.",
}: VisionProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const words = description.split(" ");

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				// Entrance: one timeline, one ScrollTrigger; reverses out when
				// scrolling back above the section.
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

				// Ambience: the arcs drift with scroll — scrub is scroll-linked
				// (ease: "none"), kept on its own top-level tween per the docs.
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

	return (
		<section
			ref={sectionRef}
			className="relative isolate"
			aria-label="Start a conversation"
		>
			{/* Full-bleed muted surface: spans the viewport while content keeps the
			    shared max-width rails. Resolves to the viewport edges because the
			    section is centered in the page container. */}
			<div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen bg-muted" />

			<VisionArcs />

			<div className="container relative flex flex-col gap-14 px-6 py-24 sm:py-32 md:px-12 md:py-40 lg:px-24">
				<div className="max-w-md">
					<p className="vision-kicker mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
						{kicker}
					</p>
					<p className="text-pretty text-lg font-medium leading-relaxed text-foreground">
						{words.map((word, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
							<Fragment key={`${index}-${word}`}>
								<span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
									<span className="vision-word inline-block">{word}</span>
								</span>
								{index < words.length - 1 ? " " : ""}
							</Fragment>
						))}
					</p>
				</div>

				<h2 className="ml-auto flex max-w-150 flex-col items-start font-medium leading-[1.05] tracking-[-0.02em] text-foreground text-[clamp(2.25rem,4.5vw,4rem)]">
					<span className="block overflow-hidden pb-2">
						<span className="vision-line block">
							<Link
								href="/contact"
								className="group relative inline-block leading-none transition-colors duration-300 hover:text-[var(--brand-coral)]"
							>
								{linkText}
								<span className="vision-underline absolute -bottom-1.5 left-0 h-[3px] w-full origin-left bg-[var(--brand-coral)]" />
							</Link>
						</span>
					</span>
					<span className="block overflow-hidden">
						<span className="vision-line block">{heading}</span>
					</span>
				</h2>
			</div>
		</section>
	);
}
