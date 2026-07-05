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
import { Container } from "~/components/container";
import { LogoWordmark } from "~/components/logo-wordmark";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { SOCIALS } from "~/libs/socials";
import { ContactFormPanel } from "./contact-form-panel";

// Palette triad, inverted: fixed brand ink surface in both themes, coral
// for the headline and actions, cream for text and the form fields. No
// theme-dependent tokens on this page - the ink block is a brand statement.
const CORAL = "var(--brand-coral)";
const INK = "var(--dark)";
const CREAM = "var(--light)";

const socialLinks = [
	{ label: "LinkedIn", icon: Linkedin01Icon, href: SOCIALS.linkedin },
	{ label: "Instagram", icon: InstagramIcon, href: SOCIALS.instagram },
	{ label: "Twitter", icon: NewTwitterIcon, href: SOCIALS.twitter },
	{ label: "Dribbble", icon: DribbbleIcon, href: SOCIALS.dribbble },
	{ label: "GitHub", icon: GithubIcon, href: SOCIALS.github },
];

export function ContactForm() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				// One timeline, one ScrollTrigger; reverses out on scroll-up to
				// match the rest of the site. The form panel animates as a single
				// block so an interrupted tween can never strand individual
				// fields invisible.
				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});

				tl.from(
					root.querySelectorAll(".contact-aside"),
					{ y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
					0,
				)
					.from(
						root.querySelectorAll(".contact-headline-line"),
						{ yPercent: 110, duration: 0.9, stagger: 0.12 },
						0.05,
					)
					.from(
						root.querySelectorAll(".contact-copy"),
						{ y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.1 },
						0.35,
					)
					.from(
						root.querySelectorAll(".contact-panel"),
						{ y: 24, autoAlpha: 0, duration: 0.8 },
						0.25,
					);
			}),
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			aria-label="Contact"
			className="relative isolate flex min-h-[calc(100dvh-3.5rem)] items-center py-16 md:py-20"
			style={{ color: CREAM }}
		>
			{/* Full-bleed ink surface: spans the viewport width while the content
			    keeps the shared max-width rails. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen"
				style={{ backgroundColor: INK }}
			/>

			<Container className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12 lg:items-start">
				{/* Brand, address, socials. Last on mobile so the form stays close
				    to the headline; first column on desktop. */}
				<div className="order-3 flex flex-col gap-10 lg:order-none lg:col-span-3 lg:border-r lg:border-[var(--light)]/15 lg:pr-8">
					<Link
						href="/"
						aria-label="Untab Studio home"
						className="contact-aside"
					>
						<LogoWordmark className="h-12 w-auto text-[var(--light)] md:h-14" />
					</Link>

					<address className="contact-aside space-y-1 text-[15px] not-italic leading-relaxed text-[var(--light)]/75">
						<p>Warsaw, Poland</p>
						<p>CET · UTC+1</p>
						<a
							href="mailto:hello@untabstudio.com"
							className="mt-2 inline-block underline-offset-4 transition-colors hover:text-[var(--brand-coral)] hover:underline"
						>
							hello@untabstudio.com
						</a>
					</address>

					<ul className="contact-aside flex flex-wrap gap-3">
						{socialLinks.map((social) => (
							<li key={social.label}>
								<Link
									href={social.href}
									aria-label={social.label}
									className="flex size-11 items-center justify-center rounded-full border border-[var(--light)]/30 text-[var(--light)] transition-colors duration-200 hover:border-transparent hover:bg-[var(--brand-coral)] hover:text-[var(--dark)]"
								>
									<HugeiconsIcon
										icon={social.icon}
										className="size-[18px]"
										strokeWidth={1.5}
									/>
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Headline + intro */}
				<div className="order-1 lg:order-none lg:col-span-4">
					<h1
						className="font-medium leading-[0.95] tracking-[-0.03em] text-[clamp(2.75rem,5vw,4rem)]"
						style={{ color: CORAL }}
					>
						<span className="block overflow-hidden pb-1">
							<span className="contact-headline-line block">Accepting new</span>
						</span>
						<span className="block overflow-hidden pb-1">
							<span className="contact-headline-line block">
								business &amp;
							</span>
						</span>
						<span className="block overflow-hidden pb-1">
							<span className="contact-headline-line block">good ideas</span>
						</span>
					</h1>

					<p className="contact-copy mt-8 max-w-md text-pretty text-[15px] leading-relaxed text-[var(--light)]/80">
						If you&apos;ve got an ambitious idea and you&apos;re not afraid to
						make moves, tell us about it. We&apos;ll get back within one
						business day to see how we can help exceed your expectations.
					</p>

					<p className="contact-copy mt-6 text-[15px] leading-relaxed text-[var(--light)]/60">
						We typically book new projects a few weeks out. The sooner you reach
						out, the better.
					</p>
				</div>

				{/* Form */}
				<div className="contact-panel order-2 lg:order-none lg:col-span-5">
					<ContactFormPanel />
				</div>
			</Container>
		</section>
	);
}
