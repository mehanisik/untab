"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import type { Service } from "~/libs/sanity";
import { PAGE_PADDING, pad } from "~/libs/utils";

export function Capabilities({ services }: { services: Service[] }) {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				gsap.from(root.querySelectorAll<HTMLElement>(".services-reveal"), {
					y: 24,
					autoAlpha: 0,
					duration: 0.8,
					ease: "expo.out",
					stagger: 0.07,
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});

				gsap.from(root.querySelectorAll<HTMLElement>(".service-card"), {
					y: 28,
					autoAlpha: 0,
					duration: 0.75,
					ease: "expo.out",
					stagger: 0.06,
					scrollTrigger: {
						trigger: root.querySelector(".service-grid") ?? root,
						start: "top 85%",
						toggleActions: "play reverse play reverse",
					},
				});
			}),
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			aria-label="Services"
			className="w-full bg-background pb-24 pt-20 text-foreground sm:pb-28 sm:pt-24 md:pb-36 md:pt-28"
		>
			<div className={`container ${PAGE_PADDING}`}>
				<header className="services-reveal grid gap-8 border-b border-border pb-12 md:grid-cols-[0.85fr_1.15fr] md:items-end md:pb-16">
					<div>
						<p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
							Services{" "}
							<span className="tabular-nums">({pad(services.length)})</span>
						</p>
						<h1 className="mt-5 text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[0.96] tracking-[-0.04em]">
							Services
						</h1>
					</div>
					<p className="max-w-2xl text-pretty text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug tracking-[-0.02em] text-muted-foreground">
						Strategy, brand, websites, products, and development handled as one
						connected process, so the thinking, design, and build stay aligned
						from the first conversation to launch.
					</p>
				</header>

				<div className="service-grid mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4 lg:grid-cols-3">
					{services.map((service, index) => (
						<article
							key={service.title}
							className="service-card flex min-h-[24rem] flex-col justify-between rounded-lg bg-card p-7 text-card-foreground sm:min-h-[26rem] sm:p-8 md:p-10"
						>
							<div>
								<p className="font-mono text-[12px] tabular-nums text-muted-foreground">
									({pad(index + 1)})
								</p>
								<h2 className="mt-6 text-[clamp(2rem,3vw,2.75rem)] leading-[1.02] tracking-[-0.03em]">
									{service.lead ? (
										<span className="block font-light">{service.lead}</span>
									) : null}
									<span className="block font-semibold tracking-[-0.04em]">
										{service.main ?? service.title}
									</span>
								</h2>
							</div>
							<p className="mt-10 max-w-[34ch] text-pretty text-[15px] leading-snug text-muted-foreground md:text-base">
								{service.cardDescription}
							</p>
						</article>
					))}
				</div>

				<div className="services-reveal mt-10 flex justify-end md:mt-12">
					<Link
						href="/contact"
						className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-medium tracking-[-0.01em] text-primary-foreground transition-opacity hover:opacity-80"
					>
						Start a project
						<span aria-hidden>→</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
