"use client";

import { Link } from "~/components/ui/link";
import { buttonVariants } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/logo";
import { cn } from "~/libs/utils";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navLinks = [
	{ label: "WORK", href: "/work" },
	{ label: "PROCESS", href: "/process" },
	{ label: "TEAM", href: "/team" },
	{ label: "BLOG", href: "/blog" },
];

export function Navbar() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuItemsRef = useRef<HTMLDivElement>(null);

	const onScroll = useEffectEvent(() => {
		if (isMenuOpen) return;
		const currentScrollY = window.scrollY;

		if (currentScrollY < lastScrollY || currentScrollY < 50) {
			setIsVisible(true);
		} else if (currentScrollY > lastScrollY && currentScrollY > 50) {
			setIsVisible(false);
		}

		setLastScrollY(currentScrollY);
	});

	useEffect(() => {
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
			if (isMenuOpen) {
				gsap.to(menuRef.current, {
					height: "100dvh",
					duration: 0.6,
					ease: "expo.out",
				});
				gsap.to(".mobile-nav-item", {
					opacity: 1,
					y: 0,
					stagger: 0.1,
					delay: 0.2,
					duration: 0.6,
					ease: "power3.out",
				});
			} else {
				gsap.to(".mobile-nav-item", {
					opacity: 0,
					y: 20,
					duration: 0.3,
					ease: "power3.in",
				});
				gsap.to(menuRef.current, {
					height: 0,
					duration: 0.5,
					ease: "expo.inOut",
					delay: 0.1,
				});
			}
		},
		{ dependencies: [isMenuOpen] },
	);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out",
				isVisible ? "translate-y-0" : "-translate-y-full",
			)}
		>
			<nav className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:px-12 lg:px-24">
				<Link href="/" className="flex items-center gap-2">
					<Logo />
				</Link>

				<div className="flex items-center gap-4 md:gap-8">
					<div className="hidden items-center gap-6 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="text-xs font-medium text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground"
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="flex items-center gap-2 md:gap-4">
						<ThemeToggle />
						<Link
							href="/contact"
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"hidden text-xs uppercase tracking-wider sm:flex",
							)}
						>
							Let&apos;s talk
						</Link>

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
				</div>
			</nav>

			{/* Mobile Menu */}
			<div
				ref={menuRef}
				className="absolute top-14 left-0 w-full overflow-hidden bg-background/95 backdrop-blur-xl md:hidden"
				style={{ height: 0 }}
			>
				<div
					ref={menuItemsRef}
					className="flex flex-col items-center justify-center gap-8 py-20 px-6"
				>
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							onClick={() => setIsMenuOpen(false)}
							className="mobile-nav-item opacity-0 translate-y-5 text-3xl font-medium tracking-tighter transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/contact"
						onClick={() => setIsMenuOpen(false)}
						className="mobile-nav-item opacity-0 translate-y-5 mt-4 flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground transition-transform hover:scale-95"
					>
						LET&apos;S TALK
					</Link>
				</div>
			</div>
		</header>
	);
}
