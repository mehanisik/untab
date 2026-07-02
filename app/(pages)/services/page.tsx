import type { Metadata } from "next";
import { generatePageMetadata } from "~/libs/metadata";
import { Capabilities, ServicesHero } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"Five practices, one studio. Website and platform software, brand strategy, branding, creative content, and design systems. Shipped end-to-end by a senior team.",
});

export default function ServicesPage() {
	return (
		<main className="grow bg-background pt-14">
			<ServicesHero />
			<Capabilities />
		</main>
	);
}
