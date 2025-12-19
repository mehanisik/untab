"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { THEME_REGISTRY, DEFAULT_THEME, type ThemeTokens } from "~/libs/themes";

/**
 * useAdaptiveTheme
 *
 * Smoothly transitions the site's primary UI tokens (CSS variables)
 * based on the provided theme key or specific tokens.
 */
export function useAdaptiveTheme(themeKey?: string) {
	const lastThemeRef = useRef<ThemeTokens>(DEFAULT_THEME);

	useEffect(() => {
		const targetTheme = (themeKey && THEME_REGISTRY[themeKey]) || DEFAULT_THEME;

		if (JSON.stringify(targetTheme) === JSON.stringify(lastThemeRef.current))
			return;

		const root = document.documentElement;

		// GSAP proxy object to animate values
		const proxy = {
			primary: lastThemeRef.current.primary,
		};

		gsap.to(proxy, {
			primary: targetTheme.primary,
			duration: 0.8,
			ease: "power2.out",
			onUpdate: () => {
				root.style.setProperty("--primary", proxy.primary);
				// Also update sidebar primary if needed
				root.style.setProperty("--sidebar-primary", proxy.primary);
			},
			onComplete: () => {
				lastThemeRef.current = targetTheme;
			},
		});

		// Cleanup if needed (though global state persists)
	}, [themeKey]);

	return { currentTheme: themeKey };
}
