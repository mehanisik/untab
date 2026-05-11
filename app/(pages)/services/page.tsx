import type { Metadata } from "next";
import { Wrapper } from "~/components/wrapper";
import { generatePageMetadata } from "~/libs/metadata";
import { Footer, Navbar } from "../_components";
import { Partners, ServicesIntro, ServicesList } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"Strategy, design, and development. Together from day one. We build and design digital products, brands, and websites for ambitious teams.",
});

export default function ServicesPage() {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<ServicesIntro />
				<ServicesList />
				<Partners />
			</main>
			<Footer />
		</Wrapper>
	);
}
