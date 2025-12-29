"use client";

import { useRef } from "react";

export function BackgroundMesh() {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 overflow-hidden pointer-events-none z-0"
		>
			<div className="absolute inset-0 bg-background" />

			{/* Grain Overlay */}
			<div
				className="grain-bg absolute inset-0 opacity-[0.01] dark:opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage:
						'url("https://grainy-gradients.vercel.app/noise.svg")',
					filter: "contrast(150%) brightness(100%)",
				}}
			/>
		</div>
	);
}
