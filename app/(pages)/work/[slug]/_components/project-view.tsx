"use client";

import { PortableText } from "@portabletext/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";
import type { Project } from "~/libs/projects";
import { Footer, Navbar } from "../../../_components";

gsap.registerPlugin(ScrollTrigger);

interface ProjectViewProps {
	project: Project;
	nextProject: Project;
}

export function ProjectView({ project, nextProject }: ProjectViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(".deck-item", {
				opacity: 0,
				y: 60,
				duration: 1.2,
				stagger: 0.1,
				ease: "expo.out",
				scrollTrigger: {
					trigger: ".deck-grid",
					start: "top 80%",
				},
			});

			gsap.from(".hero-title", {
				opacity: 0,
				y: 40,
				duration: 1.5,
				ease: "power4.out",
				delay: 0.2,
			});

			gsap.to(".parallax-img", {
				y: -30,
				ease: "none",
				scrollTrigger: {
					trigger: ".deck-grid",
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<Navbar />
			<main ref={containerRef} className="grow bg-background text-foreground">
				<section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
					<Container>
						<div className="max-w-4xl">
							<div className="hero-title flex flex-col gap-4">
								<div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
									<div className="h-px w-8 bg-primary/40" />
									Case Study • {project.year}
								</div>
								<h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.85]">
									{project.title}
								</h1>
								<p className="mt-8 text-xl md:text-3xl text-muted-foreground/80 font-light max-w-2xl leading-tight">
									{project.description}
								</p>
							</div>
						</div>
					</Container>
				</section>

				<section className="pb-40">
					<Container>
						<div className="deck-grid grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 auto-rows-[100px] md:auto-rows-[120px] gap-6 md:gap-8">
							<div className="deck-item col-span-4 md:col-span-8 lg:col-span-12 row-span-4 md:row-span-6 rounded-[3rem] overflow-hidden bg-muted/20 border border-border/50 shadow-2xl">
								<div className="relative size-full overflow-hidden">
									<Image
										src={project.image}
										alt={project.title}
										fill
										className="parallax-img object-cover scale-110"
										priority
										aspectRatio={16 / 9}
									/>
									<div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-4 lg:col-span-6 row-span-3 bg-zinc-950 rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-between overflow-hidden relative group">
								<div className="relative z-10">
									<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 font-mono">
										01 / Identity
									</p>
									<h3 className="text-4xl font-light tracking-tight text-white mb-8">
										Visual Harmony &<br />
										Brand Language
									</h3>
								</div>

								<div className="relative z-10 flex items-end gap-3">
									{project.branding.colors.map((color) => (
										<div
											key={color.hex}
											className="flex flex-col items-center gap-3 group/swatch"
										>
											<div
												className="size-16 md:size-20 rounded-2xl shadow-lg border border-white/10 group-hover/swatch:scale-110 transition-transform duration-500"
												style={{ backgroundColor: color.hex }}
											/>
											<span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover/swatch:opacity-100 transition-opacity">
												{color.hex}
											</span>
										</div>
									))}
								</div>

								<div className="absolute -right-10 -bottom-20 text-[20rem] font-black text-white/[0.03] select-none">
									{project.title.charAt(0)}
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-4 lg:col-span-6 row-span-3 bg-muted/20 border border-border/50 rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-between">
								<div>
									<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6 font-mono">
										02 / Typography
									</p>
									<h3 className="text-4xl font-light tracking-tight mb-2">
										Editorial Precision
									</h3>
									<p className="text-sm text-muted-foreground/60 font-light max-w-xs">
										Carefully selected typefaces to ensure clarity and emotional
										resonance across all touchpoints.
									</p>
								</div>

								<div className="flex items-end justify-between">
									<div className="space-y-1">
										<p
											className="text-7xl md:text-8xl font-light tracking-tighter"
											style={{
												fontFamily: project.branding.typography[0]?.name,
											}}
										>
											Aa
										</p>
										<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
											{project.branding.typography[0]?.name || "Inter"}
										</p>
									</div>
									<div className="text-[10px] font-mono text-muted-foreground/40 leading-relaxed text-right uppercase tracking-widest">
										A B C D E F G<br />H I J K L M N<br />O P Q R S T U
									</div>
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-3 lg:col-span-5 row-span-4 md:row-span-5 rounded-[2.5rem] overflow-hidden bg-muted/10 border border-border/40 group">
								<div className="relative size-full">
									<Image
										src={project.image}
										alt={`${project.title} Detail`}
										fill
										className="object-cover transition-transform duration-1000 group-hover:scale-110"
										aspectRatio={3 / 4}
									/>
									<div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-5 lg:col-span-7 row-span-4 md:row-span-5 bg-foreground rounded-[2.5rem] p-10 md:p-20 flex flex-col justify-center gap-12 text-background">
								<div>
									<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/40 mb-8 font-mono">
										03 / Narrative
									</p>
									<h3 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.1]">
										&ldquo;{project.content.mission}&rdquo;
									</h3>
								</div>

								<div className="space-y-6 text-lg md:text-xl text-background/60 font-light leading-relaxed">
									{Array.isArray(project.content.approach) ? (
										<PortableText value={project.content.approach} />
									) : (
										<p>{project.content.approach}</p>
									)}
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-5 lg:col-span-7 row-span-2 bg-muted/20 border border-border/50 rounded-[2.5rem] p-10 flex items-center justify-between gap-8">
								<div className="max-w-xs">
									<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 font-mono">
										04 / Infrastructure
									</p>
									<h4 className="text-xl font-medium tracking-tight">
										Advanced Technology Stack
									</h4>
								</div>
								<div className="flex flex-wrap gap-2 justify-end">
									{project.techStack.map((tech) => (
										<span
											key={tech}
											className="px-4 py-2 rounded-xl bg-background border border-border/60 text-xs font-medium text-muted-foreground"
										>
											{tech}
										</span>
									))}
								</div>
							</div>

							<div className="deck-item col-span-4 md:col-span-3 lg:col-span-5 row-span-2 bg-primary rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-primary-foreground text-center">
								<div className="size-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
									<span className="text-4xl font-black">
										{project.title.charAt(0)}
									</span>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-foreground/60">
									Signature System
								</p>
							</div>

							<div className="deck-item col-span-4 md:col-span-8 lg:col-span-12 row-span-3 md:row-span-4 rounded-[3rem] overflow-hidden bg-muted/20 border border-border/50 shadow-xl group">
								<div className="relative size-full">
									<Image
										src={project.image}
										alt={`${project.title} Wide`}
										fill
										className="object-cover transition-transform duration-1000 group-hover:scale-105"
										aspectRatio={21 / 9}
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />

									<div className="absolute inset-x-0 bottom-0 p-10 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 text-white">
										<div className="max-w-2xl">
											<p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6 font-mono">
												05 / Impact
											</p>
											<h3 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
												{Array.isArray(project.content.result) ? (
													<PortableText value={project.content.result} />
												) : (
													project.content.result
												)}
											</h3>
										</div>
										<div className="flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
											<span>KPI Verified</span>
											<div className="h-0.5 w-12 bg-primary" />
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-40 pt-40 border-t border-border/40">
							<Link
								href={nextProject.href}
								className="group flex flex-col items-center text-center transition-all duration-700 hover:-translate-y-2"
							>
								<div className="mb-8 size-20 rounded-full border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-700 flex items-center justify-center">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="size-8 transition-transform group-hover:translate-x-1"
										stroke="currentColor"
									>
										<title>Next Project</title>
										<path
											d="M5 12h14M12 5l7 7-7 7"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-[0.6em] text-muted-foreground/60 mb-6 font-mono">
									Next Showcase
								</p>
								<h2 className="text-6xl md:text-[10rem] font-medium tracking-tighter leading-none group-hover:text-primary transition-colors">
									{nextProject.title}
								</h2>
							</Link>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</Wrapper>
	);
}
