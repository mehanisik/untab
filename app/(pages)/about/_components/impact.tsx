"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface Stat {
	value: string;
	body: string;
}

const STATS: Stat[] = [
	{
		value: "2021",
		body: "The year we started. What began as a small team in Warsaw has grown into a global practice working with founders across continents.",
	},
	{
		value: "40+",
		body: "Strategists, designers, and engineers. Projects shipped end-to-end as one team, each bringing a perspective that the work is better for.",
	},
	{
		value: "$120m+",
		body: "Raised by our clients over the past four years. The systems we build together help them turn that capital into outcomes.",
	},
	{
		value: "8m+",
		body: "People who interact with the products we've helped design and ship. Quietly, every day, in the background of their work.",
	},
];

export function Impact() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const eyebrow = root.querySelector<HTMLElement>(".impact-eyebrow");
				const title = root.querySelector<HTMLElement>(".impact-title");
				const rows = root.querySelectorAll<HTMLElement>(".impact-row");

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

				if (title) {
					gsap.from(title, {
						y: 28,
						opacity: 0,
						duration: 0.9,
						ease: "expo.out",
						delay: 0.1,
						scrollTrigger: trigger,
					});
				}

				if (rows.length) {
					gsap.from(rows, {
						y: 24,
						opacity: 0,
						duration: 0.85,
						ease: "expo.out",
						stagger: 0.08,
						delay: 0.25,
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
			id="about-impact"
			className="w-full bg-surface-deep text-surface-deep-foreground py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-24"
			aria-label="Untab's technical pedigree in numbers"
		>
			<div className="mx-auto w-full max-w-[1440px]">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
					<div className="md:col-span-3 lg:col-span-3">
						<p className="impact-eyebrow text-[11px] font-medium uppercase tracking-[0.28em] opacity-60">
							Technical pedigree
						</p>
					</div>
					<div className="md:col-span-9 lg:col-span-9">
						<h2 className="impact-title text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight">
							A pedigree, measured in outcomes
						</h2>
					</div>
				</div>

				<ul className="mt-16 md:mt-20 border-t border-current/15">
					{STATS.map((s) => (
						<li
							key={s.value}
							className="impact-row grid grid-cols-1 gap-6 border-b border-current/15 py-10 md:grid-cols-12 md:gap-10 md:py-12 lg:py-14"
						>
							<div className="md:col-span-3 lg:col-span-3" aria-hidden />
							<div className="md:col-span-4 lg:col-span-4">
								<p className="text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em] tabular-nums">
									{s.value}
								</p>
							</div>
							<div className="md:col-span-5 lg:col-span-5 flex items-center">
								<p className="max-w-md text-pretty text-sm md:text-base leading-[1.65] opacity-70">
									{s.body}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
