import type { Metadata } from "next";
import { generatePageMetadata } from "~/libs/metadata";
import { getServices } from "~/libs/services";
import { Capabilities } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "Services",
	description:
		"Strategy, brand, website, product, and development. One studio, together from day one, shipping end-to-end with senior hands on every piece.",
	url: "/services",
});

export default async function ServicesPage() {
	const services = await getServices();

	return (
		<main className="grow bg-background pt-14">
			<Capabilities services={services} />
		</main>
	);
}
