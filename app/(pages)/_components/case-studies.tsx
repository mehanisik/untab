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

	const featured = projects.slice(0, 5);

	return (
		<section
			ref={sectionRef}
			id="work"
			className="featured-section relative w-full bg-background"
		>
			<div className="flex w-full flex-col">
				{featured.map((project, index) => (
					<FeaturedItem
						key={project._id ?? project.slug}
						project={project}
						index={index}
					/>
				))}
			</div>
		</section>
	);
}

function FeaturedItem({ project, index }: { project: Project; index: number }) {
	const itemRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const el = itemRef.current;
				if (!el) return;

				const inner = el.querySelector(".featured-inner") as HTMLElement | null;
				const thumb = el.querySelector(".featured-thumb");
				const titleWords = el.querySelectorAll(".featured-title-word");
				const tags = el.querySelectorAll(".featured-tag");
				const indexEl = el.querySelector(".featured-index");

				// Width scrub: card grows from narrow to full-width as it scrolls into
				// view, plateaus at full scale, then eases back down as it leaves.
				if (inner) {
					const isMobile = window.matchMedia("(max-width: 767px)").matches;
					const minScale = isMobile ? 0.8 : 0.7;
					const maxScale = isMobile ? 0.95 : 0.9;
					gsap.set(inner, { scaleX: minScale, scaleY: minScale });
					gsap.to(inner, {
						keyframes: [
							{
								scaleX: maxScale,
								scaleY: maxScale,
								duration: 0.4,
								ease: "power2.out",
							},
							{
								scaleX: maxScale,
								scaleY: maxScale,
								duration: 0.2,
								ease: "none",
							},
							{
								scaleX: minScale,
								scaleY: minScale,
								duration: 0.4,
								ease: "power2.in",
							},
						],
						scrollTrigger: {
							trigger: el,
							start: "top bottom",
							end: "bottom top",
							scrub: 1.4,
						},
					});
				}

				// Image fade-in scrubbed alongside the card growing in
				if (thumb) {
					gsap.set(thumb, { opacity: 0 });
					gsap.to(thumb, {
						opacity: 1,
						ease: "none",
						scrollTrigger: {
							trigger: el,
							start: "top 90%",
							end: "top 40%",
							scrub: true,
						},
					});
				}

				// Index number: quick fade/slide in once card is in view
				if (indexEl) {
					gsap.fromTo(
						indexEl,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.6,
							ease: "power3.out",
							scrollTrigger: {
								trigger: el,
								start: "top 70%",
								toggleActions: "play none none none",
							},
						},
					);
				}

				// Title words slide in from 50vw to the right, staggered
				if (titleWords.length) {
					gsap.fromTo(
						titleWords,
						{ x: "50vw", opacity: 0 },
						{
							x: 0,
							opacity: 1,
							duration: 1.2,
							ease: "expo.out",
							stagger: 0.08,
							scrollTrigger: {
								trigger: el,
								start: "top 70%",
								toggleActions: "play none none none",
							},
						},
					);
				}

				// Tags wipe up from below their mask, staggered
				if (tags.length) {
					gsap.fromTo(
						tags,
						{ yPercent: 120, opacity: 0 },
						{
							yPercent: 0,
							opacity: 1,
							duration: 0.8,
							ease: "expo.out",
							stagger: 0.06,
							delay: 0.25,
							scrollTrigger: {
								trigger: el,
								start: "top 70%",
								toggleActions: "play none none none",
							},
						},
					);
				}
			}),
		{ scope: itemRef },
	);

	const tags = (
		project.techStack?.length ? project.techStack : (project.tools ?? [])
	).slice(0, 5);

	const titleWords = project.title.split(" ");

	return (
		<div
			ref={itemRef}
			className="featured-element relative h-[100svh] w-full mb-8 md:mb-12 last:mb-0 overflow-hidden"
		>
			<div className="featured-inner relative size-full origin-center will-change-transform">
				<Link
					href={project.href ?? `/work/${project.slug}`}
					className="group relative block size-full overflow-hidden"
				>
					<div className="featured-thumb absolute inset-0 size-full will-change-[opacity]">
						<Image
							src={project.image}
							alt={project.title}
							fill
							priority={index === 0}
							sizes="100vw"
							className="size-full object-cover"
						/>
					</div>

					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

					<div className="featured-text absolute bottom-10 left-6 md:left-16 lg:left-32 flex w-[88%] md:w-1/2 lg:w-1/3 flex-col items-start pointer-events-none">
						<div className="featured-index text-[13px] font-medium uppercase tracking-[0.18em] text-white">
							{String(index + 1).padStart(2, "0")}
						</div>

						<h3 className="my-4 md:my-6 overflow-hidden text-[8vw] md:text-[5.5vw] leading-[1] font-extralight tracking-tight text-white font-sans">
							{titleWords.map((word, i) => (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: stable per-title order
									key={`${word}-${i}`}
									className="featured-title-word inline-block mr-[0.25em] last:mr-0 will-change-transform"
								>
									{word}
								</span>
							))}
						</h3>

						{tags.length > 0 && (
							<div className="hidden md:flex flex-col items-start gap-3">
								{tags.map((tag) => (
									<div key={tag} className="overflow-hidden">
										<div className="featured-tag inline-flex h-[30px] items-center justify-center rounded-full border-2 border-white px-3 text-[13px] font-medium uppercase tracking-wide text-white will-change-transform">
											{tag}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</Link>
			</div>
		</div>
	);
}
