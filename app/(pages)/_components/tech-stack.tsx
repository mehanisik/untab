"use client";

import { useGSAP } from "@gsap/react";
import {
	AiMagicIcon,
	CloudServerIcon,
	CodeIcon,
	Database01Icon,
	GlobeIcon,
	Layout01Icon,
	Link01Icon,
	Shield01Icon,
	SmartPhone01Icon,
	WorkflowSquare01Icon,
	ZapIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Container } from "~/components/container";
import { withMotion } from "~/libs/gsap/presets";

interface TechItem {
	name: string;
	description: string;
	// biome-ignore lint/suspicious/noExplicitAny: Hugeicons icons have complex internal structures
	icon: any;
	size?: "small" | "medium" | "large";
	color?: string;
}

interface TechCategory {
	title: string;
	items: TechItem[];
}

const TECH_CATEGORIES: TechCategory[] = [
	{
		title: "Apps & Ecosystems",
		items: [
			{
				name: "Next.js & React",
				description: "Enterprise scalability with Next.js 16 and React 19.",
				icon: Layout01Icon,
				size: "large",
				color: "text-blue-400",
			},
			{
				name: "Native Mobile",
				description: "High-performance iOS & Android applications.",
				icon: SmartPhone01Icon,
				size: "medium",
			},
			{
				name: "Nuxt & Vue",
				description: "Modern reactive web experiences.",
				icon: GlobeIcon,
				size: "small",
			},
			{
				name: "TypeScript",
				description: "Type-safe engineering across every layer.",
				icon: CodeIcon,
				size: "small",
			},
		],
	},
	{
		title: "Backend & Systems",
		items: [
			{
				name: "Edge Infrastructure",
				description: "Global 99.9% uptime via distributed Node.js cloud logic.",
				icon: CloudServerIcon,
				size: "large",
				color: "text-purple-400",
			},
			{
				name: "Modern DB",
				description: "Postgres & Supabase real-time sync.",
				icon: Database01Icon,
				size: "medium",
			},
			{
				name: "Python Logic",
				description: "Data-heavy automation & scripts.",
				icon: ZapIcon,
				size: "small",
			},
			{
				name: "API Mesh",
				description: "Robust, secure service integrations.",
				icon: Link01Icon,
				size: "small",
			},
		],
	},
	{
		title: "Intelligence & Growth",
		items: [
			{
				name: "Generative AI",
				description:
					"Integrating modern LLMs and custom AI agents into business workflows.",
				icon: AiMagicIcon,
				size: "large",
				color: "text-primary",
			},
			{
				name: "E-Commerce",
				description: "Shopify & Stripe payment systems.",
				icon: Layout01Icon,
				size: "medium",
			},
			{
				name: "Motion Engine",
				description: "Cinematic digital experiences with GSAP.",
				icon: WorkflowSquare01Icon,
				size: "small",
			},
			{
				name: "CMS Control",
				description: "Scalable content via Sanity.",
				icon: Shield01Icon,
				size: "small",
			},
		],
	},
];

function CircuitFilaments() {
	return (
		<svg
			className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
			viewBox="0 0 1000 1000"
			preserveAspectRatio="none"
		>
			<title>Circuit Filaments</title>
			<path
				d="M0,200 L200,200 L300,300 L700,300 L800,400 L1000,400"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
			/>
			<path
				d="M1000,600 L800,600 L700,700 L300,700 L200,800 L0,800"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
			/>
			<path
				d="M500,0 L500,200 L600,300 L600,700 L500,800 L500,1000"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
			/>
			<circle cx="300" cy="300" r="4" fill="currentColor" />
			<circle cx="700" cy="700" r="4" fill="currentColor" />
			<circle cx="500" cy="500" r="6" fill="currentColor" />
		</svg>
	);
}

