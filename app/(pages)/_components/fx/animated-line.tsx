"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/libs/utils";

export function AnimatedLine() {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
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
					"w-px flex-1 origin-top bg-muted-foreground/30 transition-transform delay-300 duration-1000 ease-out",
					isVisible ? "scale-y-100" : "scale-y-0",
				)}
			/>

			<div
				className={cn(
					"size-[34px] shrink-0 transition-all delay-[800ms] duration-700",
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
		</div>
	);
}
