"use client";

import { useGSAP } from "@gsap/react";
import { Loading03Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { sendContactEmail } from "~/app/actions/contact";
import { withMotion } from "~/libs/gsap/presets";

const COOLDOWN_MS = 10_000;
const MESSAGE_MAX = 5000;

// Mirrors ALLOWED_PROJECT_TYPES in app/actions/contact.ts - keep in sync.
const PROJECT_TYPES = [
	"Website & Platform",
	"Brand Strategy",
	"Branding",
	"Creative Content",
	"Design System",
	"Other",
] as const;

const FIELD =
	"w-full rounded-lg bg-[var(--light)] px-5 py-4 text-[15px] text-[var(--dark)] outline-none ring-2 ring-transparent transition duration-200 placeholder:text-[var(--dark)]/40 focus-visible:ring-[var(--brand-coral)]/70 aria-[invalid=true]:ring-[var(--brand-coral)]";

const LABEL =
	"mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--light)]/60";

type SubmitState =
	| { status: "idle" }
	| { status: "submitting" }
	| { status: "success" }
	| { status: "error"; message: string };

type FieldName = "name" | "company" | "email" | "phone" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s.-]{5,39}$/;

const VALIDATORS: Record<FieldName, (value: string) => string | null> = {
	name: (v) => {
		const value = v.trim();
		if (!value) return "Please tell us your name.";
		if (value.length < 2) return "Name needs at least 2 characters.";
		if (value.length > 100) return "Name is too long.";
		return null;
	},
	company: (v) => (v.trim().length > 120 ? "Company name is too long." : null),
	email: (v) => {
		const value = v.trim();
		if (!value) return "We need an email to reply to.";
		if (value.length > 255 || !EMAIL_RE.test(value))
			return "That email address does not look right.";
		return null;
	},
	phone: (v) => {
		const value = v.trim();
		if (!value) return null;
		if (!PHONE_RE.test(value)) return "That phone number does not look right.";
		return null;
	},
	message: (v) => {
		const value = v.trim();
		if (!value) return "Tell us a little about the project.";
		if (value.length < 10)
			return "A few more words help us respond properly, 10 characters minimum.";
		if (value.length > MESSAGE_MAX) return "Message is too long.";
		return null;
	},
};

function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p
			id={id}
			role="alert"
			className="mt-2 text-[12px] font-medium leading-snug text-[var(--brand-coral)]"
		>
			{message}
		</p>
	);
}

