"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";
import { withMotion } from "~/libs/gsap/presets";

const PAGE_PADDING = "px-5 sm:px-6 md:px-8 lg:px-12";
const SVG_CLASS = "size-24 sm:size-28";

/* ------------------------------------------------------------------ */
/* Line-art graphics (same philosophy as the home "pillars" section)  */
/* ------------------------------------------------------------------ */

function PlanningGraphic() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>A plan document with a checklist</title>
			<rect
				x="26"
				y="20"
				width="48"
				height="62"
				rx="6"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<rect
				x="42"
				y="14"
				width="16"
				height="9"
				rx="3"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<path
				d="M31 41 L34 44 L40 37"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-primary"
			/>
			<line
				x1="46"
				y1="41"
				x2="66"
				y2="41"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground/55"
			/>
			<circle
				cx="33"
				cy="55"
				r="1.6"
				fill="currentColor"
				className="text-muted-foreground"
			/>
			<line
				x1="46"
				y1="55"
				x2="66"
				y2="55"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground/55"
			/>
			<circle
				cx="33"
				cy="69"
				r="1.6"
				fill="currentColor"
				className="text-muted-foreground"
			/>
			<line
				x1="46"
				y1="69"
				x2="60"
				y2="69"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground/55"
			/>
		</svg>
	);
}

function ProcessingGraphic() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>Code brackets with a forward slash</title>
			<path
				d="M40 32 L24 50 L40 68"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<path
				d="M60 32 L76 50 L60 68"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<line
				x1="56"
				y1="28"
				x2="44"
				y2="72"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-primary"
			/>
		</svg>
	);
}

function TestingGraphic() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>A magnifier inspecting a checkmark</title>
			<circle
				cx="44"
				cy="44"
				r="22"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-muted-foreground"
			/>
			<line
				x1="60"
				y1="60"
				x2="77"
				y2="77"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				className="text-muted-foreground"
			/>
			<path
				d="M34 44 L41 51 L55 37"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-primary"
			/>
		</svg>
	);
}

function DeploymentGraphic() {
	return (
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={SVG_CLASS}
			aria-hidden="true"
		>
			<title>A rocket launching</title>
			<path
				d="M50 16 C58 24 62 38 60 52 L40 52 C38 38 42 24 50 16 Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<path
				d="M40 46 L30 62 L41 57"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<path
				d="M60 46 L70 62 L59 57"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-muted-foreground"
			/>
			<circle
				cx="50"
				cy="37"
				r="6"
				stroke="currentColor"
				strokeWidth="1.5"
				className="text-primary"
			/>
			<path
				d="M45 54 L50 73 L55 54"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-primary"
			/>
		</svg>
	);
}

/* ------------------------------------------------------------------ */

interface Phase {
	number: string;
	name: string;
	summary: string;
	description: string;
	points: string[];
	graphic: ReactNode;
}

const PHASES: Phase[] = [
	{
		number: "01",
		name: "Planning",
		summary: "Discovery & scope",
		description:
			"We start with the problem, the people, and the constraints. Goals are defined, success is made measurable, and the roadmap is agreed before a single line of code is written.",
		points: [
			"Discovery & requirements",
			"Architecture & roadmap",
			"Definition of done",
		],
		graphic: <PlanningGraphic />,
	},
	{
		number: "02",
		name: "Processing",
		summary: "Design & development",
		description:
			"Design and engineering move together in tight loops. We build in modular slices and ship working software early, so progress stays visible and feedback lands while it still counts.",
		points: ["UX & UI design", "Component-driven build", "Weekly demos"],
		graphic: <ProcessingGraphic />,
	},
	{
		number: "03",
		name: "Testing",
		summary: "Quality & refinement",
		description:
			"Every release is verified against the spec — behaviour, performance, and accessibility. We test on real devices and tighten the details until the product feels effortless to use.",
		points: [
			"Automated & manual QA",
			"Performance & a11y audits",
			"Cross-device review",
		],
		graphic: <TestingGraphic />,
	},
	{
		number: "04",
		name: "Deployment",
		summary: "Launch & support",
		description:
			"We ship to production with confidence — monitored, documented, and handed over clean. After launch we stay close, measuring real usage and iterating on what actually matters.",
		points: [
			"Production deploy",
			"Monitoring & analytics",
			"Handover & iteration",
		],
		graphic: <DeploymentGraphic />,
	},
];

