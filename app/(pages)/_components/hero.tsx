"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useTempus } from "tempus/react";
import { Splitter } from "~/components/splitter";
import { withMotion } from "~/libs/gsap/presets";

interface HeroProps {
	videoUrl?: string;
}

// Satoshi stylistic alternates (ss01–ss06) applied per character, matching the
// reference title. Each array is keyed by non-space character order in its line.
const TOP_LINE_FEATURES = [
	undefined,
	"ss02",
	undefined,
	undefined,
	"ss06",
	undefined,
	"ss05",
	undefined,
	undefined,
	"ss05",
];
const BOTTOM_LINE_FEATURES = [
	undefined,
	"ss04",
	undefined,
	undefined,
	undefined,
	"ss01",
	undefined,
	"ss06",
	undefined,
];

const HERO_MAX_WIDTH = 1440;
const HERO_SIDE_PADDING = 48;
const PARALLAX_X = 14;
const PARALLAX_Y = 10;

export function Hero({ videoUrl = "/hero.mp4" }: HeroProps) {
	const containerRef = useRef<HTMLElement>(null);
	const scrollActiveRef = useRef(false);
	const quickXRef = useRef<gsap.QuickToFunc | null>(null);
	const quickYRef = useRef<gsap.QuickToFunc | null>(null);
	const mouseRef = useRef({ x: 0, y: 0 });

	useGSAP(
		(_context, contextSafe) =>
			withMotion(() => {
				const root = containerRef.current;
				if (!(root && contextSafe)) return;

				const lineClips = root.querySelectorAll<HTMLElement>(".hero-line-clip");
				const chars = root.querySelectorAll<HTMLElement>(".split-char");
				const float = root.querySelector<HTMLElement>(".hero-float");
				const stage = root.querySelector<HTMLElement>(".hero-stage");
				const video = root.querySelector<HTMLElement>(".hero-video");
				const frame = root.querySelector<HTMLElement>(".echo-frame");
				const pink = root.querySelector<HTMLElement>(".echo-pink");
				const purple = root.querySelector<HTMLElement>(".echo-purple");
				if (!(float && stage && video && frame && pink && purple)) return;

				const topClip = lineClips[0];
				const bottomClip = lineClips[1];

				// The resting DOM is already visible (no inline hiding), so a
				// JS/animation failure degrades to static text rather than a blank
				// hero. useGSAP applies these `from` start states before paint.
				const intro = gsap.timeline({
					defaults: { ease: "expo.out", duration: 0.9 },
				});
				intro
					.from(
						chars,
						{
							yPercent: 120,
							autoAlpha: 0,
							stagger: 0.035,
						},
						0,
					)
					.from(float, { autoAlpha: 0, y: 18 }, 0.15);

				const idleFloat = gsap.to(float, {
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

				const isDesktop = window.matchMedia("(min-width: 768px)").matches;
				if (!isDesktop) return cleanupListeners;

				// The inner <video> carries its own rounded corners; if we only
				// square the wrapper, the video's corners stay rounded and get
				// stretched into ellipses by the non-uniform scale.
				const videoInner = video.querySelector<HTMLElement>("video");
				const radiusTargets = videoInner ? [video, videoInner] : [video];

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
								gsap.to(float, {
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
					// Echo cards drop away immediately.
					.to(
						[frame, pink, purple],
						{ autoAlpha: 0, duration: 0.15, ease: "power2.in" },
						0,
					)
					// Headlines clear early so they never fight the expanding card.
					.to(
						[topClip, bottomClip],
						{ autoAlpha: 0, y: -24, duration: 0.28, ease: "power2.in" },
						0.04,
					)
					// Square corners + drop the shadow up front, while the card is
					// still small, so the non-uniform scale can't smear either.
					.to(
						radiusTargets,
						{ borderRadius: 0, duration: 0.3, ease: "power2.out" },
						0,
					)
					.to(
						video,
						{
							boxShadow:
								"0px 0px 0px 0px rgba(0,0,0,0), 0px 0px 0px 0px rgba(0,0,0,0)",
							duration: 0.3,
							ease: "power1.out",
						},
						0,
					)
					// Settle rotation and grow to a framed fullscreen across the scroll.
					.to(video, { rotation: 0, ease: "power2.inOut", duration: 1 }, 0)
					.to(
						float,
						{
							scaleX: () => {
								const target = Math.min(
									window.innerWidth - HERO_SIDE_PADDING,
									HERO_MAX_WIDTH,
								);
								return target / float.offsetWidth;
							},
							scaleY: () => {
								const targetWidth = Math.min(
									window.innerWidth - HERO_SIDE_PADDING,
									HERO_MAX_WIDTH,
								);
								const targetHeight = Math.min(
									window.innerHeight - 96,
									(targetWidth * 9) / 16,
								);
								return targetHeight / float.offsetHeight;
							},
							transformOrigin: "50% 50%",
							ease: "power2.inOut",
							duration: 1,
						},
						0,
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
			<h1
				aria-label="We're built different"
				className="hero-display absolute inset-0 z-10 text-center font-black uppercase leading-[0.86] tracking-[-0.04em] text-foreground text-[clamp(2rem,8vw,7.5rem)]"
			>
				<span
					aria-hidden
					className="hero-line-clip absolute top-[var(--site-header-height,3.875rem)] left-0 right-0 px-3 md:px-6 block overflow-hidden pb-[0.06em]"
				>
					<Splitter
						text="WE'RE BUILT"
						features={TOP_LINE_FEATURES}
						className="hero-line block whitespace-nowrap"
					/>
				</span>

				<span
					aria-hidden
					className="hero-line-clip absolute bottom-3 md:bottom-6 left-0 right-0 px-3 md:px-6 block overflow-hidden pb-[0.06em]"
				>
					<Splitter
						text="DIFFERENT"
						startIndex={10}
						features={BOTTOM_LINE_FEATURES}
						className="hero-line block whitespace-nowrap"
					/>
				</span>
			</h1>

			<div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
				<div className="hero-float relative w-[44vw] sm:w-[34vw] md:w-[26vw] lg:w-[22vw] max-w-[360px] aspect-[3/4] origin-center will-change-transform">
					<div className="hero-stage absolute inset-0 will-change-transform">
						<span
							aria-hidden
							className="echo-frame pointer-events-none absolute inset-0 rounded-md md:rounded-xl border border-foreground/15"
							style={{
								transform: "translate(-9%, -8%) rotate(5deg) scale(1.04)",
								zIndex: 0,
							}}
						/>
						<span
							aria-hidden
							className="echo-pink pointer-events-none absolute inset-0 rounded-md md:rounded-xl bg-[#f8a9c8]"
							style={{
								transform: "translate(8%, -7%) rotate(8deg)",
								zIndex: 1,
							}}
						/>
						<span
							aria-hidden
							className="echo-purple pointer-events-none absolute inset-0 rounded-md md:rounded-xl bg-[#a892ff]"
							style={{
								transform: "translate(-7%, 9%) rotate(-9deg)",
								zIndex: 2,
							}}
						/>
						<div
							className="hero-video relative size-full will-change-transform"
							style={{
								zIndex: 3,
								transform: "rotate(-3deg)",
								boxShadow:
									"0 30px 60px -20px rgba(0,0,0,0.55), 0 12px 24px -12px rgba(0,0,0,0.35)",
							}}
						>
							<video
								autoPlay
								loop
								muted
								playsInline
								suppressHydrationWarning
								className="block size-full rounded-md md:rounded-xl object-cover [backface-visibility:hidden]"
							>
								<source src={videoUrl} type="video/mp4" />
							</video>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
