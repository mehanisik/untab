"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import { cn } from "~/libs/utils";

interface PosterMeta {
	location: string;
	stat: string;
	caption: string;
	bg: string;
	rotate: number;
}

interface Feature {
	title: string;
	description: string;
	poster: PosterMeta;
}

interface FeaturesProps {
	title?: string;
	features?: Feature[];
}

const DEFAULT_FEATURES: Feature[] = [
	{
		title: "Strategic Blueprinting",
		description:
			"We turn ambiguous visions into high-performance architectures. A clear plan, a defensible system, and a product built on foundations designed for scale.",
		poster: {
			location: "WARSAW, PL",
			stat: "99%",
			caption: "of our clients need this",
			bg: "#f15c7e",
			rotate: -1.4,
		},
	},
	{
		title: "Technical Risk Management",
		description:
			"Early identification and mitigation of technical debt, security risk, and operational fragility. The system you ship today is the system that holds tomorrow.",
		poster: {
			location: "AUDIT, OPS",
			stat: "0",
			caption: "incidents in production",
			bg: "#7c8df0",
			rotate: 1.2,
		},
	},
	{
		title: "Engineering Excellence",
		description:
			"The latest in modern web tooling, applied with discipline. Stable, tested, performant code that scales with your growth, not against it.",
		poster: {
			location: "SHIP, QA",
			stat: "100%",
			caption: "tested before release",
			bg: "#d8e85e",
			rotate: -0.8,
		},
	},
	{
		title: "Transparent Partnership",
		description:
			"An extension of your team. Open communication, shared goals, weekly working sessions. Expert guidance at every step, no black boxes.",
		poster: {
			location: "PARTNER, EU",
			stat: "1:1",
			caption: "with the founders, weekly",
			bg: "#a892ff",
			rotate: 1.6,
		},
	},
];

function Poster({
	meta,
	index,
	isActive,
}: {
	meta: PosterMeta;
	index: number;
	isActive: boolean;
}) {
	const dotsId = useId();
	const grainId = useId();

	return (
		<div
			className={cn(
				"origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
				"group-hover:scale-[1.04] group-hover:-translate-y-1",
			)}
		>
			<div
				className={cn(
					"relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-xl transition-shadow duration-700",
					"group-hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]",
					isActive ? "" : "opacity-90",
				)}
				style={{
					backgroundColor: meta.bg,
					transform: `rotate(${meta.rotate}deg)`,
				}}
			>
				<svg
					aria-hidden
					className="absolute inset-0 h-full w-full"
					preserveAspectRatio="xMidYMid slice"
					viewBox="0 0 240 320"
				>
					<title>poster</title>
					<defs>
						<pattern
							id={dotsId}
							patternUnits="userSpaceOnUse"
							width="4"
							height="4"
						>
							<circle cx="2" cy="2" r="0.85" fill="rgba(0,0,0,0.92)" />
						</pattern>
						<filter id={grainId}>
							<feTurbulence
								baseFrequency="0.9"
								numOctaves="2"
								stitchTiles="stitch"
							/>
							<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0" />
						</filter>
					</defs>
					<circle cx="120" cy="118" r="76" fill={`url(#${dotsId})`} />
					<circle cx="120" cy="218" r="86" fill={`url(#${dotsId})`} />
					<rect
						width="100%"
						height="100%"
						filter={`url(#${grainId})`}
						opacity="0.7"
					/>
				</svg>

				<div className="absolute inset-0 flex flex-col p-4 text-black">
					<div className="flex items-start justify-between font-mono text-[10px] tracking-[0.18em] sm:text-[11px]">
						<span>{meta.location}</span>
						<span className="font-black text-2xl leading-none sm:text-3xl">
							{String(index + 1).padStart(2, "0")}
						</span>
					</div>

					<div className="mt-auto flex items-end justify-between gap-3">
						<span className="font-black text-5xl leading-[0.85] tracking-[-0.04em] sm:text-6xl md:text-7xl">
							{meta.stat}
						</span>
						<span className="max-w-[55%] text-right font-mono text-[10px] leading-tight tracking-tight sm:text-[11px]">
							{meta.caption}
						</span>
					</div>
				</div>

				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 mix-blend-soft-light"
					style={{
						background:
							"radial-gradient(120% 80% at 30% 0%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(120% 80% at 80% 100%, rgba(0,0,0,0.25), transparent 65%)",
					}}
				/>
			</div>
		</div>
	);
}

