"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Loading() {
	const containerRef = useRef<HTMLDivElement>(null);
	const barRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.to(barRef.current, {
				scaleX: 1,
				duration: 2,
				ease: "power2.inOut",
				repeat: -1,
				yoyo: true,
			});

			gsap.fromTo(
				".loading-text",
				{ opacity: 0, y: 10 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					stagger: 0.2,
					ease: "power3.out",
					repeat: -1,
					yoyo: true,
					repeatDelay: 0.5,
				},
			);
		},
		{ scope: containerRef },
	);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background text-foreground"
		>
			<div
				className="grain-bg absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
				style={{
					backgroundImage:
						'url("https://grainy-gradients.vercel.app/noise.svg")',
				}}
			/>

			<div className="relative z-10 flex flex-col items-center gap-8">
				<div className="flex flex-col items-center">
					<span className="loading-text text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
						Untab Studio
					</span>
					<h1 className="loading-text mt-2 text-4xl font-black uppercase italic tracking-tighter">
						Defining <span className="text-primary italic">Next.</span>
					</h1>
				</div>

				<div className="relative h-px w-48 overflow-hidden bg-primary/10">
					<div
						ref={barRef}
						className="absolute inset-0 origin-left scale-x-0 bg-primary"
					/>
				</div>

				<span className="loading-text text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
					Synchronizing interface...
				</span>
			</div>
		</div>
	);
}
