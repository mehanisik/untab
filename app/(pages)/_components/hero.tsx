"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { useTempus } from "tempus/react";
import { Image } from "~/components/ui/image";
import { withMotion } from "~/libs/gsap/presets";
import { projectCardImage } from "~/libs/project-media";
import type { Project } from "~/libs/projects";

interface HeroProps {
	videoUrl?: string;
	projects?: Project[];
}

const PARALLAX_X = 14;
const PARALLAX_Y = 10;

// Masonry wall on a 5-column × 12-row grid. Each tile spans a VARYING number of
// rows (3–5) so column heights stagger like a deuxhuithuit poster wall instead
// of a uniform mosaic. Every column packs top-to-bottom (rows 1→13, bleeding one
// past the bottom edge). The center cell (col 3, rows 5–8) is reserved: the hero
// video settles there and stays the centerpiece. Cells are ordered by distance
// from the center so the scroll stagger blooms outward.
const TILE_CELLS = [
	{ col: 3, rowStart: 1, span: 4 },
	{ col: 3, rowStart: 9, span: 5 },
	{ col: 2, rowStart: 5, span: 5 },
	{ col: 4, rowStart: 6, span: 3 },
	{ col: 2, rowStart: 1, span: 4 },
	{ col: 4, rowStart: 1, span: 5 },
	{ col: 2, rowStart: 10, span: 4 },
	{ col: 4, rowStart: 9, span: 5 },
	{ col: 1, rowStart: 6, span: 4 },
	{ col: 5, rowStart: 5, span: 4 },
	{ col: 1, rowStart: 1, span: 5 },
	{ col: 5, rowStart: 1, span: 4 },
	{ col: 1, rowStart: 10, span: 4 },
	{ col: 5, rowStart: 9, span: 5 },
] as const;

// Tile rendition: ~280px rendered width at 2x retina, 5:6 portrait like the
// grid cells. Sanity's image CDN crops server-side (focal point or entropy),
// so each poster arrives already framed for the portrait tile instead of being
// blindly object-cover cropped, and nobody downloads a 4000px original.
const TILE_W = 640;
const TILE_H = 760;

function tileSrc(src: string, hotspot?: { x: number; y: number }): string {
	if (!src.includes("cdn.sanity.io")) return src;
	const sep = src.includes("?") ? "&" : "?";
	// Honour the focal point an editor set in Sanity Studio; otherwise let the
	// CDN pick the most detailed region instead of a blind centre crop, so a
	// landscape cover keeps its subject when squeezed into a 5:6 portrait tile.
	const crop = hotspot
		? `crop=focalpoint&fp-x=${hotspot.x}&fp-y=${hotspot.y}`
		: "crop=entropy";
	return `${src}${sep}w=${TILE_W}&h=${TILE_H}&fit=crop&${crop}&auto=format&q=90`;
}

interface TileImage {
	src: string;
	hotspot?: { x: number; y: number };
}

const isUsable = (src: string | undefined): src is string =>
	Boolean(src) && !src?.endsWith("placeholder.png");

// The hero is a poster wall, so it wants portrait art that fills a 5:6 tile
// without a brutal crop. The Poster Series project is exactly that — a set of
// purpose-made posters — so its cover + gallery feed the wall directly. We
// fall back to one cover per project (deduped) and finally to seeded picsum
// mocks so the mosaic always renders even before the CMS has real imagery.
function collectPool(projects: Project[]): TileImage[] {
	const posterProject =
		projects.find((p) => /poster/i.test(p.title)) ??
		// No dedicated poster set — use whichever project actually has gallery art.
		projects.find((p) => (p.gallery?.length ?? 0) > 0);

	if (posterProject) {
		const pool: TileImage[] = [];
		if (isUsable(posterProject.image)) {
			pool.push({
				src: posterProject.image,
				hotspot: posterProject.imageHotspot,
			});
		}
		// Gallery shots come back as plain URLs (no hotspot); these posters are
		// already portrait, so an entropy crop barely trims them.
		for (const src of posterProject.gallery ?? []) {
			if (isUsable(src)) pool.push({ src });
		}
		if (pool.length > 0) return pool;
	}

	const seen = new Set<string>();
	return projects
		.map((p) => ({
			src: projectCardImage(p),
			hotspot: p.cardImageHotspot ?? p.imageHotspot,
		}))
		.filter((p) => isUsable(p.src) && !seen.has(p.src) && seen.add(p.src));
}

function collectTileImages(projects: Project[] | undefined): string[] {
	const pool = collectPool(projects ?? []);
	if (pool.length === 0) {
		return TILE_CELLS.map(
			(_, i) =>
				`https://picsum.photos/seed/untab-work-${i}/${TILE_W}/${TILE_H}`,
		);
	}
	return TILE_CELLS.map((_, i) => {
		const img = pool[i % pool.length];
		return img ? tileSrc(img.src, img.hotspot) : "";
	});
}

