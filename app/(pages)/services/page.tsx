import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { HowWeWork } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"How we work — clarity and impact are non-negotiable. Strategy, design, and development from a senior team that ships.",
});

export default function ServicesPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow bg-background pt-14">
				<HowWeWork />
			</main>
			<Footer />
		</Wrapper>
	);
}