function TechCard({ item }: { item: TechItem }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [rotation, setRotation] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientY - rect.top) / rect.height - 0.5;
		const y = (e.clientX - rect.left) / rect.width - 0.5;
		setRotation({ x: -x * 20, y: y * 20 });
	};

	const handleMouseLeave = () => {
		setRotation({ x: 0, y: 0 });
	};

	const sizeClasses = {
		small: "col-span-1 h-[220px]",
		medium: "col-span-1 md:col-span-2 h-[220px] md:h-[260px]",
		large: "col-span-1 md:col-span-2 lg:col-span-4 h-[320px] md:h-[400px]",
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Purely visual mouse-tilt effect
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			role="presentation"
			className={`${sizeClasses[item.size || "small"]} relative group perspective-1000 transition-all duration-500`}
			style={{
				transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
				transformStyle: "preserve-3d",
			}}
		>
			<div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent rounded-[2.5rem] p-px transform group-hover:scale-[1.01] transition-transform duration-500">
				<div className="h-full w-full bg-[#080808]/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden border border-white/5 shadow-2xl">
					<div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-colors" />

					<div className="relative flex items-center justify-between">
						<div
							className={`size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color || "text-primary/60"} group-hover:text-primary group-hover:bg-white/10 transition-all duration-500`}
						>
							<HugeiconsIcon icon={item.icon} className="size-7" />
						</div>
						{item.size === "large" && (
							<div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 group-hover:text-primary/80 transition-colors">
								Elite Engine
							</div>
						)}
					</div>

					<div className="relative mt-auto">
						<h5
							className={`font-black uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500 ${item.size === "large" ? "text-4xl md:text-6xl leading-none mb-4" : "text-xl mb-2"}`}
						>
							{item.name}
						</h5>
						<p
							className={`text-muted-foreground/60 transition-colors group-hover:text-muted-foreground/80 ${item.size === "large" ? "text-lg md:text-2xl font-light leading-snug max-w-sm" : "text-sm font-medium leading-relaxed"}`}
						>
							{item.description}
						</p>
					</div>

					<div className="absolute bottom-6 right-8 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
						<div className="size-1 rounded-full bg-primary/50" />
						<div className="size-1 rounded-full bg-primary/30" />
						<div className="size-1 rounded-full bg-primary/10" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function TechStack() {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				gsap.from(".tech-header-text", {
					opacity: 0,
					y: 50,
					duration: 1.5,
					ease: "expo.out",
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top 80%",
					},
				});

				gsap.from(".tech-category", {
					opacity: 0,
					y: 60,
					duration: 1.2,
					stagger: 0.2,
					ease: "power4.out",
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top 70%",
					},
				});
			}),
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			className="relative py-32 md:py-48 lg:py-72 overflow-hidden bg-[#050505] selection:bg-primary selection:text-white"
		>
			<CircuitFilaments />

			<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />
			<div className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] bg-purple-500/5 rounded-full blur-[250px] pointer-events-none" />

			<Container>
				<div className="tech-header-text mb-40 lg:mb-56 relative z-10 text-center mx-auto max-w-5xl">
					<div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-10">
						<div className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--color-primary-rgb),1)]" />
						<span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
							Capabilities Matrix
						</span>
					</div>

					<h3 className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-[-0.05em] leading-[0.75] mb-12">
						Strategic <br />
						<span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-white to-white/10">
							Toolkit
							<span className="absolute -top-1/4 -left-1/4 -z-10 text-[1.2em] opacity-[0.03] select-none pointer-events-none italic">
								Matrix v3.0
							</span>
						</span>
					</h3>

					<p className="text-xl md:text-3xl text-muted-foreground/60 font-light max-w-3xl mx-auto leading-relaxed">
						We engineer impact by selecting the most efficient tools for each
						challenge. Our versatile stack ensures peak performance across every
						dimension.
					</p>
				</div>

				<div className="flex flex-col gap-40 relative z-10">
					{TECH_CATEGORIES.map((category, idx) => (
						<div key={category.title} className="tech-category">
							<div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 px-4">
								<h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white/90">
									{category.title}
								</h4>
								<p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground/40 mb-2">
									Section • 0{idx + 1}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
								{category.items.map((item) => (
									<TechCard key={item.name} item={item} />
								))}
							</div>
						</div>
					))}
				</div>
			</Container>

			<div className="mt-64 relative">
				<div className="absolute top-0 inset-w-full h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
				<Container className="py-20 flex flex-col items-center text-center">
					<div className="group cursor-default relative">
						<div className="absolute inset-0 bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
						<p className="relative text-[10px] md:text-xs font-bold uppercase tracking-[0.6em] text-muted-foreground/40 transition-colors group-hover:text-primary">
							Boundless Scalability • Engineered by Untab
						</p>
					</div>
				</Container>
			</div>
		</section>
	);
}
