"use client";

import { useGSAP } from "@gsap/react";
import {
	DribbbleIcon,
	GithubIcon,
	InstagramIcon,
	Linkedin01Icon,
	Loading03Icon,
	NewTwitterIcon,
	SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { sendContactEmail } from "~/app/actions/contact";
import { Container } from "~/components/container";
import { LogoWordmark } from "~/components/logo-wordmark";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { SOCIALS } from "~/libs/socials";

const COOLDOWN_MS = 10_000;

// The contact surface is a fixed warm orange in both themes; its foreground
// uses the cream base token (var(--light)) and ink for the form fields.
const ORANGE = "#ec5a29";

type FormState =
	| { status: "idle" }
	| { status: "submitting" }
	| { status: "success" }
	| { status: "error"; message: string };

const FIELD =
	"form-field w-full rounded-lg bg-[var(--light)] px-5 py-4 text-[15px] text-[#141311] outline-none ring-2 ring-transparent transition duration-200 placeholder:text-[#141311]/45 focus-visible:ring-[#141311]/30";

const socialLinks = [
	{ label: "LinkedIn", icon: Linkedin01Icon, href: SOCIALS.linkedin },
	{ label: "Instagram", icon: InstagramIcon, href: SOCIALS.instagram },
	{ label: "Twitter", icon: NewTwitterIcon, href: SOCIALS.twitter },
	{ label: "Dribbble", icon: DribbbleIcon, href: SOCIALS.dribbble },
	{ label: "GitHub", icon: GithubIcon, href: SOCIALS.github },
];

export function ContactForm() {
	const sectionRef = useRef<HTMLElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [formState, setFormState] = useState<FormState>({ status: "idle" });
	const [renderTimestamp, setRenderTimestamp] = useState("");
	const lastSubmitRef = useRef(0);

	useEffect(() => {
		setRenderTimestamp(String(Date.now()));
	}, []);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				// One timeline, one ScrollTrigger; reverses out on scroll-up to match
				// the rest of the site's reveal behaviour.
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
						root.querySelectorAll(".form-field"),
						{ y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
						0.3,
					);
			}),
		{ scope: sectionRef },
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (formState.status === "submitting") return;

		const now = Date.now();
		if (now - lastSubmitRef.current < COOLDOWN_MS) {
			setFormState({
				status: "error",
				message: "Please wait a moment before submitting again.",
			});
			return;
		}

		setFormState({ status: "submitting" });
		lastSubmitRef.current = now;

		const formData = new FormData(e.currentTarget);
		const result = await sendContactEmail(formData);

		if (result.error) {
			setFormState({ status: "error", message: result.error });
			return;
		}

		setFormState({ status: "success" });
		formRef.current?.reset();
	}

	return (
		<section
			ref={sectionRef}
			aria-label="Contact"
			className="relative isolate flex min-h-[calc(100dvh-3.5rem)] items-center py-16 text-[var(--light)] md:py-20"
		>
			{/* Full-bleed orange surface: spans the viewport width while the content
			    keeps the shared max-width rails. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 -ml-[50vw] w-screen"
				style={{ backgroundColor: ORANGE }}
			/>

			<Container className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12 lg:items-start">
				{/* Left: brand, address, socials */}
				<div className="flex flex-col gap-10 lg:col-span-3 lg:border-r lg:border-[var(--light)]/20 lg:pr-8">
					<Link
						href="/"
						aria-label="Untab Studio home"
						className="contact-aside"
					>
						<LogoWordmark className="h-12 w-auto text-[var(--light)] md:h-14" />
					</Link>

					<address className="contact-aside space-y-1 text-[15px] not-italic leading-relaxed text-[var(--light)]/85">
						<p>Warsaw, Poland</p>
						<p>CET · UTC+1</p>
						<a
							href="mailto:hello@untabstudio.com"
							className="mt-2 inline-block underline-offset-4 transition-colors hover:text-[var(--light)] hover:underline"
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
									className="flex size-11 items-center justify-center rounded-full border border-[var(--light)]/35 text-[var(--light)] transition-colors duration-200 hover:bg-[var(--light)] hover:text-[#ec5a29]"
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

				{/* Middle: headline + intro */}
				<div className="lg:col-span-4">
					<h1 className="font-serif font-medium leading-[0.95] tracking-[-0.01em] text-[clamp(2.75rem,5vw,4rem)]">
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

					<p className="contact-copy mt-8 max-w-md text-pretty text-[15px] leading-relaxed text-[var(--light)]/85">
						If you&apos;ve got an ambitious idea and you&apos;re not afraid to
						make moves, tell us about it. We&apos;ll get back within one
						business day to see how we can help exceed your expectations.
					</p>

					<p className="contact-copy mt-6 text-[15px] leading-relaxed text-[var(--light)]/70">
						(We typically book new projects a few weeks out — the sooner you
						reach out, the better.)
					</p>
				</div>

				{/* Right: form */}
				<div className="lg:col-span-5">
					{formState.status === "success" ? (
						<SuccessMessage />
					) : (
						<form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								name="_honeypot"
								tabIndex={-1}
								autoComplete="off"
								className="pointer-events-none absolute h-0 w-0 opacity-0"
								aria-hidden="true"
							/>
							<input type="hidden" name="_t" value={renderTimestamp} />

							<div>
								<label htmlFor="name" className="sr-only">
									Full name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									minLength={2}
									maxLength={100}
									autoComplete="name"
									placeholder="Full name"
									className={FIELD}
								/>
							</div>

							<div>
								<label htmlFor="company" className="sr-only">
									Your company
								</label>
								<input
									id="company"
									name="company"
									type="text"
									maxLength={120}
									autoComplete="organization"
									placeholder="Your company"
									className={FIELD}
								/>
							</div>

							<div>
								<label htmlFor="email" className="sr-only">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									maxLength={255}
									autoComplete="email"
									placeholder="Email"
									className={FIELD}
								/>
							</div>

							<div>
								<label htmlFor="phone" className="sr-only">
									Phone
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									maxLength={40}
									autoComplete="tel"
									placeholder="Phone"
									className={FIELD}
								/>
							</div>

							<div>
								<label htmlFor="message" className="sr-only">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									required
									minLength={10}
									maxLength={5000}
									rows={5}
									placeholder="Message"
									className={`${FIELD} resize-y`}
								/>
							</div>

							<label className="form-field flex items-center gap-3 pt-1 text-[13px] text-[var(--light)]/85">
								<input
									type="checkbox"
									name="awesome"
									className="size-4 shrink-0 rounded-sm border border-[var(--light)]/50 bg-transparent accent-[var(--light)]"
								/>
								I&apos;m aware that Untab is extremely good at this
							</label>

							{formState.status === "error" && (
								<p
									className="form-field rounded-md bg-[#0a0a0a]/20 px-4 py-2.5 text-[13px] text-[var(--light)]"
									role="alert"
								>
									{formState.message}
								</p>
							)}

							<div className="form-field pt-2">
								<button
									type="submit"
									disabled={formState.status === "submitting"}
									className="inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--light)] transition-colors duration-200 hover:bg-[#0a0a0a]/85 disabled:pointer-events-none disabled:opacity-50"
								>
									{formState.status === "submitting" ? (
										<>
											<HugeiconsIcon
												icon={Loading03Icon}
												className="size-4 animate-spin"
												strokeWidth={1.5}
											/>
											Sending
										</>
									) : (
										<>
											Send message
											<HugeiconsIcon
												icon={SentIcon}
												className="size-4"
												strokeWidth={1.5}
											/>
										</>
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</Container>
		</section>
	);
}

function SuccessMessage() {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() =>
			withMotion(() => {
				const root = ref.current;
				if (!root) return;

				gsap.from(root.querySelectorAll(".success-el"), {
					y: 20,
					autoAlpha: 0,
					duration: 0.8,
					ease: "expo.out",
					stagger: 0.1,
				});
			}),
		{ scope: ref },
	);

	return (
		<div ref={ref} className="flex flex-col items-start gap-6 py-4">
			<div className="success-el flex size-16 items-center justify-center rounded-full bg-[var(--light)]/15 text-[var(--light)]">
				<HugeiconsIcon icon={SentIcon} className="size-7" strokeWidth={1.5} />
			</div>
			<h2 className="success-el font-serif font-medium leading-[1.05] tracking-[-0.01em] text-[var(--light)] text-[clamp(1.75rem,3vw,2.5rem)]">
				Message sent.
			</h2>
			<p className="success-el max-w-md text-[15px] leading-relaxed text-[var(--light)]/85">
				Thanks for reaching out. We&apos;ll review your message and get back to
				you within one business day.
			</p>
		</div>
	);
}