export function ContactFormPanel() {
	const formRef = useRef<HTMLFormElement>(null);
	const [submitState, setSubmitState] = useState<SubmitState>({
		status: "idle",
	});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [projectType, setProjectType] = useState<string | null>(null);
	const [messageLength, setMessageLength] = useState(0);
	const [renderTimestamp, setRenderTimestamp] = useState("");
	const lastSubmitRef = useRef(0);

	useEffect(() => {
		setRenderTimestamp(String(Date.now()));
	}, []);

	function validateField(field: FieldName, value: string) {
		const message = VALIDATORS[field](value) ?? undefined;
		setErrors((prev) => {
			if (prev[field] === message) return prev;
			return { ...prev, [field]: message };
		});
		return !message;
	}

	function handleBlur(e: React.FocusEvent<HTMLElement>) {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		const field = target.name as FieldName;
		if (field in VALIDATORS) validateField(field, target.value);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (submitState.status === "submitting") return;

		const form = e.currentTarget;
		const formData = new FormData(form);

		// Validate everything up front; focus the first field that fails.
		const nextErrors: FieldErrors = {};
		for (const field of Object.keys(VALIDATORS) as FieldName[]) {
			const value = String(formData.get(field) ?? "");
			const message = VALIDATORS[field](value);
			if (message) nextErrors[field] = message;
		}
		setErrors(nextErrors);
		const firstInvalid = Object.keys(nextErrors)[0];
		if (firstInvalid) {
			form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
			return;
		}

		const now = Date.now();
		if (now - lastSubmitRef.current < COOLDOWN_MS) {
			setSubmitState({
				status: "error",
				message: "Please wait a moment before submitting again.",
			});
			return;
		}

		setSubmitState({ status: "submitting" });
		lastSubmitRef.current = now;

		const result = await sendContactEmail(formData);
		if (result.error) {
			setSubmitState({ status: "error", message: result.error });
			return;
		}

		setSubmitState({ status: "success" });
		setProjectType(null);
		setMessageLength(0);
		formRef.current?.reset();
	}

	if (submitState.status === "success") {
		return (
			<SuccessMessage onReset={() => setSubmitState({ status: "idle" })} />
		);
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			noValidate
			className="space-y-5"
		>
			<input
				type="text"
				name="_honeypot"
				tabIndex={-1}
				autoComplete="off"
				className="pointer-events-none absolute h-0 w-0 opacity-0"
				aria-hidden="true"
			/>
			<input type="hidden" name="_t" value={renderTimestamp} />

			{/* Project type: single-select pills feeding the action's
			    projectType field. Optional by design. */}
			<fieldset>
				<legend className={LABEL}>What do you need</legend>
				<div className="flex flex-wrap gap-2">
					{PROJECT_TYPES.map((type) => {
						const active = projectType === type;
						return (
							<label
								key={type}
								className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
									active
										? "border-transparent bg-[var(--brand-coral)] text-[var(--dark)]"
										: "border-[var(--light)]/30 text-[var(--light)] hover:border-[var(--brand-coral)]"
								}`}
							>
								<input
									type="radio"
									name="projectType"
									value={type}
									checked={active}
									onChange={() => setProjectType(active ? null : type)}
									onClick={() => {
										if (active) setProjectType(null);
									}}
									className="sr-only"
								/>
								{type}
							</label>
						);
					})}
				</div>
			</fieldset>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label htmlFor="contact-name" className={LABEL}>
						Full name <span className="text-[var(--brand-coral)]">*</span>
					</label>
					<input
						id="contact-name"
						name="name"
						type="text"
						required
						maxLength={100}
						autoComplete="name"
						placeholder="Ada Lovelace"
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? "contact-name-error" : undefined}
						onBlur={handleBlur}
						className={FIELD}
					/>
					<FieldError id="contact-name-error" message={errors.name} />
				</div>

				<div>
					<label htmlFor="contact-company" className={LABEL}>
						Company
					</label>
					<input
						id="contact-company"
						name="company"
						type="text"
						maxLength={120}
						autoComplete="organization"
						placeholder="Optional"
						aria-invalid={Boolean(errors.company)}
						aria-describedby={
							errors.company ? "contact-company-error" : undefined
						}
						onBlur={handleBlur}
						className={FIELD}
					/>
					<FieldError id="contact-company-error" message={errors.company} />
				</div>

				<div>
					<label htmlFor="contact-email" className={LABEL}>
						Email <span className="text-[var(--brand-coral)]">*</span>
					</label>
					<input
						id="contact-email"
						name="email"
						type="email"
						required
						maxLength={255}
						autoComplete="email"
						placeholder="you@company.com"
						aria-invalid={Boolean(errors.email)}
						aria-describedby={errors.email ? "contact-email-error" : undefined}
						onBlur={handleBlur}
						className={FIELD}
					/>
					<FieldError id="contact-email-error" message={errors.email} />
				</div>

				<div>
					<label htmlFor="contact-phone" className={LABEL}>
						Phone
					</label>
					<input
						id="contact-phone"
						name="phone"
						type="tel"
						maxLength={40}
						autoComplete="tel"
						placeholder="Optional"
						aria-invalid={Boolean(errors.phone)}
						aria-describedby={errors.phone ? "contact-phone-error" : undefined}
						onBlur={handleBlur}
						className={FIELD}
					/>
					<FieldError id="contact-phone-error" message={errors.phone} />
				</div>
			</div>

			<div>
				<div className="flex items-baseline justify-between">
					<label htmlFor="contact-message" className={LABEL}>
						About the project{" "}
						<span className="text-[var(--brand-coral)]">*</span>
					</label>
					<span className="text-[11px] tabular-nums text-[var(--light)]/40">
						{messageLength}/{MESSAGE_MAX}
					</span>
				</div>
				<textarea
					id="contact-message"
					name="message"
					required
					maxLength={MESSAGE_MAX}
					rows={5}
					placeholder="Goals, scope, timeline, budget range. Whatever you know so far."
					aria-invalid={Boolean(errors.message)}
					aria-describedby={
						errors.message ? "contact-message-error" : undefined
					}
					onBlur={handleBlur}
					onChange={(e) => setMessageLength(e.target.value.length)}
					className={`${FIELD} resize-y`}
				/>
				<FieldError id="contact-message-error" message={errors.message} />
			</div>

			{submitState.status === "error" && (
				<p
					className="rounded-md bg-[var(--brand-coral)]/20 px-4 py-2.5 text-[13px] font-medium text-[var(--light)]"
					role="alert"
				>
					{submitState.message}
				</p>
			)}

			<div className="flex flex-wrap items-center gap-5 pt-1">
				<button
					type="submit"
					disabled={submitState.status === "submitting"}
					className="inline-flex items-center gap-3 rounded-full bg-[var(--brand-coral)] px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--dark)] transition-opacity duration-200 hover:opacity-85 disabled:pointer-events-none disabled:opacity-50"
				>
					{submitState.status === "submitting" ? (
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
				<p className="text-[12px] leading-snug text-[var(--light)]/50">
					We reply within one business day.
				</p>
			</div>
		</form>
	);
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
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
			<div className="success-el flex size-16 items-center justify-center rounded-full bg-[var(--brand-coral)]/15 text-[var(--brand-coral)]">
				<HugeiconsIcon icon={SentIcon} className="size-7" strokeWidth={1.5} />
			</div>
			<h2 className="success-el font-medium leading-[1.05] tracking-[-0.02em] text-[var(--brand-coral)] text-[clamp(1.75rem,3vw,2.5rem)]">
				Message sent.
			</h2>
			<p className="success-el max-w-md text-[15px] leading-relaxed text-[var(--light)]/80">
				Thanks for reaching out. We&apos;ll review your message and get back to
				you within one business day.
			</p>
			<button
				type="button"
				onClick={onReset}
				className="success-el text-[13px] font-medium text-[var(--light)] underline underline-offset-4 transition-opacity hover:opacity-70"
			>
				Send another message
			</button>
		</div>
	);
}
