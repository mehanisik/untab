import type { Metadata } from "next";
import { getContact } from "~/libs/contact-page";
import { generatePageMetadata } from "~/libs/metadata";
import { ContactForm } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Contact",
	description:
		"Get in touch with Untab Studio. Tell us about your project and we'll get back to you within one business day.",
	url: "/contact",
});

export default async function ContactPage() {
	const contact = await getContact();

	return (
		<main className="grow pt-14">
			<ContactForm {...contact} />
		</main>
	);
}
