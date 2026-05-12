"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
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
		title: "Grounded in Experience",
		body: "Every engagement starts from what we've learned shipping real products with real teams. We bring patterns that hold up, not theory.",
	},
	{
		id: "partner",
		title: "Partner-led Projects",
		body: "Founders and product leads work with senior people from day one. No hand-offs, no layers — the team you meet is the team that ships.",
	},
	{
		id: "efficiency",
		title: "Emphasis on Efficiency",
		body: "We pick the shortest path from idea to a thing in production. Tight scope, tight loops, and zero ceremony work we don't need.",
	},
	{
		id: "success",
		title: "Success Requires Definition",
		body: "Before we touch a pixel we agree on what good looks like. Clear outcomes, named metrics, and the trade-offs we'll make to get there.",
	},
	{
		id: "people",
		title: "Work with Great People",
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

				if (rows.length) {
					gsap.from(rows, {
						y: 18,
						opacity: 0,
						duration: 0.8,
						ease: REVEAL.ease,
						stagger: 0.06,
						delay: 0.3,
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
			className={`w-full bg-background pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-20 sm:pb-28 md:pb-36 ${PAGE_PADDING} text-[#B7A3F2]`}
			aria-label="How we work"
		>
			<p className="hww-eyebrow text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em]">
				How we work
			</p>

			<h2 className="mt-6 sm:mt-8 md:mt-10 font-medium leading-[0.9] tracking-[-0.035em] text-[clamp(2.5rem,9vw,9rem)] uppercase">
				<span className="hww-title block">Clarity and impact are</span>
				<span className="hww-title block">non-negotiable</span>
			</h2>

			<ul className="mt-12 sm:mt-16 md:mt-20 border-t border-current/30">
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
	const [open, setOpen] = useState(false);
	const contentRef = useRef<HTMLElement>(null);
	const iconRef = useRef<SVGSVGElement>(null);

	useGSAP(
		() => {
			const el = contentRef.current;
			const icon = iconRef.current;
			if (!(el && icon)) return;

			gsap.to(el, {
				height: open ? el.scrollHeight : 0,
				opacity: open ? 1 : 0,
				duration: 0.55,
				ease: "expo.out",
			});

			gsap.to(icon, {
				rotate: open ? 45 : 0,
				duration: 0.4,
				ease: "expo.out",
			});
		},
		{ dependencies: [open] },
	);

	return (
		<li className="hww-row border-b border-current/30">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={`hww-panel-${principle.id}`}
				className="group flex w-full items-center justify-between gap-6 py-5 sm:py-7 md:py-8 lg:py-9 text-left transition-opacity hover:opacity-80"
			>
				<span className="flex items-baseline gap-4 sm:gap-6 min-w-0">
					<span className="hidden sm:inline-block shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums opacity-55">
						{String(index + 1).padStart(2, "0")}
					</span>
					<span className="truncate text-[15px] sm:text-base md:text-lg lg:text-xl font-medium uppercase tracking-[0.14em]">
						{principle.title}
					</span>
				</span>

				<span
					aria-hidden
					className="relative inline-flex size-5 sm:size-6 shrink-0 items-center justify-center"
				>
					<svg
						ref={iconRef}
						viewBox="0 0 24 24"
						className="size-full"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="square"
						aria-hidden="true"
						focusable="false"
					>
						<title>Toggle</title>
						<line x1="12" y1="4" x2="12" y2="20" />
						<line x1="4" y1="12" x2="20" y2="12" />
					</svg>
				</span>
			</button>

			<section
				ref={contentRef}
				id={`hww-panel-${principle.id}`}
				aria-labelledby={`hww-trigger-${principle.id}`}
				style={{ height: 0, opacity: 0, overflow: "hidden" }}
			>
				<p className="max-w-2xl pb-7 sm:pb-9 md:pb-10 pl-0 sm:pl-12 text-pretty text-[14px] sm:text-[15px] md:text-base leading-[1.6] opacity-75">
					{principle.body}
				</p>
			</section>
		</li>
	);
}
