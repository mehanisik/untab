"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { type ReactNode, useId, useRef, useState } from "react";
import {
	BrandingMark,
	ContentMark,
	PlatformMark,
	StrategyMark,
	SystemMark,
} from "~/components/service-marks";
import { withMotion } from "~/libs/gsap/presets";
import { PAGE_PADDING, cn } from "~/libs/utils";

/* ------------------------------------------------------------------ */

interface Service {
	number: string;
	title: string;
	tagline: string;
	description: string;
	deliverables: string[];
	accent: string;
	mark: ReactNode;
}

const SERVICES: Service[] = [
	{
		number: "01",
		title: "Website & Platform Software",
		tagline: "The product itself",
		description:
			"Production-grade web apps and marketing sites, architected to scale and shipped end-to-end. We own the stack from data model to the last pixel, so what we design is exactly what goes live.",
		deliverables: [
			"Web & platform apps",
			"Headless CMS",
			"Performance & SEO",
			"Maintenance",
		],
		accent: "#E83A50",
		mark: <PlatformMark />,
	},
	{
		number: "02",
		title: "Brand Strategy",
		tagline: "The thinking first",
		description:
			"Positioning, narrative, and the decisions that make everything downstream coherent. We define who you are for, what you stand for, and the through-line that holds the whole experience together.",
		deliverables: [
			"Positioning",
			"Messaging & voice",
			"Audience & market",
			"Naming",
		],
		accent: "#7C8DF0",
		mark: <StrategyMark />,
	},
	{
		number: "03",
		title: "Branding",
		tagline: "The identity",
		description:
			"Logos, type, colour, and motion built as a living system — not a static logo pack. Every asset is designed to flex across product, marketing, and the real surfaces people will meet it on.",
		deliverables: ["Identity", "Logo & marks", "Type & colour", "Motion"],
		accent: "#D8E85E",
		mark: <BrandingMark />,
	},
	{
		number: "04",
		title: "Creative Content",
		tagline: "The story, told",
		description:
			"Art direction, copy, and assets that carry the brand into the world. We produce the imagery, words, and films that make the work land — consistent in tone, sharp in execution.",
		deliverables: ["Art direction", "Copywriting", "Imagery", "Social & film"],
		accent: "#A892FF",
		mark: <ContentMark />,
	},
	{
		number: "05",
		title: "Design System & Brand Guide",
		tagline: "The handover",
		description:
			"Everything documented, tokenised, and ready for your team to run with. Components, usage rules, and guidelines that keep the brand consistent long after the engagement ends.",
		deliverables: [
			"Design tokens",
			"Component library",
			"Usage guidelines",
			"Handover",
		],
		accent: "#5FB89A",
		mark: <SystemMark />,
	},
];

const TOTAL = String(SERVICES.length).padStart(2, "0");

/* ------------------------------------------------------------------ */

function Poster({ service }: { service: Service }) {
	const dotsId = useId();
	const grainId = useId();

	return (
		<div
			className="relative aspect-[16/10] w-full overflow-hidden rounded-xl text-black sm:aspect-[16/9]"
			style={{ backgroundColor: service.accent }}
		>
			<svg
				aria-hidden
				className="absolute inset-0 h-full w-full"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 320 200"
			>
				<title>texture</title>
				<defs>
					<pattern
						id={dotsId}
						patternUnits="userSpaceOnUse"
						width="4"
						height="4"
					>
						<circle cx="2" cy="2" r="0.8" fill="rgba(0,0,0,0.85)" />
					</pattern>
					<filter id={grainId}>
						<feTurbulence
							baseFrequency="0.9"
							numOctaves="2"
							stitchTiles="stitch"
						/>
						<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
					</filter>
				</defs>
				<circle cx="270" cy="40" r="70" fill={`url(#${dotsId})`} />
				<rect
					width="100%"
					height="100%"
					filter={`url(#${grainId})`}
					opacity="0.7"
				/>
			</svg>

			<span className="absolute left-5 top-4 font-mono text-[11px] uppercase tracking-[0.22em] tabular-nums">
				{service.number} / {TOTAL}
			</span>

			<div className="absolute right-4 top-3 h-16 w-16 sm:h-20 sm:w-20">
				{service.mark}
			</div>

			<div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
				<span className="font-mono text-[10px] uppercase tracking-[0.2em]">
					{service.tagline}
				</span>
			</div>

			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 mix-blend-soft-light"
				style={{
					background:
						"radial-gradient(120% 90% at 25% 0%, rgba(255,255,255,0.4), transparent 60%), radial-gradient(120% 90% at 85% 100%, rgba(0,0,0,0.28), transparent 65%)",
				}}
			/>
		</div>
	);
}

