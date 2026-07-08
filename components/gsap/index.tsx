"use client";

import gsap from "gsap";
import { useTempus } from "tempus/react";

if (typeof window !== "undefined") {
	gsap.ticker.lagSmoothing(0);
	gsap.ticker.remove(gsap.updateRoot);
}

export function GSAPRuntime() {
	useTempus((time) => {
		gsap.updateRoot(time / 1000);
	});

	return null;
}
