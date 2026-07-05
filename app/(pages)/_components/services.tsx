"use client";

import { useGSAP } from "@gsap/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useId, useRef, useState } from "react";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { cn } from "~/libs/utils";

// Mirrors the services page (capabilities.tsx) so both surfaces tell the
// same story; this section is the index, /services is the deep dive.
const SERVICES = [
	{
		title: "Website & Platform Software",
		description:
			"Production-grade web apps and marketing sites, architected to scale and shipped end-to-end. What we design is exactly what goes live.",
		deliverables: ["Web & platform apps", "Headless CMS", "Performance & SEO"],
	},
	{
		title: "Brand Strategy",
		description:
			"Positioning, narrative, and the decisions that make everything downstream coherent. Who you are for, and the through-line that holds it together.",
		deliverables: ["Positioning", "Messaging & voice", "Naming"],
	},
	{
		title: "Branding",
		description:
			"Logos, type, colour, and motion built as a living system rather than a static logo pack. Designed to flex across every surface people meet it on.",
		deliverables: ["Identity", "Logo & marks", "Type & colour", "Motion"],
	},
	{
		title: "Creative Content",
		description:
			"Art direction, copy, and assets that carry the brand into the world. Consistent in tone, sharp in execution.",
		deliverables: ["Art direction", "Copywriting", "Imagery"],
	},
	{
		title: "Design System & Brand Guide",
		description:
			"Everything documented, tokenised, and ready for your team to run with. The brand stays consistent long after the engagement ends.",
		deliverables: ["Design tokens", "Component library", "Guidelines"],
	},
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Services() {
	const sectionRef = useRef<HTMLElement>(null);
	const panelBaseId = useId();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

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

	return (
		<section
			ref={sectionRef}
			aria-label="Our services"
			className="bg-background py-24 text-foreground md:py-32 lg:py-40"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<h2 className="svc-intro mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:mb-10">
					Our services{" "}
					<span className="tabular-nums">({pad(SERVICES.length)})</span>
				</h2>

				<p className="svc-intro max-w-[26ch] text-balance font-medium leading-[1.1] tracking-[-0.03em] text-[clamp(1.9rem,4vw,3.5rem)]">
					Design is the bridge between vision and reality.{" "}
					<span className="text-[var(--brand-coral-accent)]">
						Consider us your gateway.
					</span>
				</p>

				<div className="mt-14 md:mt-20">
					{SERVICES.map((service, index) => {
						const open = openIndex === index;
						const panelId = `${panelBaseId}-panel-${index}`;
						return (
							<div
								key={service.title}
								className="svc-row border-t border-foreground/12 last:border-b"
							>
								<button
									type="button"
									aria-expanded={open}
									aria-controls={panelId}
									onClick={() => setOpenIndex(open ? null : index)}
									className="group flex w-full items-center gap-5 py-6 text-left md:gap-8 md:py-8"
								>
									<span className="w-8 shrink-0 font-mono text-[11px] tabular-nums text-[var(--brand-coral-accent)]">
										{pad(index + 1)}
									</span>
									<span className="flex-1 text-balance font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(1.4rem,3vw,2.4rem)] transition-colors duration-300 group-hover:text-foreground/70">
										{service.title}
									</span>
									<span
										className={cn(
											"flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-foreground/40 md:size-11",
											open && "rotate-180",
										)}
										aria-hidden
									>
										<HugeiconsIcon
											icon={ArrowDown01Icon}
											className="size-[18px]"
											strokeWidth={1.5}
										/>
									</span>
								</button>

								{/* Grid-rows expansion: animates height without measuring,
								    and collapses cleanly if a row above opens. */}
								<section
									id={panelId}
									aria-label={service.title}
									className={cn(
										"grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
										open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
									)}
								>
									<div className="overflow-hidden">
										<div className="flex flex-col gap-6 pb-8 pl-13 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-10 md:pl-16">
											<p className="max-w-[52ch] text-pretty text-[14px] leading-relaxed text-foreground/60 md:text-[15px]">
												{service.description}
											</p>
											<div className="flex flex-col items-start gap-4 md:items-end">
												<ul className="flex flex-wrap gap-x-4 gap-y-1.5 md:justify-end">
													{service.deliverables.map((item) => (
														<li
															key={item}
															className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/45"
														>
															{item}
														</li>
													))}
												</ul>
												<Link
													href="/services"
													className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
												>
													Explore services
													<span aria-hidden>→</span>
												</Link>
											</div>
										</div>
									</div>
								</section>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
