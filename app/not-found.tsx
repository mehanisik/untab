"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";

// Halftone disc in the brand coral: pure CSS dots with a radial fade,
// echoing the blog poster art. No external assets.
const DISC_STYLE = {
	backgroundImage:
		"radial-gradient(var(--brand-coral-accent) 1.1px, transparent 1.1px)",
	backgroundSize: "9px 9px",
	maskImage: "radial-gradient(circle, black 45%, transparent 72%)",
	WebkitMaskImage: "radial-gradient(circle, black 45%, transparent 72%)",
} as const;

export default function NotFound() {
	const rootRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;

				const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
				tl.from(
					root.querySelectorAll(".nf-line"),
					{ yPercent: 110, duration: 0.9, stagger: 0.12 },
					0.1,
				).from(
					root.querySelectorAll(".nf-fade"),
					{ y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.1 },
					0.4,
				);

				// The disc drifts slowly, the only continuous motion on the page.
				gsap.to(root.querySelector(".nf-disc"), {
					y: -24,
					duration: 5,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});
			}),
		{ scope: rootRef },
	);

	return (
		<main
			ref={rootRef}
			className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground"
		>
			<div
				aria-hidden
				className="nf-disc pointer-events-none absolute right-[-8rem] top-1/2 size-[24rem] -translate-y-1/2 opacity-60 md:right-[6vw] md:size-[30rem]"
				style={DISC_STYLE}
			/>

			<div className="container flex grow flex-col justify-center px-6 py-24 md:px-12 lg:px-24">
				<p className="nf-fade mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:mb-10">
					Error <span className="tabular-nums">(404)</span>
				</p>

				<h1 className="max-w-[16ch] text-balance font-medium leading-[1.02] tracking-[-0.03em] text-[clamp(2.25rem,5vw,4rem)]">
					<span className="block overflow-hidden pb-1">
						<span className="nf-line block">This page went missing.</span>
					</span>
					<span className="block overflow-hidden pb-1">
						<span className="nf-line block text-[var(--brand-coral-accent)]">
							The work didn&apos;t.
						</span>
					</span>
				</h1>

				<p className="nf-fade mt-8 max-w-[44ch] text-pretty text-[15px] leading-relaxed text-foreground/60">
					The address may be mistyped, or the page has moved on. Start from
					home, or head straight to the work.
				</p>

				<div className="nf-fade mt-10 flex flex-wrap items-center gap-6">
					<Link
						href="/"
						className="inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-background transition-opacity duration-200 hover:opacity-85"
					>
						Back home
					</Link>
					<Link
						href="/work"
						className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
					>
						View the work
						<span aria-hidden>→</span>
					</Link>
				</div>
			</div>

			<div className="nf-fade container px-6 pb-8 md:px-12 lg:px-24">
				<div className="flex items-center justify-between border-t border-foreground/10 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/35">
					<span className="tabular-nums">404</span>
					<span>untab studio</span>
				</div>
			</div>
		</main>
	);
}
