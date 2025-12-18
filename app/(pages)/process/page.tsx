"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";

const steps = [
	{
		number: "01",
		title: "Discovery & Strategy",
		description:
			"We dive deep into your business goals, user needs, and market landscape to define a winning roadmap.",
		details: [
			"Market Research",
			"User Personas",
			"Technical Audit",
			"Product Strategy",
		],
	},
	{
		number: "02",
		title: "Design & UX",
		description:
			"Turning insights into intuitive interfaces. We craft pixel-perfect designs that prioritize both form and function.",
		details: ["Wireframing", "UI Design", "Prototyping", "Design System"],
	},
	{
		number: "03",
		title: "Development",
		description:
			"Bringing designs to life with robust, scalable code. We use cutting-edge tech to ensure peak performance.",
		details: [
			"Frontend Dev",
			"Backend Arch",
			"API Integration",
			"Quality Assurance",
		],
	},
	{
		number: "04",
		title: "Launch & Scale",
		description:
			"The beginning of your success. We handle deployment and provide continuous support for growth.",
		details: [
			"Deployment",
			"Performance Monitoring",
			"Feature Iteration",
			"Maintenance",
		],
	},
];

export default function ProcessPage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const blueprintRef = useRef<SVGSVGElement>(null);

	useGSAP(
		() => {
			gsap.from(".process-title span", {
				y: 100,
				opacity: 0,
				duration: 1,
				stagger: 0.1,
				ease: "power4.out",
			});

			if (blueprintRef.current) {
				const path = blueprintRef.current.querySelector(
					".main-path",
				) as SVGPathElement;
				if (path) {
					const length = path.getTotalLength();
					gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

					gsap.to(path, {
						strokeDashoffset: 0,
						ease: "none",
						scrollTrigger: {
							trigger: ".process-steps",
							start: "top 20%",
							end: "bottom 80%",
							scrub: 1,
						},
					});
				}
			}

			gsap.utils.toArray<HTMLElement>(".step-card").forEach((card) => {
				gsap.from(card, {
					opacity: 0,
					x: -50,
					duration: 0.8,
					scrollTrigger: {
						trigger: card,
						start: "top 80%",
					},
				});
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				className="grow bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
			>
				<section className="relative pt-48 pb-32 overflow-hidden">
					<div className="absolute inset-0 -z-10 opacity-20 dark:opacity-40">
						<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
						<svg
							className="w-full h-full"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<title>Grid Pattern</title>
							<defs>
								<pattern
									id="grid-process"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 10 0 L 0 0 0 10"
										fill="none"
										stroke="currentColor"
										strokeWidth="0.05"
									/>
								</pattern>
							</defs>
							<rect width="100" height="100" fill="url(#grid-process)" />
						</svg>
					</div>

					<Container>
						<div className="max-w-4xl">
							<h1 className="process-title text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic">
								<span className="block italic">The</span>
								<span className="block text-primary">Blueprint</span>
								<span className="block">Method</span>
							</h1>
							<p className="mt-12 text-xl md:text-2xl font-light text-muted-foreground max-w-2xl leading-relaxed">
								A systematic approach to digital excellence. We combine rigorous
								engineering with boundless creativity to build what’s next.
							</p>
						</div>
					</Container>
				</section>

				<section className="process-steps relative py-32 lg:py-64">
					<Container className="grid lg:grid-cols-[1fr_2fr] gap-20 lg:gap-32">
						<div className="hidden lg:block relative h-[600px]">
							<div className="sticky top-48">
								<svg
									ref={blueprintRef}
									viewBox="0 0 200 600"
									className="w-full h-full text-muted-foreground/20"
								>
									<title>Process Blueprint</title>
									<path
										className="main-path"
										d="M100 0 V600"
										fill="none"
										stroke="currentColor"
										strokeWidth="1"
									/>
									{steps.map((step) => (
										<circle
											key={step.number}
											cx="100"
											cy={100 + (Number.parseInt(step.number, 10) - 1) * 150}
											r="6"
											className="fill-background stroke-muted-foreground/40"
											strokeWidth="2"
										/>
									))}
								</svg>
							</div>
						</div>

						<div className="flex flex-col gap-32 lg:gap-48">
							{steps.map((step) => (
								<div key={step.number} className="step-card group relative">
									<div className="flex flex-col gap-6">
										<div className="flex items-center gap-4">
											<span className="text-primary font-mono text-xl">
												{step.number}
											</span>
											<div className="h-px flex-1 bg-border group-hover:bg-primary/30 transition-colors" />
										</div>
										<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
											{step.title}
										</h2>
										<p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl">
											{step.description}
										</p>
										<div className="grid grid-cols-2 gap-4 mt-8">
											{step.details.map((detail) => (
												<div
													key={detail}
													className="flex items-center gap-3 text-sm text-muted-foreground/60 font-medium uppercase tracking-widest"
												>
													<div className="size-1 bg-primary/40 rounded-full" />
													{detail}
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</Container>
				</section>

				<section className="py-32 bg-primary text-primary-foreground">
					<Container>
						<div className="max-w-4xl mx-auto text-center">
							<h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-12">
								We bridge the gap between imagination and execution.
							</h2>
							<div className="inline-block px-8 py-4 bg-foreground text-background text-sm font-bold uppercase tracking-[0.2em]">
								Start your project
							</div>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</Wrapper>
	);
}
