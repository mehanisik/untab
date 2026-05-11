import type { HTMLAttributes } from "react";
import { cn } from "~/libs/utils";

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function Wrapper({ children, className, ...props }: WrapperProps) {
	return (
		<div
			{...props}
			className={cn(
				"relative flex w-full flex-col transition-colors duration-500 bg-background text-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
}
