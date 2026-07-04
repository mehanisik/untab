"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LogoMark } from "~/components/logo-mark";

export function Manifesto() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const mm = gsap.matchMedia();

			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const eyebrow = root.querySelector<HTMLElement>(".about-eyebrow");
				const lines = root.querySelectorAll<HTMLElement>(".about-line");
				const body = root.querySelectorAll<HTMLElement>(".about-body");
				const cards = root.querySelectorAll<HTMLElement>(".about-card");

				const trigger = {
					trigger: root,
					start: "top 85%",
					toggleActions: "play reverse play reverse",
				} as const;

				if (eyebrow) {
					gsap.from(eyebrow, {
						y: 14,
						opacity: 0,
						duration: 0.7,
						ease: "expo.out",
						scrollTrigger: trigger,
					});
				}

				if (lines.length) {
					gsap.from(lines, {
						y: 40,
						opacity: 0,
						duration: 1,
						ease: "expo.out",
						stagger: 0.08,
						delay: 0.05,
						scrollTrigger: trigger,
					});
				}

				if (body.length) {
					gsap.from(body, {
						y: 20,
						opacity: 0,
						duration: 0.8,
						ease: "expo.out",
						stagger: 0.08,
						delay: 0.35,
						scrollTrigger: trigger,
					});
				}

				if (cards.length) {
					gsap.from(cards, {
						y: 32,
						opacity: 0,
						duration: 1,
						ease: "expo.out",
						stagger: 0.1,
						scrollTrigger: {
							trigger: cards[0],
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
				}
			});

			return () => mm.revert();
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			id="about-manifesto"
			className="relative w-full bg-background text-foreground pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<h1 className="font-medium leading-[0.95] tracking-[-0.035em] text-foreground text-[clamp(2.25rem,5vw,4rem)] max-w-[14ch]">
					<span className="about-line block">We exist between</span>
					<span className="about-line block">what is and what</span>
					<span className="about-line block">is emerging.</span>
				</h1>

				<div className="mt-20 md:mt-28 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
					<div className="md:col-span-3 lg:col-span-3">
						<p className="about-eyebrow text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
							About Untab
						</p>
					</div>

					<div className="md:col-span-9 lg:col-span-8 space-y-6 max-w-2xl">
						<p className="about-body text-base md:text-lg leading-[1.65] text-foreground">
							Most companies work with separate agencies and teams. Then, when
							everything needs to come together, nothing quite fits. Here at
							Untab, strategy, design, and development work at the same table.
							One team. One conversation. From day one.
						</p>
						<p className="about-body text-base md:text-lg leading-[1.65] text-muted-foreground">
							We start where you are, beginning with your constraints, your
							complexity, your teams. Discovery and research ground our
							decisions in insight, not assumptions. We interrogate the brief,
							identify what's actually possible, and create a common thread that
							runs through the entire partnership. The result: systems that work
							now and adapt as your future unfolds.
						</p>
					</div>
				</div>

				<div className="mt-16 md:mt-20 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
					<div className="md:col-span-3 lg:col-span-3" aria-hidden />
					<div className="md:col-span-9 lg:col-span-9 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
						<div className="about-card relative aspect-square overflow-hidden rounded-2xl bg-card text-card-foreground flex items-center justify-center">
							<LogoMark
								aria-label="Untab mark"
								className="size-1/2 text-card-foreground"
							/>
						</div>
						<div className="about-card flex flex-col justify-between rounded-2xl bg-muted text-muted-foreground p-7 md:p-9">
							<p className="text-[11px] font-medium uppercase tracking-[0.28em] opacity-80">
								The studio
							</p>
							<div className="mt-10 space-y-6">
								<p className="text-balance text-lg md:text-xl leading-[1.4] text-foreground">
									A small, senior team. Same names on the kickoff call and the
									ship date.
								</p>
								<button
									type="button"
									className="inline-flex w-fit items-center gap-3 rounded-full border border-foreground/20 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-transparent"
								>
									Read the story
									<span aria-hidden>→</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
