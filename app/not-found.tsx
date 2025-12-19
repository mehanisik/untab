"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";

export default function NotFound() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);

	useGSAP(
		() => {
			gsap.from(".not-found-fade", {
				opacity: 0,
				y: 30,
				duration: 1.2,
				stagger: 0.2,
				ease: "power3.out",
			});

			gsap.to(titleRef.current, {
				y: -20,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "power1.inOut",
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<main
				ref={containerRef}
				className="grow bg-background text-foreground min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
			>
				<div
					className="grain-bg absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
					style={{
						backgroundImage:
							'url("https://grainy-gradients.vercel.app/noise.svg")',
					}}
				/>

				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

				<div className="relative z-10 flex flex-col items-center text-center">
					<div className="not-found-fade mb-8 text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
						Error 404 / Void Detected
					</div>

					<h1
						ref={titleRef}
						className="not-found-fade text-[clamp(6rem,25vw,18rem)] font-black leading-[0.8] tracking-tighter uppercase italic perspective-1000"
					>
						Lost.
					</h1>

					<div className="not-found-fade mt-16 flex flex-col items-center gap-8">
						<p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed max-w-md italic">
							The page you seek has drifted into the digital ether. It either
							never existed or has been reclaimed by the void.
						</p>

						<Link
							href="/"
							className="group relative w-fit overflow-hidden border border-primary px-12 py-6 text-xs font-black uppercase tracking-[0.3em] bg-transparent text-foreground hover:text-black transition-colors"
						>
							<span className="relative z-10">Return to Studio</span>
							<div className="absolute inset-0 z-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
						</Link>
					</div>
				</div>

				<div className="not-found-fade absolute bottom-12 left-0 w-full px-12 flex justify-between items-center text-[8px] uppercase tracking-widest font-bold text-muted-foreground/30">
					<span>Coordinates: Null</span>
					<span>Status: Drifted</span>
				</div>
			</main>
		</Wrapper>
	);
}
