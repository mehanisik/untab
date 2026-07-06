import type { Metadata } from "next";
import { generatePageMetadata } from "~/libs/metadata";
import { Capabilities } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"Strategy, brand, website, product, and development. One studio, together from day one, shipping end-to-end with senior hands on every piece.",
});

export default function ServicesPage() {
	return (
		<main className="grow bg-background pt-14">
			<Capabilities />
		</main>
	);
}
