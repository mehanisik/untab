import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
	Link,
	Img,
} from "@react-email/components";

interface UntabContactEmailProps {
	name: string;
	email: string;
	projectType: string;
	message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://untab.studio";

export const UntabContactEmail = ({
	name,
	email,
	projectType,
	message,
}: UntabContactEmailProps) => {
	const previewText = `New inquiry from ${name}`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans px-2">
					<Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Section className="mt-[32px]">
							<Img
								src={`${baseUrl}/logo.png`}
								width="120"
								height="auto"
								alt="Untab Studio"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center font-bold text-[24px] text-black">
							New Project Inquiry
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Hello,
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							You have received a new inquiry through the contact form.
						</Text>

						<Section className="bg-[#f9f9f9] rounded-lg p-[16px] my-[24px]">
							<Text className="text-[10px] uppercase tracking-[0.2em] text-[#666666] mb-[4px] font-bold">
								From
							</Text>
							<Text className="text-[14px] font-medium m-0 mb-[12px]">
								{name} ({email})
							</Text>

							<Text className="text-[10px] uppercase tracking-[0.2em] text-[#666666] mb-[4px] font-bold">
								Inquiry Type
							</Text>
							<Text className="text-[14px] font-medium m-0 mb-[12px]">
								{projectType}
							</Text>

							<Text className="text-[10px] uppercase tracking-[0.2em] text-[#666666] mb-[4px] font-bold">
								Message
							</Text>
							<Text className="text-[14px] m-0 text-black whitespace-pre-wrap italic">
								"{message}"
							</Text>
						</Section>

						<Section className="text-center mt-[32px] mb-[32px]">
							<Link
								href={`mailto:${email}`}
								className="bg-[#cf3f99] rounded-full text-white text-[12px] font-bold no-underline text-center px-6 py-3 inline-block"
							>
								Reply to {name}
							</Link>
						</Section>

						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

						<Section className="text-center">
							<Text className="text-[#666666] text-[12px] leading-[24px] mb-2">
								Untab Studio &copy; 2025
							</Text>
							<Text className="text-[#999999] text-[10px] leading-[18px]">
								Warsaw, Poland
								<br />
								Digital Product & Design Agency
							</Text>
							<Section className="mt-4">
								<Link
									href="https://untab.studio"
									className="text-[#cf3f99] text-[10px] mx-2 no-underline"
								>
									Website
								</Link>
								<Link
									href="https://twitter.com/untab_studio"
									className="text-[#cf3f99] text-[10px] mx-2 no-underline"
								>
									Twitter
								</Link>
								<Link
									href="https://instagram.com/untab_studio"
									className="text-[#cf3f99] text-[10px] mx-2 no-underline"
								>
									Instagram
								</Link>
							</Section>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

UntabContactEmail.PreviewProps = {
	name: "Tony Stark",
	email: "tony@stark.com",
	projectType: "Web Development",
	message: "I need a website for my new armor project. Money is no object.",
} as UntabContactEmailProps;

export default UntabContactEmail;