export function Hero({ videoUrl = "/hero.mp4", projects }: HeroProps) {
	// The video's poster IS the LCP element, but browsers fetch poster images
	// at low priority — on throttled mobile it queued ~3.5s behind JS chunks.
	// Preloading it at high priority moves the LCP paint next to FCP.
	preload("/hero-poster.webp", { as: "image", fetchPriority: "high" });

	// `autoplay` makes the browser pull the whole ~1.3MB video the moment the
	// element appears, and that download lands in the LCP critical chain on
	// slow connections (it also dominates Lighthouse's mobile simulation).
	// Attach the src only after `window.load`: the preloaded poster fills the
	// stage instantly and the intro overlay covers the first moments anyway,
	// so the later start is invisible - the video simply fades from poster to
	// motion once the page is settled.
	const [videoSrc, setVideoSrc] = useState<string | null>(null);
	useEffect(() => {
		const attach = () => setVideoSrc(videoUrl);
		if (document.readyState === "complete") {
			attach();
			return;
		}
		window.addEventListener("load", attach, { once: true });
		return () => window.removeEventListener("load", attach);
	}, [videoUrl]);

	const containerRef = useRef<HTMLElement>(null);
	const scrollActiveRef = useRef(false);
	const quickXRef = useRef<gsap.QuickToFunc | null>(null);
	const quickYRef = useRef<gsap.QuickToFunc | null>(null);
	const mouseRef = useRef({ x: 0, y: 0 });

	const tileImages = collectTileImages(projects);

	useGSAP(
		(_context, contextSafe) =>
			withMotion(() => {
				const root = containerRef.current;
				if (!(root && contextSafe)) return;

				const frame = root.querySelector<HTMLElement>(".hero-frame");
				const float = root.querySelector<HTMLElement>(".hero-float");
				const bob = root.querySelector<HTMLElement>(".hero-bob");
				const stage = root.querySelector<HTMLElement>(".hero-stage");
				if (!(frame && float && bob && stage)) return;

				// The resting DOM is already visible (no inline hiding), so a
				// JS/animation failure degrades to static text rather than a blank
				// hero. useGSAP applies these `from` start states before paint.
				const intro = gsap.timeline({
					defaults: { ease: "expo.out", duration: 0.9 },
				});
				// The fade-in `from` hides the poster (the LCP element) until
				// hydration + tween completes - on a throttled phone that pushes
				// LCP past 3.5s. Mobile gets no scroll scrub either, so keep the
				// entrance flourish desktop-only and let the poster paint straight
				// from the server HTML on phones.
				const isDesktop = window.matchMedia("(min-width: 768px)").matches;
				if (isDesktop) {
					intro.from(float, { autoAlpha: 0, scale: 0.96, duration: 1.1 }, 0);
				}

				// The bob lives on its own wrapper so it never shares a transform
				// with the scroll scrub, which exclusively owns .hero-float. A
				// shared `y` would let the onEnter reset overwrite the scrub's
				// landing tween and drop the card out of its grid slot.
				const idleFloat = gsap.to(bob, {
					y: 6,
					duration: 3.4,
					ease: "sine.inOut",
					yoyo: true,
					repeat: -1,
					paused: true,
				});
				intro.call(
					() => {
						idleFloat.play();
					},
					undefined,
					">-0.2",
				);

				quickXRef.current = gsap.quickTo(stage, "x", {
					duration: 0.9,
					ease: "power3.out",
				});
				quickYRef.current = gsap.quickTo(stage, "y", {
					duration: 0.9,
					ease: "power3.out",
				});

				const onMove = contextSafe((e: MouseEvent) => {
					const rect = root.getBoundingClientRect();
					mouseRef.current.x = (e.clientX - rect.left) / rect.width - 0.5;
					mouseRef.current.y = (e.clientY - rect.top) / rect.height - 0.5;
				});

				const onLeave = contextSafe(() => {
					mouseRef.current.x = 0;
					mouseRef.current.y = 0;
				});

				root.addEventListener("mousemove", onMove);
				root.addEventListener("mouseleave", onLeave);

				const cleanupListeners = () => {
					root.removeEventListener("mousemove", onMove);
					root.removeEventListener("mouseleave", onLeave);
					quickXRef.current = null;
					quickYRef.current = null;
				};

				if (!isDesktop) return cleanupListeners;

				const grid = root.querySelector<HTMLElement>(".hero-grid");
				const centerCell = root.querySelector<HTMLElement>(".hero-grid-center");
				const tiles = root.querySelectorAll<HTMLElement>(".hero-tile");
				if (!(grid && centerCell && tiles.length)) return cleanupListeners;

				// Untransformed center of a grid cell in hero coordinates. Built on
				// offset* (which ignores transforms) so invalidateOnRefresh can safely
				// re-measure mid-animation on resize.
				const cellCenter = (el: HTMLElement) => ({
					x: grid.offsetLeft + el.offsetLeft + el.offsetWidth / 2,
					y: grid.offsetTop + el.offsetTop + el.offsetHeight / 2,
				});

				// Untransformed center of the poster. The frame flex-centers the
				// float inside its padded box, so this stays constant even while
				// the width/height tween below is mid-flight on a refresh.
				const floatCenter = () => ({
					x: frame.offsetLeft + float.offsetLeft + float.offsetWidth / 2,
					y: frame.offsetTop + float.offsetTop + float.offsetHeight / 2,
				});

				gsap
					.timeline({
						scrollTrigger: {
							trigger: root,
							start: "top top",
							end: "+=120%",
							pin: true,
							pinSpacing: true,
							scrub: 1,
							anticipatePin: 1,
							invalidateOnRefresh: true,
							onEnter: () => {
								scrollActiveRef.current = true;
								idleFloat.pause();
								gsap.to(bob, {
									y: 0,
									duration: 0.4,
									overwrite: "auto",
								});
								gsap.to(stage, {
									x: 0,
									y: 0,
									duration: 0.4,
									overwrite: "auto",
								});
							},
							onLeaveBack: () => {
								scrollActiveRef.current = false;
								idleFloat.play();
							},
						},
					})
					// The big poster shrinks into its reserved slot and STAYS the
					// centerpiece of the wall. Width/height (not scale) so the rounded
					// corners never smear under a non-uniform transform.
					.to(
						float,
						{
							width: () => centerCell.offsetWidth,
							height: () => centerCell.offsetHeight,
							x: () => cellCenter(centerCell).x - floatCenter().x,
							y: () => cellCenter(centerCell).y - floatCenter().y,
							ease: "power2.inOut",
							duration: 1,
						},
						0,
					)
					// Tiles bloom outward from behind the poster into the wall.
					.fromTo(
						tiles,
						{
							x: (_i: number, el: Element) =>
								root.offsetWidth / 2 - cellCenter(el as HTMLElement).x,
							y: (_i: number, el: Element) =>
								root.offsetHeight / 2 - cellCenter(el as HTMLElement).y,
							scale: 0.2,
							autoAlpha: 0,
						},
						{
							x: 0,
							y: 0,
							scale: 1,
							autoAlpha: 1,
							duration: 0.8,
							ease: "power3.inOut",
							stagger: 0.04,
						},
						0.1,
					);

				return cleanupListeners;
			}),
		{ scope: containerRef },
	);

	useTempus(() => {
		if (scrollActiveRef.current) return;
		const qx = quickXRef.current;
		const qy = quickYRef.current;
		if (!(qx && qy)) return;
		qx(mouseRef.current.x * PARALLAX_X);
		qy(mouseRef.current.y * PARALLAX_Y);
	});

	return (
		<section
			ref={containerRef}
			className="home-hero relative w-full overflow-hidden bg-background h-dvh"
		>
			{/* The hero is visual (poster wall + video), so the page's top-level
			    heading is screen-reader-only for SEO/a11y. */}
			<h1 className="sr-only">
				Untab Studio — software studio in Warsaw building brand-led websites,
				platforms, and digital products
			</h1>
			{/* Poster-wall mosaic: hidden at rest, bloomed open by the scroll scrub.
			    Bleeds past the top/bottom edges like an endless wall of work. */}
			<div
				aria-hidden
				className="hero-grid pointer-events-none absolute inset-x-0 -inset-y-10 z-15 hidden gap-3 px-6 md:grid md:px-12 grid-cols-5 grid-rows-12 lg:gap-4 lg:px-24"
			>
				{TILE_CELLS.map((cell, i) => {
					const src = tileImages[i];
					return (
						<div
							key={`${cell.col}-${cell.rowStart}`}
							className="hero-tile relative overflow-hidden rounded-md bg-muted opacity-0 will-change-transform md:rounded-xl"
							style={{
								gridColumn: cell.col,
								gridRow: `${cell.rowStart} / span ${cell.span}`,
							}}
						>
							{src ? (
								<Image
									src={src}
									alt=""
									fill
									sizes="(max-width: 768px) 45vw, 20vw"
									aspectRatio={TILE_W / TILE_H}
									className="object-cover"
								/>
							) : null}
						</div>
					);
				})}
				<div
					className="hero-grid-center"
					style={{ gridColumn: 3, gridRow: "5 / span 4" }}
				/>
			</div>

			{/* One big video poster aligned with the site container (the same
			    container + px rails as every other section). On scroll it
			    shrinks into the reserved center cell of the mosaic. */}
			<div className="hero-frame absolute inset-0 z-20 pointer-events-none pt-[calc(var(--site-header-height,3.875rem)+0.75rem)] pb-4 md:pb-6">
				<div className="container flex size-full items-center justify-center px-6 md:px-12 lg:px-24">
					<div className="hero-float relative size-full will-change-transform">
						<div className="hero-bob absolute inset-0 will-change-transform">
							<div className="hero-stage absolute inset-0 will-change-transform">
								<video
									autoPlay
									loop
									muted
									playsInline
									preload="none"
									poster="/hero-poster.webp"
									src={videoSrc ?? undefined}
									suppressHydrationWarning
									className="block size-full rounded-md md:rounded-xl object-contain md:object-cover backface-hidden"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
