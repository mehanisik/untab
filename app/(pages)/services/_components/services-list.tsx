"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { type ComponentType, type SVGProps, useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";
import {
	BrandSketch,
	DevelopmentSketch,
	ProductSketch,
	StrategySketch,
	WebsiteSketch,
} from "./sketches";

interface Service {
	id: string;
	number: string;
	name: string;
	description: string;
	capabilities: string[];
	href: string;
	caseStudy: { name: string; href: string };
	Sketch: ComponentType<SVGProps<SVGSVGElement>>;
}

const SERVICES: Service[] = [
	{
		id: "service-strategy",
		number: "01",
		name: "Strategy",
		description:
			"We establish clarity and direction before anything gets built. Discovery, benchmarking and team alignment that grounds decisions in insight, not assumptions. We interrogate the brief, identify what's actually possible, and set a common thread that runs across the entire partnership.",
		capabilities: [
			"Strategic Research & Discovery",
			"User Experience Research",
			"Workshops & Facilitation",
			"Brand Strategy & Positioning",
			"Product Strategy",
			"Digital Performance Strategy",
		],
		href: "/services/strategy",
		caseStudy: { name: "Charted", href: "/work/charted" },
		Sketch: StrategySketch,
	},
	{
		id: "service-brand",
		number: "02",
		name: "Brand",
		description:
			"We design visual and verbal systems that resonate and endure. Brand guidelines, component libraries, and assets are built for consistency across every touchpoint and ladder up to a unique identity that has value as a strategic asset, not just decoration.",
		capabilities: [
			"Visual Identity Systems",
			"Naming",
			"Tone of Voice & Messaging",
			"Brand & Marketing Collateral",
			"Illustration & Mascot Design",
			"Motion Design & Brand Videos",
			"Campaign Creative & Activation",
		],
		href: "/services/brand",
		caseStudy: { name: "Solvd", href: "/work/solvd" },
		Sketch: BrandSketch,
	},
	{
		id: "service-website",
		number: "03",
		name: "Website",
		description:
			"We build brand-led marketing sites that work hard for your business. Clear messaging, smooth user journeys, and content management systems with guardrails baked in. Sites your teams can update and evolve without breaking things or losing consistency.",
		capabilities: [
			"Information Architecture & User Flows",
			"Interface Design & Interactions",
			"Web Animations & Transitions",
			"Design Systems & Documentation",
			"Web Copywriting & UX Writing",
			"Analytics & Performance Tracking",
		],
		href: "/services/website",
		caseStudy: { name: "PlayByPoint", href: "/work/playbypoint" },
		Sketch: WebsiteSketch,
	},
	{
		id: "service-product",
		number: "04",
		name: "Product",
		description:
			"We create platforms and digital products that solve real problems and adapt as things change. We design and build interaction flows, interfaces, and component libraries. Through prototyping and testing to validate direction early, we can track what's working through analytics, and establish systems your team can grow.",
		capabilities: [
			"Interaction Architecture & Product Flows",
			"Interface Design & Micro-interactions",
			"Design Systems & Component Libraries",
			"Animated Product Visualizations & Demos",
			"Prototyping, Testing & User Validation",
			"Analytics & Event Tracking",
		],
		href: "/services/product",
		caseStudy: { name: "ThoughtSpot", href: "/work/thoughtspot" },
		Sketch: ProductSketch,
	},
	{
		id: "service-development",
		number: "05",
		name: "Development",
		description:
			"We back our designs with robust development. Product designers and back-end developers work hand-in-hand to create technology that's built for growth, performance, and long-term flexibility, not just launch day.",
		capabilities: [
			"Front-end Development",
			"Backend Development",
			"CMS Development",
			"Mobile Development",
			"Generative AI & Machine Learning",
			"Quality Assurance & Maintenance",
			"Cloud & Infrastructure",
		],
		href: "/services/development",
		caseStudy: { name: "eOne", href: "/work/eone" },
		Sketch: DevelopmentSketch,
	},
];

