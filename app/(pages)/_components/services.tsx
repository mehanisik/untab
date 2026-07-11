import { stegaClean } from "next-sanity";
import { Link } from "~/components/ui/link";
import type { Service } from "~/libs/sanity";
import { pad } from "~/libs/utils";
import { ServicesAccordion } from "./fx/services-accordion";
import { ServicesFx } from "./fx/services-fx";

export function Services({ services }: { services: Service[] }) {
	const cleanedServices = services.map((service) => ({
		...service,
		mark: stegaClean(service.mark),
	}));

	return (
		<ServicesFx
			aria-label="Our services"
			className="bg-background py-24 text-foreground md:py-32 lg:py-40"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<h2 className="svc-intro mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:mb-10">
					Our services{" "}
					<span className="tabular-nums">({pad(services.length)})</span>
				</h2>

				<p className="svc-intro max-w-[24ch] text-balance font-medium leading-[1.08] tracking-[-0.03em] text-[clamp(1.9rem,4vw,3.5rem)]">
					Vision on one side, reality on the other.{" "}
					<span className="text-[var(--brand-coral-accent)]">
						We are the bridge.
					</span>
				</p>

				<ServicesAccordion services={cleanedServices} />

				<div className="svc-intro mt-10 flex justify-end md:mt-12">
					<Link
						href="/services"
						className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-opacity hover:opacity-60"
					>
						All services
						<span aria-hidden>→</span>
					</Link>
				</div>
			</div>
		</ServicesFx>
	);
}
