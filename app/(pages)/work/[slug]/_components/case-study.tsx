"use client";

import { useGSAP } from "@gsap/react";
import cn from "clsx";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { REVEAL } from "~/libs/gsap/presets";
import type { MediaItem, Project } from "~/libs/projects";

const PAGE_PADDING = "px-6 md:px-12 lg:px-24";

// Assumed ratio when a source has no parseable dimensions (local fallbacks).
const DEFAULT_ASPECT = 16 / 10;
// Anything wider than this reads as a banner and gets its own full row.
const ULTRAWIDE = 2.4;
// Taller-than-this reads as a phone shot / poster and prefers grouped rows.
const PORTRAIT = 0.9;
// Don't pair shots whose ratios differ too much — the narrower one would
// collapse to a sliver in a justified row.
const MAX_PAIR_RATIO = 2.2;
// Triples want a near-even look, so keep their ratio spread tighter.
const MAX_TRIPLE_RATIO = 1.6;

interface CaseStudyProps {
	study: Project;
}

type MediaRow = { key: string; items: MediaItem[] };

const aspectOf = (item: MediaItem) => item.aspect || DEFAULT_ASPECT;
const isImage = (item: MediaItem | undefined): item is MediaItem =>
	item?.kind === "image";
const isPortrait = (item: MediaItem) => aspectOf(item) < PORTRAIT;

const spread = (items: MediaItem[]) => {
	const ratios = items.map(aspectOf);
	return Math.max(...ratios) / Math.min(...ratios);
};

/**
 * Compose the media column into editorial rows that survive any count:
 * a landscape hero gets a full-width row, videos and ultra-wide banners get
 * their own row, runs of portraits (phone shots, posters) group three-up,
 * and remaining compatible neighbours justify into pairs sharing a row
 * height at native ratios — no cropping anywhere. 1 image → one clean hero.
 */
function buildRows(media: MediaItem[]): MediaRow[] {
	const rows: MediaRow[] = [];
	let i = 0;
	while (i < media.length) {
		const item = media[i];
		if (!item) break;
		const next = media[i + 1];
		const third = media[i + 2];

		const groupable = (m: MediaItem | undefined): m is MediaItem =>
			isImage(m) && aspectOf(m) <= ULTRAWIDE;
		// The hero leads solo unless it's a portrait — two phone shots side by
		// side open better than one tower-tall full-width image.
		const soloRow = !groupable(item) || (i === 0 && !isPortrait(item));

		if (!soloRow && groupable(next)) {
			const triple = [item, next, third];
			if (
				groupable(third) &&
				triple.every((m) => m && isPortrait(m)) &&
				spread([item, next, third as MediaItem]) <= MAX_TRIPLE_RATIO
			) {
				rows.push({
					key: `${item.src}+${next.src}+${(third as MediaItem).src}`,
					items: [item, next, third as MediaItem],
				});
				i += 3;
				continue;
			}
			if (spread([item, next]) <= MAX_PAIR_RATIO) {
				rows.push({ key: `${item.src}+${next.src}`, items: [item, next] });
				i += 2;
				continue;
			}
		}

		rows.push({ key: item.src, items: [item] });
		i += 1;
	}
	return rows;
}