export function ServicesList() {
	return (
		<section className="relative w-full">
			<Container>
				<ul className="flex flex-col">
					{SERVICES.map((service, index) => (
						<li
							key={service.id}
							className={
								index < SERVICES.length - 1
									? "border-b border-foreground/10"
									: ""
							}
						>
							<ServiceBlock service={service} />
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

function ServiceBlock({ service }: { service: Service }) {
	const blockRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = blockRef.current;
			if (!root) return;

			const sketch = root.querySelector<HTMLElement>(".svc-sketch");
			const number = root.querySelector<HTMLElement>(".svc-number");
			const name = root.querySelector<HTMLElement>(".svc-name");
			const desc = root.querySelector<HTMLElement>(".svc-desc");
			const caps = root.querySelectorAll<HTMLElement>(".svc-cap");
			const links = root.querySelectorAll<HTMLElement>(".svc-link");

			const trigger = {
				trigger: root,
				start: "top 78%",
				toggleActions: "play none none none",
			};

			if (sketch) {
				const path = sketch.querySelectorAll<SVGPathElement>("path, circle");
				if (path.length) {
					gsap.set(path, { opacity: 0 });
					gsap.to(path, {
						opacity: 1,
						duration: 0.6,
						ease: "power2.out",
						stagger: 0.05,
						scrollTrigger: trigger,
					});
				}
				gsap.from(sketch, {
					y: 18,
					rotate: -3,
					duration: 0.9,
					ease: "expo.out",
					scrollTrigger: trigger,
				});
			}

			if (number) {
				gsap.from(number, {
					y: 14,
					opacity: 0,
					duration: 0.6,
					ease: "expo.out",
					delay: 0.2,
					scrollTrigger: trigger,
				});
			}

			if (name) {
				gsap.from(name, {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					delay: 0.05,
					scrollTrigger: trigger,
				});
			}

			if (desc) {
				gsap.from(desc, {
					y: 18,
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					delay: 0.15,
					scrollTrigger: trigger,
				});
			}

			if (caps.length) {
				gsap.from(caps, {
					y: 12,
					opacity: 0,
					duration: 0.5,
					ease: "expo.out",
					stagger: 0.04,
					delay: 0.25,
					scrollTrigger: trigger,
				});
			}

			if (links.length) {
				gsap.from(links, {
					y: 14,
					opacity: 0,
					duration: 0.6,
					ease: "expo.out",
					stagger: 0.06,
					delay: 0.4,
					scrollTrigger: trigger,
				});
			}
		},
		{ scope: blockRef },
	);

	return (
		<div
			ref={blockRef}
			id={service.id}
			className="grid scroll-mt-24 grid-cols-1 gap-12 py-24 md:grid-cols-12 md:gap-12 md:py-32 lg:py-40"
		>
			<div className="md:col-span-4 lg:col-span-4">
				<div className="md:sticky md:top-32 flex flex-col gap-6">
					<service.Sketch className="svc-sketch -ml-2 size-20 md:size-24 text-foreground/85" />
					<span className="svc-number text-sm font-normal text-foreground/55 tabular-nums">
						{service.number}
					</span>
					<h2 className="svc-name text-balance text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(3rem,2rem+2.4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-foreground">
						{service.name}
					</h2>
				</div>
			</div>

			<div className="md:col-span-8 lg:col-span-7 lg:col-start-6 flex flex-col gap-14 md:gap-16">
				<p className="svc-desc max-w-[52ch] text-pretty text-lg md:text-xl font-light leading-[1.6] text-foreground/80">
					{service.description}
				</p>

				<div className="flex flex-col gap-6">
					<p className="text-sm font-normal text-foreground/55">
						What's included
					</p>
					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
						{service.capabilities.map((cap) => (
							<li
								key={cap}
								className="svc-cap text-base font-normal text-foreground/85 leading-relaxed"
							>
								{cap}
							</li>
						))}
					</ul>
				</div>

				<div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:gap-10 md:pt-4">
					<Link
						href={service.href}
						className="svc-link group inline-flex items-center gap-2 text-base font-medium text-foreground"
					>
						<span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
							Explore {service.name.toLowerCase()}
						</span>
						<HugeiconsIcon
							icon={ArrowUpRight01Icon}
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							strokeWidth={2}
						/>
					</Link>

					<Link
						href={service.caseStudy.href}
						className="svc-link group inline-flex items-center gap-2 text-base font-normal text-foreground/65 transition-colors hover:text-foreground"
					>
						<span>See {service.caseStudy.name}</span>
						<HugeiconsIcon
							icon={ArrowUpRight01Icon}
							className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							strokeWidth={1.75}
						/>
					</Link>
				</div>
			</div>
		</div>
	);
}
