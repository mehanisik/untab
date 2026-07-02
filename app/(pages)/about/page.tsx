import type { Metadata } from "next";
import { generatePageMetadata } from "~/libs/metadata";
import { Impact, Manifesto, Studio } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "About",
	description:
		"We exist between what is and what is emerging. Strategy, design, and engineering from one studio. Same team from kickoff to ship.",
});

export default function AboutPage() {
	return (
		<main className="grow">
			<Manifesto />
			<Studio />
			<Impact />
		</main>
	);
}
