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

// Split-card contact layout: a theme-aware info panel on the left, a fixed
// brand coral form block on the right with ink type. The card flips with the
// theme; the coral block is a brand statement and stays put in both.
const INFO_BLOCKS = [
	{
		title: "Chat to us",
		body: "Our friendly team is here to help.",
		detail: (
			<a
				href="mailto:hello@untabstudio.com"
				className="font-medium text-foreground underline-offset-4 transition-colors hover:text-[var(--brand-coral-accent)] hover:underline"
			>
				hello@untabstudio.com
			</a>
		),
	},
	{
		title: "Based in",
		body: "Working with teams across Europe and beyond.",
		detail: (
			<p className="font-medium text-foreground">
				Warsaw, Poland
				<span className="block text-[13px] font-normal text-foreground/55">
					CET · UTC+1
				</span>
			</p>
		),
	},
	{
		title: "Availability",
		body: "Mon to Fri, 9am to 5pm CET.",
		detail: (
			<p className="font-medium text-foreground">
				Replies within one business day
			</p>
		),
	},
];

const pad = (n: number) => String(n).padStart(2, "0");

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

				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 80%",
						toggleActions: "play reverse play reverse",
					},
				});

				tl.from(
					root.querySelector(".contact-eyebrow"),
					{ y: 14, autoAlpha: 0, duration: 0.7 },
					0,
				)
					.from(
						root.querySelector(".contact-card"),
						{ y: 40, autoAlpha: 0, duration: 0.9 },
						0.05,
					)
					.from(
						root.querySelectorAll(".contact-aside"),
						{ y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
						0.2,
					)
					.from(
						root.querySelectorAll(".contact-headline-line"),
						{ yPercent: 110, duration: 0.9, stagger: 0.1 },
						0.25,
					)
					// The form reveals as one block so an interrupted tween can
					// never strand individual fields invisible.
					.from(
						root.querySelector(".contact-panel"),
						{ y: 20, autoAlpha: 0, duration: 0.8 },
						0.4,
					);
			}),
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			aria-label="Contact"
			className="flex min-h-[calc(100dvh-3.5rem)] items-center bg-background py-10 text-foreground md:py-14"
		>
			<Container>
				<h2 className="contact-eyebrow mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:mb-10">
					Contact{" "}
					<span className="tabular-nums">({pad(INFO_BLOCKS.length)})</span>
				</h2>
				<div className="contact-card overflow-hidden rounded-2xl border border-foreground/10 bg-card text-card-foreground shadow-sm">
					<div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
						{/* Left: brand, contact channels, socials */}
						<div className="flex flex-col gap-12 p-7 sm:p-10 lg:p-12">
							<Link
								href="/"
								aria-label="Untab Studio home"
								className="contact-aside w-fit"
							>
								<LogoWordmark className="h-10 w-auto text-foreground md:h-12" />
							</Link>

							<div className="flex flex-1 flex-col">
								{INFO_BLOCKS.map((block, index) => (
									<div
										key={block.title}
										className="contact-aside flex items-baseline gap-5 border-t border-foreground/10 py-6 first:border-t-0 first:pt-0 lg:py-7"
									>
										<span className="font-mono text-[11px] tabular-nums text-[var(--brand-coral-accent)]">
											{pad(index + 1)}
										</span>
										<div className="space-y-1.5 text-[14px] leading-relaxed">
											<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/55">
												{block.title}
											</p>
											<p className="text-pretty text-foreground/55">
												{block.body}
											</p>
											<div className="pt-1 text-[15px]">{block.detail}</div>
										</div>
									</div>
								))}
							</div>

							<ul className="contact-aside flex flex-wrap gap-3">
								{socialLinks.map((social) => (
									<li key={social.label}>
										<Link
											href={social.href}
											aria-label={social.label}
											className="flex size-10 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors duration-200 hover:border-transparent hover:bg-[var(--brand-coral)] hover:text-[var(--dark)]"
										>
											<HugeiconsIcon
												icon={social.icon}
												className="size-4"
												strokeWidth={1.5}
											/>
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Right: coral form block */}
						<div className="bg-[var(--brand-coral)] p-7 text-[var(--dark)] sm:p-10 lg:rounded-l-2xl lg:p-12">
							<h1 className="max-w-[18ch] font-medium leading-[1.05] tracking-[-0.03em] text-[clamp(1.9rem,3.4vw,2.9rem)]">
								<span className="block overflow-hidden pb-0.5">
									<span className="contact-headline-line block">
										Got an idea? We&apos;ve got
									</span>
								</span>
								<span className="block overflow-hidden pb-0.5">
									<span className="contact-headline-line block">
										the craft. Let&apos;s team up.
									</span>
								</span>
							</h1>

							<p className="contact-aside mt-4 text-[15px] leading-relaxed text-[var(--dark)]/70">
								Tell us more about yourself and what you&apos;ve got in mind.
							</p>

							<div className="contact-panel mt-10">
								<ContactFormPanel />
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
