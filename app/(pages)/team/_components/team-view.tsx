"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface TeamViewProps {
	children: React.ReactNode;
}

export function TeamView({ children }: TeamViewProps) {
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
		<main
			ref={containerRef}
			className="grow bg-background text-foreground overflow-hidden"
		>
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="parallax-item absolute top-[20%] left-[10%] size-64 bg-primary/10 rounded-full blur-3xl opacity-20 dark:opacity-30" />
				<div className="parallax-item absolute top-[50%] right-[15%] size-96 bg-violet-500/5 rounded-full blur-3xl opacity-10 dark:opacity-20" />
				<div className="parallax-item absolute top-[80%] left-[5%] size-80 bg-chart-1/5 rounded-full blur-3xl opacity-10 dark:opacity-20" />
			</div>
			{children}
		</main>
	);
}
