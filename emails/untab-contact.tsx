import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import {
	CARD,
	CORAL,
	CREAM,
	EmailFooter,
	EmailHeader,
	INK,
	MUTED,
} from "./brand";

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
						<EmailHeader eyebrow="New inquiry" />

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

						<EmailFooter />
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
