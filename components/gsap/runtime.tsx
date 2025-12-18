"use client";

import dynamic from "next/dynamic";
import { ScrollTrigger } from "./scroll-trigger";

const GSAP = dynamic(() => import("./index").then((m) => m.GSAP), {
	ssr: false,
});

export function GSAPRuntime() {
	return (
		<>
			<GSAP />
			<ScrollTrigger />
		</>
	);
}