export function CaseStudy({ study }: CaseStudyProps) {
	const rootRef = useRef<HTMLElement>(null);
	const mediaRef = useRef<HTMLUListElement>(null);
	const asideRef = useRef<HTMLElement>(null);

	const rows = buildRows(study.media ?? []);

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
								scrollTrigger: {
									trigger: item,
									start: i === 0 ? "top 100%" : "top 90%",
									toggleActions: "play reverse play reverse",
								},
							},
						);

						if (isDesktop) {
							for (const img of item.querySelectorAll<HTMLElement>(
								".cs-media-img",
							)) {
								gsap.fromTo(
									img,
									{ scale: 1.06 },
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
				{/* Compact editorial header: title full width, then about + meta
				    side by side. The gallery below gets the whole container, so
				    no half-empty sticky rail next to a long media column. */}
				<header ref={asideRef}>
					<h1 className="cs-headline text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[0.92] tracking-[-0.035em] text-foreground">
						{study.title}
					</h1>

					<div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-[1.35fr_1fr] lg:gap-x-14 xl:gap-x-20">
						{study.about?.length ? (
							<div className="cs-aside min-w-0">
								<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
									About
								</p>
								<div className="mt-3 sm:mt-4 flex max-w-[62ch] flex-col gap-3 sm:gap-4 text-[14px] md:text-[15px] leading-[1.6] text-foreground/80">
									{study.about.map((paragraph) => (
										<p key={paragraph} className="text-pretty">
											{paragraph}
										</p>
									))}
								</div>
							</div>
						) : null}

						<div className="cs-aside min-w-0">
							<dl className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
								<MetaBlock label="Type" value={study.category} />
								<MetaBlock label="Date" value={formatYear(study.year)} />
								{study.services?.length ? (
									<MetaBlock
										label="Services"
										value={study.services.join(", ")}
									/>
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
									className="mt-10 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
								>
									Visit Site
									<span aria-hidden>→</span>
								</a>
							) : null}
						</div>
					</div>
				</header>

				<ul
					ref={mediaRef}
					className="mt-12 sm:mt-16 md:mt-20 flex flex-col gap-3 md:gap-4"
				>
					{rows.map((row, rowIndex) => (
						<li key={row.key} className="cs-media">
							{/* Grouped rows justify: each cell's width grows with its
							    aspect ratio, so all images share the exact row height
							    at their native ratios — no cropping. Groups stay
							    side-by-side on mobile too (portrait shots read fine
							    at half/third width); solo rows span full width. */}
							<div className="flex gap-3 md:gap-4">
								{row.items.map((item, itemIndex) => (
									<MediaCell
										key={item.src}
										item={item}
										groupSize={row.items.length}
										preload={rowIndex === 0 && itemIndex === 0}
									/>
								))}
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

// The gallery spans the container (viewport minus page padding).
const CELL_SIZES: Record<number, string> = {
	1: "95vw",
	2: "48vw",
	3: "32vw",
};

function MediaCell({
	item,
	groupSize,
	preload,
}: {
	item: MediaItem;
	groupSize: number;
	preload: boolean;
}) {
	const aspect = aspectOf(item);
	const grouped = groupSize > 1;
	// In a justified row each cell's flex-grow equals its aspect ratio, so
	// widths distribute to equalize height. Solo cells fill the row — except
	// solo portraits, which cap and center so a phone shot never towers.
	const cellStyle = grouped
		? { flexGrow: aspect, flexBasis: 0, minWidth: 0 }
		: undefined;
	const soloPortrait = !grouped && isPortrait(item);
	const sizes = CELL_SIZES[groupSize] ?? CELL_SIZES[1];

	return (
		<div
			style={cellStyle}
			className={cn(
				"w-full",
				soloPortrait && "mx-auto max-w-[70%] md:max-w-[44%]",
			)}
		>
			{item.kind === "image" ? (
				<div
					className="relative w-full overflow-hidden bg-foreground/[0.04]"
					style={{ aspectRatio: aspect }}
				>
					<Image
						src={item.src}
						alt={item.alt ?? ""}
						fill
						preload={preload}
						sizes={sizes}
						className="cs-media-img size-full object-cover will-change-transform"
					/>
				</div>
			) : (
				<video
					className="cs-media-img block w-full bg-foreground/[0.04] object-cover"
					style={{ aspectRatio: item.aspect || DEFAULT_ASPECT }}
					src={item.src}
					poster={item.poster}
					controls
					playsInline
					preload="metadata"
				>
					<track kind="captions" />
				</video>
			)}
		</div>
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
