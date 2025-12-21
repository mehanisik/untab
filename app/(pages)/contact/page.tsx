"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";
import { ContactForm } from "./_components/contact-form";
import { BackgroundMesh } from "./_components/background-mesh";

export default function ContactPage() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(".grain-bg", {
				opacity: 0,
				duration: 2,
				ease: "none",
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

				<Container className="flex-1 flex flex-col justify-center items-center relative z-10 pt-32 pb-16">
					<div className="w-full max-w-2xl">
						<ContactForm />
					</div>
				</Container>

				<div className="h-24 border-t border-white/5 flex items-center bg-background/50 backdrop-blur-md relative z-10">
					<Container>
						<div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground/40">
							<div className="flex items-center gap-6">
								<span>Untab Studio © 2025</span>
								<span className="hidden md:inline">Warsaw, Poland</span>
							</div>
							<div className="flex items-center gap-6">
								<span>Status: Operational</span>
								<span className="h-1.5 w-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
							</div>
						</div>
					</Container>
				</div>
			</main>
			<Footer />
		</Wrapper>
	);
}
