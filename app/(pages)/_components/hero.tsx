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

const TILE_W = 640;
const TILE_H = 760;

function tileSrc(src: string, hotspot?: { x: number; y: number }): string {
	if (!src.includes("cdn.sanity.io")) return src;
	const sep = src.includes("?") ? "&" : "?";
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

function collectPool(projects: Project[]): TileImage[] {
	const posterProject =
		projects.find((p) => /poster/i.test(p.title)) ??
		projects.find((p) => (p.gallery?.length ?? 0) > 0);

	if (posterProject) {
		const pool: TileImage[] = [];
		if (isUsable(posterProject.image)) {
			pool.push({
				src: posterProject.image,
				hotspot: posterProject.imageHotspot,
			});
		}
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
	preload("/hero-poster.webp", { as: "image", fetchPriority: "high" });

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

				const intro = gsap.timeline({
					defaults: { ease: "expo.out", duration: 0.9 },
				});
				const isDesktop = window.matchMedia("(min-width: 768px)").matches;
				if (isDesktop) {
					intro.from(float, { autoAlpha: 0, scale: 0.96, duration: 1.1 }, 0);
				}

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

				const cellCenter = (el: HTMLElement) => ({
					x: grid.offsetLeft + el.offsetLeft + el.offsetWidth / 2,
					y: grid.offsetTop + el.offsetTop + el.offsetHeight / 2,
				});

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
			<h1 className="sr-only">
				Untab Studio — software studio in Warsaw building brand-led websites,
				platforms, and digital products
			</h1>
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
