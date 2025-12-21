"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";
import type { Project } from "~/libs/projects";
import { cn } from "~/libs/utils";
import { Footer, Navbar } from "../../_components";

interface WorkViewProps {
	projects: Project[];
}

export function WorkView({ projects }: WorkViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline();
			tl.from(".char", {
				y: 100,
				opacity: 0,
				duration: 1,
				stagger: 0.05,
				ease: "power4.out",
			}).from(
				".work-line",
				{
					scaleX: 0,
					transformOrigin: "left",
					duration: 1.5,
					ease: "expo.inOut",
				},
				"-=0.8",
			);

			gsap.to(".parallax-bg", {
				y: (_, target) => -target.offsetHeight * 0.2,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			});
		},
		{ scope: containerRef },
	);

	if (!projects || projects.length === 0) {
		return (
			<Wrapper>
				<Navbar />
				<main className="grow bg-background">
					<Container className="py-48 text-center">
						<h1 className="text-4xl font-bold mb-4">No Projects Available</h1>
						<p className="text-muted-foreground">
							We&apos;re working on some amazing projects. Check back soon!
						</p>
					</Container>
				</main>
				<Footer />
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				className="grow relative bg-background overflow-hidden"
			>
				<div className="parallax-bg pointer-events-none absolute inset-0 -z-10 h-[120%] opacity-20 dark:opacity-40">
					<div className="absolute top-[10%] left-[5%] size-96 rounded-full bg-primary/20 blur-3xl" />
					<div className="absolute top-[40%] right-[10%] size-[500px] rounded-full bg-violet-500/10 blur-3xl" />
					<div className="absolute bottom-[20%] left-[15%] size-[400px] rounded-full bg-amber-500/10 blur-3xl" />
				</div>

				<Container className="pt-48 pb-32">
					<div ref={headerRef} className="relative mb-32">
						<div className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
							Selected Works
						</div>
						<h1 className="flex flex-col text-[clamp(4rem,15vw,12rem)] font-black leading-[0.85] tracking-tighter">
							<span className="flex overflow-hidden">
								{"IMPACT".split("").map((c, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static split for animation
									<span key={`impact-${c}-${i}`} className="char inline-block">
										{c}
									</span>
								))}
							</span>
							<span className="flex overflow-hidden ml-[10%]">
								{"THROUGH".split("").map((c, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static split for animation
									<span key={`through-${c}-${i}`} className="char inline-block">
										{c}
									</span>
								))}
							</span>
							<span className="flex overflow-hidden text-primary">
								{"DESIGN".split("").map((c, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static split for animation
									<span key={`design-${c}-${i}`} className="char inline-block">
										{c}
									</span>
								))}
							</span>
						</h1>
						<div className="work-line mt-12 h-0.5 w-full bg-foreground/10" />
						<div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
							<p className="max-w-xl text-xl text-muted-foreground/80 font-light leading-relaxed">
								We don&apos;t just build products; we create digital legacies.
								Explore our curated selection of high-performance solutions.
							</p>
							<div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
								Scroll to explore
								<div className="h-12 w-px bg-foreground/20 animate-bounce" />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-40 lg:gap-64">
						{projects.map((project, i) => (
							<ProjectSection key={project.title} project={project} index={i} />
						))}
					</div>
				</Container>
			</main>
			<Footer />
		</Wrapper>
	);
}

function ProjectSection({
	project,
	index,
}: {
	project: Project;
	index: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const isEven = index % 2 === 0;

	useGSAP(
		() => {
			gsap.from(ref.current, {
				opacity: 0,
				y: 100,
				duration: 1.2,
				ease: "power3.out",
				scrollTrigger: {
					trigger: ref.current,
					start: "top 80%",
				},
			});
		},
		{ scope: ref },
	);

	return (
		<div
			ref={ref}
			className={cn(
				"group relative flex flex-col gap-12 lg:flex-row lg:items-center",
				isEven ? "lg:flex-row" : "lg:flex-row-reverse",
			)}
		>
			<Link
				href={project.href}
				className="relative block flex-1 aspect-16/10 overflow-hidden rounded bg-muted/20"
			>
				<div className="relative size-full">
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover transition-transform duration-1000 group-hover:scale-105"
						aspectRatio={16 / 10}
					/>
				</div>
				<div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-700" />

				<div className="absolute inset-x-8 bottom-8 flex items-end justify-between text-white">
					<div className="flex flex-col gap-1 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
						<span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
							{project.category}
						</span>
						<span className="text-4xl font-black">{project.title}</span>
					</div>
					<div className="size-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="size-8"
							stroke="currentColor"
						>
							<title>Explore Project</title>
							<path
								d="M7 17L17 7M17 7H7M17 7V17"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</Link>

			<div className="flex-1 max-w-lg">
				<div className="flex items-center gap-4 mb-6">
					<span className="text-xs font-bold text-primary tabular-nums">
						0{index + 1}
					</span>
					<div className="h-px w-8 bg-primary/30" />
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
						{project.year}
					</span>
				</div>
				<h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
					{project.title}
				</h2>
				<p className="text-lg text-muted-foreground/80 font-light leading-relaxed mb-10">
					{project.description}
				</p>
				<Link
					href={project.href}
					className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors group/link"
				>
					Explore Case Study
					<div className="h-px w-12 bg-foreground transition-all group-hover/link:w-24 group-hover/link:bg-primary" />
				</Link>
			</div>
		</div>
	);
}
