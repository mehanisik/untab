/* ------------------------------------------------------------------ */
/* Abstract marks — one geometric composition per discipline. Drawn in */
/* currentColor so they read on any surface. Shared by the services    */
/* page capabilities and the landing page services accordion.          */
/*                                                                     */
/* Each mark plays on hover of a parent `group`: internal parts move   */
/* with compositor-only transforms, gated behind motion-safe. Without  */
/* a group parent they simply render static.                           */
/* ------------------------------------------------------------------ */

// SVG children transform in user units; fill-box keeps each part's
// origin on itself so scales and tilts stay local.
const PART =
	"[transform-box:fill-box] origin-center transition-transform duration-300 ease-out";

export function PlatformMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Stacked platform layers</title>
			<rect
				x="22"
				y="30"
				width="76"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:translate-x-[7px]`}
			/>
			<rect
				x="22"
				y="56"
				width="76"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} delay-75 motion-safe:group-hover:-translate-x-[5px]`}
			/>
			<rect
				x="22"
				y="82"
				width="46"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} delay-150 motion-safe:group-hover:translate-x-[10px]`}
			/>
			<circle
				cx="32"
				cy="40"
				r="2.4"
				fill="currentColor"
				className={`${PART} motion-safe:group-hover:translate-x-[7px]`}
			/>
			<circle
				cx="32"
				cy="66"
				r="2.4"
				fill="currentColor"
				className={`${PART} delay-75 motion-safe:group-hover:-translate-x-[5px]`}
			/>
			<circle
				cx="32"
				cy="92"
				r="2.4"
				fill="currentColor"
				className={`${PART} delay-150 motion-safe:group-hover:translate-x-[10px]`}
			/>
		</svg>
	);
}

export function StrategyMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Intersecting strategy vectors</title>
			<circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="2" />
			{/* The needle swings like a compass finding north. */}
			<g className="[transform-box:view-box] origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:rotate-90">
				<path d="M60 22 L60 98" stroke="currentColor" strokeWidth="2" />
				<path d="M30 44 L90 76" stroke="currentColor" strokeWidth="2" />
			</g>
			<circle
				cx="60"
				cy="60"
				r="6"
				fill="currentColor"
				className={`${PART} motion-safe:group-hover:scale-125`}
			/>
		</svg>
	);
}

export function BrandingMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Overlapping brand forms</title>
			<circle
				cx="48"
				cy="60"
				r="28"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:-translate-x-[6px]`}
			/>
			<rect
				x="50"
				y="32"
				width="44"
				height="56"
				rx="6"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:translate-x-[6px] motion-safe:group-hover:rotate-3`}
			/>
		</svg>
	);
}

export function ContentMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>A play triangle inside a frame</title>
			<rect
				x="24"
				y="30"
				width="72"
				height="60"
				rx="6"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{/* Press play: the triangle leans in and fills. */}
			<path
				d="M52 48 L72 60 L52 72 Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
				className={`${PART} transition-[transform,fill] [fill:transparent] motion-safe:group-hover:translate-x-[4px] motion-safe:group-hover:scale-110 motion-safe:group-hover:[fill:currentColor]`}
			/>
		</svg>
	);
}

export function SystemMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>A grid of system tokens</title>
			{/* Tokens snap toward the grid centre, the odd one rounds off. */}
			<rect
				x="28"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:translate-x-[4px] motion-safe:group-hover:translate-y-[4px]`}
			/>
			<rect
				x="66"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:-translate-x-[4px] motion-safe:group-hover:translate-y-[4px]`}
			/>
			<rect
				x="28"
				y="66"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:translate-x-[4px] motion-safe:group-hover:-translate-y-[4px]`}
			/>
			<circle
				cx="79"
				cy="79"
				r="13"
				stroke="currentColor"
				strokeWidth="2"
				className={`${PART} motion-safe:group-hover:-translate-x-[4px] motion-safe:group-hover:-translate-y-[4px] motion-safe:group-hover:scale-110`}
			/>
		</svg>
	);
}
