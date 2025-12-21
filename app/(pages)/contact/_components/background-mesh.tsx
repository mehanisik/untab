"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function BackgroundMesh() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const orbs = containerRef.current?.querySelectorAll(".orb");
			if (!orbs) return;

			orbs.forEach((orb, i) => {
				gsap.to(orb, {
					x: "random(-100, 100)%",
					y: "random(-100, 100)%",
					duration: "random(10, 20)",
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
					delay: i * -2,
				});
			});

			const handleMouseMove = (e: MouseEvent) => {
				const { clientX, clientY } = e;
				const xPos = (clientX / window.innerWidth - 0.5) * 40;
				const yPos = (clientY / window.innerHeight - 0.5) * 40;

				gsap.to(".interactive-orb", {
					x: `${xPos}%`,
					y: `${yPos}%`,
					duration: 2,
					ease: "power2.out",
				});
			};

			window.addEventListener("mousemove", handleMouseMove);
			return () => window.removeEventListener("mousemove", handleMouseMove);
		},
		{ scope: containerRef },
	);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 overflow-hidden pointer-events-none z-0"
		>
			<div className="absolute inset-0 bg-background" />

			{/* Decorative Orbs */}
			<div className="orb absolute top-[10%] left-[10%] size-[500px] bg-primary/20 blur-[120px] rounded-full" />
			<div className="orb absolute top-[60%] left-[50%] size-[600px] bg-blue-500/10 blur-[150px] rounded-full dark:bg-blue-400/5" />
			<div className="orb absolute top-[20%] left-[70%] size-[400px] bg-purple-500/10 blur-[100px] rounded-full dark:bg-purple-400/5" />

			{/* Interactive Follower */}
			<div className="interactive-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 blur-[180px] rounded-full" />

			{/* Grain Overlay */}
			<div
				className="grain-bg absolute inset-0 opacity-[0.01] dark:opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						'url("https://grainy-gradients.vercel.app/noise.svg")',
					filter: "contrast(150%) brightness(100%)",
				}}
			/>
		</div>
	);
}
