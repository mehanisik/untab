"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";

export function ServicesIntro() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const eyebrow = root.querySelector<HTMLElement>(".intro-eyebrow");
			const titleLines =
				root.querySelectorAll<HTMLElement>(".intro-title-line");
			const lede = root.querySelector<HTMLElement>(".intro-lede");

			const trigger = {
				trigger: root,
				start: "top 85%",
				toggleActions: "play none none none",
			};

			if (eyebrow) {
				gsap.from(eyebrow, {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: "expo.out",
					scrollTrigger: trigger,
				});
			}

			if (titleLines.length) {
				gsap.from(titleLines, {
					y: 36,
					opacity: 0,
					duration: 1,
					ease: "expo.out",
					stagger: 0.06,
					delay: 0.05,
					scrollTrigger: trigger,
				});
			}

			if (lede) {
				gsap.from(lede, {
					y: 18,
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					delay: 0.4,
					scrollTrigger: trigger,
				});
			}
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="relative w-full pt-36 md:pt-44 lg:pt-56 pb-24 md:pb-32"
		>
			<Container>
				<p className="intro-eyebrow text-sm font-normal text-foreground/60">
					Our services
				</p>

				<h1 className="mt-10 text-balance text-foreground font-medium leading-[1.02] tracking-[-0.035em] text-5xl sm:text-6xl md:text-7xl lg:text-[clamp(4rem,2.5rem+3.6vw,6.5rem)]">
					<span className="intro-title-line block">Strategy, design,</span>
					<span className="intro-title-line block">and development.</span>
					<span className="intro-title-line block text-foreground/50">
						Together from day one.
					</span>
				</h1>

				<p className="intro-lede mt-14 md:mt-20 max-w-xl text-pretty text-lg md:text-xl font-light leading-[1.55] text-foreground/75">
					Everything we do supports and informs the other, creating systems that
					work today and adapt to wherever your business goes next.
				</p>
			</Container>
		</section>
	);
}
