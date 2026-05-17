import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { Impact, Manifesto, Studio } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "About",
	description:
		"We exist between what is and what is emerging. Strategy, design, and engineering from one studio — same team from kickoff to ship.",
});

export default function AboutPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<Manifesto />
				<Studio />
				<Impact />
			</main>
			<Footer />
		</Wrapper>
	);
}
