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
import { useId, useRef } from "react";
import { LogoWordmark } from "~/components/logo-wordmark";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { SOCIALS } from "~/libs/socials";

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
	{ label: "LinkedIn", icon: Linkedin01Icon, href: SOCIALS.linkedin },
	{ label: "Instagram", icon: InstagramIcon, href: SOCIALS.instagram },
	{ label: "Twitter", icon: NewTwitterIcon, href: SOCIALS.twitter },
	{ label: "Dribbble", icon: DribbbleIcon, href: SOCIALS.dribbble },
	{ label: "GitHub", icon: GithubIcon, href: SOCIALS.github },
];

const SECTION_LABEL =
	"text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground";
const LINK =
	"inline-block text-[15px] text-surface-deep-foreground transition-opacity duration-200 hover:opacity-70";

export function Footer() {
	const year = new Date().getFullYear();
	const footerRef = useRef<HTMLElement>(null);
	const grainId = useId();

	useGSAP(
		() =>
			withMotion(() => {
				const root = footerRef.current;
				if (!root) return;

				// Curtain reveal: the whole footer body eases down into place as
				// the footer scrolls in. Scroll-linked, so scrub + ease "none",
				// clamped so short pages don't start mid-animation.
				gsap.fromTo(
					root.querySelector(".fx-inner"),
					{ yPercent: -10 },
					{
						yPercent: 0,
						ease: "none",
						scrollTrigger: {
							trigger: root,
							start: "clamp(top bottom)",
							end: "clamp(top 25%)",
							scrub: true,
						},
					},
				);

				// Entrance: one timeline, one ScrollTrigger. Only reverses on
				// scroll-up (onLeaveBack) — NOT "play reverse play reverse". The
				// footer is the last element, so its trigger end sits past the max
				// scroll and gets clamped there; a reverse-on-leave would fire at
				// the page bottom and hide the footer exactly when it's in view.
				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 85%",
						toggleActions: "play none none reverse",
					},
				});

				tl.from(
					root.querySelectorAll(".fx-logo"),
					{ y: 24, autoAlpha: 0, duration: 0.9 },
					0,
				)
					.from(
						root.querySelectorAll(".fx-tagline-line"),
						{ y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08 },
						0.1,
					)
					.from(
						root.querySelectorAll(".fx-col-label"),
						{ y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.06 },
						0.15,
					)
					.from(
						root.querySelectorAll(".fx-link"),
						{ y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.04 },
						0.25,
					)
					.from(
						root.querySelector(".fx-divider"),
						{
							scaleX: 0,
							transformOrigin: "left center",
							duration: 1,
						},
						0.35,
					)
					.from(
						root.querySelectorAll(".fx-meta"),
						{ y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
						0.45,
					);
			}),
		{ scope: footerRef },
	);

	return (
		<footer
			ref={footerRef}
			// Fixed dark-ink surface in both themes, so pin the foreground to the
			// cream base token instead of the theme-flipping surface foreground.
			className="relative isolate w-full text-surface-deep-foreground [--surface-deep-foreground:var(--light)]"
		>
			{/* Full-bleed dark-ink surface: spans the viewport width (like a
			    proper footer) while the content below keeps the shared max-width
			    rails. left-1/2 + -ml-[50vw] + w-screen resolves to the viewport
			    edges because the footer is centered in the page container. */}
			<div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen overflow-hidden bg-[var(--dark)]">
				<svg
					aria-hidden
					className="size-full opacity-[0.12] mix-blend-soft-light"
					preserveAspectRatio="none"
				>
					<title>texture</title>
					<filter id={grainId}>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.72"
							numOctaves="3"
							stitchTiles="stitch"
						/>
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.45 0.45 0.45 0 0"
						/>
					</filter>
					<rect width="100%" height="100%" filter={`url(#${grainId})`} />
				</svg>
			</div>

			<div className="fx-inner container relative px-6 py-20 md:px-12 md:py-24 lg:px-24">
				<div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-10 lg:gap-12">
					<div className="flex flex-col items-start gap-6 md:col-span-6 lg:col-span-5">
						<LogoWordmark
							aria-label="Untab Studio"
							className="fx-logo block h-10 md:h-12 w-auto text-surface-deep-foreground"
						/>
						<p className="fx-tagline-line max-w-sm text-pretty text-[15px] font-light leading-[1.6] text-surface-deep-foreground">
							An independent software studio in Warsaw, building brand-led
							websites, platforms, and digital products with ambitious teams
							around the world.
						</p>
						<p className="fx-tagline-line text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground">
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
										className="fx-link text-[15px] text-surface-deep-foreground"
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
											className="size-4 text-surface-deep-foreground"
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
					<p className="fx-meta text-xs text-surface-deep-foreground">
						© {year} Untab Studio. All rights reserved.
					</p>
					<p className="fx-meta text-xs text-surface-deep-foreground">
						Crafted in Warsaw, Poland.
					</p>
				</div>
			</div>
		</footer>
	);
}
