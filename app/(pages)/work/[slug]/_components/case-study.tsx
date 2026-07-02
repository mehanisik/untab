"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { REVEAL } from "~/libs/gsap/presets";
import type { Project } from "~/libs/projects";

const PAGE_PADDING = "px-6 md:px-12 lg:px-24";

interface CaseStudyProps {
	study: Project;
}

export function CaseStudy({ study }: CaseStudyProps) {
	const rootRef = useRef<HTMLElement>(null);
	const mediaRef = useRef<HTMLUListElement>(null);
	const asideRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add(
				{
					isDesktop: "(min-width: 1024px)",
					isTablet: "(min-width: 768px) and (max-width: 1023px)",
					isMobile: "(max-width: 767px)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(ctx) => {
					const { isDesktop, isMobile, reduced } = ctx.conditions as {
						isDesktop: boolean;
						isTablet: boolean;
						isMobile: boolean;
						reduced: boolean;
					};

					if (reduced) return;

					const headline =
						asideRef.current?.querySelector<HTMLElement>(".cs-headline");
					if (headline) {
						gsap.from(headline, {
							y: 36,
							opacity: 0,
							duration: 1,
							ease: REVEAL.ease,
						});
					}

					const asideBlocks =
						asideRef.current?.querySelectorAll<HTMLElement>(".cs-aside");
					if (asideBlocks?.length) {
						gsap.from(asideBlocks, {
							y: 24,
							opacity: 0,
							duration: 0.8,
							ease: REVEAL.ease,
							stagger: 0.08,
							delay: 0.15,
						});
					}

					const items =
						mediaRef.current?.querySelectorAll<HTMLElement>(".cs-media");
					if (!items?.length) return;

					items.forEach((item, i) => {
						gsap.fromTo(
							item,
							{ opacity: 0, y: isMobile ? 24 : 48 },
							{
								opacity: 1,
								y: 0,
								duration: 1,
								ease: REVEAL.ease,
								delay: i === 0 ? 0 : 0,
								scrollTrigger: {
									trigger: item,
									start: i === 0 ? "top 100%" : "top 90%",
									toggleActions: "play none none none",
								},
							},
						);

						if (isDesktop) {
							const img = item.querySelector<HTMLElement>(".cs-media-img");
							if (img) {
								gsap.fromTo(
									img,
									{ scale: 1.1 },
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
						}
					});
				},
			);

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			className="w-full pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 sm:pb-24 md:pb-32"
			aria-label={`${study.title} case study`}
		>
			<div className={`container ${PAGE_PADDING}`}>
				<div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:gap-y-12 lg:grid-cols-[1.35fr_1fr] lg:gap-x-14 xl:gap-x-20">
					<div className="min-w-0 order-2 lg:order-1">
						<ul ref={mediaRef} className="flex flex-col gap-3 md:gap-4">
							{(study.media ?? []).map((item, index) => (
								<li key={`${item.kind}-${item.src}`} className="cs-media">
									{item.kind === "image" ? (
										<div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/[0.04]">
											<Image
												src={item.src}
												alt={item.alt ?? ""}
												fill
												priority={index === 0}
												sizes="(min-width: 1024px) 58vw, 100vw"
												className="cs-media-img size-full object-cover will-change-transform"
											/>
										</div>
									) : (
										<video
											className="cs-media-img block aspect-[4/3] w-full bg-foreground/[0.04] object-cover"
											src={item.src}
											poster={item.poster}
											controls
											playsInline
											preload="metadata"
										>
											<track kind="captions" />
										</video>
									)}
								</li>
							))}
						</ul>
					</div>

					<aside
						ref={asideRef}
						className="min-w-0 order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start"
					>
						<h1 className="cs-headline text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.92] tracking-[-0.035em] text-foreground">
							{study.title}
						</h1>

						{study.about?.length ? (
							<div className="cs-aside mt-8 sm:mt-10 md:mt-14">
								<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
									About
								</p>
								<div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4 text-[14px] md:text-[15px] leading-[1.6] text-foreground/80">
									{study.about.map((paragraph) => (
										<p key={paragraph} className="text-pretty">
											{paragraph}
										</p>
									))}
								</div>
							</div>
						) : null}

						<dl className="cs-aside mt-10 sm:mt-12 grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
							<MetaBlock label="Type" value={study.category} />
							<MetaBlock label="Date" value={formatYear(study.year)} />
							{study.services?.length ? (
								<MetaBlock label="Services" value={study.services.join(", ")} />
							) : null}
							{study.timeline ? (
								<MetaBlock label="Timeline" value={study.timeline} />
							) : null}
							{study.honors?.length ? (
								<MetaList label="Honor" items={study.honors} />
							) : null}
							{study.stack?.length ? (
								<MetaList label="Stack" items={study.stack} />
							) : null}
						</dl>

						{study.visitUrl ? (
							<a
								href={study.visitUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="cs-aside mt-10 sm:mt-12 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
							>
								Visit Site
								<span aria-hidden>→</span>
							</a>
						) : null}
					</aside>
				</div>
			</div>
		</section>
	);
}

function MetaBlock({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
				{label}
			</dt>
			<dd className="mt-2 sm:mt-3 text-[14px] sm:text-[15px] md:text-base font-medium text-foreground">
				{value}
			</dd>
		</div>
	);
}

function MetaList({ label, items }: { label: string; items: string[] }) {
	return (
		<div>
			<dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
				{label}
			</dt>
			<dd className="mt-2 sm:mt-3 flex flex-col gap-1.5 text-[14px] sm:text-[15px] md:text-base font-medium text-foreground">
				{items.map((item) => (
					<span key={item}>{item}</span>
				))}
			</dd>
		</div>
	);
}

function formatYear(year: string) {
	if (/^\d{4}$/.test(year)) return `January ${year}`;
	return year;
}
