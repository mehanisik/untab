"use client";

import { useGSAP } from "@gsap/react";
import {
	DribbbleIcon,
	GithubIcon,
	InstagramIcon,
	Linkedin01Icon,
	NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { LogoWordmark } from "~/components/logo-wordmark";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { CtaBanner } from "./cta-banner";

const studioLinks = [
	{ label: "Home", href: "/" },
	{ label: "Work", href: "/work" },
	{ label: "Services", href: "/services" },
	{ label: "About", href: "/about" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/contact" },
];

const contactLinks: Array<{ label: string; href?: string }> = [
	{ label: "hello@untabstudio.com", href: "mailto:hello@untabstudio.com" },
	{ label: "Book a call", href: "/contact" },
	{ label: "Warsaw, Poland" },
	{ label: "CET · UTC+1" },
];

const socialLinks = [
	{ label: "LinkedIn", icon: Linkedin01Icon, href: "https://linkedin.com" },
	{ label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
	{ label: "Twitter", icon: NewTwitterIcon, href: "https://twitter.com" },
	{ label: "Dribbble", icon: DribbbleIcon, href: "https://dribbble.com" },
	{ label: "GitHub", icon: GithubIcon, href: "https://github.com" },
];

const SECTION_LABEL =
	"text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground/45";
const LINK =
	"inline-block text-[15px] text-surface-deep-foreground/85 transition-colors duration-200 hover:text-surface-deep-foreground";

export function Footer() {
	const year = new Date().getFullYear();
	const footerRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = footerRef.current;
				if (!root) return;

				const trigger = {
					trigger: root,
					start: "top 90%",
					toggleActions: "play none none none",
				};

				gsap.from(root.querySelectorAll(".fx-logo"), {
					y: 24,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".fx-tagline-line"), {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					delay: 0.1,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".fx-col-label"), {
					y: 14,
					opacity: 0,
					duration: 0.7,
					ease: "expo.out",
					stagger: 0.06,
					delay: 0.15,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".fx-link"), {
					y: 10,
					opacity: 0,
					duration: 0.5,
					ease: "expo.out",
					stagger: { each: 0.04, from: "start" },
					delay: 0.25,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelector(".fx-divider"), {
					scaleX: 0,
					transformOrigin: "left center",
					duration: 1,
					ease: "expo.out",
					delay: 0.35,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".fx-meta"), {
					y: 10,
					opacity: 0,
					duration: 0.6,
					ease: "expo.out",
					stagger: 0.06,
					delay: 0.45,
					scrollTrigger: trigger,
				});
			}),
		{ scope: footerRef },
	);

	return (
		<>
			<CtaBanner />
			<footer
				ref={footerRef}
				className="w-full bg-surface-deep text-surface-deep-foreground"
			>
				<div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16 py-20 md:py-24">
					<div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-10 lg:gap-12">
						<div className="flex flex-col items-start gap-6 md:col-span-6 lg:col-span-5">
							<LogoWordmark
								aria-label="Untab Studio"
								className="fx-logo block h-10 md:h-12 w-auto text-surface-deep-foreground"
							/>
							<p className="fx-tagline-line max-w-sm text-pretty text-[15px] font-light leading-[1.6] text-surface-deep-foreground/70">
								An independent software studio in Warsaw, building brand-led
								websites, platforms, and digital products with ambitious teams
								around the world.
							</p>
							<p className="fx-tagline-line text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground/45">
								Software Studio
							</p>
						</div>

						<nav
							aria-label="Studio"
							className="md:col-span-3 md:col-start-7 lg:col-span-2 lg:col-start-7"
						>
							<h3 className={`fx-col-label ${SECTION_LABEL}`}>Untab</h3>
							<ul className="mt-6 flex flex-col gap-3">
								{studioLinks.map((link) => (
									<li key={link.label} className="fx-link">
										<Link href={link.href} className={LINK}>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className="md:col-span-3 lg:col-span-2 lg:col-start-9">
							<h3 className={`fx-col-label ${SECTION_LABEL}`}>Contact</h3>
							<ul className="mt-6 flex flex-col gap-3">
								{contactLinks.map((item) =>
									item.href ? (
										<li key={item.label} className="fx-link">
											<Link href={item.href} className={LINK}>
												{item.label}
											</Link>
										</li>
									) : (
										<li
											key={item.label}
											className="fx-link text-[15px] text-surface-deep-foreground/55"
										>
											{item.label}
										</li>
									),
								)}
							</ul>
						</div>

						<nav
							aria-label="Social"
							className="md:col-span-3 md:col-start-10 lg:col-span-2 lg:col-start-11"
						>
							<h3 className={`fx-col-label ${SECTION_LABEL}`}>Follow us</h3>
							<ul className="mt-6 flex flex-col gap-3">
								{socialLinks.map((social) => (
									<li key={social.label} className="fx-link">
										<Link
											href={social.href}
											className={`${LINK} group inline-flex items-center gap-2.5`}
										>
											<HugeiconsIcon
												icon={social.icon}
												className="size-4 text-surface-deep-foreground/55 transition-colors duration-200 group-hover:text-surface-deep-foreground"
												strokeWidth={1.5}
											/>
											<span>{social.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>

					<div className="fx-divider mt-20 md:mt-24 h-px w-full bg-surface-deep-foreground/12" />

					<div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<p className="fx-meta text-xs text-surface-deep-foreground/50">
							© {year} Untab Studio. All rights reserved.
						</p>
						<p className="fx-meta text-xs text-surface-deep-foreground/50">
							Crafted in Warsaw, Poland.
						</p>
					</div>
				</div>
			</footer>
		</>
	);
}