function FeatureCard({
	feature,
	index,
	onVisible,
}: {
	feature: Feature;
	index: number;
	onVisible: (index: number) => void;
}) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isActive, setIsActive] = useState(false);
	const onIntersect = useEffectEvent((isIntersecting: boolean) => {
		setIsActive(isIntersecting);
		if (isIntersecting) {
			onVisible(index);
		}
	});

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				onIntersect(entry.isIntersecting);
			},
			{
				threshold: 0.6,
				rootMargin: "-20% 0px -20% 0px",
			},
		);

		if (cardRef.current) observer.observe(cardRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={cardRef}
			className="group relative grid cursor-default grid-cols-1 gap-8 sm:grid-cols-[200px_1fr] sm:gap-12 md:grid-cols-[240px_1fr] md:gap-16"
		>
			<div className="origin-top">
				<Poster meta={feature.poster} index={index} isActive={isActive} />
			</div>

			<div className="flex flex-col pt-2 transition-transform duration-500 ease-out group-hover:translate-x-1">
				<span
					className={cn(
						"mb-6 block font-mono text-[11px] tracking-[0.2em] uppercase tabular-nums transition-colors duration-500 group-hover:text-foreground",
						isActive ? "text-foreground" : "text-muted-foreground",
					)}
				>
					{String(index + 1).padStart(2, "0")}
				</span>

				<h3
					className={cn(
						"mb-5 font-medium text-foreground leading-[1.05] tracking-[-0.02em] transition-opacity duration-500 group-hover:opacity-100",
						"text-[clamp(1.625rem,2.4vw,2.5rem)]",
						isActive ? "opacity-100" : "opacity-70",
					)}
				>
					{feature.title}
				</h3>

				<p
					className={cn(
						"max-w-[42ch] text-pretty font-light text-muted-foreground leading-[1.6] transition-opacity duration-500 group-hover:opacity-100",
						"text-[15px] sm:text-base",
						isActive ? "opacity-100" : "opacity-75",
					)}
				>
					{feature.description}
				</p>
			</div>
		</div>
	);
}

export function Features({
	title = "How we work",
	features = DEFAULT_FEATURES,
}: FeaturesProps) {
	const headerRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<section className="relative bg-background py-20 md:py-32 lg:py-48">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
					<div className="relative hidden lg:block">
						<div className="sticky top-32 flex min-h-[60vh] flex-col justify-center">
							<div ref={headerRef}>
								<h2 className="mb-8 font-medium text-foreground leading-[0.95] tracking-[-0.035em] text-[clamp(2.75rem,4.5vw,5rem)]">
									{title}
								</h2>

								<p className="max-w-[32ch] font-light text-balance text-base text-muted-foreground leading-[1.55] md:text-lg">
									Strike the balance between investment and impact. A true
									partner in building not just software, but a sustainable
									business advantage.
								</p>

								<div className="mt-12 font-mono text-[11px] text-muted-foreground tracking-[0.2em] uppercase tabular-nums">
									<span className="text-foreground">
										{String(activeIndex + 1).padStart(2, "0")}
									</span>
									<span className="mx-1.5">/</span>
									<span>{String(features.length).padStart(2, "0")}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="mb-12 lg:hidden">
						<h2 className="mb-4 font-medium text-3xl text-foreground tracking-tight sm:text-4xl">
							{title}
						</h2>
						<p className="font-light text-base text-muted-foreground leading-relaxed">
							Strike the optimal balance between investment and impact.
						</p>
					</div>

					<div className="flex flex-col gap-16 py-12 lg:gap-32 lg:py-[10vh]">
						{features.map((feature, index) => (
							<FeatureCard
								key={feature.title}
								feature={feature}
								index={index}
								onVisible={setActiveIndex}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
