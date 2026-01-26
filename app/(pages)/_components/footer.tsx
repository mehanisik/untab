"use client";

import {
	DribbbleIcon,
	InstagramIcon,
	Linkedin01Icon,
	NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logo } from "~/components/logo";
import { Link } from "~/components/ui/link";

const footerLinks = {
	company: {
		title: "Company",
		links: [
			{ label: "About Us", href: "/about" },
			{ label: "Our Team", href: "/team" },
			{ label: "Our Process", href: "/process" },
			{ label: "Careers", href: "/careers" },
			{ label: "Contact", href: "/contact" },
		],
	},
	services: {
		title: "Services",
		links: [
			{ label: "Web Development", href: "/services/web" },
			{ label: "Mobile Apps", href: "/services/mobile" },
			{ label: "UI/UX Design", href: "/services/design" },
			{ label: "Branding", href: "/services/branding" },
			{ label: "Consulting", href: "/services/consulting" },
		],
	},
	work: {
		title: "Work",
		links: [
			{ label: "All Projects", href: "/work" },
			{ label: "Case Studies", href: "/work#case-studies" },
			{ label: "Industries", href: "/work#industries" },
		],
	},
	resources: {
		title: "Resources",
		links: [
			{ label: "Blog", href: "/blog" },
			{ label: "Insights", href: "/insights" },
			{ label: "FAQ", href: "/faq" },
		],
	},
};

const socialLinks = [
	{ label: "LinkedIn", icon: Linkedin01Icon, href: "https://linkedin.com" },
	{ label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
	{ label: "Twitter", icon: NewTwitterIcon, href: "https://twitter.com" },
	{ label: "Dribbble", icon: DribbbleIcon, href: "https://dribbble.com" },
];

export function Footer() {
	return (
		<footer className="w-full bg-[#181A19] text-foreground">
			<div className="mx-auto max-w-360 px-6 md:px-12 lg:px-24">
				{/* Top Section - Logo */}
				<div className="py-12 md:py-16">
					<Logo className="scale-125 origin-left" />
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">
					{/* Left Side - CTA Box + Contact */}
					<div className="lg:col-span-4 flex flex-col gap-10">
						{/* CTA Box */}
						<div className="bg-primary p-8 md:p-10">
							<h2 className="text-2xl md:text-3xl font-light text-primary-foreground leading-tight mb-3">
								Let&apos;s start
								<br />
								<span className="font-medium">your project</span>
							</h2>
							<p className="text-primary-foreground/80 text-sm font-light mb-6">
								Ready to bring your vision to life? Let&apos;s create something
								extraordinary together.
							</p>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full bg-background text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm outline-none"
							/>
						</div>

						{/* Contact & Social */}
						<div className="flex flex-col gap-4">
							<Link
								href="mailto:contact@untabstudio.com"
								className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
							>
								contact@untabstudio.com
							</Link>
							<p className="text-sm text-muted-foreground">Warsaw, Poland</p>
							<div className="flex items-center gap-3 mt-2">
								{socialLinks.map((social) => (
									<Link
										key={social.label}
										href={social.href}
										className="flex size-10 items-center justify-center rounded-full border border-[#514e4e] text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all"
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
					</div>

					{/* Right Side - Link Columns */}
					<div className="lg:col-span-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
							{Object.values(footerLinks).map((section) => (
								<div key={section.title}>
									<h3 className="text-sm font-medium text-foreground mb-5">
										{section.title}
									</h3>
									<ul className="flex flex-col gap-2.5">
										{section.links.map((link) => (
											<li key={link.label}>
												<Link
													href={link.href}
													className="text-sm text-muted-foreground hover:text-primary transition-colors"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-[#514e4e] py-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<p className="text-xs text-muted-foreground">
							Copyright © {new Date().getFullYear()} Untab Studio. All rights
							reserved.
						</p>
						<Link
							href="/privacy"
							className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
