"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { projectCardImage, sanityFitMax } from "~/libs/project-media";
import type { Project } from "~/libs/projects";

interface CaseStudiesProps {
	projects: Project[];
}

export function CaseStudies({ projects }: CaseStudiesProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const featured = projects;

	useGSAP(
		() =>
			withMotion(() => {
				const section = sectionRef.current;
				const viewport = viewportRef.current;
				const track = trackRef.current;
				if (!(section && viewport && track)) return;

				if (!window.matchMedia("(min-width: 768px)").matches) return;

				const distance = () =>
					Math.max(0, track.scrollWidth - viewport.clientWidth);

				gsap.set(viewport, { overflow: "hidden" });

				const tween = gsap.to(track, {
					x: () => -distance(),
					ease: "none",
					scrollTrigger: {
						trigger: section,
						start: "top top",
						end: () => `+=${distance()}`,
						pin: true,
						scrub: 1,
						anticipatePin: 1,
						invalidateOnRefresh: true,
					},
				});

				return () => {
					tween.scrollTrigger?.kill();
					tween.kill();
					gsap.set(viewport, { clearProps: "overflow" });
				};
			}),
		{ scope: sectionRef, dependencies: [featured.length] },
	);

	return (
		<section
			ref={sectionRef}
			id="work"
			className="relative w-full overflow-hidden bg-background py-20 md:py-0"
		>
			<header className="container flex items-end justify-between gap-6 px-6 md:absolute md:inset-x-0 md:top-12 md:z-10 md:px-12 lg:px-24">
				<div>
					<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
						Selected Work
					</p>
					<p className="mt-3 max-w-xl text-pretty text-[clamp(1.25rem,2.4vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.02em] text-foreground">
						A few projects we&apos;re proud of.
					</p>
				</div>

				<Link
					href="/work"
					className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-foreground/20 bg-foreground/[0.03] px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
				>
					View all
					<span
						aria-hidden
						className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
					>
						&rarr;
					</span>
				</Link>
			</header>

			<div className="container flex flex-col justify-center px-6 md:h-[100svh] md:px-12 md:pt-16 lg:px-24">
				<div
					ref={viewportRef}
					className="w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:snap-none"
				>
					<div ref={trackRef} className="flex w-max items-start gap-5 md:gap-8">
						{featured.map((project, index) => (
							<ProjectCard
								key={project._id ?? project.slug}
								project={project}
								index={index}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
	const cardImage = projectCardImage(project);

	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group flex w-[82vw] shrink-0 snap-start flex-col sm:w-[60vw] md:w-[44vw] lg:w-[38vw]"
		>
			<div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-foreground/[0.035]">
				<Image
					src={sanityFitMax(cardImage, 1600)}
					alt={project.title}
					fill
					priority={index === 0}
					sizes="(max-width: 640px) 82vw, (max-width: 768px) 60vw, (max-width: 1024px) 44vw, 38vw"
					quality={90}
					objectFit="cover"
					className="size-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
				/>
				{project.previewVideo ? (
					<video
						aria-hidden
						className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						src={project.previewVideo}
						poster={sanityFitMax(cardImage, 1600)}
						autoPlay
						muted
						loop
						playsInline
						preload="metadata"
					/>
				) : null}
			</div>

			<div className="mt-3 flex items-baseline justify-between gap-4 md:mt-4">
				<h3 className="text-[clamp(1.25rem,1.55vw,1.75rem)] font-medium leading-tight tracking-tight text-foreground">
					{project.title}
				</h3>
				<span className="shrink-0 text-sm tabular-nums text-foreground/50">
					{project.year}
				</span>
			</div>
		</Link>
	);
}
