"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LogoMark } from "~/components/logo-mark";
import { LogoWordmark } from "~/components/logo-wordmark";

export function Studio() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const frames = root.querySelectorAll<HTMLElement>(".studio-frame");
				if (!frames.length) return;

				gsap.from(frames, {
					y: 48,
					opacity: 0,
					duration: 1.1,
					ease: "expo.out",
					stagger: 0.09,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});
			});

			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			id="about-studio"
			aria-label="Untab public brand system"
			className="w-full bg-background py-20 md:py-28 lg:py-32"
		>
			<div className="container px-4 md:px-8 lg:px-12">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:auto-rows-[minmax(10rem,auto)] md:gap-4">
					<div className="studio-frame relative min-h-[21rem] overflow-hidden rounded-md bg-[var(--light)] p-6 text-[var(--dark)] md:col-span-8 md:min-h-[26rem] md:p-8 lg:p-10">
						<LogoMark className="pointer-events-none absolute -right-9 bottom-4 h-64 w-auto text-[var(--dark)]/95 md:-right-12 md:bottom-5 md:h-80" />
						<h2 className="relative max-w-[10ch] text-[clamp(3.35rem,8vw,6.75rem)] font-black leading-[0.86] tracking-normal text-[var(--brand-coral)]">
							Digital, crafted with intent
						</h2>
						<div className="relative mt-10 grid gap-6 md:mt-16 md:grid-cols-[auto_minmax(0,22rem)] md:items-end md:justify-between">
							<div className="flex h-14 w-44 items-center bg-white px-4 text-[var(--dark)]">
								<LogoWordmark
									aria-label="Untab"
									className="h-9 w-auto max-w-full"
								/>
							</div>
							<p className="max-w-sm text-sm leading-relaxed text-[var(--dark)]/70 md:text-base md:pb-1">
								A digital studio for brands, products, and interfaces that need
								to feel unmistakably made.
							</p>
						</div>
					</div>

					<div className="studio-frame relative min-h-[21rem] overflow-hidden rounded-md bg-[#bfdaf2] p-6 text-[var(--brand-coral)] md:col-span-4 md:min-h-[26rem] md:p-8">
						<h3 className="mx-auto max-w-[11ch] text-center text-[clamp(2.2rem,4vw,3.8rem)] font-black leading-[0.88] tracking-normal">
							Every pixel a sharper signal
						</h3>
						<LogoMark
							aria-label="Untab mark"
							className="mx-auto mt-8 h-32 w-auto text-[var(--dark)] md:mt-10 md:h-40"
						/>
						<p className="mx-auto mt-8 max-w-[24ch] text-center text-sm font-semibold leading-snug">
							Strategy, design, and engineering in one joined-up system.
						</p>
					</div>

					<div className="studio-frame relative min-h-64 overflow-hidden rounded-md bg-[var(--brand-coral)] p-6 text-white md:col-span-5 md:min-h-80">
						<div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />
						<div className="absolute inset-x-8 top-1/2 h-px bg-white/45" />
						<div className="absolute left-1/2 inset-y-8 w-px bg-white/45" />
						<div className="relative flex h-full min-h-52 items-center justify-center">
							<div className="flex h-24 w-[20rem] items-center justify-center bg-[var(--dark)] px-8 text-[var(--light)] md:h-28 md:w-[22rem]">
								<LogoWordmark
									aria-label="Untab horizontal logo"
									className="h-14 w-auto max-w-full md:h-16"
								/>
							</div>
						</div>
					</div>

					<div className="studio-frame relative min-h-64 overflow-hidden rounded-md bg-muted md:col-span-3 md:min-h-80">
						<div className="absolute inset-0 bg-gradient-to-br from-white/55 to-transparent dark:from-white/5" />
						<div className="absolute left-1/2 top-1/2 flex h-[78%] w-[72%] -translate-x-1/2 -translate-y-1/2 flex-col justify-between overflow-hidden rounded-lg border border-foreground/10 bg-[var(--light)] p-6 text-[var(--dark)] shadow-2xl">
							<div className="flex items-center justify-between">
								<LogoMark className="h-8 w-auto" />
								<div className="flex gap-1.5">
									<span className="size-2 rounded-full bg-[var(--brand-coral)]" />
									<span className="size-2 rounded-full bg-[var(--dark)]/25" />
								</div>
							</div>
							<div>
								<p className="max-w-[9ch] text-3xl font-black leading-[0.92] text-[var(--dark)]">
									One tab among many.
								</p>
								<div className="mt-5 space-y-2">
									<span className="block h-2 w-24 bg-[var(--dark)]/18" />
									<span className="block h-2 w-16 bg-[var(--dark)]/18" />
								</div>
							</div>
							<div className="flex items-end justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--dark)]/45">
								<span>untab.studio</span>
								<span>2026</span>
							</div>
						</div>
					</div>

					<div className="studio-frame relative min-h-64 overflow-hidden rounded-md bg-[var(--light)] p-7 text-[var(--brand-coral)] md:col-span-4 md:min-h-80">
						<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--brand-coral)]">
							<LogoMark className="h-9 w-auto text-[var(--light)]" />
						</div>
						<h3 className="mx-auto mt-8 max-w-[12ch] text-center text-[clamp(2rem,4vw,3.25rem)] font-black leading-[0.9] tracking-normal">
							Systems built to compound
						</h3>
						<div className="mx-auto mt-8 flex h-9 w-36 items-center justify-center text-[var(--dark)]">
							<LogoWordmark
								aria-label="Untab logo"
								className="h-7 w-auto max-w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
