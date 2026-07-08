"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted ? resolvedTheme === "dark" : true;

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className="relative inline-flex size-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground"
		>
			<HugeiconsIcon
				icon={isDark ? Sun03Icon : Moon02Icon}
				className="size-[18px] transition-transform duration-300"
				strokeWidth={1.5}
			/>
		</button>
	);
}
