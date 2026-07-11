"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	startTransition,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { PageTransition } from "~/components/page-transition";

interface RouterTransition {
	push: (href: string) => void;
	replace: (href: string) => void;
}

export const RouterTransitionContext = createContext<RouterTransition>({
	push() {
		throw new Error("RouterTransitionContextProvider was not initialized");
	},
	replace() {
		throw new Error("RouterTransitionContextProvider was not initialized");
	},
});

const WIPE_DURATION = 0.4;
const WIPE_EASE = "power2.in";
const REVEAL_DURATION = 0.5;
const REVEAL_EASE = "power3.out";

interface RouterTransitionProviderProps {
	children: React.ReactNode;
}

export function RouterTransitionProvider({
	children,
}: RouterTransitionProviderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const lenis = useLenis();

	const overlayRef = useRef<HTMLDivElement>(null);
	const lenisRef = useRef(lenis);
	const isAnimating = useRef(false);
	const pendingPathname = useRef<string | null>(null);
	const reducedMotion = useRef(false);

	const revealRef = useRef<(() => void) | null>(null);
	const wipeRef = useRef<((onComplete: () => void) => void) | null>(null);

	useEffect(() => {
		lenisRef.current = lenis;
	}, [lenis]);

	const resetScroll = useCallback(() => {
		const l = lenisRef.current;
		if (l) {
			l.scrollTo(0, { immediate: true, force: true });
		} else {
			window.scrollTo(0, 0);
		}
	}, []);

	useGSAP(
		(_ctx, contextSafe) => {
			if (!(overlayRef.current && contextSafe)) return;

			reducedMotion.current = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;

			gsap.set(overlayRef.current, { y: 0, yPercent: 100 });

			const reveal = contextSafe(() => {
				const overlay = overlayRef.current;
				if (!overlay) return;
				if (reducedMotion.current) {
					gsap.set(overlay, { yPercent: 100 });
					lenisRef.current?.start();
					isAnimating.current = false;
					return;
				}
				gsap.fromTo(
					overlay,
					{ yPercent: 0 },
					{
						yPercent: -100,
						duration: REVEAL_DURATION,
						ease: REVEAL_EASE,
						onComplete: () => {
							if (!overlayRef.current) return;
							gsap.set(overlayRef.current, { yPercent: 100 });
							lenisRef.current?.start();
							isAnimating.current = false;
						},
					},
				);
			});

			const wipe = contextSafe((onComplete: () => void) => {
				const overlay = overlayRef.current;
				if (!overlay) return;
				if (reducedMotion.current) {
					onComplete();
					return;
				}
				gsap.fromTo(
					overlay,
					{ yPercent: 100 },
					{
						yPercent: 0,
						duration: WIPE_DURATION,
						ease: WIPE_EASE,
						onComplete,
					},
				);
			});

			revealRef.current = reveal;
			wipeRef.current = wipe;

			return () => {
				lenisRef.current?.start();
			};
		},
		{ scope: overlayRef },
	);

	const navigate = useCallback(
		(method: "push" | "replace", href: string) => {
			if (isAnimating.current) return;
			if (href === pathname) return;

			const targetPath = href.split(/[?#]/)[0] ?? href;
			if (targetPath === pathname) {
				router[method](href as Route);
				return;
			}

			if (reducedMotion.current) {
				router[method](href as Route);
				return;
			}

			isAnimating.current = true;
			pendingPathname.current = href;
			lenisRef.current?.stop();

			wipeRef.current?.(() => {
				resetScroll();
				startTransition(() => {
					router[method](href as Route);
				});
			});
		},
		[router, pathname, resetScroll],
	);

	const push = useCallback(
		(href: string) => navigate("push", href),
		[navigate],
	);
	const replace = useCallback(
		(href: string) => navigate("replace", href),
		[navigate],
	);

	useEffect(() => {
		if (!pendingPathname.current) return;
		if (pendingPathname.current !== pathname) return;
		pendingPathname.current = null;

		resetScroll();
		revealRef.current?.();

		const raf = requestAnimationFrame(() => {
			requestAnimationFrame(() => ScrollTrigger.refresh());
		});
		return () => cancelAnimationFrame(raf);
	}, [pathname, resetScroll]);

	return (
		<RouterTransitionContext.Provider value={{ push, replace }}>
			{children}
			<PageTransition ref={overlayRef} />
		</RouterTransitionContext.Provider>
	);
}
