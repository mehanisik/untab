"use client";

import { useGSAP } from "@gsap/react";
import cn from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Image, type ImageProps } from "~/components/ui/image";
import { REVEAL, withMotion } from "~/libs/gsap/presets";

export type AnimatedImageProps = ImageProps & {
	/** Sizes the frame (aspect ratio, width). The image fills it. */
	wrapperClassName?: string;
	/**
	 * "scroll" (default): reveal plays once the image is loaded AND the frame
	 * scrolls into view, replaying bidirectionally like the section reveals.
	 * "load": plays as soon as the image loads — for above-fold images.
	 */
	reveal?: "scroll" | "load";
};

/**
 * Clip-path curtain reveal: the frame wipes open bottom-to-top while the
 * image counter-zooms from 1.3 to rest. Waits for the actual image load
 * (not just mount) so the curtain never opens onto a placeholder.
 */
export function AnimatedImage({
	wrapperClassName,
	reveal = "scroll",
	onLoad,
	ref,
	...props
}: AnimatedImageProps) {
	const frameRef = useRef<HTMLDivElement>(null);
	const zoomRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [loaded, setLoaded] = useState(false);

	// Cached images can be complete before hydration, in which case React
	// never fires onLoad — without this check the image would stay hidden.
	useEffect(() => {
		if (imgRef.current?.complete) setLoaded(true);
	}, []);

	useGSAP(
		() =>
			withMotion(() => {
				const frame = frameRef.current;
				const zoom = zoomRef.current;
				if (!(frame && zoom)) return;

				// Hidden pre-reveal state. useGSAP runs in a layout effect, so
				// this lands before first paint — no flash of the full image.
				gsap.set(frame, { clipPath: "inset(100% 0 0 0)" });
				gsap.set(zoom, { scale: 1.3 });

				if (!loaded) return;

				const tl = gsap.timeline({
					defaults: { duration: 1.1, ease: REVEAL.ease },
					scrollTrigger:
						reveal === "scroll"
							? {
									trigger: frame,
									start: REVEAL.start,
									toggleActions: REVEAL.toggleActions,
								}
							: undefined,
				});
				tl.to(frame, { clipPath: "inset(0% 0 0 0)" }).to(zoom, { scale: 1 }, 0);
			}),
		{ dependencies: [loaded, reveal], revertOnUpdate: true, scope: frameRef },
	);

	return (
		<div
			ref={frameRef}
			className={cn("relative overflow-hidden", wrapperClassName)}
		>
			{/* The zoom layer is the positioned ancestor for fill-mode images, so
			    the counter-scale moves the image and its frame stays clipped. */}
			<div ref={zoomRef} className="relative size-full">
				<Image
					{...props}
					ref={(node: HTMLImageElement | null) => {
						imgRef.current = node;
						if (typeof ref === "function") ref(node);
						else if (ref) ref.current = node;
					}}
					onLoad={(event) => {
						setLoaded(true);
						onLoad?.(event);
					}}
				/>
			</div>
		</div>
	);
}
