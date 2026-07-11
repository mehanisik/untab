import { Img, Link, Section, Text } from "@react-email/components";

export const ASSETS = "https://untabstudio.com";
export const CREAM = "#ece7de";
export const CARD = "#f6f3ec";
export const INK = "#1d1c1a";
export const MUTED = "#6e685f";
export const CORAL = "#ee7b7e";
export const CORAL_DEEP = "#b23a44";

export function EmailHeader({ eyebrow }: { eyebrow: string }) {
	return (
		<Section className="px-[32px] py-[26px]" style={{ backgroundColor: INK }}>
			<Img
				src={`${ASSETS}/brand/email/logo-wordmark.png`}
				width="130"
				height="27"
				alt="Untab Studio"
			/>
			<Text
				className="m-0 mt-[12px] text-[10px] font-bold uppercase tracking-[0.25em]"
				style={{ color: CORAL, fontFamily: "monospace" }}
			>
				{eyebrow}
			</Text>
		</Section>
	);
}

export function EmailFooter() {
	const year = new Date().getFullYear();
	return (
		<Section
			className="px-[32px] py-[20px]"
			style={{ borderTop: `1px solid ${INK}1f` }}
		>
			<Text
				className="m-0 text-[10px] uppercase tracking-[0.22em]"
				style={{ color: MUTED, fontFamily: "monospace" }}
			>
				Untab Studio · Warsaw, Poland · {year}
			</Text>
			<Text className="m-0 mt-[8px] text-[11px]">
				<Link
					href="https://untabstudio.com"
					className="no-underline"
					style={{ color: CORAL_DEEP }}
				>
					untabstudio.com
				</Link>
			</Text>
		</Section>
	);
}
