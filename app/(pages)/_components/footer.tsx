"use client";

import { Link } from "~/components/ui/link";
import { Separator } from "~/components/ui/separator";
import { useFadeInOnScroll } from "~/hooks/use-scroll-animation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	DribbbleIcon,
	NewTwitterIcon,
	InstagramIcon,
	Linkedin01Icon,
	Video01Icon,
	Home01Icon,
	Briefcase01Icon,
	WorkflowSquare01Icon,
	UserGroupIcon,
	Book02Icon,
	RssIcon,
	Mail01Icon,
	Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { Logo } from "~/components/logo";
import { cn } from "~/libs/utils";

const footerData = {
	main: [
		{ label: "Home", href: "/", icon: Home01Icon },
		{ label: "Work", href: "/work", icon: Briefcase01Icon },
		{ label: "Process", href: "/process", icon: WorkflowSquare01Icon },
		{ label: "Team", href: "/team", icon: UserGroupIcon },
	],
	secondary: [
		{ label: "Blog", href: "/blog", icon: Book02Icon },
		{ label: "Radar", href: "/radar", icon: RssIcon },
		{ label: "Contact", href: "/contact", icon: Mail01Icon },
		{
			label: "Strategic sessions",
			href: "/strategic-session",
			icon: Calendar01Icon,
		},
	],
	social: [
		{ label: "Dribbble", icon: DribbbleIcon, href: "https://dribbble.com" },
		{ label: "Twitter", icon: NewTwitterIcon, href: "https://twitter.com" },
		{ label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
		{ label: "LinkedIn", icon: Linkedin01Icon, href: "https://linkedin.com" },
		{ label: "Vimeo", icon: Video01Icon, href: "https://vimeo.com" },
	],
};

const companyInfo = {
	name: "Untab Studio Sp. z o.o.",
	address: "ul. Prosta 1, 00-001 Warszawa, Poland",
	nip: "5252814321",
	regon: "385432123",
	krs: "0000821213",
	capital: "5.000,00 PLN",
};

function FooterColumn({
	children,
	index,
	className,
}: {
	children: React.ReactNode;
	index: number;
	className?: string;
}) {
	const ref = useFadeInOnScroll<HTMLDivElement>({ delay: 0.1 + index * 0.1 });
	return (
		<div ref={ref} className={cn("flex flex-col gap-6", className)}>
			{children}
		</div>
	);
}

export function Footer() {
	const bottomRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0.5 });
	const brandingRef = useFadeInOnScroll<HTMLDivElement>({ delay: 0 });

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="w-full bg-background py-20">
			<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
				<div className="relative border border-border bg-muted/10 rounded-[2.5rem] overflow-hidden">
					<div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]">
						<svg
							width="100%"
							height="100%"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<title>Abstract geometric background</title>
							<defs>
								<pattern
									id="grid-footer"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 10 0 L 0 0 0 10"
										fill="none"
										stroke="currentColor"
										strokeWidth="0.05"
									/>
								</pattern>
							</defs>
							<rect width="100" height="100" fill="url(#grid-footer)" />
							<circle
								cx="80"
								cy="20"
								r="40"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.05"
							/>
							<circle
								cx="20"
								cy="80"
								r="30"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.05"
							/>
						</svg>
					</div>

					<div className="px-8 py-16 md:px-16 md:py-20 lg:px-24 lg:py-24">
						<div className="flex flex-col gap-20">
							<div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
								<div ref={brandingRef} className="flex flex-col gap-8">
									<Logo className="scale-125 origin-left mb-2" />
									<div className="flex flex-col gap-4">
										<p className="max-w-[240px] text-[11px] leading-relaxed text-muted-foreground font-light">
											{companyInfo.address}
											<br />
											NIP: {companyInfo.nip} | REGON: {companyInfo.regon}
											<br />
											KRS: {companyInfo.krs}
											<br />
											Kapitał zakładowy: {companyInfo.capital}
										</p>
									</div>
									<div className="flex items-center gap-3">
										{footerData.social.map((social) => (
											<Link
												key={social.label}
												href={social.href}
												className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-all hover:border-primary/60 hover:text-primary hover:scale-110 backdrop-blur-sm"
											>
												<HugeiconsIcon
													icon={social.icon}
													className="size-4"
													strokeWidth={1.5}
												/>
												<span className="sr-only">{social.label}</span>
											</Link>
										))}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
									<FooterColumn index={1}>
										<h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
											Navigate
										</h3>
										<ul className="flex flex-col gap-4">
											{footerData.main.map((link) => (
												<li key={link.label}>
													<Link
														href={link.href}
														className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
													>
														<HugeiconsIcon
															icon={link.icon}
															className="size-4 opacity-40"
															strokeWidth={1.5}
														/>
														{link.label}
													</Link>
												</li>
											))}
										</ul>
									</FooterColumn>

									<FooterColumn index={2}>
										<h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
											Discover
										</h3>
										<ul className="flex flex-col gap-4">
											{footerData.secondary.map((link) => (
												<li key={link.label}>
													<Link
														href={link.href}
														className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
													>
														<HugeiconsIcon
															icon={link.icon}
															className="size-4 opacity-40"
															strokeWidth={1.5}
														/>
														{link.label}
													</Link>
												</li>
											))}
										</ul>
									</FooterColumn>

									<FooterColumn index={3} className="hidden sm:flex">
										<h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
											Get in touch
										</h3>
										<div className="flex flex-col gap-4">
											<Link
												href="mailto:hello@untab.studio"
												className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
											>
												<HugeiconsIcon
													icon={Mail01Icon}
													className="size-4 opacity-40"
													strokeWidth={1.5}
												/>
												hello@untab.studio
											</Link>
											<p className="text-[11px] leading-relaxed text-muted-foreground/60 font-light max-w-[200px]">
												Let&apos;s build the future of digital experiences
												together.
											</p>
										</div>
									</FooterColumn>
								</div>
							</div>

							<div ref={bottomRef}>
								<Separator className="mb-8 opacity-10 bg-foreground" />
								<div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
									<div className="flex flex-wrap items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/30">
										<span>© UntabStudio {new Date().getFullYear()}</span>
										<Separator
											orientation="vertical"
											className="h-3 opacity-10 hidden md:block bg-foreground"
										/>
										<Link
											href="/terms"
											className="hover:text-foreground transition-colors"
										>
											Terms
										</Link>
										<Separator
											orientation="vertical"
											className="h-3 opacity-10 hidden md:block bg-foreground"
										/>
										<Link
											href="/privacy"
											className="hover:text-foreground transition-colors"
										>
											Privacy
										</Link>
									</div>

									<button
										type="button"
										onClick={scrollToTop}
										className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all"
									>
										<span>Back to top</span>
										<div className="flex size-9 items-center justify-center rounded-full border border-border/40 bg-background/20 backdrop-blur-md transition-all group-hover:border-primary/40 group-hover:bg-primary/5">
											<span className="text-xs transition-transform group-hover:-translate-y-1">
												↑
											</span>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
