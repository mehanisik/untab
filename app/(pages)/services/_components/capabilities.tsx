"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";
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
/* Minimal bento: five flat tiles, one discipline each. A mark, a      */
/* title, a three-word meta line. The whole tile links to the case     */
/* study that proves the discipline.                                   */
/* ------------------------------------------------------------------ */

interface Discipline {
	title: string;
	meta: string;
	mark: ReactNode;
	href: string;
	// Flat tile surfaces from the brand palette only.
	surface: string;
	tall?: boolean;
}

const DISCIPLINES: Discipline[] = [
	{
		title: "Strategy",
		meta: "Discovery · Research · Workshops",
		mark: <StrategyMark />,
		href: "/work/atik-import-export",
		surface: "border border-foreground/10 bg-card text-card-foreground",
	},
	{
		title: "Brand",
		meta: "Identity · Naming · Motion",
		mark: <BrandingMark />,
		href: "/work/untab-studio",
		surface: "bg-[var(--brand-coral)] text-[var(--dark)]",
	},
	{
		title: "Development",
		meta: "Backend · Front-end · Mobile",
		mark: <PlatformMark />,
		href: "/work/crypto-predict",
		surface: "bg-[var(--dark)] text-[var(--light)]",
		tall: true,
	},
	{
		title: "Website",
		meta: "Architecture · Interface · Animation",
		mark: <ContentMark />,
		href: "/work/sagando-bungalows",
		surface: "bg-[var(--light)] text-[var(--dark)]",
	},
	{
		title: "Product",
		meta: "Flows · Prototyping · Systems",
		mark: <SystemMark />,
		href: "/work/wooah",
		surface: "border border-foreground/10 bg-card text-card-foreground",
	},
];

const TOTAL = pad(DISCIPLINES.length);

export function Capabilities() {
	const rootRef = useRef<HTMLElement>(null);

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

				gsap.from(root.querySelectorAll<HTMLElement>(".cap-tile"), {
					y: 44,
					autoAlpha: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.09,
					scrollTrigger: {
						trigger: root.querySelector(".cap-grid"),
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});
			}),
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			aria-label="Capabilities"
			className="w-full bg-background pb-24 pt-4 text-foreground sm:pb-28 md:pb-36"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<header>
					<p className="cap-head font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
						Our services <span className="tabular-nums">({TOTAL})</span>
					</p>
					<h2 className="cap-head mt-6 max-w-[24ch] text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
						Strategy, design, and development.{" "}
						<span className="text-[var(--brand-coral-accent)]">
							Together from day one.
						</span>
					</h2>
				</header>

				<div className="cap-grid mt-14 grid grid-cols-1 gap-3 sm:mt-20 md:grid-cols-3 md:gap-4">
					{DISCIPLINES.map((discipline, index) => (
						<Link
							key={discipline.title}
							href={discipline.href}
							aria-label={`${discipline.title} case study`}
							className={cn(
								"cap-tile group relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-2xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 md:min-h-[20rem]",
								discipline.tall && "md:row-span-2 md:min-h-0",
								discipline.surface,
							)}
						>
							<div className="flex items-start justify-between">
								<span
									className={cn(
										"size-12 opacity-80 md:size-14",
										discipline.tall && "md:size-20",
									)}
								>
									{discipline.mark}
								</span>
								<HugeiconsIcon
									icon={ArrowUpRight01Icon}
									aria-hidden
									strokeWidth={1.5}
									className="size-5 opacity-40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
								/>
							</div>

							<div>
								<div className="flex items-baseline gap-3">
									<span className="font-mono text-[11px] tabular-nums opacity-50">
										{pad(index + 1)}
									</span>
									<h3 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
										{discipline.title}
									</h3>
								</div>
								<p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-50">
									{discipline.meta}
								</p>
							</div>
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
		</section>
	);
}
