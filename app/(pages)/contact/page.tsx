import type { Metadata } from "next";
import { generatePageMetadata } from "~/libs/metadata";
import { ContactForm } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Contact",
	description:
		"Get in touch with Untab Studio. Tell us about your project and we'll get back to you within one business day.",
});

export default function ContactPage() {
	return (
		<main className="grow pt-14">
			<ContactForm />
		</main>
	);
}
