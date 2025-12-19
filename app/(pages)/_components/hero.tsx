"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

export function Hero() {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline();

			gsap.set(".hero-line", { opacity: 0, y: 30 });
			gsap.set(".hero-scroll-btn", { opacity: 0, y: 20 });
			gsap.set(".hero-image-container", {
				opacity: 0,
				y: 60,
				scale: 0.9,
				transformOrigin: "center top",
			});

			tl.to(".hero-line", {
				opacity: 1,
				y: 0,
				duration: 0.8,
				stagger: 0.15,
				ease: "power3.out",
			})
				.to(
					".hero-scroll-btn",
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: "power3.out",
					},
					"-=0.4",
				)
				.to(
					".hero-image-container",
					{
						opacity: 1,
						y: 0,
						duration: 1.2,
						ease: "power3.out",
					},
					"-=0.6",
				);

			const contentWrapper = document.querySelector(".hero-content-wrapper");
			const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
			const scrollBtn = document.querySelector<HTMLElement>(".hero-scroll-btn");

			if (contentWrapper && lines.length > 0) {
				const wrapperWidth = contentWrapper.clientWidth;

				lines.forEach((line) => {
					const lineX = (wrapperWidth - line.clientWidth) / 2;
					gsap.set(line, { x: lineX });
				});

				if (scrollBtn) {
					const btnX = (wrapperWidth - scrollBtn.clientWidth) / 2;
					gsap.set(scrollBtn, { x: btnX });
				}

				tl.to(
					[".hero-line", ".hero-scroll-btn"],
					{
						x: 0,
						duration: 2.5,
						ease: "power2.inOut",
					},
					"+=1.0",
				).to(
					".hero-image-container",
					{
						scale: 1,
						duration: 2.5,
						ease: "power2.inOut",
					},
					"<",
				);
			}
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			className="relative flex min-h-dvh flex-col bg-background overflow-hidden"
		>
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-20 -right-20 size-96 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute top-1/2 -left-32 size-64 rounded-full bg-chart-2/5 blur-3xl" />
				<div className="absolute bottom-20 right-1/3 size-48 rounded-full bg-chart-1/5 blur-3xl" />
			</div>

			<div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 md:px-12 lg:px-24 relative z-10">
				<div className="hero-content-wrapper pt-48 md:pt-56 lg:pt-64 flex flex-col w-full">
					<div className="max-w-3xl w-full">
						<h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
							<span className="hero-line inline-block">We craft digital</span>
							<br />
							<span className="hero-line inline-block">experiences to</span>
							<br />
							<span className="hero-line inline-block">
								<span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
									scale and impact
								</span>
							</span>
						</h1>

						<div className="hero-scroll-btn mt-12 flex w-fit">
							<button
								type="button"
								className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
								onClick={() => {
									const showcase = document.getElementById("showcase");
									if (showcase) showcase.scrollIntoView({ behavior: "smooth" });
								}}
							>
								<div className="relative flex size-10 items-center justify-center rounded-full border border-muted-foreground/50 transition-all group-hover:border-foreground group-hover:scale-110">
									<HugeiconsIcon
										icon={ArrowDown01Icon}
										className="size-4 transition-transform group-hover:translate-y-0.5"
										strokeWidth={2}
									/>
									<div className="absolute inset-0 rounded-full border border-muted-foreground/30 animate-ping-slow" />
								</div>
								<span className="text-xs font-medium uppercase tracking-widest">
									Scroll to start
								</span>
							</button>
						</div>
					</div>
				</div>

				<div className="hero-image-container relative mt-16 mb-0 aspect-video overflow-hidden rounded-t-3xl bg-zinc-950/50 lg:mt-20">
					<video
						autoPlay
						loop
						muted
						playsInline
						className="relative z-10 size-full object-cover"
					>
						<source src="/hero.mp4" type="video/mp4" />
					</video>
					
					{/* Overlay for better text readability and depth */}
					<div className="absolute inset-0 z-20 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
					
					{/* Subtle glow effect */}
					<div className="absolute -bottom-1/2 left-1/2 -z-10 size-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
				</div>
			</div>
		</section>
	);
}
