import gsap from "gsap";

export const REVEAL = {
	ease: "expo.out",
	duration: 0.9,
	y: 32,
	start: "top 80%",
	toggleActions: "play reverse play reverse",
} as const;

type MotionCleanup = () => void;

export function withMotion(
	// biome-ignore lint/suspicious/noConfusingVoidType: setup may return cleanup or nothing, matching useGSAP's callback signature
	setup: () => MotionCleanup | void,
	onReduced?: () => void,
): MotionCleanup {
	const mm = gsap.matchMedia();
	mm.add(
		{
			animated: "(prefers-reduced-motion: no-preference)",
			reduced: "(prefers-reduced-motion: reduce)",
		},
		(ctx) => {
			const { animated, reduced } = ctx.conditions as {
				animated: boolean;
				reduced: boolean;
			};
			if (animated) return setup();
			if (reduced) onReduced?.();
		},
	);
	return () => mm.revert();
}
