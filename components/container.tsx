import type { HTMLAttributes } from "react";
import { cn } from "~/libs/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-24",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
