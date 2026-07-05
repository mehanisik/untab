"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Fragment, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";
import { pad } from "~/libs/utils";

const DEFAULT_PILLARS = [
	{
		title: "Fluent conversation",
		description:
			"We establish a workflow where we can follow our proven process while you enhance the final deliverable with your input and feedback.",
	},
	{
		title: "Iterative decisions",
		description:
			"Product teams make decisions every day, so we work in short cycles with frequent feedback and maximum flexibility.",
	},
	{
		title: "Shared responsibility",
		description:
			"You know your market, we know how to build. We tackle the big risks early and solve the right problems side-by-side.",
	},
];

const DEFAULT_QUOTE = "Great work is a conversation, not a handoff.";
const DEFAULT_ATTRIBUTION = "- untab studio";
const DEFAULT_NOTE =
	"To be honest, we'll shape the process around how your team already works. But if you like lists, here are the pillars every collaboration stands on.";

interface PillarsProps {
	title?: string;
	quote?: string;
	attribution?: string;
	note?: string;
	pillars?: {
		title: string;
		description: string;
		icon?: string;
	}[];
}

// Capsule outline with a curved chevron, both drawn in stroke-by-stroke on
// scroll. On hover the capsule fills with the accent and the arrow flips dark.
function ArrowPill() {
	return (
		<svg
			viewBox="0 0 68 44"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-10 w-[3.9rem] shrink-0 md:h-12 md:w-[4.6rem]"
			aria-hidden="true"
		>
			<title>Arrow</title>
			<rect
				x="1.5"
				y="1.5"
				width="65"
				height="41"
				rx="20.5"
				stroke="currentColor"
				strokeWidth="2"
				className="fill-transparent transition-[fill] duration-300 group-hover:fill-[var(--brand-coral-accent)]"
			/>
			<path
				d="M28 13 Q37.5 18 37.5 22 Q37.5 26 28 31"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="transition-colors duration-300 group-hover:stroke-[#0a0a0a]"
			/>
		</svg>
	);
}

export function Pillars({
	title = "Our collaboration pillars",
	quote = DEFAULT_QUOTE,
	attribution = DEFAULT_ATTRIBUTION,
	note = DEFAULT_NOTE,
	pillars: dynamicPillars,
}: PillarsProps) {
	const sectionRef = useRef<HTMLElement>(null);

	const displayPillars =
		dynamicPillars?.map((p) => ({
			title: p.title,
			description: p.description,
		})) ?? DEFAULT_PILLARS;

	const total = displayPillars.length;
	const words = quote.split(" ");

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				// Quote rises word by word out of overflow masks.
				const quoteWords = gsap.utils.toArray<HTMLElement>("[data-word]", root);
				if (quoteWords.length) {
					gsap.fromTo(
						quoteWords,
						{ yPercent: 115 },
						{
							yPercent: 0,
							duration: 0.9,
							ease: "expo.out",
							stagger: 0.03,
							scrollTrigger: {
								trigger: root,
								start: "top 70%",
								toggleActions: "play reverse play reverse",
							},
						},
					);
				}

				const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", root);
				if (fades.length) {
					gsap.fromTo(
						fades,
						{ y: 24, autoAlpha: 0 },
						{
							y: 0,
							autoAlpha: 1,
							duration: 0.9,
							ease: "expo.out",
							stagger: 0.12,
							delay: 0.35,
							scrollTrigger: {
								trigger: root,
								start: "top 70%",
								toggleActions: "play reverse play reverse",
							},
						},
					);
				}

				// Each row slides in while its pill draws itself: capsule first,
				// then the chevron.
				const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
				rows.forEach((row) => {
					const shapes = Array.from(
						row.querySelectorAll<SVGGeometryElement>("[stroke]"),
					);
					for (const shape of shapes) {
						const len = shape.getTotalLength();
						shape.style.strokeDasharray = `${len}`;
						shape.style.strokeDashoffset = `${len}`;
					}

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: row,
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
					tl.fromTo(
						row,
						{ y: 32, autoAlpha: 0 },
						{ y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" },
					).to(
						shapes,
						{
							strokeDashoffset: 0,
							duration: 0.9,
							ease: "power2.inOut",
							stagger: 0.15,
						},
						0.1,
					);
				});
			}),
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="bg-background py-24 text-foreground md:py-32 lg:py-40"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<h2 className="mb-14 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:mb-20">
					{title} <span className="tabular-nums">({pad(total)})</span>
				</h2>

				<div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-24">
					{/* Left: accent quote, attribution, and the honest aside */}
					<div className="flex flex-col md:pt-2">
						<blockquote className="max-w-[18ch] text-balance font-medium leading-[1.08] tracking-[-0.02em] text-[clamp(2rem,4.2vw,3.6rem)] text-[var(--brand-coral-accent)]">
							{words.map((word, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
								<Fragment key={`${index}-${word}`}>
									<span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
										<span data-word className="inline-block">
											{index === 0 ? `“${word}` : word}
											{index === words.length - 1 ? "”" : ""}
										</span>
									</span>
									{index < words.length - 1 ? " " : ""}
								</Fragment>
							))}
						</blockquote>

						<p
							data-fade
							className="mt-7 font-semibold uppercase tracking-[0.04em] text-[clamp(1.05rem,1.7vw,1.5rem)] text-[var(--brand-coral-accent)]"
						>
							{attribution}
						</p>

						<p
							data-fade
							className="mt-12 max-w-[46ch] text-pretty text-[15px] leading-relaxed text-foreground/70 md:mt-16"
						>
							{note}
						</p>
					</div>

					{/* Right: pillar list with self-drawing arrow pills */}
					<ul className="flex flex-col gap-10 md:gap-12">
						{displayPillars.map((pillar) => (
							<li
								key={pillar.title}
								data-row
								className="group flex items-start gap-6 md:gap-8"
							>
								<span className="mt-1 text-[var(--brand-coral-accent)]">
									<ArrowPill />
								</span>
								<div className="transition-transform duration-300 ease-out group-hover:translate-x-1">
									<h3 className="text-balance font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,3.2vw,3rem)]">
										{pillar.title}
									</h3>
									<p className="mt-2 max-w-[42ch] text-pretty text-[14px] leading-relaxed text-foreground/55">
										{pillar.description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
