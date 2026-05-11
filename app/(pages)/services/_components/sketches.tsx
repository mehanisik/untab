import type { SVGProps } from "react";

const baseProps: SVGProps<SVGSVGElement> = {
	xmlns: "http://www.w3.org/2000/svg",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.4,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	viewBox: "0 0 100 100",
	"aria-hidden": true,
};

export function StrategySketch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...baseProps} {...props}>
			<title>Strategy</title>
			<path d="M50 12 C 72 14, 88 30, 88 50 C 87 71, 72 86, 50 88 C 28 87, 13 72, 12 50 C 12 30, 28 14, 50 12 Z" />
			<path d="M50 50 L 64 30" />
			<path d="M50 50 L 38 64" />
			<circle cx="50" cy="50" r="2.4" fill="currentColor" />
			<path d="M 50 8 L 52 14 L 48 14 Z" fill="currentColor" />
			<path d="M 18 78 q 4 -2 9 0" opacity="0.55" />
		</svg>
	);
}

export function BrandSketch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...baseProps} {...props}>
			<title>Brand</title>
			<path d="M 18 22 C 28 18, 60 17, 82 22 C 84 32, 84 60, 82 78 C 60 82, 28 81, 18 78 C 16 60, 16 32, 18 22 Z" />
			<path d="M 26 30 C 32 28, 60 27, 74 30" opacity="0.6" />
			<path d="M 50 38 L 53 47 L 62 47 L 55 53 L 58 62 L 50 56 L 42 62 L 45 53 L 38 47 L 47 47 Z" />
			<path d="M 28 70 q 22 -4 44 0" opacity="0.6" />
		</svg>
	);
}

export function WebsiteSketch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...baseProps} {...props}>
			<title>Website</title>
			<path d="M 14 22 C 30 19, 70 19, 86 22 C 87 38, 87 72, 86 80 C 70 82, 30 82, 14 80 C 13 70, 13 38, 14 22 Z" />
			<path d="M 14 34 C 30 33, 70 33, 86 34" />
			<circle cx="22" cy="28" r="1.8" fill="currentColor" />
			<circle cx="29" cy="28" r="1.8" fill="currentColor" />
			<circle cx="36" cy="28" r="1.8" fill="currentColor" />
			<path d="M 24 46 C 38 45, 64 45, 76 46" opacity="0.6" />
			<path d="M 24 56 C 38 55, 56 55, 64 56" opacity="0.45" />
			<path d="M 24 66 C 38 65, 70 65, 76 66" opacity="0.6" />
		</svg>
	);
}

export function ProductSketch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...baseProps} {...props}>
			<title>Product</title>
			<path d="M 32 10 C 44 8, 56 8, 68 10 C 70 26, 70 74, 68 90 C 56 92, 44 92, 32 90 C 30 74, 30 26, 32 10 Z" />
			<path d="M 32 22 C 44 21, 56 21, 68 22" />
			<path d="M 32 80 C 44 81, 56 81, 68 80" />
			<path d="M 38 32 C 46 31, 54 31, 62 32" opacity="0.55" />
			<path d="M 38 42 C 46 41, 58 41, 62 42" opacity="0.4" />
			<path d="M 38 56 q 6 -3 12 0 q 6 3 12 0" opacity="0.6" />
			<circle cx="50" cy="86" r="1.8" />
		</svg>
	);
}

export function DevelopmentSketch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...baseProps} {...props}>
			<title>Development</title>
			<path d="M 30 26 C 22 32, 14 42, 12 50 C 14 58, 22 68, 30 74" />
			<path d="M 70 26 C 78 32, 86 42, 88 50 C 86 58, 78 68, 70 74" />
			<path d="M 58 22 C 56 38, 50 60, 42 78" opacity="0.7" />
		</svg>
	);
}
