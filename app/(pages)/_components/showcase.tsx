"use client";

import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/libs/utils";

function AnimatedLine() {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.3 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className="mx-5 mt-8 flex max-h-[557px] flex-col items-center gap-6"
		>
			<div
				className={cn(
					"size-[34px] shrink-0 transition-all duration-700",
					isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50",
				)}
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 34 34"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="size-full"
				>
					<circle
						cx="17"
						cy="17"
						r="2"
						fill="currentColor"
						fillOpacity="0.95"
						className="text-foreground"
					/>
					<rect
						x="0.5"
						y="0.5"
						width="33"
						height="33"
						rx="16.5"
						stroke="currentColor"
						className="text-foreground"
					/>
				</svg>
			</div>

			<div
				className={cn(
					"w-px flex-1 origin-top bg-muted-foreground/30 transition-transform duration-1000 ease-out",
					isVisible ? "scale-y-100" : "scale-y-0",
				)}
				style={{ transitionDelay: "300ms" }}
			/>

			<div
				className={cn(
					"size-[34px] shrink-0 transition-all duration-700",
					isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50",
				)}
				style={{ transitionDelay: "800ms" }}
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 34 34"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="size-full"
				>
					<circle
						cx="17"
						cy="17"
						r="2"
						fill="currentColor"
						fillOpacity="0.95"
						className="text-foreground"
					/>
					<rect
						x="0.5"
						y="0.5"
						width="33"
						height="33"
						rx="16.5"
						stroke="currentColor"
						className="text-foreground"
					/>
				</svg>
			</div>
		</div>
	);
}

export function Showcase() {
	const titleRef = useFadeInOnScroll<HTMLHeadingElement>({ delay: 0 });
	const contentRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0.4 });

	return (
		<section id="showcase" className="relative min-h-dvh bg-background py-24">
			<div className="mx-auto flex max-w-[1440px] justify-between px-6 md:px-12 lg:px-24">
				<h2
					ref={titleRef}
					className="text-3xl font-medium tracking-tight text-foreground md:text-4xl"
				>
					What we deliver
				</h2>

				<AnimatedLine />

				<div
					ref={contentRef}
					className="mt-[544px] flex max-w-[559px] flex-col gap-8"
				>
					<h3 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
						Minimum
						<br />
						Perfect
						<br />
						Experiences
					</h3>
					<p className="text-base text-muted-foreground">
						Digital products, webapps, mobile apps, brands and marketing
						websites you&apos;ll be excited to put in front of your customers
						and investors.
					</p>
				</div>
			</div>
		</section>
	);
}
