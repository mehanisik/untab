import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Two-digit index for the site's mono counters: 1 -> "01". */
export const pad = (n: number) => String(n).padStart(2, "0");

/** The shared horizontal page rails used by every full-width section. */
export const PAGE_PADDING = "px-6 md:px-12 lg:px-24";
