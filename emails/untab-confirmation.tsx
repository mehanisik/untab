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

interface UntabConfirmationEmailProps {
	name: string;
}

export const UntabConfirmationEmail = ({
	name,
}: UntabConfirmationEmailProps) => {
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
						<EmailHeader eyebrow="Message received" />

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

						<EmailFooter />
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
