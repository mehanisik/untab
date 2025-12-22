"use client";

import type { ReactNode } from "react";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";

const pillars = [
	{
		title: "Work as a fluent conversation",
		description:
			"We establish a workflow where we can follow our proven process while you enhance the final deliverable with your input and feedback.",
		icon: (
			<svg
				viewBox="0 0 100 100"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="size-24"
				aria-hidden="true"
			>
				<circle
					cx="50"
					cy="55"
					r="30"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<path
					d="M25 40 Q45 15 70 28"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					className="text-primary"
				/>
				<circle
					cx="70"
					cy="28"
					r="10"
					fill="currentColor"
					className="text-primary"
				/>
			</svg>
		),
	},
	{
		title: "Iterative, integrated decision-making",
		description:
			"Since product teams make decisions every day, we work in short cycles with frequent feedback and maximum flexibility to adapt to your reports easily.",
		icon: (
			<svg
				viewBox="0 0 100 100"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="size-24"
				aria-hidden="true"
			>
				<circle
					cx="38"
					cy="40"
					r="20"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<circle
					cx="62"
					cy="40"
					r="20"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<circle
					cx="50"
					cy="60"
					r="20"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
			</svg>
		),
	},
	{
		title: "Shared knowledge and responsibility",
		description:
			"You are an expert in your target market, and we're masters in building digital products. We tackle the big risks early and focus on solving the right problems by working side-by-side.",
		icon: (
			<svg
				viewBox="0 0 100 100"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="size-24"
				aria-hidden="true"
			>
				<circle
					cx="35"
					cy="28"
					r="10"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<path
					d="M22 80 L35 48 L48 80"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					className="text-muted-foreground"
				/>
				<line
					x1="22"
					y1="80"
					x2="48"
					y2="80"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<circle
					cx="65"
					cy="28"
					r="10"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
				<path
					d="M52 80 L65 48 L78 80"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					className="text-muted-foreground"
				/>
				<line
					x1="52"
					y1="80"
					x2="78"
					y2="80"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-muted-foreground"
				/>
			</svg>
		),
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
			<div className="mb-10">{pillar.icon}</div>

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

const PILLAR_ICON_MAP: Record<string, ReactNode> = {
	"fluent-conversation": (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-24"
			aria-hidden="true"
		>
			<circle
				cx="50"
				cy="55"
				r="30"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M25 40 Q45 15 70 28"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
				className="text-primary"
			/>
			<circle
				cx="70"
				cy="28"
				r="10"
				fill="currentColor"
				className="text-primary"
			/>
		</svg>
	),
	"iterative-decision-making": (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-24"
			aria-hidden="true"
		>
			<circle
				cx="38"
				cy="40"
				r="20"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<circle
				cx="62"
				cy="40"
				r="20"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<circle
				cx="50"
				cy="60"
				r="20"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
		</svg>
	),
	"shared-responsibility": (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="size-24"
			aria-hidden="true"
		>
			<circle
				cx="35"
				cy="28"
				r="10"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M22 80 L35 48 L48 80"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
				className="text-muted-foreground"
			/>
			<line
				x1="22"
				y1="80"
				x2="48"
				y2="80"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<circle
				cx="65"
				cy="28"
				r="10"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M52 80 L65 48 L78 80"
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
				className="text-muted-foreground"
			/>
			<line
				x1="52"
				y1="80"
				x2="78"
				y2="80"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
		</svg>
	),
};

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
			icon: PILLAR_ICON_MAP[p.icon] || PILLAR_ICON_MAP["fluent-conversation"],
		})) || pillars;

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
