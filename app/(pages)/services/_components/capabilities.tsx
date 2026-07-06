"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
	BrandingMark,
	ContentMark,
	PlatformMark,
	StrategyMark,
	SystemMark,
} from "~/components/service-marks";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { PAGE_PADDING, cn, pad } from "~/libs/utils";

/* ------------------------------------------------------------------ */
/* Specimen ledger: the disciplines as an index sheet. Mono column     */
/* heads, hairline rows, the whole row links to the case study that    */
/* proves the discipline. Hovering a row summons its mark, large and   */
/* coral, in the fixed preview area on the right.                      */
/* ------------------------------------------------------------------ */

interface Discipline {
	title: string;
	description: string;
	scope: string;
	caseStudy: string;
	href: string;
	mark: ReactNode;
}

const DISCIPLINES: Discipline[] = [
	{
		title: "Strategy",
		description:
			"Clarity and direction before anything gets built. Decisions grounded in insight, not assumptions.",
		scope: "Discovery · Research · Workshops",
		caseStudy: "Atik Import Export",
		href: "/work/atik-import-export",
		mark: <StrategyMark />,
	},
	{
		title: "Brand",
		description:
			"Visual and verbal systems that resonate and endure, built as a strategic asset rather than decoration.",
		scope: "Identity · Naming · Motion",
		caseStudy: "Untab Studio",
		href: "/work/untab-studio",
		mark: <BrandingMark />,
	},
	{
		title: "Website",
		description:
			"Brand-led marketing sites that work hard for your business, with guardrails your team can trust.",
		scope: "Architecture · Interface · Animation",
		caseStudy: "Sagando Bungalows",
		href: "/work/sagando-bungalows",
		mark: <ContentMark />,
	},
	{
		title: "Product",
		description:
			"Platforms and digital products that solve real problems and adapt as things change.",
		scope: "Flows · Prototyping · Systems",
		caseStudy: "Wooah!",
		href: "/work/wooah",
		mark: <SystemMark />,
	},
	{
		title: "Development",
		description:
			"Robust engineering behind every design. Built for growth, performance, and flexibility, not just launch day.",
		scope: "Backend · Front-end · Mobile",
		caseStudy: "Crypto Predict",
		href: "/work/crypto-predict",
		mark: <PlatformMark />,
	},
];

const TOTAL = pad(DISCIPLINES.length);

export function Capabilities() {
	const rootRef = useRef<HTMLElement>(null);
	const [hovered, setHovered] = useState<number | null>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				gsap.from(root.querySelectorAll<HTMLElement>(".cap-head"), {
					y: 28,
					autoAlpha: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});

				for (const row of root.querySelectorAll<HTMLElement>(".cap-row")) {
					gsap.from(row, {
						y: 36,
						autoAlpha: 0,
						duration: 0.8,
						ease: "expo.out",
						scrollTrigger: {
							trigger: row,
							start: "top 92%",
							toggleActions: "play reverse play reverse",
						},
					});
				}
			}),
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			aria-label="Capabilities"
			className="w-full bg-background pb-24 pt-24 text-foreground sm:pb-28 sm:pt-28 md:pb-36 md:pt-32"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<header>
					<p className="cap-head font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
						Services <span className="tabular-nums">({TOTAL})</span>
					</p>
					<h1 className="cap-head mt-6 max-w-[24ch] text-balance text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[0.98] tracking-[-0.035em]">
						Strategy, design, and development.{" "}
						<span className="text-[var(--brand-coral-accent)]">
							Together from day one.
						</span>
					</h1>
				</header>

				<div className="relative mt-14 sm:mt-20">
					{/* Hover preview: the hovered discipline's mark, oversized, on
					    the right rail. Pointer devices and wide screens only. */}
					<div
						aria-hidden
						className="pointer-events-none absolute -top-16 right-0 -z-10 hidden size-56 lg:block xl:size-64"
					>
						{DISCIPLINES.map((discipline, index) => (
							<span
								key={discipline.title}
								className={cn(
									"absolute inset-0 text-[var(--brand-coral-accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
									hovered === index
										? "scale-100 opacity-100 rotate-0"
										: "scale-90 opacity-0 rotate-6",
								)}
							>
								{discipline.mark}
							</span>
						))}
					</div>

					{/* biome-ignore lint/a11y/noStaticElementInteractions: mouse-leave only resets the decorative hover preview; rows themselves are the interactive elements */}
					<div className="cap-ledger" onMouseLeave={() => setHovered(null)}>
						{/* Column heads */}
						<div className="cap-row grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-5 border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 md:grid-cols-[3.5rem_1.2fr_1fr_auto] md:gap-x-8">
							<span>No.</span>
							<span>Discipline</span>
							<span className="hidden md:block">Scope</span>
							<span className="text-right">Case</span>
						</div>

						{DISCIPLINES.map((discipline, index) => (
							<Link
								key={discipline.title}
								href={discipline.href}
								onMouseEnter={() => setHovered(index)}
								onFocus={() => setHovered(index)}
								className={cn(
									"cap-row group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-5 border-b border-foreground/10 py-6 transition-opacity duration-300 md:grid-cols-[3.5rem_1.2fr_1fr_auto] md:gap-x-8 md:py-8",
									hovered !== null &&
										hovered !== index &&
										"pointer-fine:md:opacity-35",
								)}
							>
								<span className="pt-2 font-mono text-[11px] tabular-nums text-[var(--brand-coral-accent)]">
									{pad(index + 1)}
								</span>
								<div className="min-w-0">
									<h3 className="text-balance font-medium leading-[1.02] tracking-[-0.025em] text-[clamp(1.6rem,3.4vw,2.6rem)] transition-transform duration-300 ease-out group-hover:translate-x-1.5">
										{discipline.title}
									</h3>
									<p className="mt-2.5 max-w-[44ch] text-pretty text-[13px] leading-relaxed text-foreground/55 md:text-[14px]">
										{discipline.description}
									</p>
								</div>
								<span className="hidden pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 md:block">
									{discipline.scope}
								</span>
								<span className="justify-self-end pt-3 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 transition-colors duration-300 group-hover:text-foreground">
									{discipline.caseStudy}
									<HugeiconsIcon
										icon={ArrowUpRight01Icon}
										aria-hidden
										strokeWidth={2}
										className="ml-1.5 inline size-3.5 align-[-2px]"
									/>
								</span>
							</Link>
						))}
					</div>

					<div className="cap-head mt-10 flex justify-end md:mt-12">
						<Link
							href="/contact"
							className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
						>
							Start a project
							<span aria-hidden>→</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
