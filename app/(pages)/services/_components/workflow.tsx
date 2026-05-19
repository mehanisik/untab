"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { type MouseEvent, useRef, useState } from "react";
import { REVEAL } from "~/libs/gsap/presets";

const PAGE_PADDING = "px-5 sm:px-6 md:px-8 lg:px-12";

interface Step {
	id: string;
	number: string;
	name: string;
	duration: string;
	description: string;
	keywords: string[];
}

const STEPS: Step[] = [
	{
		id: "scope",
		number: "01",
		name: "Scope",
		duration: "1 – 2 Weeks",
		description:
			"We listen and tune the brief — matching intent, audience, and budget to the right body of work. Before anything is drawn, we agree on what good looks like.",
		keywords: [
			"Brief",
			"Background",
			"Objectives",
			"Audience",
			"Schedule",
			"Budget",
			"Expectations",
			"Scope of work",
		],
	},
	{
		id: "research",
		number: "02",
		name: "Research",
		duration: "2 – 6 Weeks",
		description:
			"Research and interviews. We map the current state — your brand, market, and competitive context — to gather the inputs the work actually needs.",
		keywords: [
			"Brand history",
			"Market",
			"Positioning",
			"Industry trends",
			"Mission",
			"Vision & values",
			"Strengths & weaknesses",
			"Competitors",
		],
	},
	{
		id: "strategy",
		number: "03",
		name: "Strategy",
		duration: "2 – 6 Weeks",
		description:
			"We extract the core of the brand and decide the direction — for the design system, and for how it speaks to the world outside it.",
		keywords: [
			"Brand foundations",
			"Brand DNA",
			"Architecture",
			"Personality",
			"Design principles",
			"Verbal identity",
			"Benchmarks",
			"Moodboards",
		],
	},
	{
		id: "identity",
		number: "04",
		name: "Identity",
		duration: "3 – 6 Months",
		description:
			"Output — the brand identity itself. Tailored to its use cases, from the mark down to every working asset the team will reach for.",
		keywords: [
			"Logo",
			"Tagline",
			"Slogan",
			"Identity design",
			"Guidelines",
			"Brand book",
			"Naming",
			"Web",
			"Packaging",
			"Tools",
		],
	},
	{
		id: "communication",
		number: "05",
		name: "Communication",
		duration: "2 – 6 Months",
		description:
			"We move into producing the communication assets — anywhere the brand needs to live, across surfaces, on screen and off.",
		keywords: [
			"Concept",
			"Copy",
			"Campaign sites",
			"Graphics",
			"Editorial",
			"Installation",
			"Signage",
			"Video",
			"Animation",
			"Events",
		],
	},
];

