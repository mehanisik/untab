"use client";

import type { HTMLAttributes } from "react";
import { cn } from "~/libs/utils";
import { Lenis } from "./lenis-provider";

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	lenis?: boolean;
}

export function Wrapper({
	children,
	className,
	lenis = true,
	...props
}: WrapperProps) {
	const content = (
		<div
			{...props}
			className={cn(
				"relative flex min-h-screen w-full flex-col transition-colors duration-500 bg-background text-foreground",
				className,
			)}
		>
			{children}
		</div>
	);

	if (lenis) {
		return (
			<Lenis root options={{}}>
				{content}
			</Lenis>
		);
	}

	return content;
}
