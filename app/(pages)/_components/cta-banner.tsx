"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LogoMark } from "~/components/logo-mark";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";

export function CtaBanner() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const trigger = {
					trigger: root,
					start: "top 85%",
					toggleActions: "play none none none" as const,
				};

				gsap.from(root.querySelector(".cta-card"), {
					y: 48,
					opacity: 0,
					duration: 1.1,
					ease: "expo.out",
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelector(".cta-heading"), {
					y: 32,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					delay: 0.15,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelector(".cta-subtitle"), {
					y: 24,
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					delay: 0.25,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".cta-btn"), {
					y: 20,
					opacity: 0,
					duration: 0.7,
					ease: "expo.out",
					stagger: 0.1,
					delay: 0.35,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelector(".cta-mark"), {
					scale: 0.85,
					opacity: 0,
					duration: 1.2,
					ease: "expo.out",
					delay: 0.2,
					scrollTrigger: trigger,
				});
			}),
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			aria-label="Get started"
			className="w-full bg-surface-deep"
		>
			<div className="mx-auto max-w-[1440px] px-6 pt-20 md:px-12 md:pt-24 lg:px-16">
				<div className="cta-card relative isolate overflow-hidden rounded-2xl bg-[#E83A50] p-8 sm:p-12 md:p-16 lg:px-20 lg:py-16 xl:py-20">
					<div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
						{/* Copy */}
						<div className="max-w-xl">
							<h2 className="cta-heading text-balance text-[28px] font-semibold leading-[1.15] tracking-tight text-black sm:text-[36px] md:text-[42px] lg:text-[44px]">
								Every great brand deserves a digital experience to match.
							</h2>
							<p className="cta-subtitle mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-black/60 sm:text-base md:mt-6">
								No templates. No&nbsp;compromises. Set up a call and see what we
								can build together.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
								<Link
									href="/contact"
									className="cta-btn inline-flex h-11 items-center justify-center rounded-lg border border-black/20 px-6 text-sm font-medium text-black transition-all duration-200 hover:bg-black/[0.06]"
								>
									Start a project
								</Link>
								<Link
									href="/contact"
									className="cta-btn inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-medium text-[#E83A50] transition-all duration-200 hover:bg-black/85"
								>
									Book a call
								</Link>
							</div>
						</div>

						{/* Decorative mark */}
						<div className="cta-mark hidden shrink-0 lg:block">
							<LogoMark className="h-[260px] w-auto text-black/20 xl:h-[320px]" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