function ServicePanel({ service }: { service: Service }) {
	return (
		<article
			id={`service-${service.number}`}
			className="cap-panel scroll-mt-28 border-t border-foreground/12 py-12 first:border-t-0 sm:py-16 md:py-20"
		>
			<div className="flex items-center gap-4 md:hidden">
				<span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-foreground/45">
					{service.number}
				</span>
				<h3 className="text-balance text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
					{service.title}
				</h3>
			</div>

			<div className="mt-6 md:mt-0">
				<Poster service={service} />
			</div>

			<p className="mt-7 max-w-xl text-pretty text-[15px] leading-[1.65] text-foreground/75 sm:text-base">
				{service.description}
			</p>

			<ul className="mt-7 flex flex-wrap gap-2">
				{service.deliverables.map((item) => (
					<li
						key={item}
						className="inline-flex items-center rounded-full border border-foreground/15 px-3 py-1.5 text-[12.5px] text-foreground/70"
					>
						{item}
					</li>
				))}
			</ul>
		</article>
	);
}

export function Capabilities() {
	const rootRef = useRef<HTMLElement>(null);
	const navRef = useRef<HTMLElement>(null);
	const markerRef = useRef<HTMLSpanElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const lenis = useLenis();

	const handleJump = (number: string) => {
		const el = document.getElementById(`service-${number}`);
		if (!el) return;
		// Drive Lenis directly — native smooth scrollIntoView fights Lenis. The
		// offset clears the sticky header (top-28 = 112px). Fall back to native
		// if Lenis isn't ready.
		if (lenis) lenis.scrollTo(el, { offset: -112 });
		else el.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			// Scrollspy: drive the active service + a gliding accent thumb from the
			// scroll position (updates every tick via ScrollTrigger, synced to
			// Lenis). Runs regardless of motion preference — it's a scrollbar-like
			// indicator, not decorative motion. Replaces the old per-panel
			// IntersectionObserver, which snapped the active state.
			const nav = navRef.current;
			const marker = markerRef.current;
			const panels = gsap.utils.toArray<HTMLElement>(".cap-panel", root);
			let spy: ScrollTrigger | undefined;

			if (nav && marker && panels.length) {
				const buttons = Array.from(nav.querySelectorAll<HTMLElement>("button"));
				let navTops: number[] = [];
				let navHeights: number[] = [];
				const measure = () => {
					// Layout offsets (offsetTop/Height) instead of rects: whole-pixel,
					// immune to the reveal transforms, and stable while the column is
					// sticky — so the highlight aligns exactly with each item.
					navTops = buttons.map((b) => b.offsetTop);
					navHeights = buttons.map((b) => b.offsetHeight);
				};

				let lastIdx = -1;
				// Move the highlight to exactly frame item `idx`. Whole-pixel values
				// so the edges stay crisp; ease between items, or snap instantly on
				// first paint / layout changes.
				const frame = (idx: number, animate: boolean) => {
					const y = Math.round(navTops[idx]!);
					const height = Math.round(navHeights[idx]!);
					if (animate) {
						gsap.to(marker, {
							y,
							height,
							duration: 0.5,
							ease: "power3.out",
							overwrite: true,
						});
					} else {
						gsap.set(marker, { y, height });
					}
				};

				const update = () => {
					if (!navTops.length) return;
					const vpCenter = window.innerHeight / 2;

					// Active service = the panel whose true (untransformed) centre is
					// nearest the viewport centre. Subtracting the reveal's live
					// y-offset keeps the pick exact during entrance animations.
					let idx = 0;
					let best = Number.POSITIVE_INFINITY;
					panels.forEach((p, i) => {
						const r = p.getBoundingClientRect();
						const ty = (gsap.getProperty(p, "y") as number) || 0;
						const c = r.top - ty + r.height / 2;
						const d = Math.abs(c - vpCenter);
						if (d < best) {
							best = d;
							idx = i;
						}
					});

					if (idx !== lastIdx) {
						frame(idx, lastIdx !== -1);
						lastIdx = idx;
						setActiveIndex(idx);
					}
				};

				spy = ScrollTrigger.create({
					trigger: root,
					start: "top bottom",
					end: "bottom top",
					onUpdate: update,
					onRefresh: () => {
						measure();
						// Re-frame the current item instantly after a layout change.
						if (lastIdx >= 0) frame(lastIdx, false);
						update();
					},
				});
				measure();
				update();

				// Re-measure once the brand font has loaded — fallback-font metrics
				// give different item heights, which would offset the highlight.
				document.fonts?.ready.then(() => ScrollTrigger.refresh());
			}

			// Decorative reveals — gated behind reduced-motion.
			const stopMotion = withMotion(() => {
				gsap.from(root.querySelectorAll<HTMLElement>(".cap-head"), {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});

				gsap.from(root.querySelectorAll<HTMLElement>(".cap-panel"), {
					y: 40,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: root.querySelector(".cap-grid"),
						start: "top 75%",
						toggleActions: "play reverse play reverse",
					},
				});
			});

			return () => {
				spy?.kill();
				stopMotion();
			};
		},
		{ scope: rootRef },
	);

	const active = SERVICES[activeIndex];

	return (
		<section
			ref={rootRef}
			aria-label="Capabilities"
			className="w-full bg-background pb-24 pt-4 text-foreground sm:pb-28 md:pb-36"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<header className="max-w-3xl">
					<p className="cap-head text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
						What we do
					</p>
					<h2 className="cap-head mt-6 text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
						Where we go deep.
					</h2>
				</header>

				<div className="cap-grid mt-14 grid grid-cols-1 gap-x-10 sm:mt-20 md:grid-cols-12">
					{/* Sticky index — desktop only */}
					<div className="hidden md:col-span-4 md:block">
						<div className="sticky top-28">
							<span
								className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums transition-colors duration-500"
								style={{ color: active.accent }}
							>
								{active.number} / {TOTAL}
							</span>

							<div className="relative mt-8">
								{/* Scroll-driven highlight: a soft accent block with an
								    accent left-bar that glides (position + height) to the
								    active service as you scroll — the visible scrub. */}
								<span
									ref={markerRef}
									aria-hidden
									className="pointer-events-none absolute inset-x-0 top-0 rounded-lg border-l-2 transition-colors duration-500 will-change-transform"
									style={{
										borderColor: active.accent,
										backgroundColor: `color-mix(in srgb, ${active.accent} 12%, transparent)`,
									}}
								/>

								<nav
									className="relative flex flex-col"
									aria-label="Services"
									ref={navRef}
								>
									{SERVICES.map((service, i) => {
										const isActive = i === activeIndex;
										return (
											<button
												key={service.number}
												type="button"
												onClick={() => handleJump(service.number)}
												className="group block py-3 pl-4 pr-2 text-left"
											>
												<span
													className={cn(
														"text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium leading-tight tracking-[-0.02em] transition-colors duration-500",
														isActive
															? "text-foreground"
															: "text-foreground/35 group-hover:text-foreground/70",
													)}
												>
													{service.title}
												</span>
											</button>
										);
									})}
								</nav>
							</div>
						</div>
					</div>

					{/* Scrolling panels */}
					<div className="md:col-span-7 md:col-start-6">
						{SERVICES.map((service) => (
							<ServicePanel key={service.number} service={service} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
