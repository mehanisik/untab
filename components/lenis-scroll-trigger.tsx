"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useEffect, useEffectEvent } from "react";

export function LenisScrollTriggerSync() {
	const handleUpdate = useEffectEvent(() => {
		ScrollTrigger.update();
	});

	const handleRefresh = useEffectEvent(() => {
		ScrollTrigger.refresh();
	});

	const lenis = useLenis(handleUpdate);

	useEffect(() => {
		if (lenis) {
			handleRefresh();
		}
	}, [lenis]);

	return null;
}
