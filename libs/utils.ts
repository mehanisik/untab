import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function clamp(min: number, input: number, max: number) {
	return Math.max(min, Math.min(input, max));
}

export function mapRange(
	inMin: number,
	inMax: number,
	input: number,
	outMin: number,
	outMax: number,
	shouldClamp = false,
) {
	const result =
		((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

	const isInverted = outMin > outMax;

	if (isInverted) {
		return shouldClamp ? clamp(outMax, result, outMin) : result;
	}

	return shouldClamp ? clamp(outMin, result, outMax) : result;
}

/** Two-digit index for the site's mono counters: 1 -> "01". */
export const pad = (n: number) => String(n).padStart(2, "0");

/** The shared horizontal page rails used by every full-width section. */
export const PAGE_PADDING = "px-6 md:px-12 lg:px-24";
