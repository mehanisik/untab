"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";
import { ContactForm } from "./_components/contact-form";
import { BackgroundMesh } from "./_components/background-mesh";
import { Link } from "~/components/ui/link";

export default function ContactPage() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			// Hero Text Animation
			gsap.from(".reveal-text", {
				yPercent: 100,
				duration: 1.2,
				ease: "power4.out",
				stagger: 0.1,
			});
		},
		{ scope: containerRef },
	);

	return (
		<Wrapper>
			<Navbar />
			<main
				ref={containerRef}
				className="grow bg-background text-foreground min-h-screen relative overflow-hidden flex flex-col"
			>
				<BackgroundMesh />

				<Container className="relative z-10 pt-24 md:pt-40 pb-16 md:pb-24 flex-1 flex flex-col">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start w-full">
						{/* Left: Heading & Info */}
						<div className="lg:col-span-5 xl:col-span-4 space-y-10 md:space-y-12">
							<div className="space-y-4 md:space-y-6">
								<div className="overflow-hidden">
									<h1 className="reveal-text text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-none md:leading-[0.9]">
										Let&apos;s build <br />
										<span className="italic font-extralight opacity-60">
											something
										</span>{" "}
										<br />
										extraordinary.
									</h1>
								</div>
								<p className="text-muted-foreground text-base md:text-lg font-light max-w-sm reveal-text">
									Partner with us to create digital experiences that define the
									future of your brand.
								</p>
							</div>

							<div className="pt-8 md:pt-12 border-t border-white/5 space-y-6 md:space-y-8 reveal-text">
								<div className="space-y-1 md:space-y-2">
									<p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
										Email
									</p>
									<Link
										href="mailto:contact@untabstudio.com"
										className="text-lg md:text-xl font-light hover:text-primary transition-colors"
									>
										contact@untabstudio.com
									</Link>
								</div>

								<div className="space-y-1 md:space-y-2">
									<p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
										Social
									</p>
									<div className="flex flex-wrap gap-x-6 gap-y-2">
										{["Instagram", "LinkedIn", "Awwwards"].map((s) => (
											<Link
												key={s}
												href="#"
												className="text-sm font-light hover:text-primary transition-colors"
											>
												{s}
											</Link>
										))}
									</div>
								</div>

								<div className="space-y-1 md:space-y-2">
									<p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
										Location
									</p>
									<p className="text-sm font-light">Warsaw, Poland</p>
								</div>
							</div>
						</div>

						{/* Right: The Form */}
						<div className="lg:col-span-7 xl:col-span-8 lg:pl-12">
							<div className="p-6 md:p-12 bg-white/2 border border-white/5 rounded-2xl md:rounded-3xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
								{/* Subtle border shine */}
								<div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
								<ContactForm />
							</div>
						</div>
					</div>
				</Container>

				{/* Footer Bar */}
				<div className="h-auto md:h-20 py-6 md:py-0 border-t border-white/5 flex items-center bg-background/50 backdrop-blur-md relative z-20">
					<Container>
						<div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-medium text-muted-foreground/40">
							<div className="flex items-center gap-4 md:gap-8">
								<span>Untab © 2025</span>
								<span className="hidden md:inline">Open to New Projects</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
								<span>Status: Ready</span>
							</div>
						</div>
					</Container>
				</div>
			</main>
			<Footer />
		</Wrapper>
	);
}
