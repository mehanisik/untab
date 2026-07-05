"use client";

import { useGSAP } from "@gsap/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useId, useRef, useState } from "react";
import {
	BrandingMark,
	ContentMark,
	PlatformMark,
	StrategyMark,
	SystemMark,
} from "~/components/service-marks";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { cn } from "~/libs/utils";

// The landing index of what /services covers in depth: five rows, one
// line each. Kept deliberately terse; the deep dive lives on /services.
const SERVICES = [
	{
		mark: <PlatformMark />,
		title: "Websites & Platforms",
		description:
			"Production-grade sites and web apps, designed and shipped end-to-end.",
		meta: "Web apps · Headless CMS · Performance",
	},
	{
		mark: <StrategyMark />,
		title: "Brand Strategy",
		description:
			"Positioning and narrative that make everything downstream coherent.",
		meta: "Positioning · Messaging · Naming",
	},
	{
		mark: <BrandingMark />,
		title: "Branding",
		description: "Identity as a living system. Logo, type, colour, motion.",
		meta: "Identity · Marks · Motion",
	},
	{
		mark: <ContentMark />,
		title: "Creative Content",
		description:
			"Art direction, copy, and assets that carry the brand into the world.",
		meta: "Art direction · Copy · Imagery",
	},
	{
		mark: <SystemMark />,
		title: "Design Systems",
		description: "Tokens, components, and guidelines your team can run with.",
		meta: "Tokens · Components · Guidelines",
	},
];

const pad = (n: number) => String(n).padStart(2, "0");

// One grid for the row and its panel keeps the expanded copy aligned
// exactly under the title, whatever the mark column measures.
const ROW_GRID =
	"grid grid-cols-[2.25rem_1fr_1.5rem] items-center gap-x-5 md:grid-cols-[3rem_1fr_1.75rem] md:gap-x-7";

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

				<p className="svc-intro max-w-[24ch] text-balance font-medium leading-[1.08] tracking-[-0.03em] text-[clamp(1.9rem,4vw,3.5rem)]">
					Vision on one side, reality on the other.{" "}
					<span className="text-[var(--brand-coral-accent)]">
						We are the bridge.
					</span>
				</p>

				<div className="mt-14 md:mt-20">
					{SERVICES.map((service, index) => {
						const open = openIndex === index;
						const panelId = `${panelBaseId}-panel-${index}`;
						return (
							<div
								key={service.title}
								className="svc-row border-t border-foreground/10 last:border-b"
							>
								<button
									type="button"
									aria-expanded={open}
									aria-controls={panelId}
									onClick={() => setOpenIndex(open ? null : index)}
									className={cn(
										ROW_GRID,
										"group w-full py-6 text-left md:py-8",
									)}
								>
									<span
										className={cn(
											"size-8 transition-colors duration-300 md:size-10",
											open
												? "text-[var(--brand-coral-accent)]"
												: "text-foreground/60 group-hover:text-foreground",
										)}
										aria-hidden
									>
										{service.mark}
									</span>
									<span className="min-w-0 truncate font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(1.35rem,2.8vw,2.2rem)] transition-colors duration-300 group-hover:text-foreground/70">
										{service.title}
									</span>
									<HugeiconsIcon
										icon={ArrowDown01Icon}
										aria-hidden
										strokeWidth={1.5}
										className={cn(
											"size-5 justify-self-end text-foreground/50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground md:size-6",
											open && "rotate-180",
										)}
									/>
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
										<div className={cn(ROW_GRID, "pb-7 md:pb-9")}>
											<span aria-hidden />
											<div className="space-y-2.5">
												<p className="max-w-[46ch] text-pretty text-[14px] leading-relaxed text-foreground/60 md:text-[15px]">
													{service.description}
												</p>
												<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
													{service.meta}
												</p>
											</div>
										</div>
									</div>
								</section>
							</div>
						);
					})}
				</div>

				<div className="svc-intro mt-10 flex justify-end md:mt-12">
					<Link
						href="/services"
						className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
					>
						All services
						<span aria-hidden>→</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
