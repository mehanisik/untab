export const PROJECT_IMAGE_FALLBACK = "/brand/og/og-image-dark.png";

// Sanity asset filenames encode intrinsic size: <id>-<width>x<height>.<ext>
const SANITY_DIMENSIONS = /-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i;

/** Intrinsic width/height ratio parsed from a Sanity asset URL, if present. */
export function sanityAspect(src: string | undefined): number | undefined {
	if (!src) return undefined;
	const match = src.match(SANITY_DIMENSIONS);
	const width = Number(match?.[1]);
	const height = Number(match?.[2]);
	return width > 0 && height > 0 ? width / height : undefined;
}

export function sanityFitMax(src: string, width: number) {
	if (!src.includes("cdn.sanity.io")) return src;
	const params = new URLSearchParams({
		w: String(width),
		fit: "max",
		auto: "format",
		q: "90",
	});
	return `${src}${src.includes("?") ? "&" : "?"}${params.toString()}`;
}

export function projectCardImage(project: {
	cardImage?: string;
	image?: string;
}) {
	return project.cardImage || project.image || PROJECT_IMAGE_FALLBACK;
}
