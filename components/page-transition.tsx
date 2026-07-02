"use client";

import { forwardRef } from "react";

interface PageTransitionProps {
	className?: string;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
	function PageTransition({ className }, ref) {
		return (
			<div
				ref={ref}
				aria-hidden
				style={{ transform: "translateY(100%)" }}
				className={
					className ??
					"fixed inset-0 z-[200] pointer-events-none bg-foreground will-change-transform"
				}
			/>
		);
	},
);
