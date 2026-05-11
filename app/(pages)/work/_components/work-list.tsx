"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { REVEAL } from "~/libs/gsap/presets";
import type { Project } from "~/libs/projects";

interface WorkListProps {
	projects: Project[];
}

const MONO_LABEL =
	"font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/55";

export function WorkList({ projects }: WorkListProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const meta = root.querySelector<HTMLElement>(".work-meta-strip");
			const cards = root.querySelectorAll<HTMLElement>(".work-card");

			if (meta) {
				gsap.from(meta, {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: REVEAL.ease,
					scrollTrigger: {
						trigger: root,
						start: REVEAL.start,
						toggleActions: REVEAL.toggleActions,
					},
				});
			}

			if (cards.length) {
				gsap.from(cards, {
					y: 40,
					opacity: 0,
					duration: REVEAL.duration,
					ease: REVEAL.ease,
					stagger: 0.08,
					scrollTrigger: {
						trigger: root,
						start: REVEAL.start,
						toggleActions: REVEAL.toggleActions,
					},
				});
			}
		},
		{ scope: sectionRef, dependencies: [projects.length] },
	);

	if (projects.length === 0) {
		return (
			<section className="relative w-full pb-32 md:pb-48">
				<Container>
					<div className="border-t border-foreground/15 pt-16 text-center">
						<p className={MONO_LABEL}>Index — empty</p>
						<p className="mt-6 text-base font-medium text-foreground">
							New work is on the way.
						</p>
						<p className="mt-3 max-w-md mx-auto text-sm text-foreground/55 leading-relaxed">
							Recent engagements are still under NDA — get in touch and we'll
							walk you through them directly.
						</p>
						<Link
							href="/contact"
							className="mt-8 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-sm font-medium text-foreground transition-colors hover:border-foreground"
						>
							Start a conversation
						</Link>
					</div>
				</Container>
			</section>
		);
	}

	return (
		<section
			ref={sectionRef}
			className="relative w-full pb-32 md:pb-48"
			aria-label="All projects"
		>
			<Container>
				<div className="work-meta-strip flex items-center justify-between border-t border-foreground/15 pt-5">
					<span className={MONO_LABEL}>Index</span>
					<span className={`${MONO_LABEL} tabular-nums`}>
						{String(projects.length).padStart(2, "0")} Projects
					</span>
				</div>

				<ul className="mt-16 md:mt-20 lg:mt-24 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14 lg:gap-x-6 lg:gap-y-20">
					{projects.map((project, index) => (
						<li key={project._id ?? project.slug} className="work-card">
							<WorkCard project={project} index={index} />
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

function WorkCard({ project, index }: { project: Project; index: number }) {
	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group block focus-visible:outline-none"
			aria-label={`${project.title} — ${project.category}`}
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/[0.04]">
				<Image
					src={project.image}
					alt=""
					fill
					priority={index < 3}
					sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 50vw"
					className="size-full object-cover transition-[filter,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
				/>

				<div
					aria-hidden
					className="absolute inset-x-0 bottom-0 flex items-end p-4 md:p-5 opacity-0 translate-y-2 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
					style={{
						background:
							"linear-gradient(to top, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0) 70%)",
					}}
				>
					<div className="flex w-full items-end justify-between gap-4 text-white">
						<div className="flex flex-col gap-1">
							<span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70 tabular-nums">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span className="text-lg md:text-xl font-medium leading-tight tracking-[-0.01em]">
								{project.title}
							</span>
						</div>
						<span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70 tabular-nums shrink-0">
							{project.year}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
