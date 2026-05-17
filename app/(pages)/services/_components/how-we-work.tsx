"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { REVEAL } from "~/libs/gsap/presets";

const PAGE_PADDING = "px-5 sm:px-6 md:px-8 lg:px-12";

interface Principle {
	id: string;
	title: string;
	body: string;
}

const PRINCIPLES: Principle[] = [
	{
		id: "experience",
		title: "Grounded in Experience.",
		body: "Every engagement starts from what we've learned shipping real products with real teams. We bring patterns that hold up, not theory — and we say no to the ones that don't.",
	},
	{
		id: "partner",
		title: "Partner-led Projects.",
		body: "Founders and product leads work with senior people from day one. No hand-offs, no layers — the team you meet is the team that ships.",
	},
	{
		id: "efficiency",
		title: "Emphasis on Efficiency.",
		body: "We pick the shortest path from idea to a thing in production. Tight scope, tight loops, and zero ceremony work we don't need.",
	},
	{
		id: "success",
		title: "Success Requires Definition.",
		body: "Before we touch a pixel, we agree on what good looks like. Clear outcomes, named metrics, and the trade-offs we'll make to get there.",
	},
	{
		id: "people",
		title: "Work with Great People.",
		body: "We're picky about who we partner with — on both sides. The work is better, the days are better, and the result speaks for itself.",
	},
];

export function HowWeWork() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const eyebrow = root.querySelector<HTMLElement>(".hww-eyebrow");
				const titleLines = root.querySelectorAll<HTMLElement>(".hww-title");
				const intro = root.querySelector<HTMLElement>(".hww-intro");
				const subtitle = root.querySelector<HTMLElement>(".hww-subtitle");
				const rows = root.querySelectorAll<HTMLElement>(".hww-row");

				const trigger = {
					trigger: root,
					start: "top 80%",
					toggleActions: "play none none none",
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

				if (titleLines.length) {
					gsap.from(titleLines, {
						y: 40,
						opacity: 0,
						duration: 1,
						ease: REVEAL.ease,
						stagger: 0.08,
						delay: 0.05,
						scrollTrigger: trigger,
					});
				}

				if (intro) {
					gsap.from(intro, {
						y: 20,
						opacity: 0,
						duration: 0.9,
						ease: REVEAL.ease,
						delay: 0.2,
						scrollTrigger: trigger,
					});
				}

				if (subtitle) {
					gsap.from(subtitle, {
						y: 16,
						opacity: 0,
						duration: 0.8,
						ease: REVEAL.ease,
						delay: 0.3,
						scrollTrigger: trigger,
					});
				}

				if (rows.length) {
					gsap.from(rows, {
						y: 24,
						opacity: 0,
						duration: 0.8,
						ease: REVEAL.ease,
						stagger: 0.08,
						scrollTrigger: {
							trigger: rows[0],
							start: "top 85%",
							toggleActions: "play none none none",
						},
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
			id="how-we-work"
			className={`w-full bg-background pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-20 sm:pb-28 md:pb-36 ${PAGE_PADDING} text-foreground`}
			aria-label="How we work"
		>
			{/* Header */}
			<div className="grid grid-cols-12 gap-x-6 sm:gap-x-8">
				<div className="col-span-12 lg:col-span-6">
					<p className="hww-eyebrow text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] opacity-60">
						Our values
					</p>
					<h2 className="mt-6 sm:mt-8 font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.75rem,7vw,6rem)]">
						<span className="hww-title block">We are</span>
						<span className="hww-title block">what we do.</span>
					</h2>
				</div>

				<div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-6 lg:mt-0 lg:self-end">
					<p className="hww-intro text-pretty text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] tracking-[-0.01em]">
						We are a studio where craft is rewarded, ideas move fast, and design
						is shipped with the intensity it deserves. Constraints are not
						obstacles but opportunities to create something extraordinary.
					</p>
				</div>
			</div>

			{/* Sub-intro under the principle list */}
			<div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-12 gap-x-6 sm:gap-x-8">
				<p className="hww-subtitle col-span-12 lg:col-span-5 lg:col-start-8 text-[13px] sm:text-sm leading-[1.65] opacity-65">
					Our work reflects these values, based on non-negotiable principles and
					driven by the people who make up Untab.
				</p>
			</div>

			{/* Principle list */}
			<ul className="mt-10 sm:mt-12 md:mt-16 border-t border-foreground/15">
				{PRINCIPLES.map((p, i) => (
					<PrincipleRow key={p.id} principle={p} index={i} />
				))}
			</ul>
		</section>
	);
}

function PrincipleRow({
	principle,
	index,
}: {
	principle: Principle;
	index: number;
}) {
	return (
		<li className="hww-row border-b border-foreground/15">
			<div className="grid grid-cols-12 gap-x-6 sm:gap-x-8 py-10 sm:py-14 md:py-16">
				<div className="col-span-1">
					<span
						aria-hidden
						className="inline-block font-mono text-base leading-none opacity-60"
					>
						+
					</span>
					<span className="sr-only">{`Principle ${index + 1}`}</span>
				</div>

				<div className="col-span-11 lg:col-span-5 lg:col-start-8">
					<h3 className="text-[clamp(1.375rem,2.2vw,2rem)] font-medium leading-[1.15] tracking-[-0.02em]">
						{principle.title}
					</h3>
					<p className="mt-4 sm:mt-5 text-pretty text-[13px] sm:text-sm leading-[1.65] opacity-65">
						{principle.body}
					</p>
				</div>
			</div>
		</li>
	);
}
