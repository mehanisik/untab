"use client";

import { useGSAP } from "@gsap/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Logo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { Link } from "~/components/ui/link";

const leftNavLinks = [
	{ label: "Services", href: "/services" },
	{ label: "Work", href: "/work" },
];

const rightNavLinks = [
	{ label: "About", href: "/about" },
	{ label: "Blog", href: "/blog" },
];

const mobileNavLinks = [
	...leftNavLinks,
	...rightNavLinks,
	{ label: "Contact", href: "/contact" },
];

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const containerRef = useRef<HTMLElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuItemsRef = useRef<HTMLDivElement>(null);

	const onScroll = useEffectEvent(() => {
		setIsScrolled(window.scrollY > 50);
	});

	useEffect(() => {
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isMenuOpen]);

	useGSAP(
		() => {
			const reduced = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;
			let duration = 0.3;
			let stagger: number | { each: number; from: "end" } = {
				each: 0.04,
				from: "end",
			};
			if (reduced) {
				duration = 0;
				stagger = 0;
			} else if (isScrolled) {
				duration = 0.5;
				stagger = 0.06;
			}

			if (isScrolled) {
				gsap.to(".scroll-nav-left .scroll-nav-item", {
					opacity: 1,
					x: 0,
					duration,
					stagger,
					ease: "expo.out",
					pointerEvents: "auto",
				});
				gsap.to(".scroll-nav-right .scroll-nav-item", {
					opacity: 1,
					x: 0,
					duration,
					stagger,
					ease: "expo.out",
					pointerEvents: "auto",
				});
			} else {
				gsap.to(".scroll-nav-left .scroll-nav-item", {
					opacity: 0,
					x: 12,
					duration,
					stagger,
					ease: "power2.in",
					pointerEvents: "none",
				});
				gsap.to(".scroll-nav-right .scroll-nav-item", {
					opacity: 0,
					x: -12,
					duration,
					stagger,
					ease: "power2.in",
					pointerEvents: "none",
				});
			}
		},
		{ dependencies: [isScrolled], scope: containerRef },
	);

	useGSAP(
		() => {
			const reduced = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;
			if (isMenuOpen) {
				gsap.to(menuRef.current, {
					height: "100dvh",
					duration: reduced ? 0 : 0.6,
					ease: "expo.out",
				});
				gsap.to(".mobile-nav-item", {
					opacity: 1,
					y: 0,
					stagger: reduced ? 0 : 0.1,
					delay: reduced ? 0 : 0.2,
					duration: reduced ? 0 : 0.6,
					ease: "power3.out",
				});
			} else {
				gsap.to(".mobile-nav-item", {
					opacity: 0,
					y: 20,
					duration: reduced ? 0 : 0.3,
					ease: "power3.in",
				});
				gsap.to(menuRef.current, {
					height: 0,
					duration: reduced ? 0 : 0.5,
					ease: "expo.inOut",
					delay: reduced ? 0 : 0.1,
				});
			}
		},
		{ dependencies: [isMenuOpen], scope: containerRef },
	);

	return (
		<header
			ref={containerRef}
			className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md"
		>
			<nav className="container grid h-14 grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 lg:px-24">
				<div className="flex items-center justify-between gap-6">
					<Link href="/" className="flex items-center gap-2" aria-label="Home">
						<Logo showText={false} />
					</Link>
					<div className="scroll-nav-left hidden items-center gap-7 md:flex">
						{leftNavLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="scroll-nav-item font-sans text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
								style={{ opacity: 0, transform: "translateX(12px)" }}
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<Link
					href="/"
					className="flex flex-col items-center leading-none px-10 font-sans"
					aria-label="untab software studio home"
				>
					<span className="text-[15px] font-semibold tracking-tight text-foreground lowercase whitespace-nowrap">
						untab
					</span>
					<span className="text-[9px] font-medium text-foreground/55 lowercase tracking-[0.22em] whitespace-nowrap mt-0.5">
						software studio
					</span>
				</Link>

				<div className="flex items-center justify-end gap-6">
					<div className="scroll-nav-right mr-auto hidden items-center gap-7 md:flex">
						{rightNavLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="scroll-nav-item font-sans text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
								style={{ opacity: 0, transform: "translateX(-12px)" }}
							>
								{link.label}
							</Link>
						))}
					</div>
					<Link
						href="/contact"
						className="hidden font-sans text-[13px] font-medium text-foreground transition-colors hover:text-foreground/70 sm:inline-flex"
					>
						Contact
					</Link>
					<ThemeToggle />
					<button
						type="button"
						className="flex size-10 items-center justify-center rounded-full border border-border bg-background/50 text-foreground transition-all hover:bg-background md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					>
						<HugeiconsIcon
							icon={isMenuOpen ? Cancel01Icon : Menu01Icon}
							className="size-5"
							strokeWidth={1.5}
						/>
					</button>
				</div>
			</nav>

			<div
				ref={menuRef}
				className="absolute top-14 left-0 w-full overflow-hidden bg-background/95 backdrop-blur-xl md:hidden"
				style={{ height: 0 }}
			>
				<div
					ref={menuItemsRef}
					className="flex flex-col items-center justify-center gap-8 py-20 px-6"
				>
					{mobileNavLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							onClick={() => setIsMenuOpen(false)}
							className="mobile-nav-item opacity-0 translate-y-5 text-3xl font-medium tracking-tighter transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</header>
	);
}
