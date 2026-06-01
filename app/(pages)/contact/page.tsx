import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { ContactForm, ContactHero } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Contact",
	description:
		"Get in touch with Untab Studio. Tell us about your project and we'll get back to you within one business day.",
});

export default function ContactPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow bg-background pt-14">
				<ContactHero />
				<ContactForm />
			</main>
			<Footer />
		</Wrapper>
	);
}
