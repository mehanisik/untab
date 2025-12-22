"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	ArrowDown01Icon,
	ArrowUp01Icon,
	PlayCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import { cn } from "~/libs/utils";

const quotes = [
	{
		quote:
			"Untab hit a very big and important thing that we really enjoyed working with the team on: the idea that there are these patterns that people expect with any UX, and they can fit into any different world. That's what hasn't happened in golf; people haven't built something the way people expect it to work.",
		name: "Eric Mayville",
		role: "Co-founder and CEO of Fairgame",
		location: "New York — US",
		company: "Fairgame",
		initials: "EM",
	},
	{
		quote:
			"When I met the team, the whole philosophy of zero to one resonated with me. I got the sense in the early days that my success was the firm's success, which felt good.",
		name: "Matt Stein",
		role: "Founder",
		location: "New Hampshire — US",
		company: "Wheeli",
		initials: "MS",
	},
	{
		quote:
			"They really understood the why behind everything, which made me immediately trust the team and the process. I felt confident that engineering and design could come together to create something beautiful and simple.",
		name: "Chiara Pastorelli",
		role: "Founder of Applicate",
		location: "Dubai — UAE",
		company: "Applicate",
		initials: "CP",
	},
	{
		quote:
			"The partnership has been invaluable. We feel very grateful for all the hard work the team made to make our vision a reality.",
		name: "Chris Motley",
		role: "Founder and CEO of Mentor Spaces",
		location: "Colorado — US",
		company: "Mentor Spaces",
		initials: "CM",
	},
];

interface WordsWorthBillionsProps {
	title?: string;
	testimonials?: {
		quote: string;
		name: string;
		role: string;
		location: string;
		company: string;
		initials: string;
	}[];
}

export function WordsWorthBillions({
	title = "Words worth billions",
	testimonials,
}: WordsWorthBillionsProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const headingRef = useFadeInOnScroll<HTMLHeadingElement>({ delay: 0 });
	const contentRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0.2 });

	const displayTestimonials = testimonials || quotes;

	const goNext = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
			setIsAnimating(false);
		}, 300);
	};

	const goPrev = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex(
				(prev) =>
					(prev - 1 + displayTestimonials.length) % displayTestimonials.length,
			);
			setIsAnimating(false);
		}, 300);
	};

	const currentQuote = displayTestimonials[currentIndex];

	return (
		<section className="bg-background py-20 md:py-32">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<h2
					ref={headingRef}
					className="mb-12 md:mb-16 text-3xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl"
				>
					{title}
				</h2>

				<div ref={contentRef} className="relative">
					<div className="mb-12 flex items-center justify-between border-t border-dashed border-muted-foreground/30 pt-8">
						<div className="flex-1" />
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={goPrev}
								className="flex size-10 items-center justify-center rounded-full border border-muted-foreground/50 text-muted-foreground transition-all hover:border-foreground hover:text-foreground hover:scale-110 active:scale-95"
								aria-label="Previous testimonial"
							>
								<HugeiconsIcon
									icon={ArrowUp01Icon}
									className="size-4"
									strokeWidth={2}
								/>
							</button>
							<button
								type="button"
								onClick={goNext}
								className="flex size-10 items-center justify-center rounded-full border border-muted-foreground/50 text-muted-foreground transition-all hover:border-foreground hover:text-foreground hover:scale-110 active:scale-95"
								aria-label="Next testimonial"
							>
								<HugeiconsIcon
									icon={ArrowDown01Icon}
									className="size-4"
									strokeWidth={2}
								/>
							</button>
						</div>
					</div>

					<div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
						<div className="flex items-start">
							<button
								type="button"
								className="flex size-12 items-center justify-center rounded-full border border-muted-foreground/50 text-muted-foreground transition-all hover:border-foreground hover:text-foreground hover:scale-110 active:scale-95"
								aria-label="Play video testimonial"
							>
								<HugeiconsIcon
									icon={PlayCircle02Icon}
									className="size-5"
									strokeWidth={2}
								/>
							</button>
						</div>

						<div
							className={cn(
								"space-y-8 transition-all duration-300",
								isAnimating
									? "opacity-0 translate-y-4"
									: "opacity-100 translate-y-0",
							)}
						>
							<blockquote className="text-lg font-medium leading-relaxed text-foreground sm:text-xl md:text-2xl lg:text-3xl">
								{currentQuote.quote}
							</blockquote>

							<div className="flex items-center gap-3">
								<Avatar size="sm">
									<AvatarImage
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentQuote.initials}`}
										alt={currentQuote.name}
									/>
									<AvatarFallback>{currentQuote.initials}</AvatarFallback>
								</Avatar>
								<p className="text-sm text-muted-foreground">
									{currentQuote.name}, {currentQuote.role}.{" "}
									{currentQuote.location}
								</p>
							</div>

							<p className="text-2xl font-semibold italic text-foreground md:text-3xl">
								{currentQuote.company}
							</p>
						</div>
					</div>

					<div className="mt-12 flex justify-center gap-2">
						{displayTestimonials.map((quote, index) => (
							<button
								type="button"
								key={quote.name}
								onClick={() => {
									if (isAnimating) return;
									setIsAnimating(true);
									setTimeout(() => {
										setCurrentIndex(index);
										setIsAnimating(false);
									}, 300);
								}}
								className={cn(
									"h-1 rounded-full transition-all duration-300",
									index === currentIndex
										? "w-8 bg-foreground"
										: "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
								)}
								aria-label={`Go to quote ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
