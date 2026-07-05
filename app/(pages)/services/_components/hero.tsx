"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { REVEAL } from "~/libs/gsap/presets";
import { PAGE_PADDING } from "~/libs/utils";

const META = [
	{ label: "Foundation", value: "Technical pedigree" },
	{ label: "Team", value: "Senior, in-house" },
	{ label: "Output", value: "Shipped, not slides" },
];

export function ServicesHero() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const eyebrow = root.querySelector<HTMLElement>(".hero-eyebrow");
				const titles = root.querySelectorAll<HTMLElement>(".hero-title");
				const lead = root.querySelector<HTMLElement>(".hero-lead");
				const rows = root.querySelectorAll<HTMLElement>(".hero-row");

				const trigger = {
					trigger: root,
					start: "top 85%",
					toggleActions: "play reverse play reverse",
				} as const;

				if (eyebrow) {
					gsap.from(eyebrow, {
						y: 14,
						opacity: 0,
						duration: 0.7,
						ease: "expo.out",
						scrollTrigger: trigger,
					});
				}

				if (titles.length) {
					gsap.from(titles, {
						y: 40,
						opacity: 0,
						duration: 1,
						ease: REVEAL.ease,
						stagger: 0.08,
						delay: 0.05,
						scrollTrigger: trigger,
					});
				}

				if (lead) {
					gsap.from(lead, {
						y: 20,
						opacity: 0,
						duration: 0.9,
						ease: REVEAL.ease,
						delay: 0.2,
						scrollTrigger: trigger,
					});
				}

				if (rows.length) {
					gsap.from(rows, {
						y: 18,
						opacity: 0,
						duration: 0.7,
						ease: REVEAL.ease,
						stagger: 0.06,
						delay: 0.35,
						scrollTrigger: trigger,
					});
				}
			});

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			id="services-hero"
			aria-label="Services overview"
			className="w-full bg-background pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 text-foreground"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<div className="grid grid-cols-12 gap-x-6 sm:gap-x-8">
					<div className="col-span-12 lg:col-span-7">
						<p className="hero-eyebrow text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] opacity-60">
							Services
						</p>
						<h1 className="mt-6 sm:mt-8 font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4rem)]">
							<span className="hero-title block">Five practices.</span>
							<span className="hero-title block">One studio.</span>
						</h1>
					</div>

					<div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-6 lg:mt-0 lg:self-end">
						<p className="hero-lead text-pretty text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] tracking-[-0.01em]">
							From the platform your business runs on to the strategy and
							content that make it remarkable. We ship the work end-to-end, with
							senior hands on every piece.
						</p>
					</div>
				</div>

				<dl className="mt-16 grid grid-cols-1 gap-px border-t border-foreground/15 sm:mt-20 sm:grid-cols-3 md:mt-24">
					{META.map((item) => (
						<div
							key={item.label}
							className="hero-row flex items-baseline justify-between gap-4 border-b border-foreground/15 py-5 sm:flex-col sm:items-start sm:gap-3 sm:py-6"
						>
							<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 sm:text-[11px]">
								{item.label}
							</dt>
							<dd className="text-[clamp(1.125rem,2vw,1.5rem)] font-medium tracking-[-0.015em] text-foreground/85">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
