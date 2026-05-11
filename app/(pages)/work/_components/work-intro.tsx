"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { REVEAL } from "~/libs/gsap/presets";

export function WorkIntro() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const title = root.querySelector<HTMLElement>(".work-display");
			const lede = root.querySelector<HTMLElement>(".work-lede");

			if (title) {
				gsap.from(title, {
					y: 48,
					opacity: 0,
					duration: 1.1,
					ease: REVEAL.ease,
				});
			}

			if (lede) {
				gsap.from(lede, {
					y: 18,
					opacity: 0,
					duration: 0.9,
					ease: REVEAL.ease,
					delay: 0.25,
				});
			}
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="relative w-full pt-36 md:pt-44 lg:pt-52 pb-16 md:pb-24"
		>
			<Container>
				<div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
					<h1 className="work-display md:col-span-8 lg:col-span-8 text-[clamp(4.5rem,13vw,11rem)] font-black uppercase leading-[0.85] tracking-[-0.045em] text-foreground">
						All Work
					</h1>

					<div className="md:col-span-4 md:col-start-9 flex items-end">
						<p className="work-lede max-w-md text-pretty text-base md:text-lg font-light leading-[1.55] text-foreground/75">
							We collaborate with founders, marketing leaders, and ambitious
							teams across a wide range of industries — building brand-led
							websites, platforms, and digital products that ship.
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}
