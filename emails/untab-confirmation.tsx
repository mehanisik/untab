import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
	Img,
} from "@react-email/components";

// Brand palette, inlined as hex because email clients cannot read CSS vars.
// Mirrors app/globals.css - keep in sync with untab-contact.tsx.
const ASSETS = "https://untabstudio.com";
const CREAM = "#ece7de";
const CARD = "#f6f3ec";
const INK = "#1d1c1a";
const MUTED = "#6e685f";
const CORAL = "#ee7b7e";
const CORAL_DEEP = "#b23a44";

interface UntabConfirmationEmailProps {
	name: string;
}

export const UntabConfirmationEmail = ({
	name,
}: UntabConfirmationEmailProps) => {
	const year = new Date().getFullYear();

	return (
		<Html>
			<Head />
			<Preview>
				We received your message and will reply within one business day.
			</Preview>
			<Tailwind>
				<Body
					className="mx-auto my-auto px-2 font-sans"
					style={{ backgroundColor: CREAM }}
				>
					<Container
						className="mx-auto my-[40px] max-w-[560px] overflow-hidden rounded-[16px]"
						style={{ backgroundColor: CARD, border: `1px solid ${INK}1f` }}
					>
						<Section
							className="px-[32px] py-[26px]"
							style={{ backgroundColor: "#0a0a0a" }}
						>
							<Img
								src={`${ASSETS}/logo.png`}
								width="132"
								height="42"
								alt="Untab Studio"
							/>
							<Text
								className="m-0 mt-[12px] text-[10px] font-bold uppercase tracking-[0.25em]"
								style={{ color: CORAL, fontFamily: "monospace" }}
							>
								Message received
							</Text>
						</Section>

						<Section className="px-[32px] py-[28px]">
							<Heading
								className="m-0 text-[22px] font-medium leading-[1.25] tracking-[-0.02em]"
								style={{ color: INK }}
							>
								Thanks, {name}. Your message is with us.
							</Heading>

							<Text
								className="m-0 mt-[16px] text-[14px] leading-[24px]"
								style={{ color: INK }}
							>
								A real person reads every inquiry. We will get back to you
								within one business day, usually sooner, from this address.
							</Text>

							<Text
								className="m-0 mt-[14px] text-[14px] leading-[24px]"
								style={{ color: MUTED }}
							>
								In the meantime, the work is the best introduction to how we
								think.
							</Text>

							<Section className="mt-[22px]">
								<Img
									src={`${ASSETS}/brand/email/inbox-meme.png`}
									width="496"
									height="372"
									alt="Meme: your message has arrived, celebratory coffee initiated"
									className="w-full rounded-[12px]"
									style={{ border: `1px solid ${INK}1f` }}
								/>
							</Section>

							<Section className="mt-[24px]">
								<Link
									href="https://untabstudio.com/work"
									className="inline-block rounded-full px-[28px] py-[12px] text-[12px] font-bold uppercase tracking-[0.16em] no-underline"
									style={{ backgroundColor: CORAL, color: INK }}
								>
									See the work
								</Link>
							</Section>
						</Section>

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
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

UntabConfirmationEmail.PreviewProps = {
	name: "Ada",
} as UntabConfirmationEmailProps;

export default UntabConfirmationEmail;
