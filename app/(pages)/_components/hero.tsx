"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface HeroProps {
	videoUrl?: string;
}

const ROTATING_WORDS: { text: string; color: string }[] = [
	{ text: "Software", color: "#f8a9c8" },
	{ text: "Products", color: "#a892ff" },
	{ text: "Interfaces", color: "#d8e85e" },
	{ text: "Experiences", color: "#7c8df0" },
	{ text: "Platforms", color: "#f15c7e" },
];

const HERO_MAX_WIDTH = 1440;
const HERO_SIDE_PADDING = 48;
const PARALLAX_X = 14;
const PARALLAX_Y = 10;

export function Hero({ videoUrl = "/hero.mp4" }: HeroProps) {
	const containerRef = useRef<HTMLElement>(null);
	const scrollActiveRef = useRef(false);

	useGSAP(
		(_context, contextSafe) => {
			const root = containerRef.current;
			if (!(root && contextSafe)) return;

			const lineClips = root.querySelectorAll<HTMLElement>(".hero-line-clip");
			const float = root.querySelector<HTMLElement>(".hero-float");
			const stage = root.querySelector<HTMLElement>(".hero-stage");
			const video = root.querySelector<HTMLElement>(".hero-video");
			const frame = root.querySelector<HTMLElement>(".echo-frame");
			const pink = root.querySelector<HTMLElement>(".echo-pink");
			const purple = root.querySelector<HTMLElement>(".echo-purple");
			const rotateWords =
				root.querySelectorAll<HTMLElement>(".hero-rotate-word");
			if (!(float && stage && video && frame && pink && purple)) return;

			const topClip = lineClips[0];
			const bottomClip = lineClips[1];

			const introTargets = [topClip, float, bottomClip];
			gsap.set(introTargets, { autoAlpha: 0, y: 18 });

			const intro = gsap.timeline({
				defaults: { ease: "expo.out", duration: 0.9 },
			});
			intro.to(
				introTargets,
				{
					autoAlpha: 1,
					y: 0,
					stagger: 0.12,
				},
				0,
			);

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

			const quickX = gsap.quickTo(stage, "x", {
				duration: 0.9,
				ease: "power3.out",
			});
			const quickY = gsap.quickTo(stage, "y", {
				duration: 0.9,
				ease: "power3.out",
			});

			const mouse = { x: 0, y: 0 };

			const onMove = contextSafe((e: MouseEvent) => {
				const rect = root.getBoundingClientRect();
				mouse.x = (e.clientX - rect.left) / rect.width - 0.5;
				mouse.y = (e.clientY - rect.top) / rect.height - 0.5;
			});

			const onLeave = contextSafe(() => {
				mouse.x = 0;
				mouse.y = 0;
			});

			const tick = () => {
				if (scrollActiveRef.current) return;
				quickX(mouse.x * PARALLAX_X);
				quickY(mouse.y * PARALLAX_Y);
			};

			root.addEventListener("mousemove", onMove);
			root.addEventListener("mouseleave", onLeave);
			gsap.ticker.add(tick);

			const cleanupParallax = () => {
				root.removeEventListener("mousemove", onMove);
				root.removeEventListener("mouseleave", onLeave);
				gsap.ticker.remove(tick);
			};

			if (rotateWords.length > 1) {
				gsap.set(rotateWords, {
					autoAlpha: 0,
					scale: 0.94,
					filter: "blur(14px)",
				});
				gsap.set(rotateWords[0], {
					autoAlpha: 1,
					scale: 1,
					filter: "blur(0px)",
				});

				let current = 0;
				const rotateTl = gsap.timeline({ repeat: -1, delay: 1.4 });

				for (const _ of rotateWords) {
					const out = rotateWords[current];
					const next = (current + 1) % rotateWords.length;
					const incoming = rotateWords[next];

					rotateTl
						.to(
							out,
							{
								autoAlpha: 0,
								scale: 1.08,
								filter: "blur(16px)",
								duration: 0.55,
								ease: "power2.in",
							},
							"+=2.6",
						)
						.fromTo(
							incoming,
							{ autoAlpha: 0, scale: 0.94, filter: "blur(14px)" },
							{
								autoAlpha: 1,
								scale: 1,
								filter: "blur(0px)",
								duration: 0.75,
								ease: "power2.out",
							},
							"<0.2",
						);
					current = next;
				}
			}

			const isDesktop = window.matchMedia("(min-width: 768px)").matches;
			if (!isDesktop) return cleanupParallax;

			gsap
				.timeline({
					scrollTrigger: {
						trigger: root,
						start: "top top",
						end: "+=120%",
						pin: true,
						pinSpacing: true,
						scrub: 1.2,
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
				.to(
					[frame, pink, purple],
					{ autoAlpha: 0, duration: 0.18, ease: "power2.in" },
					0,
				)
				.to(
					float,
					{
						width: () =>
							`${Math.min(window.innerWidth - HERO_SIDE_PADDING, HERO_MAX_WIDTH)}px`,
						height: () => {
							const w = Math.min(
								window.innerWidth - HERO_SIDE_PADDING,
								HERO_MAX_WIDTH,
							);
							return `${Math.min(window.innerHeight - 96, (w * 9) / 16)}px`;
						},
						maxWidth: "none",
						ease: "power2.inOut",
						duration: 1,
					},
					0,
				)
				.to(
					video,
					{
						rotation: 0,
						borderRadius: 0,
						ease: "power2.inOut",
						duration: 1,
					},
					0,
				)
				.to(
					[topClip, bottomClip],
					{ autoAlpha: 0, duration: 0.35, ease: "power2.in" },
					0.3,
				);

			return cleanupParallax;
		},
		{ scope: containerRef },
	);

	const longestWord = ROTATING_WORDS.reduce((a, b) =>
		a.text.length > b.text.length ? a : b,
	).text;

	return (
		<section
			ref={containerRef}
			className="home-hero relative w-full overflow-hidden bg-background h-dvh"
		>
			<h1 className="hero-display absolute inset-0 z-10 text-center font-black uppercase leading-[0.86] tracking-[-0.04em] text-foreground text-[clamp(2rem,8vw,7.5rem)]">
				<span
					className="hero-line-clip absolute top-[var(--site-header-height,3.875rem)] left-0 right-0 px-3 md:px-6 block overflow-hidden pb-[0.06em]"
					style={{ opacity: 0, visibility: "hidden" }}
				>
					<span className="hero-line block whitespace-nowrap">We craft</span>
				</span>

				<span
					className="hero-line-clip absolute bottom-3 md:bottom-6 left-0 right-0 px-3 md:px-6 block overflow-hidden pb-[0.06em]"
					aria-live="polite"
					style={{ opacity: 0, visibility: "hidden" }}
				>
					<span className="hero-line hero-rotate relative inline-block align-baseline">
						<span aria-hidden className="invisible block whitespace-nowrap">
							{longestWord}
						</span>
						{ROTATING_WORDS.map((word, i) => (
							<span
								key={word.text}
								className="hero-rotate-word absolute inset-x-0 top-0 block whitespace-nowrap origin-center will-change-[transform,filter,opacity]"
								style={{
									color: word.color,
									...(i === 0
										? undefined
										: { opacity: 0, visibility: "hidden" }),
								}}
							>
								{word.text}
							</span>
						))}
					</span>
				</span>
			</h1>

			<div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
				<div
					className="hero-float relative w-[44vw] sm:w-[34vw] md:w-[26vw] lg:w-[22vw] max-w-[360px] aspect-[3/4] origin-center will-change-transform"
					style={{ opacity: 0, visibility: "hidden" }}
				>
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
