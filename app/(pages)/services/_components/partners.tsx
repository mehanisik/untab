"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";

export function Partners() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = sectionRef.current;
			if (!root) return;

			const eyebrow = root.querySelector<HTMLElement>(".pt-eyebrow");
			const paragraphs = root.querySelectorAll<HTMLElement>(".pt-paragraph");
			const cta = root.querySelector<HTMLElement>(".pt-cta");

			const trigger = {
				trigger: root,
				start: "top 78%",
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

			if (paragraphs.length) {
				gsap.from(paragraphs, {
					y: 24,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.1,
					delay: 0.1,
					scrollTrigger: trigger,
				});
			}

			if (cta) {
				gsap.from(cta, {
					y: 14,
					opacity: 0,
					duration: 0.7,
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
			className="relative w-full py-24 md:py-32 lg:py-40 border-t border-foreground/10"
		>
			<Container>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12">
					<div className="md:col-span-4 lg:col-span-4">
						<p className="pt-eyebrow text-sm font-normal text-foreground/60">
							Partners
						</p>
					</div>

					<div className="md:col-span-8 lg:col-span-7 lg:col-start-6 flex flex-col gap-8">
						<p className="pt-paragraph max-w-[58ch] text-pretty text-2xl md:text-3xl lg:text-[2.25rem] font-normal leading-[1.3] tracking-[-0.015em] text-foreground">
							We understand the demands of digitally focused organisations
							navigating change inside and out.
						</p>

						<p className="pt-paragraph max-w-[58ch] text-pretty text-lg md:text-xl font-light leading-[1.6] text-foreground/75">
							From startups finding their footing and scale-ups building
							momentum, to established enterprises reshaping their digital
							foundations.
						</p>

						<p className="pt-paragraph max-w-[58ch] text-pretty text-lg md:text-xl font-light leading-[1.6] text-foreground/75">
							Our most rewarding partnerships are with ambitious leaders who are
							seeking clarity, craft, and a true partner.
						</p>

						<div className="mt-6">
							<Link
								href="/contact"
								className="pt-cta group inline-flex items-center gap-2 text-base font-medium text-foreground"
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
