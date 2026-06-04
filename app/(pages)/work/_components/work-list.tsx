"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { REVEAL } from "~/libs/gsap/presets";
import type { Project } from "~/libs/projects";

const PAGE_PADDING = "px-6 md:px-12 lg:px-24";

interface WorkListProps {
	projects: Project[];
}

type View = "grid" | "list";

export function WorkList({ projects }: WorkListProps) {
	const rootRef = useRef<HTMLElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<View>("grid");

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add(
				{
					isDesktop: "(min-width: 768px)",
					isMobile: "(max-width: 767px)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(ctx) => {
					const { reduced } = ctx.conditions as {
						isDesktop: boolean;
						isMobile: boolean;
						reduced: boolean;
					};

					if (reduced) return;

					const intro = root.querySelectorAll<HTMLElement>(".reveal-intro");
					if (intro.length) {
						gsap.from(intro, {
							y: 28,
							opacity: 0,
							duration: 0.9,
							ease: REVEAL.ease,
							stagger: 0.08,
						});
					}
				},
			);

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	useGSAP(
		() => {
			const body = bodyRef.current;
			if (!body) return;

			const mm = gsap.matchMedia();

			mm.add(
				{
					isDesktop: "(min-width: 768px)",
					isMobile: "(max-width: 767px)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(ctx) => {
					const { isMobile, reduced } = ctx.conditions as {
						isDesktop: boolean;
						isMobile: boolean;
						reduced: boolean;
					};

					if (reduced) return;

					const items = body.querySelectorAll<HTMLElement>(".work-item");
					if (!items.length) return;

					items.forEach((item, i) => {
						gsap.fromTo(
							item,
							{ opacity: 0, y: isMobile ? 24 : 40 },
							{
								opacity: 1,
								y: 0,
								duration: 0.9,
								ease: REVEAL.ease,
								delay: (i % 3) * 0.05,
								scrollTrigger: {
									trigger: item,
									start: "top 92%",
									toggleActions: "play none none none",
								},
							},
						);

						const img = item.querySelector<HTMLElement>(".work-img");
						if (img && !isMobile) {
							gsap.fromTo(
								img,
								{ scale: 1.08 },
								{
									scale: 1,
									ease: "none",
									scrollTrigger: {
										trigger: item,
										start: "top bottom",
										end: "bottom top",
										scrub: 1,
									},
								},
							);
						}
					});
				},
			);

			return () => mm.revert();
		},
		{ scope: rootRef, dependencies: [view, projects.length] },
	);

	if (projects.length === 0) {
		return (
			<section ref={rootRef} className="w-full pt-32 md:pt-44 pb-24 md:pb-32">
				<div className={`mx-auto w-full max-w-[1440px] ${PAGE_PADDING}`}>
					<p className="text-center text-sm text-foreground/55">
						New work is on the way.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section
			ref={rootRef}
			className="w-full pt-24 sm:pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-32"
			aria-label="Case studies"
		>
			<div className={`mx-auto w-full max-w-[1440px] ${PAGE_PADDING}`}>
				<header className="grid grid-cols-1 items-end gap-x-8 gap-y-8 md:grid-cols-12 md:gap-y-10">
					<h1 className="reveal-intro md:col-span-8 text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[0.88] tracking-[-0.045em] text-foreground">
						Case studies
						<sup className="ml-1 align-super text-[0.2em] font-medium tabular-nums text-foreground/55">
							({String(projects.length).padStart(2, "0")})
						</sup>
					</h1>

					<div className="reveal-intro md:col-span-4 flex flex-col items-start gap-5 sm:gap-6 md:items-end md:text-right">
						<p className="max-w-xs text-pretty text-[13px] md:text-sm leading-[1.55] text-foreground/65">
							Creative software studio building timeless brands and digital
							products for the brave and the brilliant.
						</p>
						<button
							type="button"
							onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
							className="group inline-flex min-h-11 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/60 transition-colors hover:text-foreground"
							aria-pressed={view === "list"}
						>
							<span
								aria-hidden
								className="inline-block size-1.5 rounded-full bg-foreground/40 transition-colors group-hover:bg-foreground"
							/>
							{view === "grid" ? "List View" : "Grid View"}
						</button>
					</div>
				</header>

				<div ref={bodyRef}>
					{view === "grid" ? (
						<ul className="mt-10 sm:mt-14 md:mt-20 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-y-10 md:grid-cols-3 md:gap-x-4 md:gap-y-14 lg:gap-x-5">
							{projects.map((project, index) => (
								<li key={project._id ?? project.slug} className="work-item">
									<WorkTile project={project} index={index} />
								</li>
							))}
						</ul>
					) : (
						<ul className="mt-10 sm:mt-14 md:mt-20 border-y border-foreground/15">
							{projects.map((project, index) => (
								<li
									key={project._id ?? project.slug}
									className="work-item border-b border-foreground/15 last:border-b-0"
								>
									<WorkRow project={project} index={index} />
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
}

function WorkTile({ project, index }: { project: Project; index: number }) {
	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group block focus-visible:outline-none"
			aria-label={`${project.title}, ${project.category}`}
		>
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/[0.04]">
				<Image
					src={project.image}
					alt=""
					fill
					priority={index < 3}
					sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
					className="work-img size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04]"
				/>
			</div>
			<div className="mt-3 sm:mt-4 flex items-baseline justify-between gap-4 sm:gap-6">
				<span className="text-[14px] sm:text-[15px] md:text-base font-medium leading-tight tracking-[-0.01em] text-foreground">
					{project.title}
				</span>
				<span className="shrink-0 text-[12px] sm:text-[13px] md:text-sm text-foreground/55">
					{project.category}
				</span>
			</div>
		</Link>
	);
}

function WorkRow({ project, index }: { project: Project; index: number }) {
	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group flex items-baseline justify-between gap-4 sm:gap-6 py-5 sm:py-6 md:py-8 transition-colors"
			aria-label={`${project.title}, ${project.category}`}
		>
			<div className="flex items-baseline gap-4 sm:gap-5 md:gap-8 min-w-0">
				<span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] tabular-nums text-foreground/45 shrink-0">
					{String(index + 1).padStart(2, "0")}
				</span>
				<span className="truncate text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-medium leading-tight tracking-[-0.025em] text-foreground transition-colors group-hover:text-foreground/60">
					{project.title}
				</span>
			</div>
			<span className="shrink-0 text-[12px] sm:text-[13px] md:text-sm text-foreground/55">
				{project.category}
			</span>
		</Link>
	);
}
