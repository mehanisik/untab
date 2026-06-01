"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { withMotion } from "~/libs/gsap/presets";

export function ContactHero() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				const trigger = {
					trigger: root,
					start: "top 85%",
					toggleActions: "play none none none",
				} as const;

				gsap.from(root.querySelector(".contact-eyebrow"), {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: "expo.out",
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".contact-title"), {
					y: 40,
					opacity: 0,
					duration: 1,
					ease: "expo.out",
					stagger: 0.08,
					delay: 0.05,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelector(".contact-lead"), {
					y: 20,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					delay: 0.2,
					scrollTrigger: trigger,
				});
			}),
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			className="w-full bg-background pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 text-foreground"
		>
			<Container className="grid grid-cols-12 gap-x-6 sm:gap-x-8">
				<div className="col-span-12 lg:col-span-7">
					<p className="contact-eyebrow text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] opacity-60">
						Contact
					</p>
					<h1 className="mt-6 sm:mt-8 font-medium leading-[0.95] tracking-[-0.035em] text-[clamp(2.75rem,7vw,6.5rem)]">
						<span className="contact-title block">Let&apos;s build</span>
						<span className="contact-title block">something great.</span>
					</h1>
				</div>

				<div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-6 lg:mt-0 lg:self-end">
					<p className="contact-lead text-pretty text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] tracking-[-0.01em]">
						Have a project in mind? Tell us about it. We&apos;ll get back to you
						within one business day.
					</p>
				</div>
			</Container>
		</section>
	);
}
