"use client";

import cn from "clsx";
import NextImage, {
	type ImageLoader,
	type ImageProps as NextImageProps,
} from "next/image";
import type { CSSProperties, Ref } from "react";

export type ImageProps = Omit<NextImageProps, "objectFit" | "alt"> & {
	objectFit?: CSSProperties["objectFit"];
	block?: boolean;
	mobileSize?: `${number}vw`;
	desktopSize?: `${number}vw`;
	ref?: Ref<HTMLImageElement>;
	alt?: string;
	aspectRatio?: number;
	/** Opt-in card hover zoom (block mode only). Off by default so the CSS
	 *  transition never fights GSAP transforms on the same element. */
	hoverZoom?: boolean;
};

const breakpoints = {
	dt: 800,
};

const SANITY_HOST = "cdn.sanity.io";
// Sanity asset filenames encode intrinsic size: <id>-<width>x<height>.<ext>
const SANITY_DIMENSIONS = /-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i;

/**
 * Serve Sanity images straight from Sanity's image CDN instead of proxying
 * through /_next/image: the CDN resizes per srcset width, `auto=format`
 * negotiates AVIF/WebP from the Accept header, and Vercel image-transform
 * quota is never touched. Pre-cropped renditions (w+h+fit=crop, e.g. the
 * hero poster tiles) keep their crop-box ratio at each srcset width.
 */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
	const url = new URL(src);
	const prevW = Number(url.searchParams.get("w"));
	const prevH = Number(url.searchParams.get("h"));
	if (prevW > 0 && prevH > 0) {
		url.searchParams.set("h", String(Math.round((prevH / prevW) * width)));
	}
	url.searchParams.set("w", String(width));
	if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
	url.searchParams.set("auto", "format");
	url.searchParams.set("q", String(quality ?? 75));
	return url.href;
};

const toBase64 = (str: string) =>
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str);

const generateShimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="rgba(255,255,255,0.1)" offset="20%" />
        <stop stop-color="rgba(255,255,255,0.2)" offset="50%" />
        <stop stop-color="rgba(255,255,255,0.1)" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="rgba(0,0,0,0)" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const shouldUseBlurPlaceholder = (
	src: NextImageProps["src"],
	placeholder: string,
	blurDataURL: string | undefined,
): boolean => {
	if (!src) return false;
	const isSvg = typeof src === "string" && src.includes(".svg");
	return !isSvg && placeholder === "blur" && !blurDataURL;
};

const generateBlurDataURL = (
	shouldUse: boolean,
	aspectRatio: number | undefined,
	existingBlurDataURL: string | undefined,
): string | undefined => {
	if (!(shouldUse && aspectRatio)) return existingBlurDataURL;

	const shimmerSvg = generateShimmer(700, Math.round(700 / aspectRatio));
	return `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;
};

const getFinalPlaceholder = (
	shouldUse: boolean,
	aspectRatio: number | undefined,
	blurDataURL: string | undefined,
	originalPlaceholder: NextImageProps["placeholder"],
): NextImageProps["placeholder"] => {
	if (!shouldUse) {
		return originalPlaceholder === "blur" && !blurDataURL
			? "empty"
			: originalPlaceholder;
	}

	return aspectRatio || blurDataURL ? "blur" : "empty";
};

/**
 * Block mode needs a real intrinsic ratio so the browser reserves the right
 * space before load (CLS). Prefer explicit props, then the aspectRatio prop,
 * then dimensions parsed from the Sanity filename; 1x1 only as a last resort.
 */
function blockDimensions(
	src: NextImageProps["src"],
	aspectRatio: number | undefined,
): { width: number; height: number } {
	if (aspectRatio) return { width: 1600, height: Math.round(1600 / aspectRatio) };
	if (typeof src === "string") {
		const match = src.match(SANITY_DIMENSIONS);
		if (match?.[1] && match[2]) {
			return { width: Number(match[1]), height: Number(match[2]) };
		}
	}
	return { width: 1, height: 1 };
}

export function Image({
	style,
	className,
	loading,
	objectFit = "cover",
	quality = 75,
	alt = "",
	fill,
	block = !fill,
	width,
	height,
	mobileSize = "100vw",
	desktopSize = "100vw",
	sizes,
	src,
	unoptimized,
	ref,
	aspectRatio,
	placeholder = "blur",
	priority = false,
	preload,
	fetchPriority,
	hoverZoom = false,
	...props
}: ImageProps) {
	// Next 16 deprecated `priority` in favor of `preload`. Keep accepting
	// `priority` from call sites but translate it to the modern equivalents:
	// a <link rel="preload"> in <head>, eager loading, and high fetch priority.
	const shouldPreload = preload ?? priority;
	const finalLoading = loading ?? (shouldPreload ? "eager" : "lazy");
	const finalFetchPriority =
		fetchPriority ?? (shouldPreload ? "high" : undefined);

	const finalSizes =
		sizes || `(max-width: ${breakpoints.dt}px) ${mobileSize}, ${desktopSize}`;

	if (!src) return null;

	const isSvg = typeof src === "string" && src.includes(".svg");
	const isSanity = typeof src === "string" && src.includes(SANITY_HOST);

	// Block mode renders w-full/h-auto, so width/height only inform the
	// intrinsic aspect ratio the browser uses to reserve space.
	const dims =
		block && !(width && height) ? blockDimensions(src, aspectRatio) : null;
	const finalWidth = width ?? (block ? dims?.width : undefined);
	const finalHeight = height ?? (block ? dims?.height : undefined);

	const shouldUsePlaceholder = shouldUseBlurPlaceholder(
		src,
		placeholder,
		props.blurDataURL,
	);
	const blurDataURL = generateBlurDataURL(
		shouldUsePlaceholder,
		aspectRatio,
		props.blurDataURL,
	);
	const finalPlaceholder = getFinalPlaceholder(
		shouldUsePlaceholder,
		aspectRatio,
		props.blurDataURL,
		placeholder,
	);

	return (
		<NextImage
			ref={ref}
			fill={!block}
			width={finalWidth}
			height={finalHeight}
			loading={finalLoading}
			quality={quality}
			alt={alt}
			loader={isSanity ? sanityLoader : undefined}
			style={{
				objectFit,
				...(block && aspectRatio ? { aspectRatio } : null),
				...style,
			}}
			className={cn(
				className,
				block && "block w-full h-auto",
				block &&
					hoverZoom &&
					"transition-transform duration-1000 group-hover:scale-105",
			)}
			sizes={finalSizes}
			src={src}
			unoptimized={unoptimized || isSvg}
			draggable={false}
			onDragStart={(e) => e.preventDefault()}
			placeholder={finalPlaceholder}
			blurDataURL={blurDataURL}
			preload={shouldPreload}
			fetchPriority={finalFetchPriority}
			{...props}
		/>
	);
}
