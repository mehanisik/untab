import { Fragment } from "react";
import { Link } from "~/components/ui/link";
import { VisionFx } from "./fx/vision-fx";

interface VisionProps {
	kicker?: string;
	description?: string;
	linkText?: string;
	heading?: string;
}

function VisionArcs() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 1920 960"
			className="vision-arcs pointer-events-none absolute inset-0 size-full text-foreground"
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeDasharray="2 16"
			>
				<path
					transform="translate(1582 1113) scale(1.4)"
					d="M-697.263,-226.536 C-601.739,-520.359 -325.498,-733 0,-733"
				/>
				<path
					transform="translate(1582 1113) rotate(-45) scale(1.4)"
					d="M-599.285,-194.704 C-517.184,-447.239 -279.76,-630 0,-630"
				/>
			</g>
		</svg>
	);
}

export function Vision({
	kicker = "Next step",
	description = "We have the perfect combination of mindset, skills, processes, and pricing structure. Together, we'll transform your ideas into the best-in-class digital experience.",
	linkText = "Let's talk",
	heading = "about your vision.",
}: VisionProps) {
	const words = description.split(" ");

	return (
		<VisionFx className="relative isolate" aria-label="Start a conversation">
			<div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen bg-muted" />

			<VisionArcs />

			<div className="container relative flex flex-col gap-14 px-6 py-24 sm:py-32 md:px-12 md:py-40 lg:px-24">
				<div className="max-w-md">
					<p className="vision-kicker mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
						{kicker}
					</p>
					<p className="text-pretty text-lg font-medium leading-relaxed text-foreground">
						{words.map((word, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
							<Fragment key={`${index}-${word}`}>
								<span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
									<span className="vision-word inline-block">{word}</span>
								</span>
								{index < words.length - 1 ? " " : ""}
							</Fragment>
						))}
					</p>
				</div>

				<h2 className="ml-auto flex max-w-150 flex-col items-start font-medium leading-[1.05] tracking-[-0.02em] text-foreground text-[clamp(2.25rem,4.5vw,4rem)]">
					<span className="block overflow-hidden pb-2">
						<span className="vision-line block">
							<Link
								href="/contact"
								className="group relative inline-block leading-none transition-colors duration-300 hover:text-[var(--brand-coral)]"
							>
								{linkText}
								<span className="vision-underline absolute -bottom-1.5 left-0 h-[3px] w-full origin-left bg-[var(--brand-coral)]" />
							</Link>
						</span>
					</span>
					<span className="block overflow-hidden">
						<span className="vision-line block">{heading}</span>
					</span>
				</h2>
			</div>
		</VisionFx>
	);
}
