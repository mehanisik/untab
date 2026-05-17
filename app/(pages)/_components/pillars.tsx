"use client";

import type { ReactNode } from "react";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";

const SVG_CLASS = "size-40 md:size-44";

function FluentConversationIcon() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>Two speech bubbles in dialogue</title>
			<rect
				x="8"
				y="18"
				width="50"
				height="34"
				rx="10"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M22 52 L18 62 L32 52"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<line
				x1="18"
				y1="30"
				x2="48"
				y2="30"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground/55"
			/>
			<line
				x1="18"
				y1="38"
				x2="40"
				y2="38"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground/55"
			/>
			<rect
				x="42"
				y="48"
				width="50"
				height="34"
				rx="10"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-primary"
			/>
			<path
				d="M78 48 L82 38 L68 48"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				className="text-primary"
			/>
			<line
				x1="52"
				y1="60"
				x2="82"
				y2="60"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-primary/70"
			/>
			<line
				x1="52"
				y1="68"
				x2="74"
				y2="68"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-primary/70"
			/>
		</svg>
	);
}

function IterativeDecisionIcon() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>Iteration loop around a decision diamond</title>
			<path
				d="M 78 32 A 32 32 0 1 1 22 32"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground"
			/>
			<path
				d="M 70 22 L 80 32 L 70 42"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				className="text-primary"
			/>
			<path
				d="M 50 36 L 64 50 L 50 64 L 36 50 Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<circle
				cx="50"
				cy="50"
				r="3.5"
				fill="currentColor"
				className="text-primary"
			/>
		</svg>
	);
}

function SharedResponsibilityIcon() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>Two overlapping circles with a shared center</title>
			<circle
				cx="38"
				cy="50"
				r="24"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<circle
				cx="62"
				cy="50"
				r="24"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M 50 29 A 24 24 0 0 1 50 71 A 24 24 0 0 1 50 29 Z"
				fill="currentColor"
				className="text-primary"
				opacity="0.9"
			/>
			<circle
				cx="38"
				cy="50"
				r="3"
				fill="currentColor"
				className="text-muted-foreground"
			/>
			<circle
				cx="62"
				cy="50"
				r="3"
				fill="currentColor"
				className="text-muted-foreground"
			/>
		</svg>
	);
}

const PILLAR_ICON_MAP: Record<string, ReactNode> = {
	"fluent-conversation": <FluentConversationIcon />,
	"iterative-decision-making": <IterativeDecisionIcon />,
	"shared-responsibility": <SharedResponsibilityIcon />,
};

const pillars = [
	{
		title: "Work as a fluent conversation",
		description:
			"We establish a workflow where we can follow our proven process while you enhance the final deliverable with your input and feedback.",
		icon: PILLAR_ICON_MAP["fluent-conversation"],
	},
	{
		title: "Iterative, integrated decision-making",
		description:
			"Since product teams make decisions every day, we work in short cycles with frequent feedback and maximum flexibility to adapt to your reports easily.",
		icon: PILLAR_ICON_MAP["iterative-decision-making"],
	},
	{
		title: "Shared knowledge and responsibility",
		description:
			"You are an expert in your target market, and we're masters in building digital products. We tackle the big risks early and focus on solving the right problems by working side-by-side.",
		icon: PILLAR_ICON_MAP["shared-responsibility"],
	},
];

function PillarCard({
	pillar,
	index,
}: {
	pillar: { title: string; description: string; icon: ReactNode };
	index: number;
}) {
	const ref = useFadeInOnScroll<HTMLDivElement>({ delay: index * 0.15 });

	return (
		<div
			ref={ref}
			className="flex flex-col gap-6 rounded-2xl bg-card p-8 md:p-10"
		>
			<div className="flex items-center justify-center py-6 md:py-8">
				{pillar.icon}
			</div>

			<div className="flex flex-1 flex-col gap-4">
				<h3 className="text-xl font-medium text-foreground md:text-2xl">
					{pillar.title}
				</h3>
				<p className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
					{pillar.description}
				</p>
			</div>
		</div>
	);
}

interface PillarsProps {
	title?: string;
	subtitle?: string;
	pillars?: {
		title: string;
		description: string;
		icon: string;
	}[];
}

export function Pillars({
	title = "Our collaboration pillars",
	subtitle = "Your success is a proxy to our purpose.",
	pillars: dynamicPillars,
}: PillarsProps) {
	const headerRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });

	const displayPillars =
		dynamicPillars?.map((p) => ({
			title: p.title,
			description: p.description,
			icon: PILLAR_ICON_MAP[p.icon] ?? PILLAR_ICON_MAP["fluent-conversation"],
		})) ?? pillars;

	return (
		<section className="bg-background py-20 md:py-32 lg:py-48">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div ref={headerRef}>
					<div className="mb-6">
						<h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
							{title}
						</h2>
					</div>
					<p className="mb-20 text-base text-muted-foreground">{subtitle}</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{displayPillars.map((pillar, index) => (
						<PillarCard key={pillar.title} pillar={pillar} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
