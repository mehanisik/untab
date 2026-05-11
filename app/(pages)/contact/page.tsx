import type { Metadata } from "next";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Contact",
	description: "Get in touch.",
});

export default function ContactPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<Container className="pt-48 pb-32 md:pt-64 md:pb-48">
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground">
						Contact
					</h1>
				</Container>
			</main>
			<Footer />
		</Wrapper>
	);
}
