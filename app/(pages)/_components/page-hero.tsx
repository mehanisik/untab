"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";

interface PageHeroProps {
	title: string;
	description: string;
	stats?: { label: string; value: string }[];
}

export function PageHero({ title, description, stats }: PageHeroProps) {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline();

			gsap.set(".hero-title-line", { opacity: 0, y: 30 });
			gsap.set(".hero-desc", { opacity: 0, y: 20 });
			gsap.set(".hero-stat", { opacity: 0, scale: 0.95 });

			tl.to(".hero-title-line", {
				opacity: 1,
				y: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power3.out",
			})
				.to(
					".hero-desc",
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: "power3.out",
					},
					"-=0.4",
				)
				.to(
					".hero-stat",
					{
						opacity: 1,
						scale: 1,
						duration: 0.6,
						stagger: 0.1,
						ease: "back.out(1.7)",
					},
					"-=0.4",
				);
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			className="relative overflow-hidden bg-background pt-32 pb-16 md:pt-48 md:pb-24 lg:pt-56"
		>
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 right-0 size-96 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute bottom-0 left-0 size-64 rounded-full bg-chart-1/5 blur-3xl opacity-50" />
			</div>

			<Container className="relative z-10">
				<div className="max-w-4xl">
					<h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
						{title.split("\n").map((line) => (
							<span key={line} className="hero-title-line block">
								{line}
							</span>
						))}
					</h1>
					<p className="hero-desc mt-8 max-w-2xl text-lg text-muted-foreground/80 font-light leading-relaxed md:text-xl">
						{description}
					</p>

					{stats && stats.length > 0 && (
						<div className="mt-12 flex flex-wrap gap-8 md:gap-16">
							{stats.map((stat) => (
								<div key={stat.label} className="hero-stat flex flex-col gap-1">
									<span className="text-2xl font-medium tabular-nums text-foreground md:text-3xl">
										{stat.value}
									</span>
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
										{stat.label}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</Container>

			<div className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-24">
				<div className="h-px w-full bg-linear-to-r from-border/0 via-border to-border/0 opacity-30" />
			</div>
		</section>
	);
}
