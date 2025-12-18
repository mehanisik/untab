"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { cn } from "~/libs/utils";
import {
	PaintBrush01Icon,
	CodeIcon,
	Target01Icon,
	Route01Icon,
} from "@hugeicons/core-free-icons";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";

interface DisplayCardProps {
	cardId?: string;
	className?: string;
	icon?: IconSvgElement;
	title?: string;
	description?: string;
	iconClassName?: string;
	titleClassName?: string;
	gradient?: string;
	index?: number;
	visual?: React.ReactNode;
}

function DisplayCard({
	cardId,
	className,
	icon = PaintBrush01Icon,
	title = "Featured",
	description = "Discover amazing content",
	gradient = "from-chart-1 to-chart-2",
	index = 0,
	visual,
}: DisplayCardProps) {
	const ref = useFadeInOnScroll<HTMLDivElement>({
		delay: index * 0.15,
		threshold: 0.1,
	});

	return (
		<div
			ref={ref}
			id={cardId}
			className={cn(
				"relative flex h-64 w-[24rem] -skew-y-[8deg] select-none flex-col rounded-xl border border-border/50 bg-card/90 backdrop-blur-md transition-all duration-700 ease-out hover:border-primary/50 hover:bg-card hover:-translate-y-4 hover:z-50 hover:shadow-2xl hover:shadow-primary/5",
				className,
			)}
		>
			<div className="flex items-center gap-3 p-5 pb-0">
				<div
					className={cn(
						"flex size-10 items-center justify-center rounded-lg bg-linear-to-br shadow-inner",
						gradient,
					)}
				>
					<HugeiconsIcon
						icon={icon}
						className="size-5 text-white"
						strokeWidth={2}
					/>
				</div>
				<p className="text-lg font-semibold text-foreground">{title}</p>
			</div>

			<div className="relative flex-1 overflow-hidden">{visual}</div>

			<div className="p-5 pt-0">
				<p className="text-sm text-muted-foreground leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}

const DesignVisual = () => (
	<div className="absolute inset-x-0 bottom-0 h-32 px-6">
		<div className="absolute top-4 right-8 size-24 rounded-full bg-linear-to-tr from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
		<div className="relative flex h-full gap-3 translate-y-4">
			<div className="w-24 rounded-t-lg bg-zinc-900/50 border border-zinc-800 p-2 shadow-lg">
				<div className="space-y-2">
					<div className="h-8 rounded bg-linear-to-r from-violet-500 to-fuchsia-500" />
					<div className="h-8 rounded bg-linear-to-r from-fuchsia-500 to-pink-500" />
				</div>
			</div>
			<div className="flex-1 rounded-t-lg bg-zinc-800/50 border border-zinc-700 p-3 shadow-lg -mr-4">
				<div className="flex items-center gap-2 mb-3">
					<div className="size-2 rounded-full bg-red-500/50" />
					<div className="size-2 rounded-full bg-yellow-500/50" />
					<div className="size-2 rounded-full bg-green-500/50" />
				</div>
				<div className="space-y-2">
					<div className="h-2 w-1/2 rounded-full bg-zinc-600/50" />
					<div className="h-2 w-3/4 rounded-full bg-zinc-600/30" />
					<div className="mt-4 flex gap-2">
						<div className="h-6 w-12 rounded bg-violet-500/80" />
						<div className="h-6 w-12 rounded bg-zinc-700" />
					</div>
				</div>
			</div>
		</div>
		<div className="absolute top-10 right-12 z-20">
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6 text-white drop-shadow-md"
				aria-hidden="true"
			>
				<path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.45.45 0 0 0 .32-.77L6.18 2.45a.44.44 0 0 0-.68.76z" />
			</svg>
		</div>
	</div>
);

const TechVisual = () => (
	<div className="absolute inset-x-0 bottom-0 h-32 px-6">
		<div className="absolute top-0 left-10 size-32 rounded-full bg-linear-to-tr from-emerald-500/20 to-teal-500/20 blur-2xl" />
		<div className="relative h-full w-full rounded-t-lg bg-[#1E1E1E] border border-zinc-700 shadow-xl translate-y-2 overflow-hidden">
			<div className="flex items-center gap-1.5 border-b border-zinc-700 bg-[#252526] px-3 py-2">
				<div className="size-2 rounded-full bg-[#FF5F56]" />
				<div className="size-2 rounded-full bg-[#FFBD2E]" />
				<div className="size-2 rounded-full bg-[#27C93F]" />
				<div className="ml-2 text-[8px] text-zinc-400">script.tsx</div>
			</div>
			<div className="p-3 font-mono text-[8px] leading-relaxed text-blue-300">
				<div className="flex gap-2">
					<span className="text-zinc-600">1</span>
					<span>
						<span className="text-purple-400">export</span>{" "}
						<span className="text-blue-400">function</span>{" "}
						<span className="text-yellow-300">App</span>() {"{"}
					</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">2</span>
					<span className="pl-2">
						<span className="text-purple-400">return</span> (
					</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">3</span>
					<span className="pl-4">
						<span className="text-gray-400">&lt;</span>
						<span className="text-green-400">Component</span>
					</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">4</span>
					<span className="pl-6">
						<span className="text-blue-300">data</span>=
						<span className="text-green-300">"fast"</span>
					</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">5</span>
					<span className="pl-4">
						<span className="text-gray-400">/&gt;</span>
					</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">6</span>
					<span className="pl-2">)</span>
				</div>
				<div className="flex gap-2">
					<span className="text-zinc-600">7</span>
					<span>{"}"}</span>
				</div>
			</div>
		</div>
	</div>
);

const PurposeVisual = () => (
	<div className="absolute inset-x-0 bottom-0 h-32 px-6 flex items-end justify-center">
		<div className="absolute top-0 right-10 size-32 rounded-full bg-linear-to-tr from-amber-500/20 to-orange-500/20 blur-2xl" />
		<svg
			viewBox="0 0 200 120"
			className="w-full h-full drop-shadow-lg"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
				</linearGradient>
			</defs>
			<line
				x1="20"
				y1="100"
				x2="180"
				y2="100"
				stroke="rgba(255,255,255,0.1)"
				strokeWidth="1"
			/>
			<line
				x1="20"
				y1="60"
				x2="180"
				y2="60"
				stroke="rgba(255,255,255,0.1)"
				strokeWidth="1"
				strokeDasharray="4 4"
			/>
			<line
				x1="20"
				y1="20"
				x2="180"
				y2="20"
				stroke="rgba(255,255,255,0.1)"
				strokeWidth="1"
				strokeDasharray="4 4"
			/>
			<path
				d="M20 100 L50 80 L90 85 L130 40 L160 50 L180 20 V100 H20 Z"
				fill="url(#chartGradient)"
			/>
			<path
				d="M20 100 L50 80 L90 85 L130 40 L160 50 L180 20"
				fill="none"
				stroke="#F59E0B"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="50" cy="80" r="3" fill="#F59E0B" />
			<circle cx="90" cy="85" r="3" fill="#F59E0B" />
			<circle cx="130" cy="40" r="3" fill="#F59E0B" />
			<circle cx="160" cy="50" r="3" fill="#F59E0B" />
			<circle
				cx="180"
				cy="20"
				r="3"
				fill="#fff"
				stroke="#F59E0B"
				strokeWidth="2"
			/>
			<g transform="translate(160, 10)">
				<rect width="30" height="16" rx="4" fill="#F59E0B" />
				<text
					x="15"
					y="11"
					textAnchor="middle"
					fontSize="10"
					fill="white"
					fontWeight="bold"
				>
					$$$
				</text>
			</g>
		</svg>
	</div>
);

const ProcessVisual = () => (
	<div className="absolute inset-x-0 bottom-0 h-32 px-6 flex items-center justify-center">
		<div className="absolute bottom-0 left-10 size-32 rounded-full bg-linear-to-tr from-blue-500/20 to-cyan-500/20 blur-2xl" />
		<div className="relative w-full h-20 translate-y-2">
			<div className="flex items-center justify-between relative z-10">
				<div className="flex flex-col items-center gap-2">
					<div className="size-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center backdrop-blur-sm">
						<div className="size-3 rounded-full bg-primary" />
					</div>
					<div className="h-1.5 w-12 rounded-full bg-primary/20" />
				</div>
				<div className="flex flex-col items-center gap-2">
					<div className="size-10 rounded-full bg-chart-1/20 border border-chart-1/50 flex items-center justify-center backdrop-blur-sm">
						<div className="size-3 rounded-full bg-chart-1" />
					</div>
					<div className="h-1.5 w-12 rounded-full bg-chart-1/20" />
				</div>
				<div className="flex flex-col items-center gap-2">
					<div className="size-10 rounded-full bg-chart-2/20 border border-chart-2/50 flex items-center justify-center backdrop-blur-sm">
						<div className="size-3 rounded-full bg-chart-2" />
					</div>
					<div className="h-1.5 w-12 rounded-full bg-chart-2/20" />
				</div>
			</div>
			<div className="absolute top-5 left-5 right-5 h-0.5 bg-linear-to-r from-primary via-chart-1 to-chart-2 opacity-50 z-0" />
		</div>
	</div>
);

interface DisplayCardsProps {
	cards?: DisplayCardProps[];
}

export function DisplayCards({ cards }: DisplayCardsProps) {
	const defaultCards: DisplayCardProps[] = [
		{
			icon: PaintBrush01Icon,
			title: "Top-quality design",
			description:
				"Stunning interfaces that captivate users and elevate your brand.",
			gradient: "from-chart-1 to-chart-2",
			visual: <DesignVisual />,
			className:
				"[grid-area:stack] hover:-translate-y-2 before:absolute before:inset-0 before:rounded-xl before:bg-background/40 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0",
		},
		{
			icon: CodeIcon,
			title: "Rock-solid technology",
			description:
				"Scalable, performant code built with modern best practices.",
			gradient: "from-chart-2 to-chart-3",
			visual: <TechVisual />,
			className:
				"[grid-area:stack] translate-x-12 translate-y-10 hover:translate-y-8 before:absolute before:inset-0 before:rounded-xl before:bg-background/40 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0",
		},
		{
			icon: Target01Icon,
			title: "Strong purpose",
			description:
				"Every decision driven by your business goals and user needs.",
			gradient: "from-chart-3 to-chart-4",
			visual: <PurposeVisual />,
			className:
				"[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-18 before:absolute before:inset-0 before:rounded-xl before:bg-background/40 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0",
		},
		{
			icon: Route01Icon,
			title: "Simple process",
			description:
				"Clear milestones, transparent communication, zero surprises.",
			gradient: "from-primary to-chart-1",
			visual: <ProcessVisual />,
			className:
				"[grid-area:stack] translate-x-36 translate-y-[120px] hover:translate-y-28",
		},
	];

	const displayCards = cards || defaultCards;
	const headingRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });

	return (
		<section className="bg-background py-32 lg:py-48">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div ref={headingRef} className="mb-16 max-w-xl">
					<h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
						What you can expect
					</h2>
				</div>

				<div className="grid [grid-template-areas:'stack'] place-items-center">
					{displayCards.map((cardProps, index) => (
						<DisplayCard
							key={cardProps.title || index}
							{...cardProps}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
