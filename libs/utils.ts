import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const PAGE_PADDING = "px-6 md:px-12 lg:px-24";
