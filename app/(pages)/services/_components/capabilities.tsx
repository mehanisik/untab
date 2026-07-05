"use client";

import { useGSAP } from "@gsap/react";
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
/* Billboard bento: five disciplines as one composed mosaic. Left      */
/* column stacks Strategy and Website, the middle pairs the coral      */
/* Brand tile with the Product stat tile, and Development runs tall on */
/* the right with a frosted caption card, billboard-style.             */
/* ------------------------------------------------------------------ */

interface Discipline {
	title: string;
	description: string;
	meta: string;
	mark: ReactNode;
	caseStudy: { title: string; href: string };
}

const DISCIPLINES: Record<
	"strategy" | "brand" | "website" | "product" | "development",
	Discipline
> = {
	strategy: {
		title: "Strategy",
		description:
			"Clarity and direction before anything gets built. Discovery, benchmarking, and team alignment that grounds decisions in insight, not assumptions.",
		meta: "Discovery · Research · Workshops",
		mark: <StrategyMark />,
		caseStudy: {
			title: "Atik Import Export",
			href: "/work/atik-import-export",
		},
	},
	brand: {
		title: "Brand",
		description:
			"Visual and verbal systems that resonate and endure, laddering up to an identity with strategic value.",
		meta: "Identity · Naming · Motion",
		mark: <BrandingMark />,
		caseStudy: { title: "Untab Studio", href: "/work/untab-studio" },
	},
	website: {
		title: "Website",
		description:
			"Brand-led marketing sites that work hard for your business, with guardrails your team can trust.",
		meta: "Architecture · Interface · Animation",
		mark: <ContentMark />,
		caseStudy: {
			title: "Sagando Bungalows",
			href: "/work/sagando-bungalows",
		},
	},
	product: {
		title: "Product",
		description:
			"Platforms and digital products that solve real problems and adapt as things change.",
		meta: "Flows · Prototyping · Design systems",
		mark: <SystemMark />,
		caseStudy: { title: "Wooah!", href: "/work/wooah" },
	},
	development: {
		title: "Development",
		description:
			"Designers and developers working hand in hand on technology built for growth, performance, and long-term flexibility, not just launch day.",
		meta: "Backend · Front-end · Mobile · CMS",
		mark: <PlatformMark />,
		caseStudy: { title: "Crypto Predict", href: "/work/crypto-predict" },
	},
};

const TOTAL = pad(Object.keys(DISCIPLINES).length);

function TileHeading({
	index,
	title,
	className,
}: {
	index: number;
	title: string;
	className?: string;
}) {
	return (
		<div className={cn("flex items-baseline gap-3", className)}>
			<span className="font-mono text-[11px] tabular-nums opacity-60">
				{pad(index)}
			</span>
			<h3 className="text-balance text-[clamp(1.35rem,2.2vw,1.8rem)] font-medium leading-[1.05] tracking-[-0.02em]">
				{title}
			</h3>
		</div>
	);
}

