"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";

export default function ContactPage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);

	useGSAP(
		() => {
			gsap.from(".contact-fade", {
				opacity: 0,
				y: 50,
				duration: 1.2,
				stagger: 0.2,
				ease: "power3.out",
			});

			gsap.from(".grain-bg", {
				opacity: 0,
				duration: 2,
				ease: "none",
			});
		},
		{ scope: containerRef },
	);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!titleRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			titleRef.current.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;

		const moveX = (clientX - centerX) * 0.1;
		const moveY = (clientY - centerY) * 0.1;

		gsap.to(titleRef.current, {
			x: moveX,
			y: moveY,
			rotateX: -moveY * 0.2,
			rotateY: moveX * 0.2,
			duration: 0.5,
			ease: "power2.out",
		});
	};

	const handleMouseLeave = () => {
		gsap.to(titleRef.current, {
			x: 0,
			y: 0,
			rotateX: 0,
			rotateY: 0,
			duration: 1,
			ease: "elastic.out(1, 0.3)",
		});
	};

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				className="grow bg-background text-foreground min-h-screen relative overflow-hidden flex flex-col"
			>
				<div
					className="grain-bg absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
					style={{
						backgroundImage:
							'url("https://grainy-gradients.vercel.app/noise.svg")',
					}}
				/>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

				<Container className="flex-1 flex flex-col justify-center py-32 lg:py-64 relative z-10">
					<div className="max-w-6xl w-full">
						<div className="contact-fade mb-8 text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
							Available for new projects
						</div>

						<h1
							ref={titleRef}
							className="contact-fade text-[clamp(4rem,18vw,15rem)] font-black leading-[0.8] tracking-tighter uppercase italic perspective-1000"
						>
							Let&apos;s <br />
							<span className="text-primary hover:text-foreground transition-colors cursor-none">
								Talk.
							</span>
						</h1>

						<div className="contact-fade mt-24 grid md:grid-cols-[2fr_1fr] gap-20">
							<div className="flex flex-col gap-12">
								<p className="text-2xl md:text-3xl font-light text-muted-foreground leading-tight max-w-xl">
									Whether you have a fully-formed idea or just the start of a
									vision, we are here to help you build what&apos;s next.
								</p>
								<div className="flex flex-col gap-2">
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
										Email us
									</span>
									<a
										href="mailto:hello@untab.studio"
										className="text-2xl md:text-4xl font-medium text-foreground hover:text-primary transition-colors underline decoration-primary/20 hover:decoration-primary"
									>
										hello@untab.studio
									</a>
								</div>
							</div>

							<div className="flex flex-col gap-12">
								<div className="flex flex-col gap-2">
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
										Follow
									</span>
									<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest">
										<Link
											href="#"
											className="hover:text-primary transition-colors"
										>
											Twitter
										</Link>
										<Link
											href="#"
											className="hover:text-primary transition-colors"
										>
											Instagram
										</Link>
										<Link
											href="#"
											className="hover:text-primary transition-colors"
										>
											LinkedIn
										</Link>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
										Location
									</span>
									<span className="text-sm font-medium">
										Warsaw — Poland <br /> Available Globally
									</span>
								</div>
							</div>
						</div>
					</div>
				</Container>

				<div className="contact-fade h-32 border-t border-white/5 flex items-center mt-auto">
					<Container>
						<div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-zinc-700">
							<span>Untab Studio / Contact / 2025</span>
							<span>(GMT+1)</span>
						</div>
					</Container>
				</div>
			</main>
			<Footer />
		</Wrapper>
	);
}
