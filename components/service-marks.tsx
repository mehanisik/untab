/* ------------------------------------------------------------------ */
/* Abstract marks — one geometric composition per discipline. Drawn in */
/* currentColor so they read on any surface. Shared by the services    */
/* page capabilities and the landing page services accordion.          */
/* ------------------------------------------------------------------ */

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
			/>
			<rect
				x="22"
				y="56"
				width="76"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="22"
				y="82"
				width="46"
				height="20"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<circle cx="32" cy="40" r="2.4" fill="currentColor" />
			<circle cx="32" cy="66" r="2.4" fill="currentColor" />
			<circle cx="32" cy="92" r="2.4" fill="currentColor" />
		</svg>
	);
}

export function StrategyMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Intersecting strategy vectors</title>
			<circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="2" />
			<path d="M60 22 L60 98" stroke="currentColor" strokeWidth="2" />
			<path d="M30 44 L90 76" stroke="currentColor" strokeWidth="2" />
			<circle cx="60" cy="60" r="6" fill="currentColor" />
		</svg>
	);
}

export function BrandingMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>Overlapping brand forms</title>
			<circle cx="48" cy="60" r="28" stroke="currentColor" strokeWidth="2" />
			<rect
				x="50"
				y="32"
				width="44"
				height="56"
				rx="6"
				stroke="currentColor"
				strokeWidth="2"
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
			<path
				d="M52 48 L72 60 L52 72 Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function SystemMark() {
	return (
		<svg viewBox="0 0 120 120" fill="none" aria-hidden className="size-full">
			<title>A grid of system tokens</title>
			<rect
				x="28"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="66"
				y="28"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<rect
				x="28"
				y="66"
				width="26"
				height="26"
				rx="3"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<circle cx="79" cy="79" r="13" stroke="currentColor" strokeWidth="2" />
		</svg>
	);
}
