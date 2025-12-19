"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";
import { ContactForm } from "./_components/contact-form";

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
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

				<Container className="flex-1 flex flex-col pt-32 pb-16 lg:pt-48 relative z-10">
					<div className="grid lg:grid-cols-2 gap-16 lg:gap-32 flex-1">
						{/* Left Column: Info & Branding */}
						<div className="flex flex-col justify-between">
							<div className="space-y-12">
								<div className="contact-fade flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
									<span className="h-0.5 w-8 bg-primary" />
									Available for new projects
								</div>

								<div className="relative">
									<h1
										ref={titleRef}
										className="contact-fade text-[clamp(4.5rem,14vw,12rem)] font-black leading-[0.85] tracking-tighter uppercase italic perspective-1000"
									>
										Let&apos;s <br />
										<span className="text-primary hover:text-foreground transition-all duration-500 cursor-none inline-block">
											Talk.
										</span>
									</h1>
									<div className="contact-fade absolute -bottom-4 left-0 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
										Shoot the signal — Establish connection
									</div>
								</div>

								<p className="contact-fade max-w-md text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
									Whether you have a fully-formed idea or just the start of a
									vision, we are here to help you build what&apos;s next. Our
									studio is built on the foundation of radical transparency and
									exceptional craft.
								</p>
							</div>

							<div className="contact-fade mt-16 grid grid-cols-2 gap-8 border-t border-border pt-12">
								<div className="flex flex-col gap-3">
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">
										Inquiries
									</span>
									<a
										href="mailto:hello@untab.studio"
										className="group text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors flex items-center gap-2"
									>
										hello@untab.studio
										<span className="h-px w-0 bg-primary group-hover:w-4 transition-all duration-300" />
									</a>
								</div>
								<div className="flex flex-col gap-3">
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">
										Location
									</span>
									<span className="text-sm font-bold uppercase tracking-widest text-foreground">
										Warsaw (GMT+1)
									</span>
								</div>
								<div className="flex flex-col gap-3">
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">
										Social
									</span>
									<div className="flex gap-4">
										{["TW", "IG", "LN"].map((social) => (
											<Link
												key={social}
												href="#"
												className="text-[10px] font-black hover:text-primary transition-all"
											>
												{social}
											</Link>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Right Column: Conversational Form */}
						<div className="flex flex-col justify-center min-h-[500px]">
							<div className="contact-fade bg-zinc-950/20 dark:bg-zinc-900/10 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
								<ContactForm />
							</div>
						</div>
					</div>
				</Container>

				<div className="contact-fade h-24 border-t border-white/5 flex items-center bg-zinc-950/30 backdrop-blur-md">
					<Container>
						<div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground/60">
							<div className="flex items-center gap-6">
								<span>Untab Studio © 2025</span>
								<span className="hidden md:inline">
									Built with React 19 & Tailwind 4
								</span>
							</div>
							<div className="flex items-center gap-6">
								<span>Global Service</span>
								<span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
							</div>
						</div>
					</Container>
				</div>
			</main>
			<Footer />
		</Wrapper>
	);
}