export function Workflow() {
	const rootRef = useRef<HTMLElement>(null);
	const [activeId, setActiveId] = useState<string>(STEPS[0].id);
	const lenis = useLenis();

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const eyebrow = root.querySelector<HTMLElement>(".wf-eyebrow");
				const titleLines = root.querySelectorAll<HTMLElement>(".wf-title");
				const intro = root.querySelector<HTMLElement>(".wf-intro");

				const trigger = {
					trigger: root,
					start: "top 80%",
					toggleActions: "play none none none",
				} as const;

				if (eyebrow) {
					gsap.from(eyebrow, {
						y: 14,
						opacity: 0,
						duration: 0.7,
						ease: "expo.out",
						scrollTrigger: trigger,
					});
				}

				if (titleLines.length) {
					gsap.from(titleLines, {
						y: 40,
						opacity: 0,
						duration: 1,
						ease: REVEAL.ease,
						stagger: 0.08,
						delay: 0.05,
						scrollTrigger: trigger,
					});
				}

				if (intro) {
					gsap.from(intro, {
						y: 20,
						opacity: 0,
						duration: 0.9,
						ease: REVEAL.ease,
						delay: 0.2,
						scrollTrigger: trigger,
					});
				}

				const diagram = root.querySelector<SVGSVGElement>(".wf-diagram svg");
				if (diagram) {
					const circles = diagram.querySelectorAll<SVGCircleElement>("circle");
					const labels = diagram.querySelectorAll<SVGTextElement>("text");
					const dTrigger = {
						trigger: diagram,
						start: "top 85%",
						toggleActions: "play none none none",
					} as const;

					circles.forEach((c) => {
						const r = Number(c.getAttribute("r")) || 0;
						const circumference = 2 * Math.PI * r;
						c.style.strokeDasharray = String(circumference);
						c.style.strokeDashoffset = String(circumference);
					});

					gsap.to(circles, {
						strokeDashoffset: 0,
						duration: 1.4,
						ease: "expo.out",
						stagger: 0.12,
						scrollTrigger: dTrigger,
					});

					gsap.from(labels, {
						opacity: 0,
						y: 8,
						duration: 0.7,
						ease: REVEAL.ease,
						stagger: 0.12,
						delay: 0.35,
						scrollTrigger: dTrigger,
					});
				}

				const sections = root.querySelectorAll<HTMLElement>(
					"[data-step-section]",
				);
				sections.forEach((section) => {
					gsap.from(section.querySelectorAll<HTMLElement>(".wf-reveal"), {
						y: 28,
						opacity: 0,
						duration: 0.9,
						ease: REVEAL.ease,
						stagger: 0.06,
						scrollTrigger: {
							trigger: section,
							start: "top 85%",
							toggleActions: "play none none none",
						},
					});
				});
			});

			const sections = Array.from(
				root.querySelectorAll<HTMLElement>("[data-step-section]"),
			);
			const triggers = sections.map((section) =>
				ScrollTrigger.create({
					trigger: section,
					start: "top 45%",
					end: "bottom 45%",
					onEnter: () => setActiveId(section.dataset.stepSection ?? ""),
					onEnterBack: () => setActiveId(section.dataset.stepSection ?? ""),
				}),
			);

			return () => {
				triggers.forEach((t) => {
					t.kill();
				});
				mm.revert();
			};
		},
		{ scope: rootRef },
	);

	const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
		event.preventDefault();
		const target = document.getElementById(id);
		if (!target) return;

		const offset = 96;
		if (lenis) {
			lenis.scrollTo(target, { offset: -offset });
		} else {
			const top = target.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: "smooth" });
		}
	};

	return (
		<section
			ref={rootRef}
			id="workflow"
			className={`w-full bg-background ${PAGE_PADDING} pt-24 sm:pt-32 md:pt-40 pb-24 md:pb-32 text-foreground`}
			aria-label="Our workflow"
		>
			<div className="grid grid-cols-12 gap-x-6 sm:gap-x-8">
				<div className="col-span-12 lg:col-span-6">
					<p className="wf-eyebrow text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] opacity-60">
						Workflow
					</p>
					<h2 className="mt-6 sm:mt-8 font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.75rem,7vw,6rem)]">
						<span className="wf-title block">A clear path</span>
						<span className="wf-title block">from brief to launch.</span>
					</h2>
				</div>

				<div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-6 lg:mt-0 lg:self-end">
					<p className="wf-intro text-pretty text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] tracking-[-0.01em]">
						Five stages, sized to the work in front of us — focused on outcomes,
						sharp at the seams, with the senior team in the room from day one.
					</p>
				</div>
			</div>

			<WorkflowDiagram />

			<div className="mt-16 sm:mt-20 md:mt-28 grid grid-cols-12 gap-x-6 sm:gap-x-8">
				<nav
					aria-label="Workflow steps"
					className="col-span-12 lg:col-span-3 mb-10 lg:mb-0"
				>
					<ul className="lg:sticky lg:top-28 flex flex-row gap-x-5 overflow-x-auto pb-2 -mx-5 px-5 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-col lg:gap-x-0 lg:gap-y-1 border-t border-foreground/15 pt-6 lg:pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{STEPS.map((step) => {
							const isActive = activeId === step.id;
							return (
								<li key={step.id} className="shrink-0 lg:shrink">
									<a
										href={`#${step.id}`}
										onClick={(event) => handleNavClick(event, step.id)}
										aria-current={isActive ? "step" : undefined}
										className={`group flex min-h-11 items-center gap-3 text-[13px] sm:text-sm font-medium tracking-[-0.005em] transition-colors duration-300 ${
											isActive
												? "text-foreground"
												: "text-foreground/40 hover:text-foreground/75"
										}`}
									>
										<span className="font-mono text-[10px] tabular-nums opacity-70">
											{step.number}
										</span>
										<span>{step.name}</span>
										<span
											aria-hidden
											className={`hidden lg:inline-block ml-auto h-px w-6 transition-all duration-300 ${
												isActive
													? "bg-foreground w-10"
													: "bg-foreground/20 group-hover:bg-foreground/40"
											}`}
										/>
									</a>
								</li>
							);
						})}
					</ul>
				</nav>

				<ol className="col-span-12 lg:col-span-8 lg:col-start-5 border-t border-foreground/15">
					{STEPS.map((step) => (
						<li
							key={step.id}
							id={step.id}
							data-step-section={step.id}
							className="border-b border-foreground/15 py-12 sm:py-16 md:py-20 scroll-mt-24"
						>
							<div className="wf-reveal flex flex-wrap items-baseline gap-x-6 gap-y-2">
								<h3 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.025em]">
									{step.name}
								</h3>
								<span className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-foreground/55">
									{step.duration}
								</span>
							</div>

							<p className="wf-reveal mt-6 sm:mt-7 max-w-2xl text-pretty text-[15px] sm:text-base leading-[1.65] text-foreground/75">
								{step.description}
							</p>

							<ul className="wf-reveal mt-8 flex flex-wrap gap-x-2 gap-y-2.5">
								{step.keywords.map((kw) => (
									<li
										key={kw}
										className="rounded-full border border-foreground/15 px-3.5 py-1.5 text-[11px] sm:text-xs font-medium tracking-[-0.005em] text-foreground/70"
									>
										{kw}
									</li>
								))}
							</ul>

							<div
								aria-hidden
								className="wf-reveal mt-10 relative aspect-[5/3] w-full overflow-hidden bg-foreground/[0.04]"
							>
								<span className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45 tabular-nums">
									{step.number} / {String(STEPS.length).padStart(2, "0")}
								</span>
								<span className="absolute bottom-4 right-5 text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.035em] text-foreground/15">
									{step.name}
								</span>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

function WorkflowDiagram() {
	const radius = 140;
	const cy = 170;
	const spacing = 175;
	const startX = 110;
	const viewWidth = startX + spacing * (STEPS.length - 1) + radius - 10;
	const viewHeight = cy + radius + 10;

	return (
		<div className="wf-diagram mt-14 sm:mt-20 md:mt-24 -mx-2 sm:mx-0">
			<svg
				viewBox={`0 0 ${viewWidth} ${viewHeight}`}
				className="block h-auto w-full text-foreground"
				role="img"
				aria-label="The five overlapping stages of our workflow"
			>
				<title>Workflow stages</title>
				{STEPS.map((step, i) => {
					const cx = startX + spacing * i;
					return (
						<g key={step.id}>
							<circle
								cx={cx}
								cy={cy}
								r={radius}
								fill="none"
								stroke="currentColor"
								strokeOpacity={0.35}
								strokeWidth={1}
								vectorEffect="non-scaling-stroke"
							/>
							<text
								x={cx}
								y={cy}
								textAnchor="middle"
								dominantBaseline="middle"
								fill="currentColor"
								fillOpacity={0.85}
								fontSize={18}
								fontWeight={400}
								style={{ letterSpacing: "-0.005em" }}
							>
								{step.name}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
}
