"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import type { Project } from "~/libs/projects";
import { cn } from "~/libs/utils";

interface CaseStudiesProps {
	projects: Project[];
}

export function CaseStudies({ projects }: CaseStudiesProps) {
	const headerRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<section id="work" className="bg-background py-32 lg:py-48">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div ref={headerRef} className="mb-20 flex items-end justify-between">
					<div className="max-w-xl">
						<div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary">
							Selected Works
						</div>
						<h2 className="text-5xl font-medium tracking-[calc(var(--tracking-tighter)*2)] text-foreground md:text-7xl">
							Selected Projects
						</h2>
						<p className="mt-6 text-lg text-muted-foreground/60 font-light leading-relaxed">
							A collection of digital products we've brought from concept to
							market success. Focused on utility, aesthetics, and impact.
						</p>
					</div>
					<Link
						href="/work"
						className="group hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300"
					>
						View all Work
						<div className="flex size-10 items-center justify-center rounded-full border border-muted-foreground/20 transition-all duration-500 group-hover:bg-foreground group-hover:border-foreground group-hover:text-background group-hover:scale-110">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								className="size-4"
								aria-hidden="true"
							>
								<title>Arrow Right</title>
								<path
									d="M5 12h14M12 5l7 7-7 7"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 min-h-auto md:min-h-[1200px]">
					{projects.slice(0, 4).map((project, index) => (
						<div
							key={project.title}
							className={cn(
								"h-[400px] sm:h-[500px] md:h-[600px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
								index % 2 !== 0 ? "md:mt-32" : "mt-0",
								hoveredIndex !== null && hoveredIndex !== index
									? "opacity-30 grayscale scale-[0.98] blur-[2px]"
									: "opacity-100 grayscale-0 scale-100 blur-0",
							)}
						>
							<ProjectCard
								project={project}
								index={index}
								onHover={() => setHoveredIndex(index)}
								onBlur={() => setHoveredIndex(null)}
							/>
						</div>
					))}
				</div>

				<div className="mt-24 flex justify-center md:hidden">
					<Link
						href="/work"
						className={cn(
							buttonVariants({ variant: "outline", size: "lg" }),
							"rounded-full px-12 h-14 border-zinc-200 dark:border-zinc-800",
						)}
					>
						View all projects
					</Link>
				</div>
			</div>
		</section>
	);
}

function ProjectCard({
	project,
	index,
	onHover,
	onBlur,
}: {
	project: Project;
	index: number;
	onHover?: () => void;
	onBlur?: () => void;
}) {
	const ref = useFadeInOnScroll<HTMLAnchorElement>({ delay: index * 0.15 });
	const [isHovered, setIsHovered] = useState(false);
	const cardRef = useRef<HTMLAnchorElement>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		setMousePosition({ x, y });
	};

	return (
		<Link
			ref={(node) => {
				if (node) {
					(
						cardRef as React.MutableRefObject<HTMLAnchorElement | null>
					).current = node;
					(ref as React.MutableRefObject<HTMLAnchorElement | null>).current =
						node;
				}
			}}
			href={project.href || "#"}
			className="group relative block overflow-hidden  h-full bg-zinc-950 border border-white/5"
			onMouseEnter={() => {
				setIsHovered(true);
				onHover?.();
			}}
			onMouseLeave={() => {
				setIsHovered(false);
				setMousePosition({ x: 0, y: 0 });
				onBlur?.();
			}}
			onMouseMove={handleMouseMove}
		>
			<div
				className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
				style={{
					transform: isHovered
						? `scale(1.1) translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
						: "scale(1.02)",
				}}
			>
				<Image
					src={project.image}
					alt={project.title}
					fill
					className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
				/>
			</div>

			<div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

			<div
				className={cn(
					"absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent transition-opacity duration-700",
					isHovered ? "opacity-100" : "opacity-80",
				)}
			/>

			<div className="relative flex flex-col justify-between p-6 sm:p-10 md:p-14 h-full z-10">
				<div className="flex items-start justify-between">
					<div
						className={cn(
							"flex flex-col gap-1 transition-all duration-700",
							isHovered
								? "opacity-100 translate-y-0"
								: "opacity-80 -translate-y-2",
						)}
					>
						<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
							{project.category}
						</span>
						<span className="text-xs text-primary font-medium tracking-widest">
							{project.year}
						</span>
					</div>

					<div
						className={cn(
							"flex size-14 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
							isHovered
								? "opacity-100 scale-100 bg-white text-black translate-x-0 translate-y-0"
								: "opacity-0 scale-50 bg-white/5 text-white translate-x-4 -translate-y-4",
						)}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="size-6"
							aria-hidden="true"
						>
							<title>Arrow Up Right</title>
							<path
								d="M7 17L17 7M17 7H7M17 7V17"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>

				<div className="max-w-xs">
					<h3
						className={cn(
							"font-medium tracking-tighter text-white transition-all duration-700 text-3xl sm:text-5xl md:text-6xl lg:text-7xl",
							isHovered ? "translate-x-2" : "translate-x-0",
						)}
					>
						{project.title}
					</h3>
					<div
						className={cn(
							"flex items-center gap-6 mt-8 transition-all duration-700",
							isHovered
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-6",
						)}
					>
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
							View Project
						</span>
						<div className="h-px flex-1 bg-linear-to-r from-white/40 to-transparent" />
					</div>
				</div>
			</div>
		</Link>
	);
}
