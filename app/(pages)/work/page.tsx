import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { WorkList } from "./_components";
import { SAMPLE_PROJECTS } from "./_data";

export const metadata: Metadata = generatePageMetadata({
	title: "Case studies — Untab Studio",
	description:
		"Selected projects from Untab Studio — brand-led websites, platforms, and digital products built with ambitious teams.",
	url: "/work",
});

export default async function WorkPage() {
	const projects = SAMPLE_PROJECTS;

	return (
		<Wrapper>
			<Navbar />
			<main className="grow bg-background pt-14">
				<WorkList projects={projects} />
			</main>
			<Footer />
		</Wrapper>
	);
}
