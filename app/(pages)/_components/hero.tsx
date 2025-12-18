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

				<div className="hero-image-container relative mt-16 mb-0 overflow-hidden rounded-t-3xl bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 lg:mt-20">
					<div className="flex items-end justify-center pt-12 pb-0 gap-4 md:gap-8">
						<div className="relative w-[140px] md:w-[180px] lg:w-[220px] translate-y-8 -rotate-6 opacity-60">
							<div className="relative overflow-hidden rounded-[1.5rem] border-4 border-zinc-800 bg-zinc-800 shadow-2xl transition-transform duration-500 hover:scale-105 hover:-translate-y-2">
								<div className="relative aspect-[9/19.5] w-full overflow-hidden bg-linear-to-br from-amber-400 via-orange-500 to-red-500">
									<div className="absolute inset-0 flex items-center justify-center">
										<svg
											viewBox="0 0 24 24"
											fill="none"
											className="size-12 text-white/80"
											aria-hidden="true"
										>
											<path
												d="M17 8h1a2 2 0 012 2v1a2 2 0 01-2 2h-1"
												stroke="currentColor"
												strokeWidth="1.5"
											/>
											<path
												d="M5 8h12v8a4 4 0 01-4 4H9a4 4 0 01-4-4V8z"
												stroke="currentColor"
												strokeWidth="1.5"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>

						<div className="relative w-[200px] md:w-[260px] lg:w-[320px] z-10">
							<div className="group relative overflow-hidden rounded-[2rem] border-[6px] border-zinc-800 bg-zinc-800 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
								<div className="relative aspect-[9/19.5] w-full overflow-hidden bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600">
									<div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 text-xs text-white">
										<span className="font-medium">9:41</span>
										<div className="flex items-center gap-1">
											<div className="flex gap-0.5">
												<div className="h-2 w-1 rounded-sm bg-white/80" />
												<div className="h-2 w-1 rounded-sm bg-white/80" />
												<div className="h-2 w-1 rounded-sm bg-white/60" />
												<div className="h-2 w-1 rounded-sm bg-white/40" />
											</div>
											<div className="h-3 w-5 rounded-sm bg-white/80 ml-1" />
										</div>
									</div>

									<div className="absolute inset-0 flex flex-col items-center justify-center px-6">
										<div className="mb-4 size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
											<svg
												viewBox="0 0 24 24"
												fill="none"
												className="size-8 text-white"
												aria-hidden="true"
											>
												<path
													d="M9 12l2 2 4-4"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<circle
													cx="12"
													cy="12"
													r="9"
													stroke="currentColor"
													strokeWidth="2"
												/>
											</svg>
										</div>
										<div className="text-center text-white">
											<p className="text-lg font-semibold mb-1">
												Today&apos;s Progress
											</p>
											<p className="text-3xl font-bold">87%</p>
										</div>
										<div className="mt-6 w-full max-w-[140px] h-2 rounded-full bg-white/20 overflow-hidden">
											<div className="h-full w-[87%] rounded-full bg-white" />
										</div>
									</div>

									<div className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/50" />
								</div>
							</div>
						</div>

						<div className="relative w-[140px] md:w-[180px] lg:w-[220px] translate-y-8 rotate-6 opacity-60">
							<div className="relative overflow-hidden rounded-[1.5rem] border-4 border-zinc-800 bg-zinc-800 shadow-2xl transition-transform duration-500 hover:scale-105 hover:-translate-y-2">
								<div className="relative aspect-[9/19.5] w-full overflow-hidden bg-linear-to-br from-blue-400 via-indigo-500 to-purple-600">
									<div className="absolute inset-0 flex items-center justify-center">
										<svg
											viewBox="0 0 24 24"
											fill="none"
											className="size-12 text-white/80"
											aria-hidden="true"
										>
											<path
												d="M12 2L2 7l10 5 10-5-10-5z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinejoin="round"
											/>
											<path
												d="M2 17l10 5 10-5M2 12l10 5 10-5"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
