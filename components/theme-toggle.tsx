"use client";

import { useGSAP } from "@gsap/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);
	const iconRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	useGSAP(() => {
		if (!(mounted && iconRef.current)) return;

		gsap.fromTo(
			iconRef.current,
			{ rotate: -90, opacity: 0, scale: 0.5 },
			{ rotate: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
		);
	}, [resolvedTheme, mounted]);

	if (!mounted) {
		return <div className="size-9" />;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative size-9 rounded-full border border-border/40 hover:bg-accent hover:text-accent-foreground"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
		>
			<div ref={iconRef} className="flex items-center justify-center">
				{resolvedTheme === "dark" ? (
					<HugeiconsIcon
						icon={Sun01Icon}
						className="size-4"
						strokeWidth={1.5}
					/>
				) : (
					<HugeiconsIcon
						icon={Moon01Icon}
						className="size-4"
						strokeWidth={1.5}
					/>
				)}
			</div>
		</Button>
	);
}
