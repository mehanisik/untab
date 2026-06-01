import type { ComponentPropsWithoutRef, CSSProperties } from "react";

interface SplitterProps
	extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
	/** The text to split into individually-animatable characters. */
	text: string;
	/**
	 * Offset added to every character's `--char-index`. Use when rendering one
	 * logical title across multiple Splitter lines so the stagger stays
	 * continuous (e.g. line two picks up where line one left off).
	 */
	startIndex?: number;
	/**
	 * Optional OpenType `font-feature-settings` per non-space character, in
	 * order. `undefined` entries keep the font default. Lets a title opt into
	 * Satoshi's stylistic alternates (ss01–ss06) on chosen letters.
	 */
	features?: (string | undefined)[];
}

/**
 * Splits `text` into per-character spans exposing `--char-index` and
 * `--total-chars` for index-driven (CSS or GSAP) staggered reveals. Characters
 * carry `data-type="char"` and the `.split-char` class; spaces become
 * `data-type="space"` spans so word gaps survive `inline-block` children.
 */
export function Splitter({
	text,
	startIndex = 0,
	features,
	className,
	style,
	...props
}: SplitterProps) {
	// Pre-tokenise so each span gets a stable, position-based key (the source
	// string is static, so a running position is unique and never reorders).
	let order = 0;
	let position = 0;
	const tokens = Array.from(text).map((char) => {
		const key = `t${position++}`;
		if (char === " ") return { kind: "space" as const, key };
		const feature = features?.[order];
		const charIndex = startIndex + order;
		order += 1;
		return { kind: "char" as const, key, char, charIndex, feature };
	});

	return (
		<span
			data-type="splitter"
			className={className}
			style={{ "--total-chars": order, ...style } as CSSProperties}
			{...props}
		>
			{tokens.map((token) =>
				token.kind === "space" ? (
					<span key={token.key} data-type="space">
						{" "}
					</span>
				) : (
					<span
						key={token.key}
						data-type="char"
						className="split-char inline-block"
						style={
							{
								"--char-index": token.charIndex,
								...(token.feature
									? { fontFeatureSettings: `"${token.feature}"` }
									: null),
							} as CSSProperties
						}
					>
						{token.char}
					</span>
				),
			)}
		</span>
	);
}
