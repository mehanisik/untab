"use client";

import { useGSAP } from "@gsap/react";
import {
	Mail01Icon,
	SentIcon,
	Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { sendContactEmail } from "~/app/actions/contact";
import { Container } from "~/components/container";
import { withMotion } from "~/libs/gsap/presets";

const COOLDOWN_MS = 10_000;

const PROJECT_TYPES = [
	"Website & Platform",
	"Brand Strategy",
	"Branding",
	"Creative Content",
	"Design System",
	"Other",
] as const;

type FormState =
	| { status: "idle" }
	| { status: "submitting" }
	| { status: "success" }
	| { status: "error"; message: string };

const LABEL =
	"text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60";
const INPUT =
	"w-full border-b border-foreground/15 bg-transparent py-3 text-[15px] text-foreground outline-none transition-colors duration-200 placeholder:text-foreground/30 focus:border-foreground/50";

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

				const trigger = {
					trigger: root,
					start: "top 85%",
					toggleActions: "play none none none",
				} as const;

				gsap.from(root.querySelectorAll(".form-field"), {
					y: 24,
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					stagger: 0.08,
					scrollTrigger: trigger,
				});

				gsap.from(root.querySelectorAll(".form-sidebar"), {
					y: 24,
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					stagger: 0.08,
					delay: 0.15,
					scrollTrigger: trigger,
				});
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
			className="w-full bg-background pb-24 sm:pb-32 md:pb-40"
		>
			<Container className="grid grid-cols-12 gap-x-6 gap-y-16 sm:gap-x-8">
				{/* Form */}
				<div className="col-span-12 lg:col-span-7">
					{formState.status === "success" ? (
						<SuccessMessage />
					) : (
						<form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
							<input
								type="text"
								name="_honeypot"
								tabIndex={-1}
								autoComplete="off"
								className="absolute opacity-0 pointer-events-none h-0 w-0"
								aria-hidden="true"
							/>
							<input type="hidden" name="_t" value={renderTimestamp} />

							<div className="form-field space-y-2">
								<label htmlFor="name" className={LABEL}>
									Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									minLength={2}
									maxLength={100}
									autoComplete="name"
									placeholder="Your name"
									className={INPUT}
								/>
							</div>

							<div className="form-field space-y-2">
								<label htmlFor="email" className={LABEL}>
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									maxLength={255}
									autoComplete="email"
									placeholder="you@company.com"
									className={INPUT}
								/>
							</div>

							<div className="form-field space-y-2">
								<label htmlFor="projectType" className={LABEL}>
									What can we help with?
								</label>
								<select
									id="projectType"
									name="projectType"
									className={`${INPUT} cursor-pointer appearance-none`}
									defaultValue=""
								>
									<option value="" disabled>
										Select a service
									</option>
									{PROJECT_TYPES.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>

							<div className="form-field space-y-2">
								<label htmlFor="message" className={LABEL}>
									Message
								</label>
								<textarea
									id="message"
									name="message"
									required
									minLength={10}
									maxLength={5000}
									rows={5}
									placeholder="Tell us about your project, goals, and timeline..."
									className={`${INPUT} resize-none`}
								/>
							</div>

							{formState.status === "error" && (
								<p className="text-sm text-destructive">{formState.message}</p>
							)}

							<div className="form-field">
								<button
									type="submit"
									disabled={formState.status === "submitting"}
									className="inline-flex items-center gap-3 rounded-full border border-foreground/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-transparent disabled:opacity-50 disabled:pointer-events-none"
								>
									{formState.status === "submitting" ? (
										<>
											<HugeiconsIcon
												icon={Loading03Icon}
												className="size-4 animate-spin"
												strokeWidth={1.5}
											/>
											Sending...
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

				{/* Sidebar */}
				<aside className="col-span-12 lg:col-span-4 lg:col-start-9">
					<div className="form-sidebar space-y-10">
						<div>
							<p className={LABEL}>Email</p>
							<a
								href="mailto:hello@untabstudio.com"
								className="mt-3 inline-flex items-center gap-2.5 text-[15px] text-foreground transition-colors duration-200 hover:text-foreground/70"
							>
								<HugeiconsIcon
									icon={Mail01Icon}
									className="size-4 text-foreground/55"
									strokeWidth={1.5}
								/>
								hello@untabstudio.com
							</a>
						</div>

						<div>
							<p className={LABEL}>Location</p>
							<p className="mt-3 text-[15px] text-foreground/75">
								Warsaw, Poland
							</p>
							<p className="mt-1 text-[13px] text-foreground/45">CET · UTC+1</p>
						</div>

						<div>
							<p className={LABEL}>Response time</p>
							<p className="mt-3 text-[15px] text-foreground/75">
								Within one business day
							</p>
						</div>
					</div>
				</aside>
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
					opacity: 0,
					duration: 0.8,
					ease: "expo.out",
					stagger: 0.1,
				});
			}),
		{ scope: ref },
	);

	return (
		<div ref={ref} className="flex flex-col items-start gap-6 py-8">
			<div className="success-el flex size-16 items-center justify-center rounded-full bg-primary/10">
				<HugeiconsIcon
					icon={SentIcon}
					className="size-7 text-primary"
					strokeWidth={1.5}
				/>
			</div>
			<h2 className="success-el text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
				Message sent.
			</h2>
			<p className="success-el max-w-md text-base leading-[1.65] text-foreground/75">
				Thanks for reaching out. We&apos;ll review your message and get back to
				you within one business day.
			</p>
		</div>
	);
}
