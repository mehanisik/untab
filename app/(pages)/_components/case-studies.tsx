"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import type { Project } from "~/libs/projects";

interface CaseStudiesProps {
	projects: Project[];
}

export function CaseStudies({ projects }: CaseStudiesProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	const featured = projects.slice(0, 6);

	useGSAP(
		() =>
			withMotion(() => {
				const section = sectionRef.current;
				const viewport = viewportRef.current;
				const track = trackRef.current;
				if (!(section && viewport && track)) return;

				// Desktop only: turn vertical scroll into a pinned horizontal scrub.
				// On mobile (and when skipped for reduced motion) the viewport keeps
				// its default `overflow-x-auto`, so it stays a native swipe scroll.
				if (!window.matchMedia("(min-width: 768px)").matches) return;

				// Measure travel against the VIEWPORT (the rail-inset content
				// column), not the window — the viewport has no padding of its own,
				// so clientWidth is the exact clip width and the track lands with the
				// last card flush to the right rail.
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
		{ scope: sectionRef },
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

			{/* Rail column owns the max-width + side rails; the viewport clips to
			    this column, so cards start at the left rail, end at the right rail,
			    and never bleed past the site max-width while scrubbing. */}
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

// The card art is a fixed 4:5 portrait. Sanity originals arrive at arbitrary
// native ratios, so `object-cover` was hard-cropping them (awkward framing) and
// the browser was upscaling too-small candidates (soft on retina). For Sanity
// CDN sources, ask Sanity itself for a sharp 4:5 crop — honouring the focal
// point when the project defines one — in a modern format at high quality.
const CARD_W = 1200;
const CARD_H = 1500;

function cardImage(src: string, hotspot?: { x: number; y: number }): string {
	if (!src.includes("cdn.sanity.io")) return src;
	const params = new URLSearchParams({
		w: String(CARD_W),
		h: String(CARD_H),
		fit: "crop",
		auto: "format",
		q: "90",
	});
	if (typeof hotspot?.x === "number" && typeof hotspot?.y === "number") {
		params.set("crop", "focalpoint");
		params.set("fp-x", hotspot.x.toFixed(4));
		params.set("fp-y", hotspot.y.toFixed(4));
	} else {
		params.set("crop", "entropy");
	}
	return `${src}${src.includes("?") ? "&" : "?"}${params.toString()}`;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
	const subtitle = project.description || project.category || "";

	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group flex shrink-0 snap-start flex-col w-[72vw] sm:w-[52vw] md:w-[34vw] lg:w-[28vw]"
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-foreground/[0.05]">
				<Image
					src={cardImage(project.image, project.imageHotspot)}
					alt={project.title}
					fill
					priority={index === 0}
					sizes="(max-width: 640px) 72vw, (max-width: 768px) 52vw, (max-width: 1024px) 34vw, 28vw"
					quality={90}
					className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
				/>
			</div>

			<div className="mt-4 md:mt-5">
				<h3 className="text-[clamp(1.35rem,1.8vw,2rem)] font-semibold leading-tight tracking-tight text-foreground">
					{project.title}
				</h3>
				{subtitle ? (
					<p className="mt-1 line-clamp-1 text-[15px] text-foreground/55">
						{subtitle}
					</p>
				) : null}
			</div>
		</Link>
	);
}