function CaseLink({
	caseStudy,
	className,
}: {
	caseStudy: Discipline["caseStudy"];
	className?: string;
}) {
	return (
		<Link
			href={caseStudy.href}
			className={cn(
				"inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60",
				className,
			)}
		>
			Case study · {caseStudy.title}
			<span aria-hidden>→</span>
		</Link>
	);
}

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

	const d = DISCIPLINES;

	return (
		<section
			ref={rootRef}
			aria-label="Capabilities"
			className="w-full bg-background pb-24 pt-4 text-foreground sm:pb-28 md:pb-36"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<header className="max-w-3xl">
					<p className="cap-head font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
						Our services <span className="tabular-nums">({TOTAL})</span>
					</p>
					<h2 className="cap-head mt-6 text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
						Strategy, design, and development.{" "}
						<span className="text-[var(--brand-coral-accent)]">
							Together from day one.
						</span>
					</h2>
					<p className="cap-head mt-6 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-foreground/60 sm:text-base">
						Everything we do supports and informs the other, creating systems
						that work today and adapt to wherever your business goes next.
					</p>
				</header>

				<div className="cap-grid mt-14 grid grid-cols-1 gap-3 sm:mt-20 md:grid-cols-3 md:gap-4">
					{/* Strategy — badge card, top left */}
					<article className="cap-tile flex min-h-[20rem] flex-col justify-between rounded-2xl border border-foreground/10 bg-card p-7 text-card-foreground md:min-h-[22rem]">
						<div className="flex items-center">
							<span className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-coral)] text-[var(--dark)]">
								<span className="size-8">{d.strategy.mark}</span>
							</span>
							<span className="-ml-3 flex size-14 items-center justify-center rounded-full border border-foreground/20 bg-card text-foreground/60">
								<span className="size-8">{d.product.mark}</span>
							</span>
						</div>
						<div>
							<TileHeading index={1} title={d.strategy.title} />
							<p className="mt-3 max-w-[38ch] text-pretty text-[14px] leading-relaxed text-foreground/60">
								{d.strategy.description}
							</p>
							<p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
								{d.strategy.meta}
							</p>
							<CaseLink caseStudy={d.strategy.caseStudy} className="mt-2" />
						</div>
					</article>

					{/* Brand — coral halftone tile, top middle */}
					<article className="cap-tile relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-2xl bg-[var(--brand-coral)] p-7 text-[var(--dark)] md:min-h-[22rem]">
						<div
							aria-hidden
							className="halftone-disc absolute -right-16 -top-16 size-64 opacity-40 [--brand-coral-accent:var(--dark)]"
						/>
						<span className="relative size-12 text-[var(--dark)]/80">
							{d.brand.mark}
						</span>
						<div className="relative">
							<TileHeading index={2} title={d.brand.title} />
							<p className="mt-3 max-w-[36ch] text-pretty text-[14px] leading-relaxed text-[var(--dark)]/70">
								{d.brand.description}
							</p>
							<p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--dark)]/55">
								{d.brand.meta}
							</p>
							<CaseLink caseStudy={d.brand.caseStudy} className="mt-2" />
						</div>
					</article>

					{/* Development — tall billboard tile with frosted caption card */}
					<article className="cap-tile relative flex min-h-[26rem] flex-col overflow-hidden rounded-2xl bg-[var(--dark)] p-7 text-[var(--light)] md:row-span-2 md:min-h-0">
						<div
							aria-hidden
							className="halftone-disc absolute left-1/2 top-[38%] size-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-50"
						/>
						<div className="relative flex items-baseline justify-between">
							<TileHeading index={5} title={d.development.title} />
							<span className="size-10 text-[var(--light)]/50">
								{d.development.mark}
							</span>
						</div>
						<p className="relative mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--light)]/45">
							{d.development.meta}
						</p>

						<div className="relative mt-auto rounded-xl border border-[var(--light)]/20 bg-[var(--light)]/10 p-5 backdrop-blur-md">
							<p className="max-w-[38ch] text-pretty text-[14px] leading-relaxed text-[var(--light)]/90">
								{d.development.description}
							</p>
							<CaseLink
								caseStudy={d.development.caseStudy}
								className="mt-3 text-[var(--light)]/70 hover:opacity-100"
							/>
						</div>
					</article>

					{/* Website — cream art tile, bottom left */}
					<article className="cap-tile relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-2xl bg-[var(--light)] p-7 text-[var(--dark)] md:min-h-[22rem]">
						<span
							aria-hidden
							className="absolute -right-8 -top-8 size-44 text-[var(--brand-coral)]/50"
						>
							{d.website.mark}
						</span>
						<span className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--dark)]/45">
							{d.website.meta}
						</span>
						<div className="relative">
							<TileHeading index={3} title={d.website.title} />
							<p className="mt-3 max-w-[36ch] text-pretty text-[14px] leading-relaxed text-[var(--dark)]/65">
								{d.website.description}
							</p>
							<CaseLink caseStudy={d.website.caseStudy} className="mt-2" />
						</div>
					</article>

					{/* Product — stat tile, bottom middle */}
					<article className="cap-tile flex min-h-[20rem] flex-col rounded-2xl border border-foreground/10 bg-card p-7 text-card-foreground md:min-h-[22rem]">
						<TileHeading index={4} title={d.product.title} />
						<div className="mt-3 h-px w-16 bg-[var(--brand-coral-accent)]" />
						<p className="mt-auto font-medium leading-none tracking-[-0.03em] text-[var(--brand-coral-accent)] text-[clamp(3.5rem,6vw,5rem)] tabular-nums">
							8m+
						</p>
						<p className="mt-3 max-w-[30ch] text-pretty text-[13px] leading-relaxed text-foreground/60">
							people interact with products we helped design and ship.
						</p>
						<p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
							{d.product.meta}
						</p>
						<CaseLink caseStudy={d.product.caseStudy} className="mt-2" />
					</article>
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