export function Process() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				const head = root.querySelectorAll<HTMLElement>(".proc-head");
				if (head.length) {
					gsap.from(head, {
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
				}

				const timeline = root.querySelector<HTMLElement>(".proc-timeline");
				const steps = root.querySelectorAll<HTMLElement>(".proc-step");

				if (timeline && steps.length) {
					gsap.from(steps, {
						y: 40,
						opacity: 0,
						duration: 0.9,
						ease: "expo.out",
						stagger: 0.1,
						scrollTrigger: {
							trigger: timeline,
							start: "top 80%",
							toggleActions: "play none none none",
						},
					});

					const fill = timeline.querySelector<HTMLElement>(".proc-fill");
					if (fill) {
						gsap.fromTo(
							fill,
							{ scaleY: 0 },
							{
								scaleY: 1,
								ease: "none",
								scrollTrigger: {
									trigger: timeline,
									start: "top 55%",
									end: "bottom 65%",
									scrub: 0.6,
								},
							},
						);
					}

					steps.forEach((step) => {
						ScrollTrigger.create({
							trigger: step,
							start: "top 60%",
							onEnter: () => step.setAttribute("data-active", "true"),
							onLeaveBack: () => step.setAttribute("data-active", "false"),
						});
					});
				}
			}),
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			aria-label="How we work"
			className={`w-full bg-background ${PAGE_PADDING} pt-8 pb-28 sm:pb-32 md:pb-40 text-foreground`}
		>
			<div className="mx-auto max-w-[1440px]">
				{/* Header */}
				<header className="max-w-3xl">
					<p className="proc-head text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
						How we work
					</p>
					<h2 className="proc-head mt-6 text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
						A clear path from brief to launch.
					</h2>
					<p className="proc-head mt-6 max-w-xl text-pretty text-[15px] leading-[1.6] text-foreground/65 sm:text-base">
						No black boxes. Four phases, each with a defined outcome — so you
						always know where the work stands and what comes next.
					</p>
				</header>

				{/* Timeline */}
				<div className="proc-timeline relative mt-16 sm:mt-20 md:mt-24">
					{/* Rail */}
					<span
						aria-hidden
						className="absolute left-[5px] top-3 bottom-3 w-0.5 rounded-full bg-foreground/12"
					/>
					<span
						aria-hidden
						className="proc-fill absolute left-[5px] top-3 bottom-3 w-0.5 origin-top rounded-full bg-primary"
					/>

					<ol>
						{PHASES.map((phase) => (
							<li
								key={phase.number}
								data-active="false"
								className="proc-step group/step relative grid grid-cols-1 items-start gap-x-10 gap-y-6 pl-9 sm:pl-14 md:grid-cols-12 [&:not(:last-child)]:pb-14 md:[&:not(:last-child)]:pb-20"
							>
								{/* Node */}
								<span
									aria-hidden
									className="absolute left-0 top-3 size-3 rounded-full border-2 border-foreground/25 bg-background transition-colors duration-300 group-data-[active=true]/step:border-primary group-data-[active=true]/step:bg-primary"
								/>

								{/* Graphic */}
								<div className="md:col-span-4 lg:col-span-3">
									<div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-card">
										<span className="absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums text-foreground/40">
											{phase.number} / {String(PHASES.length).padStart(2, "0")}
										</span>
										{phase.graphic}
									</div>
								</div>

								{/* Content */}
								<div className="md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5">
									<h3 className="text-[clamp(1.625rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.025em]">
										{phase.name}
									</h3>
									<p className="mt-1.5 text-[12px] uppercase tracking-[0.18em] text-foreground/45">
										{phase.summary}
									</p>
									<p className="mt-5 max-w-xl text-pretty text-[15px] leading-[1.65] text-foreground/75 sm:text-base">
										{phase.description}
									</p>
									<ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
										{phase.points.map((point) => (
											<li
												key={point}
												className="inline-flex items-center rounded-full border border-foreground/15 px-3 py-1.5 text-[12.5px] text-foreground/70"
											>
												{point}
											</li>
										))}
									</ul>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
