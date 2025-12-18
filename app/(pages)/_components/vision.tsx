"use client";

import { Link } from "~/components/ui/link";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";

export function Vision() {
	const textRef = useFadeInOnScroll<HTMLParagraphElement>({ delay: 0 });
	const headingRef = useFadeInOnScroll<HTMLHeadingElement>({ delay: 0.2 });

	return (
		<section className="relative overflow-hidden bg-muted">
			<div className="pointer-events-none absolute inset-0">
				<svg
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1920 960"
					preserveAspectRatio="xMidYMid meet"
					className="size-full"
				>
					<defs>
						<clipPath id="vision-clip">
							<rect width="1920" height="960" x="0" y="0" />
						</clipPath>
					</defs>
					<g clipPath="url(#vision-clip)">
						<g
							style={{ display: "block" }}
							transform="matrix(1.4,-0.00026,0.00026,1.4,1582,1113)"
							opacity="1"
						>
							<g opacity="1" transform="matrix(1,0,0,1,0,0)">
								<path
									strokeLinecap="round"
									strokeLinejoin="miter"
									fillOpacity="0"
									strokeMiterlimit="4"
									strokeDasharray="2 16"
									strokeDashoffset="0"
									stroke="currentColor"
									className="text-foreground"
									strokeOpacity="1"
									strokeWidth="2"
									d="M-697.263,-226.536 C-601.739,-520.359 -325.498,-733 0,-733"
								/>
							</g>
						</g>
						<g
							style={{ display: "block" }}
							transform="matrix(0.99,-0.99,0.99,0.99,1582,1113)"
							opacity="1"
						>
							<g opacity="1" transform="matrix(1,0,0,1,0,0)">
								<path
									strokeLinecap="round"
									strokeLinejoin="miter"
									fillOpacity="0"
									strokeMiterlimit="4"
									strokeDasharray="2 16"
									strokeDashoffset="0"
									stroke="currentColor"
									className="text-foreground"
									strokeOpacity="1"
									strokeWidth="2"
									d="M-599.285,-194.704 C-517.184,-447.239 -279.76,-630 0,-630"
								/>
							</g>
						</g>
					</g>
				</svg>
			</div>

			<div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 px-6 py-40 md:px-12 lg:px-24">
				<p
					ref={textRef}
					className="max-w-[447px] text-lg font-medium leading-relaxed text-foreground"
				>
					We have the perfect combination of mindset, skills, processes, and
					pricing structure. Together, we&apos;ll transform your ideas into the
					best-in-class digital experience.
				</p>

				<h2
					ref={headingRef}
					className="ml-auto flex max-w-[600px] flex-col items-start text-5xl font-normal leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
				>
					<Link
						href="/contact"
						className="mb-4 border-b-4 border-foreground leading-none transition-colors duration-200 hover:border-transparent"
					>
						Let&apos;s talk
					</Link>
					<span>about your vision.</span>
				</h2>
			</div>
		</section>
	);
}
