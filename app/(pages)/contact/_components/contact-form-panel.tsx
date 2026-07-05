"use client";

import { useGSAP } from "@gsap/react";
import {
	Loading03Icon,
	SentIcon,
	Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { sendContactEmail } from "~/app/actions/contact";
import { PROJECT_TYPES } from "~/libs/contact";
import { withMotion } from "~/libs/gsap/presets";

const COOLDOWN_MS = 10_000;
const MESSAGE_MAX = 5000;

// Underline fields on the coral surface, ink type throughout.
const FIELD =
	"w-full border-b-2 border-[var(--dark)]/35 bg-transparent px-0 py-3 text-[15px] text-[var(--dark)] outline-none transition-colors duration-200 placeholder:text-[var(--dark)]/55 focus:border-[var(--dark)] aria-[invalid=true]:border-[var(--dark)]";

type SubmitState =
	| { status: "idle" }
	| { status: "submitting" }
	| { status: "success" }
	| { status: "error"; message: string };

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VALIDATORS: Record<FieldName, (value: string) => string | null> = {
	name: (v) => {
		const value = v.trim();
		if (!value) return "Please tell us your name.";
		if (value.length < 2) return "Name needs at least 2 characters.";
		if (value.length > 100) return "Name is too long.";
		return null;
	},
	email: (v) => {
		const value = v.trim();
		if (!value) return "We need an email to reply to.";
		if (value.length > 255 || !EMAIL_RE.test(value))
			return "That email address does not look right.";
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
			className="mt-2 text-[12px] font-semibold leading-snug text-[var(--dark)]"
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
			className="space-y-7"
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

			<div>
				<label htmlFor="contact-name" className="sr-only">
					Your name
				</label>
				<input
					id="contact-name"
					name="name"
					type="text"
					required
					maxLength={100}
					autoComplete="name"
					placeholder="Your name"
					aria-invalid={Boolean(errors.name)}
					aria-describedby={errors.name ? "contact-name-error" : undefined}
					onBlur={handleBlur}
					className={FIELD}
				/>
				<FieldError id="contact-name-error" message={errors.name} />
			</div>

			<div>
				<label htmlFor="contact-email" className="sr-only">
					Email
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
				<label htmlFor="contact-message" className="sr-only">
					About the project
				</label>
				<textarea
					id="contact-message"
					name="message"
					required
					maxLength={MESSAGE_MAX}
					rows={3}
					placeholder="Tell us a little about the project..."
					aria-invalid={Boolean(errors.message)}
					aria-describedby={
						errors.message ? "contact-message-error" : undefined
					}
					onBlur={handleBlur}
					onChange={(e) => setMessageLength(e.target.value.length)}
					className={`${FIELD} resize-y`}
				/>
				<div className="mt-1.5 flex items-center justify-between gap-4">
					<FieldError id="contact-message-error" message={errors.message} />
					<span className="ml-auto font-mono text-[11px] tabular-nums text-[var(--dark)]/50">
						{messageLength}/{MESSAGE_MAX}
					</span>
				</div>
			</div>

			{/* Project type: checkbox-styled single select feeding the action's
			    projectType field. Optional by design. */}
			<fieldset>
				<legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--dark)]/60">
					How can we help
				</legend>
				<div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
					{PROJECT_TYPES.map((type) => {
						const active = projectType === type;
						return (
							<label
								key={type}
								className="group flex w-fit cursor-pointer items-center gap-3 text-[14px] font-medium text-[var(--dark)]"
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
								<span
									aria-hidden
									className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150 ${
										active
											? "border-[var(--dark)] bg-[var(--dark)] text-[var(--brand-coral)]"
											: "border-[var(--dark)]/50 bg-transparent group-hover:border-[var(--dark)]"
									}`}
								>
									{active ? (
										<HugeiconsIcon
											icon={Tick02Icon}
											className="size-3.5"
											strokeWidth={3}
										/>
									) : null}
								</span>
								{type}
							</label>
						);
					})}
				</div>
			</fieldset>

			{submitState.status === "error" && (
				<p
					className="rounded-lg bg-[var(--dark)]/12 px-4 py-3 text-[13px] font-semibold text-[var(--dark)]"
					role="alert"
				>
					{submitState.message}
				</p>
			)}

			<button
				type="submit"
				disabled={submitState.status === "submitting"}
				className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--dark)] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--light)] transition-opacity duration-200 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
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
					"Let's get started"
				)}
			</button>
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
			<div className="success-el flex size-16 items-center justify-center rounded-full bg-[var(--dark)]/10 text-[var(--dark)]">
				<HugeiconsIcon icon={SentIcon} className="size-7" strokeWidth={1.5} />
			</div>
			<h2 className="success-el font-medium leading-[1.05] tracking-[-0.02em] text-[var(--dark)] text-[clamp(1.6rem,2.6vw,2.2rem)]">
				Message sent.
			</h2>
			<p className="success-el max-w-md text-[15px] leading-relaxed text-[var(--dark)]/75">
				Thanks for reaching out. We&apos;ll review your message and get back to
				you within one business day.
			</p>
			<button
				type="button"
				onClick={onReset}
				className="success-el text-[13px] font-semibold text-[var(--dark)] underline underline-offset-4 transition-opacity hover:opacity-70"
			>
				Send another message
			</button>
		</div>
	);
}
