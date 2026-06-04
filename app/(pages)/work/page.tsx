import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { getProjects } from "~/libs/projects";
import { Footer, Navbar } from "../_components";
import { WorkList } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Case studies | Untab Studio",
	description:
		"Selected projects from Untab Studio. Brand-led websites, platforms, and digital products built with ambitious teams.",
	url: "/work",
});

export default async function WorkPage() {
	const projects = await getProjects();

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
