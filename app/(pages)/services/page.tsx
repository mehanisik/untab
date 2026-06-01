import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { Process, ServicesHero } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"Five practices, one studio. Website and platform software, brand strategy, branding, creative content, and design systems. Shipped end-to-end by a senior team.",
});

export default function ServicesPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow bg-background pt-14">
				<ServicesHero />
				<Process />
			</main>
			<Footer />
		</Wrapper>
	);
}
