"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function Intro() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const eyebrow = root.querySelector<HTMLElement>(".intro-eyebrow");
			const lines = root.querySelectorAll<HTMLElement>(".intro-line");

			const trigger = {
				trigger: root,
				start: "top 75%",
				toggleActions: "play none none none",
			};

			if (eyebrow) {
				gsap.from(eyebrow, {
					y: 16,
					opacity: 0,
					duration: 0.7,
					ease: "expo.out",
					scrollTrigger: trigger,
				});
			}

			if (lines.length) {
				gsap.from(lines, {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.07,
					delay: 0.1,
					scrollTrigger: trigger,
				});
			}
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			id="intro"
			className="relative w-full bg-background text-foreground py-24 md:py-32 lg:py-40"
		>
			<div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
					<div className="md:col-span-3 lg:col-span-3">
						<p className="intro-eyebrow flex items-center gap-2 text-sm md:text-base font-normal text-foreground">
							<span
								aria-hidden
								className="size-1.5 rounded-full bg-foreground"
							/>
							Who are we?
						</p>
					</div>

					<div className="md:col-span-9 lg:col-span-9">
						<h2 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.75rem,1.5rem+3.2vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
							<span className="intro-line block">An independent software</span>
							<span className="intro-line block">
								studio in Warsaw who care,
							</span>
							<span className="intro-line block">
								build relationships, sweat
							</span>
							<span className="intro-line block">the details, and ship</span>
							<span className="intro-line block">considered products.</span>
						</h2>
					</div>
				</div>
			</div>
		</section>
	);
}
