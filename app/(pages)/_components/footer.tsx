import { LogoWordmark } from "~/components/logo-wordmark";
import { Link } from "~/components/ui/link";
import type { Settings } from "~/libs/sanity";
import { CopyrightYear } from "./fx/copyright-year";
import { FooterFx } from "./fx/footer-fx";

const DEFAULT_TAGLINE =
	"An independent software studio in Warsaw, building brand-led websites, platforms, and digital products with ambitious teams around the world.";
const DEFAULT_EMAIL = "contact@untabstudio.com";
const DEFAULT_CITY = "Warsaw, Poland";
const DEFAULT_TIMEZONE = "CET · UTC+1";

const GRAIN_FILTER_ID = "footer-grain";

const studioLinks = [
	{ label: "Home", href: "/" },
	{ label: "Work", href: "/work" },
	{ label: "Services", href: "/services" },
	{ label: "About", href: "/about" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/contact" },
];

const SECTION_LABEL =
	"text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground";
const LINK =
	"inline-block text-[15px] text-surface-deep-foreground transition-opacity duration-200 hover:opacity-70";

type FooterProps = Pick<
	Settings,
	| "footerTagline"
	| "studioTypeLabel"
	| "contactEmail"
	| "studioCity"
	| "timezone"
>;

export function Footer({
	footerTagline,
	studioTypeLabel = "Software Studio",
	contactEmail,
	studioCity,
	timezone,
}: FooterProps = {}) {
	const email = contactEmail ?? DEFAULT_EMAIL;
	const contactLinks: Array<{ label: string; href?: string }> = [
		{ label: email, href: `mailto:${email}` },
		{ label: "Book a call", href: "/contact" },
		{ label: studioCity ?? DEFAULT_CITY },
		{ label: timezone ?? DEFAULT_TIMEZONE },
	];

	return (
		<FooterFx className="relative isolate w-full text-surface-deep-foreground [--surface-deep-foreground:var(--light)]">
			<div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen overflow-hidden bg-[var(--dark)]">
				<svg
					aria-hidden
					className="size-full opacity-[0.12] mix-blend-soft-light"
					preserveAspectRatio="none"
				>
					<title>texture</title>
					<filter id={GRAIN_FILTER_ID}>
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
					<rect
						width="100%"
						height="100%"
						filter={`url(#${GRAIN_FILTER_ID})`}
					/>
				</svg>
			</div>

			<div className="fx-inner container relative px-6 py-16 md:px-12 md:py-24 lg:px-24">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-12">
					<div className="flex flex-col items-start gap-6 md:col-span-6 lg:col-span-5">
						<LogoWordmark
							aria-label="Untab Studio"
							className="fx-logo block h-10 md:h-12 w-auto text-surface-deep-foreground"
						/>
						<p className="fx-tagline-line max-w-sm text-pretty text-[15px] font-light leading-[1.6] text-surface-deep-foreground">
							{footerTagline ?? DEFAULT_TAGLINE}
						</p>
						<p className="fx-tagline-line text-[11px] font-medium uppercase tracking-[0.22em] text-surface-deep-foreground">
							{studioTypeLabel}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-10 sm:gap-8 md:contents">
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
					</div>
				</div>

				<div className="fx-divider mt-14 md:mt-24 h-px w-full bg-surface-deep-foreground/12" />

				<div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<p className="fx-meta text-xs text-surface-deep-foreground">
						© <CopyrightYear /> Untab Studio. All rights reserved.
					</p>
					<p className="fx-meta text-xs text-surface-deep-foreground">
						Crafted in Warsaw, Poland.
					</p>
				</div>
			</div>
		</FooterFx>
	);
}
