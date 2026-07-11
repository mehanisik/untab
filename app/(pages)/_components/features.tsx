import type { HomepageFeatureItem } from "~/libs/sanity";
import { cn } from "~/libs/utils";
import { FeaturesFx } from "./fx/features-fx";

interface FeaturesProps {
	title?: string;
	features?: HomepageFeatureItem[];
}

const POSTER_STYLES = [
	{ bg: "#f15c7e", rotate: -1.4 },
	{ bg: "#7c8df0", rotate: 1.2 },
	{ bg: "#d8e85e", rotate: -0.8 },
	{ bg: "#a892ff", rotate: 1.6 },
];

const DEFAULT_FEATURES: HomepageFeatureItem[] = [
	{
		title: "Strategic Blueprinting",
		description:
			"We turn ambiguous visions into high-performance architectures. A clear plan, a defensible system, foundations designed for scale.",
		location: "WARSAW, PL",
		stat: "99%",
		caption: "of our clients need this",
	},
	{
		title: "Technical Risk Management",
		description:
			"Early identification and mitigation of technical debt, security risk, and operational fragility. The system you ship today is the system that holds tomorrow.",
		location: "AUDIT, OPS",
		stat: "0",
		caption: "incidents in production",
	},
	{
		title: "Technical Pedigree",
		description:
			"Years of shipping production systems, distilled into how we build. Battle-tested patterns and modern tooling, applied with discipline.",
		location: "SHIP, QA",
		stat: "100%",
		caption: "tested before release",
	},
	{
		title: "Transparent Partnership",
		description:
			"An extension of your team. Open communication, shared goals, weekly working sessions. Expert guidance at every step, no black boxes.",
		location: "PARTNER, EU",
		stat: "1:1",
		caption: "with the founders, weekly",
	},
];

function Poster({ meta, index }: { meta: HomepageFeatureItem; index: number }) {
	const dotsId = `poster-dots-${index}`;
	const grainId = `poster-grain-${index}`;
	const style = POSTER_STYLES[index % POSTER_STYLES.length];

	return (
		<div
			className={cn(
				"relative aspect-3/4 w-full overflow-hidden rounded-sm shadow-xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
				"group-hover:-translate-y-1.5 group-hover:rotate-0 group-hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]",
			)}
			style={{
				backgroundColor: style.bg,
				transform: `rotate(${style.rotate}deg)`,
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
					<span className="font-black text-5xl leading-[0.85] tracking-[-0.04em] sm:text-6xl">
						{meta.stat}
					</span>
					<span className="max-w-[55%] text-right font-mono text-[10px] leading-tight tracking-tight sm:text-[11px]">
						{meta.caption}
					</span>
				</div>
			</div>

			<div
				aria-hidden
				className="poster-sheen pointer-events-none absolute inset-0 mix-blend-soft-light"
			/>
		</div>
	);
}

function PosterCard({
	feature,
	index,
}: {
	feature: HomepageFeatureItem;
	index: number;
}) {
	return (
		<div className="features-card group flex flex-col">
			<Poster meta={feature} index={index} />

			<div className="mt-5">
				<h3 className="text-[clamp(1.15rem,1.5vw,1.4rem)] font-medium leading-tight tracking-[-0.01em] text-foreground">
					{feature.title}
				</h3>
				<p className="mt-2 text-pretty font-light text-[14px] text-muted-foreground leading-[1.55]">
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
	return (
		<FeaturesFx className="relative bg-background py-24 md:py-32 lg:py-40">
			<div className="container px-6 md:px-12 lg:px-24">
				<h2 className="features-heading mb-12 flex items-baseline gap-3 font-medium text-foreground leading-none tracking-[-0.03em] text-[clamp(2rem,5vw,4rem)] md:mb-16">
					{title}
					<span className="font-mono text-[11px] tracking-[0.2em] text-foreground/40 tabular-nums">
						({String(features.length).padStart(2, "0")})
					</span>
				</h2>

				<div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
					{features.map((feature, index) => (
						<PosterCard key={feature.title} feature={feature} index={index} />
					))}
				</div>
			</div>
		</FeaturesFx>
	);
}
