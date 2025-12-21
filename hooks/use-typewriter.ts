"use client";

import { useEffect, useState, useEffectEvent } from "react";

interface UseTypewriterOptions {
	speed?: number;
	delayBeforeComplete?: number;
	onComplete?: () => void;
}

/**
 * useTypewriter
 * 
 * Custom hook to handle typewriter logic with React 19 best practices.
 * 
 * @param text - The text to animate
 * @param options - Configuration options (speed, delay, onComplete)
 */
export function useTypewriter(
	text: string,
	options: UseTypewriterOptions = {},
) {
	const { speed = 35, delayBeforeComplete = 500, onComplete } = options;
	const [displayedText, setDisplayedText] = useState("");
	const [index, setIndex] = useState(0);
	const [prevText, setPrevText] = useState(text);

	if (text !== prevText) {
		setPrevText(text);
		setDisplayedText("");
		setIndex(0);
	}

	const onCompleteEvent = useEffectEvent(() => {
		onComplete?.();
	});

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		if (index < text.length) {
			timeout = setTimeout(() => {
				setDisplayedText((prev) => prev + text[index]);
				setIndex((prev) => prev + 1);
			}, speed);
		} else {
			timeout = setTimeout(onCompleteEvent, delayBeforeComplete);
		}

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [index, text, speed, delayBeforeComplete]);

	return {
		displayedText,
		index,
		isFinished: index >= text.length,
	};
}
