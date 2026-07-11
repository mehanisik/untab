"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useState } from "react";
import { SERVICE_MARKS } from "~/components/service-marks";
import type { Service } from "~/libs/sanity";
import { cn } from "~/libs/utils";

const ROW_GRID =
	"grid grid-cols-[2.75rem_1fr_1.5rem] items-center gap-x-5 md:grid-cols-[3.75rem_1fr_1.75rem] md:gap-x-8";

export function ServicesAccordion({ services }: { services: Service[] }) {
	const panelBaseId = useId();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div className="group/list mt-14 md:mt-20">
			{services.map((service, index) => {
				const open = openIndex === index;
				const panelId = `${panelBaseId}-panel-${index}`;
				const Mark = SERVICE_MARKS[service.mark] ?? null;
				return (
					<div
						key={service.title}
						className="svc-row border-t border-foreground/10 last:border-b"
					>
						<button
							type="button"
							aria-expanded={open}
							aria-controls={panelId}
							onClick={() => setOpenIndex(open ? null : index)}
							className={cn(
								ROW_GRID,
								"group w-full py-6 text-left transition-opacity duration-300 md:py-8 md:group-hover/list:opacity-40 md:hover:opacity-100",
							)}
						>
							<span
								className={cn(
									"size-11 transition-colors duration-300 md:size-14",
									open
										? "text-[var(--brand-coral-accent)]"
										: "text-foreground/60 group-hover:text-foreground",
								)}
								aria-hidden
							>
								{Mark ? <Mark /> : null}
							</span>
							<span className="min-w-0 truncate font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(1.35rem,2.8vw,2.2rem)] transition-transform duration-300 ease-out group-hover:translate-x-1.5">
								{service.title}
							</span>
							<HugeiconsIcon
								icon={ArrowDown01Icon}
								aria-hidden
								strokeWidth={1.5}
								className={cn(
									"size-5 justify-self-end text-foreground/50 transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5 group-hover:text-foreground md:size-6",
									open && "rotate-180 group-hover:translate-y-0",
								)}
							/>
						</button>

						<section
							id={panelId}
							aria-label={service.title}
							className={cn(
								"grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
								open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
							)}
						>
							<div className="overflow-hidden">
								<div className={cn(ROW_GRID, "pb-7 md:pb-9")}>
									<span aria-hidden />
									<div className="space-y-2.5">
										<p className="max-w-[46ch] text-pretty text-[14px] leading-relaxed text-foreground/60 md:text-[15px]">
											{service.summary}
										</p>
										<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
											{service.meta}
										</p>
									</div>
								</div>
							</div>
						</section>
					</div>
				);
			})}
		</div>
	);
}
