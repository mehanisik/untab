import { gsap } from "gsap";

/**
 * GSAP Animation Registry & Presets
 * Standardized high-fidelity motion sequences for Untab Studio.
 */

export const EASINGS = {
	expoOut: "expo.out",
	expoInOut: "expo.inOut",
	power4Out: "power4.out",
	power2Out: "power2.out",
	elasticOut: "elastic.out(1, 0.3)",
	backOut: "back.out(1.7)",
};

export const ANIMATIONS = {
	/** Standard reveal from bottom */
	revealUp: (el: gsap.TweenTarget, vars: gsap.TweenVars = {}) => {
		return gsap.from(el, {
			y: 60,
			opacity: 0,
			duration: 1.2,
			ease: EASINGS.expoOut,
			...vars,
		});
	},

	/** Fade in sequence */
	fadeIn: (el: gsap.TweenTarget, vars: gsap.TweenVars = {}) => {
		return gsap.from(el, {
			opacity: 0,
			duration: 0.8,
			ease: "power2.out",
			...vars,
		});
	},

	/** Staggered list items reveal */
	staggerReveal: (el: gsap.TweenTarget, vars: gsap.TweenVars = {}) => {
		return gsap.from(el, {
			y: 30,
			opacity: 0,
			duration: 1,
			stagger: 0.1,
			ease: EASINGS.expoOut,
			...vars,
		});
	},

	/** Subtle scale-up on hover */
	hoverScale: (el: gsap.TweenTarget) => {
		return gsap.to(el, {
			scale: 1.02,
			duration: 0.4,
			ease: EASINGS.power4Out,
		});
	},
};
