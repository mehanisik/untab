"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface Step {
	number: string;
	title: string;
	description: string;
	details: string[];
}

interface ProcessContentProps {
	title?: string[];
	description?: string;
	steps?: Step[];
}

export default function ProcessContent({
	title = ["Design", "Develop", "Deploy"],
	description = "A streamlined, results-driven approach to digital product engineering. We focus on clarity, efficiency, and uncompromising quality.",
	steps = [
		{
			number: "01",
			title: "Discovery & Architecture",
			description:
				"We define the technical landscape and core system requirements, ensuring a scalable foundation for your project.",
			details: [
				"Requirement Analysis",
				"System Mapping",
				"Infrastructure Design",
				"Risk Assessment",
			],
		},
		{
			number: "02",
			title: "Precision Engineering",
			description:
				"Our developers build with clean code principles, performance optimization, and rigorous testing at every stage.",
			details: [
				"High-Fidelity Codebase",
				"API Development",
				"UI Interaction Design",
				"Unit & Integration Testing",
			],
		},
		{
			number: "03",
			title: "Quality Assurance",
			description:
				"Before launch, every feature undergoes intense scrutiny to guarantee a flawless user experience and rock-solid stability.",
			details: [
				"Performance Indexing",
				"Cross-Platform Testing",
				"Accessibility Verification",
				"Security Hardening",
			],
		},
		{
			number: "04",
			title: "Launch & Evolution",
			description:
				"We manage the deployment and provide continuous support, monitoring performance to drive ongoing improvements.",
			details: [
				"Seamless Deployment",
				"Live Monitoring",
				"Data-Driven Iteration",
				"Scalability Roadmap",
			],
		},
	],
}: ProcessContentProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			// Precise Reveal for Hero
			if (containerRef.current?.querySelectorAll(".minimal-hero-line").length) {
				gsap.from(".minimal-hero-line", {
					y: 20,
					opacity: 0,
					duration: 0.8,
					stagger: 0.1,
					ease: "power2.out",
				});
			}

			// Steps Staggered Entrance
			const stepItems = gsap.utils.toArray<HTMLElement>(".minimal-step-item");
			stepItems.forEach((item) => {
				const content = item.querySelector(".minimal-step-content");
				const divider = item.querySelector(".minimal-step-divider");

				if (content) {
					gsap.from(content, {
						opacity: 0,
						y: 20,
						scrollTrigger: {
							trigger: item,
							start: "top 80%",
							toggleActions: "play none none reverse",
						},
					});
				}

				if (divider) {
					gsap.from(divider, {
						scaleX: 0,
						transformOrigin: "left center",
						duration: 1.2,
						scrollTrigger: {
							trigger: item,
							start: "top 90%",
							toggleActions: "play none none reverse",
						},
					});
				}
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				className="grow bg-background text-foreground selection:bg-foreground selection:text-background"
			>
				{/* Hero Section */}
				<section className="relative pt-40 pb-20 border-b border-foreground/5">
					<Container>
						<div className="max-w-4xl">
							<div className="flex items-center gap-4 mb-12">
								<div className="w-12 h-px bg-primary" />
								<span className="minimal-hero-line text-[10px] font-mono leading-none uppercase tracking-[0.4em] text-primary">
									Methodology v2.0
								</span>
							</div>
							<h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-12 leading-[1.1]">
								{title.map((line, i) => (
									<span key={line} className="minimal-hero-line block">
										{line}
										{i !== title.length - 1 && (
											<span className="text-primary opacity-50">.</span>
										)}
									</span>
								))}
							</h1>
							<p className="minimal-hero-line text-lg md:text-xl text-foreground/50 leading-relaxed max-w-2xl">
								{description}
							</p>
						</div>
					</Container>
				</section>

				{/* Process List Section */}
				<section className="py-20">
					<Container>
						<div className="flex flex-col">
							{steps.map((step) => (
								<div
									key={step.number}
									className="minimal-step-item grid grid-cols-1 lg:grid-cols-12 gap-12 py-20 border-b border-foreground/5 last:border-0"
								>
									{/* Index */}
									<div className="lg:col-span-2">
										<span className="text-xs font-mono text-foreground/20 uppercase tracking-widest">
											[{step.number}]
										</span>
									</div>

									{/* Main Content */}
									<div className="minimal-step-content lg:col-span-6 flex flex-col gap-8">
										<h2 className="text-3xl md:text-4xl font-medium tracking-tight">
											{step.title}
										</h2>
										<p className="text-lg text-foreground/40 leading-relaxed">
											{step.description}
										</p>
									</div>

									{/* Capabilities/Details List */}
									<div className="minimal-step-content lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-foreground/5 lg:pl-12">
										<span className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.2em] mb-2">
											Core Capabilities
										</span>
										<div className="grid grid-cols-1 gap-4">
											{step.details.map((detail) => (
												<div
													key={detail}
													className="flex items-center gap-4 group cursor-default"
												>
													<div className="w-1 h-1 rounded-full bg-foreground/10 group-hover:bg-primary transition-colors" />
													<span className="text-sm text-foreground/50 group-hover:text-foreground transition-colors">
														{detail}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</Container>
				</section>

				{/* High-End Minimal CTA */}
				<section className="py-40 bg-foreground text-background selection:bg-primary selection:text-white">
					<Container>
						<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
							<div className="max-w-2xl">
								<span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-8 block">
									{"// Ready to begin"}
								</span>
								<h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight">
									Let's translate your vision into{" "}
									<span className="italic font-serif">precision.</span>
								</h2>
							</div>

							<div className="flex flex-col gap-6">
								<button
									type="button"
									className="px-12 py-5 bg-background text-foreground text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 duration-300"
								>
									Contact Studio
								</button>
								<span className="text-[9px] font-mono text-background/20 uppercase tracking-widest text-center truncate">
									Avg initialization time: 24h
								</span>
							</div>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</Wrapper>
	);
}
