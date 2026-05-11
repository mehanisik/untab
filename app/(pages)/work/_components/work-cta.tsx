"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";
import { REVEAL } from "~/libs/gsap/presets";

export function WorkCta() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const eyebrow = root.querySelector<HTMLElement>(".cta-eyebrow");
			const titleLines = root.querySelectorAll<HTMLElement>(".cta-title-line");
			const cta = root.querySelector<HTMLElement>(".cta-link");

			const trigger = {
				trigger: root,
				start: REVEAL.start,
				toggleActions: REVEAL.toggleActions,
			};

			if (eyebrow) {
				gsap.from(eyebrow, {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: REVEAL.ease,
					scrollTrigger: trigger,
				});
			}

			if (titleLines.length) {
				gsap.from(titleLines, {
					y: 32,
					opacity: 0,
					duration: REVEAL.duration,
					ease: REVEAL.ease,
					stagger: 0.06,
					delay: 0.05,
					scrollTrigger: trigger,
				});
			}

			if (cta) {
				gsap.from(cta, {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: REVEAL.ease,
					delay: 0.35,
					scrollTrigger: trigger,
				});
			}
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="relative w-full border-t border-foreground/10 py-24 md:py-32 lg:py-40"
		>
			<Container>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
					<div className="md:col-span-4 lg:col-span-4">
						<p className="cta-eyebrow text-sm font-normal text-foreground/60">
							Have a project in mind?
						</p>
					</div>

					<div className="md:col-span-8 lg:col-span-7 lg:col-start-6 flex flex-col gap-10">
						<h2 className="text-balance text-foreground font-medium leading-[1.05] tracking-[-0.03em] text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(3rem,2rem+2.4vw,4.5rem)]">
							<span className="cta-title-line block">
								Let's build the next one
							</span>
							<span className="cta-title-line block text-foreground/50">
								together.
							</span>
						</h2>

						<div>
							<Link
								href="/contact"
								className="cta-link group inline-flex items-center gap-2 text-base font-medium text-foreground"
							>
								<span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
									Start a project
								</span>
								<HugeiconsIcon
									icon={ArrowUpRight01Icon}
									className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									strokeWidth={2}
								/>
							</Link>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
