import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

// Brand palette, inlined as hex because email clients cannot read CSS vars.
// Mirrors app/globals.css: cream --light, ink --dark, coral --brand-coral,
// deep coral-rose --brand-coral-accent (light surfaces).
const ASSETS = "https://untabstudio.com";
const CREAM = "#ece7de";
const CARD = "#f6f3ec";
const INK = "#1d1c1a";
const MUTED = "#6e685f";
const CORAL = "#ee7b7e";
const CORAL_DEEP = "#b23a44";

interface UntabContactEmailProps {
	name: string;
	email: string;
	projectType: string;
	message: string;
}

export const UntabContactEmail = ({
	name,
	email,
	projectType,
	message,
}: UntabContactEmailProps) => {
	const year = new Date().getFullYear();

	return (
		<Html>
			<Head />
			<Preview>New inquiry from {name}</Preview>
			<Tailwind>
				<Body
					className="mx-auto my-auto px-2 font-sans"
					style={{ backgroundColor: CREAM }}
				>
					<Container
						className="mx-auto my-[40px] max-w-[560px] overflow-hidden rounded-[16px]"
						style={{ backgroundColor: CARD, border: `1px solid ${INK}1f` }}
					>
						{/* Ink header band with the text wordmark and coral full stop */}
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
								New inquiry
							</Text>
						</Section>

						<Section className="px-[32px] py-[28px]">
							<Heading
								className="m-0 text-[22px] font-medium leading-[1.2] tracking-[-0.02em]"
								style={{ color: INK }}
							>
								{name} wants to start a conversation.
							</Heading>

							<Section className="mt-[24px]">
								<Text
									className="m-0 mb-[4px] text-[10px] font-bold uppercase tracking-[0.22em]"
									style={{ color: MUTED, fontFamily: "monospace" }}
								>
									From
								</Text>
								<Text
									className="m-0 text-[14px] font-medium leading-[22px]"
									style={{ color: INK }}
								>
									{name} · {email}
								</Text>

								<Hr
									className="my-[16px] w-full"
									style={{ borderColor: `${INK}1f`, borderWidth: 1 }}
								/>

								<Text
									className="m-0 mb-[4px] text-[10px] font-bold uppercase tracking-[0.22em]"
									style={{ color: MUTED, fontFamily: "monospace" }}
								>
									Project type
								</Text>
								<Text
									className="m-0 text-[14px] font-medium leading-[22px]"
									style={{ color: INK }}
								>
									{projectType}
								</Text>

								<Hr
									className="my-[16px] w-full"
									style={{ borderColor: `${INK}1f`, borderWidth: 1 }}
								/>

								<Text
									className="m-0 mb-[4px] text-[10px] font-bold uppercase tracking-[0.22em]"
									style={{ color: MUTED, fontFamily: "monospace" }}
								>
									Message
								</Text>
								<Text
									className="m-0 whitespace-pre-wrap text-[14px] leading-[24px]"
									style={{ color: INK }}
								>
									{message}
								</Text>
							</Section>

							<Section className="mt-[28px]">
								<Link
									href={`mailto:${email}`}
									className="inline-block rounded-full px-[28px] py-[12px] text-[12px] font-bold uppercase tracking-[0.16em] no-underline"
									style={{ backgroundColor: CORAL, color: INK }}
								>
									Reply to {name}
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

UntabContactEmail.PreviewProps = {
	name: "Ada Lovelace",
	email: "ada@analytical.engine",
	projectType: "Website & Platform",
	message:
		"We are rebuilding our marketing site and need a partner who can own design and build end to end. Timeline is this quarter.",
} as UntabContactEmailProps;

export default UntabContactEmail;
