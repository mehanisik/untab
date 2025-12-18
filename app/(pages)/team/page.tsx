"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";

const values = [
	{
		title: "Radical Transparency",
		description:
			"No black boxes. We share our process, challenges, and successes openly with our partners.",
	},
	{
		title: "Continuous Evolution",
		description:
			"Digital is never static. We constantly iterate, learn, and push the boundaries of what's possible.",
	},
	{
		title: "Obsessive Utility",
		description:
			"Aesthetics serve purpose. Every pixel and every line of code must contribute to the user's ultimate goal.",
	},
];

export default function TeamPage() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(".team-title span", {
				y: 150,
				opacity: 0,
				duration: 1.5,
				stagger: 0.1,
				ease: "expo.out",
			});

			gsap.to(".parallax-item", {
				y: (_, target) => -target.offsetHeight * 0.5,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			});

			gsap.utils.toArray<HTMLElement>(".value-card").forEach((card) => {
				gsap.from(card, {
					opacity: 0,
					y: 50,
					duration: 1,
					scrollTrigger: {
						trigger: card,
						start: "top 80%",
					},
				});
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				className="grow bg-background text-foreground overflow-hidden"
			>
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="parallax-item absolute top-[20%] left-[10%] size-64 bg-primary/10 rounded-full blur-3xl opacity-20 dark:opacity-30" />
					<div className="parallax-item absolute top-[50%] right-[15%] size-96 bg-violet-500/5 rounded-full blur-3xl opacity-10 dark:opacity-20" />
					<div className="parallax-item absolute top-[80%] left-[5%] size-80 bg-chart-1/5 rounded-full blur-3xl opacity-10 dark:opacity-20" />
				</div>

				<section className="relative pt-48 pb-32 md:pt-64 md:pb-48">
					<Container>
						<div className="max-w-6xl">
							<h1 className="team-title text-[clamp(3.5rem,12vw,10rem)] font-black leading-[0.8] tracking-tighter uppercase italic py-4">
								<span className="block mb-4">Collective</span>
								<span className="block text-primary">Intelligence</span>
							</h1>
							<div className="mt-20 grid lg:grid-cols-2 gap-12 lg:gap-32">
								<div className="h-px w-full bg-border lg:hidden" />
								<p className="text-2xl md:text-3xl font-light text-muted-foreground leading-tight">
									We are a decentralized network of thinkers, makers, and
									dreamers unified by a single obsession: humanizing technology
									through exceptional design.
								</p>
								<div className="flex flex-col gap-8">
									<div className="h-px w-full bg-border" />
									<div className="grid grid-cols-2 gap-8">
										<div className="flex flex-col gap-1">
											<span className="text-4xl font-bold tabular-nums">
												12
											</span>
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
												Core Savants
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-4xl font-bold tabular-nums">
												03
											</span>
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
												Continents
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section className="py-32 lg:py-64 bg-muted/30">
					<Container>
						<div className="flex flex-col gap-32">
							<div className="max-w-4xl">
								<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-12">
									Mindset is our most valuable asset.
								</h2>
								<p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed italic">
									&ldquo;We don&apos;t just hire talent; we curate perspective.
									Our multi-disciplinary approach ensures that every problem is
									attacked from multiple angles simultaneously.&rdquo;
								</p>
							</div>

							<div className="grid md:grid-cols-3 gap-12 lg:gap-20">
								{values.map((value, i) => (
									<div
										key={value.title}
										className="value-card flex flex-col gap-6"
									>
										<div className="size-10 rounded-full border border-border flex items-center justify-center font-bold text-xs">
											0{i + 1}
										</div>
										<h3 className="text-2xl font-bold uppercase tracking-tight">
											{value.title}
										</h3>
										<p className="text-muted-foreground font-medium leading-relaxed">
											{value.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</Container>
				</section>

				<section className="py-32 lg:py-64">
					<Container>
						<div className="grid grid-cols-2 md:grid-cols-4 aspect-4/3 md:aspect-16/9 gap-4 overflow-hidden rounded-[3rem]">
							<div className="bg-muted flex items-center justify-center">
								<div className="size-20 bg-primary/20 blur-xl animate-pulse" />
							</div>
							<div className="bg-primary/80" />
							<div className="bg-muted/50" />
							<div className="bg-muted" />
							<div className="bg-muted col-span-2" />
							<div className="bg-primary" />
							<div className="bg-muted/80" />
						</div>
						<div className="mt-12 flex justify-between items-end">
							<div className="max-w-xs">
								<h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">
									Our Base
								</h4>
								<p className="text-xl font-light">
									Warsaw — London — NYC. Available globally.
								</p>
							</div>
							<div className="size-32 rounded-full border border-border flex items-center justify-center p-8 animate-spin-slow">
								<div className="size-full border-t-2 border-primary rounded-full" />
							</div>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</Wrapper>
	);
}
