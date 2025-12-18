"use client";

import { Link } from "~/components/ui/link";
import { buttonVariants } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/logo";
import { cn } from "~/libs/utils";
import { useEffect, useEffectEvent, useState } from "react";

const navLinks = [
	{ label: "WORK", href: "/work" },
	{ label: "PROCESS", href: "/process" },
	{ label: "TEAM", href: "/team" },
	{ label: "BLOG", href: "/blog" },
];

export function Navbar() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const onScroll = useEffectEvent(() => {
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

				<div className="flex items-center gap-8">
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

					<div className="flex items-center gap-4">
						<ThemeToggle />
						<Link
							href="/contact"
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"text-xs uppercase tracking-wider",
							)}
						>
							Let&apos;s talk
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
}
