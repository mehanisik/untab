"use client";

import { useTypewriter } from "~/hooks/use-typewriter";
import { cn } from "~/libs/utils";

interface TypewriterProps {
	text: string;
	onComplete?: () => void;
	className?: string;
}

export const Typewriter = ({
	text,
	onComplete,
	className,
}: TypewriterProps) => {
	const { displayedText, isFinished } = useTypewriter(text, {
		onComplete,
		speed: 40,
	});

	return (
		<div className={cn("min-h-[1.2em]", className)}>
			{displayedText}
			{!isFinished && (
				<span className="inline-block w-2 h-[0.7em] bg-primary/40 ml-1 animate-pulse align-middle" />
			)}
		</div>
	);
};
