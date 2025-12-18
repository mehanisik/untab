"use client";

import { useRect, useWindowSize } from "hamo";
import { useLenis } from "lenis/react";
import { useEffect, useEffectEvent, useRef } from "react";
import { clamp, mapRange } from "~/libs/utils";

export type UseScrollTriggerOptions = {
	start?: string;
	end?: string;
	offset?: number;
	disabled?: boolean;
	onEnter?: ({ progress }: { progress: number }) => void;
	onLeave?: ({ progress }: { progress: number }) => void;
	onProgress?: (data: { progress: number; isInView: boolean }) => void;
};

export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
	options: UseScrollTriggerOptions = {},
	deps: unknown[] = [],
) {
	const {
		start = "bottom bottom",
		end = "top top",
		offset = 0,
		disabled = false,
		onEnter,
		onLeave,
		onProgress,
	} = options;

	const elementRef = useRef<T>(null);
	const [setRectRef, rect] = useRect();
	const lenis = useLenis();
	const { height: windowHeight = 0 } = useWindowSize();
	const lastProgressRef = useRef<number>(-1);

	const isReady = rect?.top !== undefined;

	const [elementStartKeyword, viewportStartKeyword] = start.split(" ");
	const [elementEndKeyword, viewportEndKeyword] = end.split(" ");

	let viewportStart = 0;
	if (viewportStartKeyword === "top") viewportStart = 0;
	else if (viewportStartKeyword === "center")
		viewportStart = windowHeight * 0.5;
	else if (viewportStartKeyword === "bottom") viewportStart = windowHeight;
	else viewportStart = Number.parseFloat(viewportStartKeyword) || 0;

	let viewportEnd = 0;
	if (viewportEndKeyword === "top") viewportEnd = 0;
	else if (viewportEndKeyword === "center") viewportEnd = windowHeight * 0.5;
	else if (viewportEndKeyword === "bottom") viewportEnd = windowHeight;
	else viewportEnd = Number.parseFloat(viewportEndKeyword) || 0;

	let elementStart = rect?.bottom || 0;
	if (elementStartKeyword === "top") elementStart = rect?.top || 0;
	else if (elementStartKeyword === "center")
		elementStart = (rect?.top || 0) + (rect?.height || 0) * 0.5;
	else if (elementStartKeyword === "bottom") elementStart = rect?.bottom || 0;
	elementStart += offset;

	let elementEnd = rect?.top || 0;
	if (elementEndKeyword === "top") elementEnd = rect?.top || 0;
	else if (elementEndKeyword === "center")
		elementEnd = (rect?.top || 0) + (rect?.height || 0) * 0.5;
	else if (elementEndKeyword === "bottom") elementEnd = rect?.bottom || 0;
	elementEnd += offset;

	const startValue = elementStart - viewportStart;
	const endValue = elementEnd - viewportEnd;

	const handleProgress = useEffectEvent((progress: number) => {
		const lastProgress = lastProgressRef.current;
		const clampedProgress = clamp(0, progress, 1);
		const isInView = progress >= 0 && progress <= 1;

		if (
			(progress >= 0 && lastProgress < 0) ||
			(progress <= 1 && lastProgress > 1)
		) {
			onEnter?.({ progress: clampedProgress });
		}

		onProgress?.({ progress: clampedProgress, isInView });

		if (
			(progress < 0 && lastProgress >= 0) ||
			(progress > 1 && lastProgress <= 1)
		) {
			onLeave?.({ progress: clampedProgress });
		}

		lastProgressRef.current = progress;
	});

	const update = useEffectEvent(() => {
		if (disabled || !isReady) return;

		const scroll = lenis?.scroll ?? window.scrollY;
		const progress = mapRange(startValue, endValue, scroll, 0, 1);
		handleProgress(progress);
	});

	useLenis(update);

	useEffect(() => {
		if (lenis) return;
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [lenis, ...deps]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(update, [update, rect, ...deps]);

	const setRef = (el: T | null) => {
		(elementRef as React.MutableRefObject<T | null>).current = el;
		setRectRef(el);
	};

	return { ref: setRef, progress: lastProgressRef.current };
}

export function useFadeInOnScroll<T extends HTMLElement = HTMLDivElement>(
	options: { threshold?: number; delay?: number } = {},
) {
	const { threshold = 0.2, delay = 0 } = options;
	const elementRef = useRef<T>(null);
	const hasAnimatedRef = useRef(false);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		element.style.opacity = "0";
		element.style.transform = "translateY(60px) scale(0.95)";
		element.style.transition = `opacity 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimatedRef.current) {
					hasAnimatedRef.current = true;
					element.style.opacity = "1";
					element.style.transform = "translateY(0) scale(1)";
				}
			},
			{ threshold },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [threshold, delay]);

	return elementRef;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
	speed = 0.5,
) {
	const elementRef = useRef<T>(null);
	const lenis = useLenis();

	const update = useEffectEvent(() => {
		const element = elementRef.current;
		if (!element) return;

		const rect = element.getBoundingClientRect();
		const scrollY = lenis?.scroll ?? window.scrollY;
		const elementTop = rect.top + scrollY;
		const windowHeight = window.innerHeight;

		const progress =
			(scrollY - elementTop + windowHeight) / (windowHeight + rect.height);
		const offset = (progress - 0.5) * speed * 100;

		element.style.transform = `translateY(${offset}px)`;
	});

	useLenis(update);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		update();
		if (!lenis) {
			window.addEventListener("scroll", update, { passive: true });
			return () => window.removeEventListener("scroll", update);
		}
		return undefined;
	}, [lenis, update]);

	return elementRef;
}
