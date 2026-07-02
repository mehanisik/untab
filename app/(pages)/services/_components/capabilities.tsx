"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
	type ReactNode,
	useEffect,
	useEffectEvent,
	useId,
	useRef,
	useState,
} from "react";
import { withMotion } from "~/libs/gsap/presets";
import { cn } from "~/libs/utils";

const PAGE_PADDING = "px-6 md:px-12 lg:px-24";

/* ------------------------------------------------------------------ */
/* Abstract marks — one geometric composition per discipline.          */
/* Monochrome on the accent card, drawn in black to match the brand.   */
/* ------------------------------------------------------------------ */

function PlatformMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Stacked platform layers</title>
			<rect
				x="22"
				y="30"
				width="76"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="22"
				y="56"
				width="76"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="22"
				y="82"
				width="46"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<circle cx="32" cy="40" r="2.4" fill="currentColor" />
			<circle cx="32" cy="66" r="2.4" fill="currentColor" />
			<circle cx="32" cy="92" r="2.4" fill="currentColor" />
		</svg>
	);
}

function StrategyMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Intersecting strategy vectors</title>
			<circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="2" />
			<path d="M60 22 L60 98" stroke="currentColor" strokeWidth="2" />
			<path d="M30 44 L90 76" stroke="currentColor" strokeWidth="2" />
			<circle cx="60" cy="60" r="6" fill="currentColor" />
		</svg>
	);
}

function BrandingMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Overlapping brand forms</title>
			<circle cx="48" cy="60" r="28" stroke="currentColor" strokeWidth="2" />
			<rect
				x="50"
				y="32"
				width="44"
				height="56"
				rx="6"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	);
}

function ContentMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>A play triangle inside a frame</title>
			<rect
				x="24"
				y="30"
				width="72"
				height="60"
				rx="6"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M52 48 L72 60 L52 72 Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function SystemMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>A grid of system tokens</title>
			<rect
				x="28"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="66"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="28"
				y="66"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<circle cx="79" cy="79" r="13" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}

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

function ServicePanel({
	service,
	index,
	onVisible,
}: {
	service: Service;
	index: number;
	onVisible: (index: number) => void;
}) {
	const ref = useRef<HTMLElement>(null);
	const onIntersect = useEffectEvent((isIntersecting: boolean) => {
		if (isIntersecting) onVisible(index);
	});

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => onIntersect(entry.isIntersecting),
			{ threshold: 0, rootMargin: "-45% 0px -45% 0px" },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<article
			ref={ref}
			id={`service-${service.number}`}
			className="cap-panel scroll-mt-28 border-t border-foreground/12 py-12 first:border-t-0 sm:py-16 md:py-20"
		>
			<div className="flex items-center gap-4 lg:hidden">
				<span className="font-mono text-[11px] tabular-nums tracking-[0.18em] text-foreground/45">
					{service.number}
				</span>
				<h3 className="text-balance text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
					{service.title}
				</h3>
			</div>

			<div className="mt-6 lg:mt-0">
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
	const [activeIndex, setActiveIndex] = useState(0);

	const handleJump = (number: string) => {
		document
			.getElementById(`service-${number}`)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				gsap.from(root.querySelectorAll<HTMLElement>(".cap-head"), {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play none none none",
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
						toggleActions: "play none none none",
					},
				});
			}),
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

				<div className="cap-grid mt-14 grid grid-cols-1 gap-x-10 sm:mt-20 lg:grid-cols-12">
					{/* Sticky index — desktop only */}
					<div className="hidden lg:col-span-4 lg:block">
						<div className="sticky top-28">
							<span
								className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums transition-colors duration-500"
								style={{ color: active.accent }}
							>
								{active.number} / {TOTAL}
							</span>

							<nav className="mt-8 flex flex-col" aria-label="Services">
								{SERVICES.map((service, i) => {
									const isActive = i === activeIndex;
									return (
										<button
											key={service.number}
											type="button"
											onClick={() => handleJump(service.number)}
											className="group flex items-center gap-4 py-3 text-left"
										>
											<span
												aria-hidden
												className="h-px transition-all duration-500"
												style={{
													width: isActive ? 36 : 16,
													backgroundColor: isActive
														? service.accent
														: "var(--foreground)",
													opacity: isActive ? 1 : 0.25,
												}}
											/>
											<span
												className={cn(
													"text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium leading-tight tracking-[-0.02em] transition-all duration-500",
													isActive
														? "translate-x-0 text-foreground"
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

					{/* Scrolling panels */}
					<div className="lg:col-span-7 lg:col-start-6">
						{SERVICES.map((service, i) => (
							<ServicePanel
								key={service.number}
								service={service}
								index={i}
								onVisible={setActiveIndex}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
