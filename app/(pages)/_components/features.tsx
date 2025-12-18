"use client";

import { cn } from "~/libs/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Rocket01Icon,
	Shield02Icon,
	Time01Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import { useEffect, useRef, useState } from "react";

const features = [
	{
		icon: Rocket01Icon,
		title: "Vision to Reality",
		description:
			"Transform your vision into an outstanding digital experience. We don't just build software; we craft digital ecosystems that scale and perform.",
	},
	{
		icon: Shield02Icon,
		title: "Risk Mitigation",
		description:
			"Increase your probability of success by mitigating technical risks early. Our architecture reviews and stress testing ensure your platform stands the test of time.",
	},
	{
		icon: Time01Icon,
		title: "Expert Efficiency",
		description:
			"Save time by accessing an experienced team committed to your success. We leverage modern stack capabilities to deliver faster without compromising quality.",
	},
	{
		icon: UserGroupIcon,
		title: "Collaborative Space",
		description:
			"Find a safe space to reach the best outcome through collaborative decision-making. We work as an extension of your team, providing transparent communication.",
	},
];

function FeatureCard({
	feature,
	index,
	onVisible,
}: {
	feature: (typeof features)[0];
	index: number;
	onVisible: (index: number) => void;
}) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsActive(entry.isIntersecting);
				if (entry.isIntersecting) {
					onVisible(index);
				}
			},
			{
				threshold: 0.6,
				rootMargin: "-20% 0px -20% 0px",
			},
		);

		if (cardRef.current) observer.observe(cardRef.current);
		return () => observer.disconnect();
	}, [index, onVisible]);

	return (
		<div
			ref={cardRef}
			className={cn(
				"group relative transition-all duration-700",
				isActive ? "opacity-100" : "opacity-30",
			)}
		>
			<div className="flex gap-8 items-start">
				<span
					className={cn(
						"text-7xl font-light tabular-nums transition-colors duration-500 md:text-8xl lg:text-9xl",
						isActive ? "text-foreground" : "text-muted-foreground/20",
					)}
				>
					{String(index + 1).padStart(2, "0")}
				</span>

				<div className="flex-1 pt-4">
					<div className="flex items-center gap-4 mb-4">
						<div
							className={cn(
								"flex size-10 items-center justify-center rounded-full transition-all duration-500",
								isActive
									? "bg-foreground text-background"
									: "bg-muted text-muted-foreground",
							)}
						>
							<HugeiconsIcon
								icon={feature.icon}
								className="size-5"
								strokeWidth={1.5}
							/>
						</div>
						<h3
							className={cn(
								"text-2xl font-medium tracking-tight text-foreground md:text-3xl",
							)}
						>
							{feature.title}
						</h3>
					</div>
					<p
						className={cn(
							"text-muted-foreground leading-relaxed text-base font-light max-w-lg transition-all duration-500",
							isActive ? "opacity-100" : "opacity-60",
						)}
					>
						{feature.description}
					</p>
				</div>
			</div>

			<div
				className={cn(
					"mt-12 h-px w-full transition-all duration-700",
					isActive ? "bg-border" : "bg-border/30",
				)}
			/>
		</div>
	);
}

export function Features() {
	const headerRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<section className="relative bg-background py-24 md:py-32 lg:py-48">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
					<div className="relative hidden lg:block">
						<div className="sticky top-32 flex flex-col justify-center min-h-[60vh]">
							<div ref={headerRef}>
								<h2 className="mb-8 text-5xl font-medium tracking-tight text-foreground lg:text-7xl">
									How we work
								</h2>

								<p className="mb-12 text-lg text-muted-foreground leading-relaxed font-light max-w-md">
									Strike the optimal balance between investment and impact. We
									work as a true partner to help you build not just software,
									but a sustainable business advantage.
								</p>

								<div className="flex items-center gap-3">
									<span className="text-sm text-muted-foreground tabular-nums">
										{String(activeIndex + 1).padStart(2, "0")}
									</span>
									<div className="h-px flex-1 max-w-32 bg-border overflow-hidden">
										<div
											className="h-full bg-foreground transition-all duration-500"
											style={{
												width: `${((activeIndex + 1) / features.length) * 100}%`,
											}}
										/>
									</div>
									<span className="text-sm text-muted-foreground/50 tabular-nums">
										{String(features.length).padStart(2, "0")}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:hidden mb-12">
						<h2 className="mb-4 text-4xl font-medium tracking-tight text-foreground">
							How we work
						</h2>
						<p className="text-base text-muted-foreground font-light leading-relaxed">
							Strike the optimal balance between investment and impact.
						</p>
					</div>

					<div className="flex flex-col gap-16 lg:gap-32 py-12 lg:py-[10vh]">
						{features.map((feature, index) => (
							<FeatureCard
								key={feature.title}
								feature={feature}
								index={index}
								onVisible={setActiveIndex}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
