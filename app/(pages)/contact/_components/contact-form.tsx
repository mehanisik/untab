"use client";

import gsap from "gsap";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { sendContactEmail } from "~/app/actions/contact";
import { toast } from "sonner";
import { cn } from "~/libs/utils";

import { useTypewriter } from "~/hooks/use-typewriter";

const Typewriter = ({
	text,
	onComplete,
	className,
}: {
	text: string;
	onComplete?: () => void;
	className?: string;
}) => {
	const { displayedText, isFinished } = useTypewriter(text, { onComplete });

	return (
		<div className={cn("min-h-[1.2em]", className)}>
			{displayedText}
			{!isFinished && (
				<span className="inline-block w-1.5 h-[0.9em] bg-primary ml-1 animate-pulse align-middle" />
			)}
		</div>
	);
};

const PROJECT_TYPES = [
	"Web Development",
	"Mobile App",
	"Branding",
	"UI/UX Design",
	"Other",
] as const;

export function ContactForm() {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		projectType: "Web Development" as string,
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "submitting" | "success">(
		"idle",
	);
	const [isTyping, setIsTyping] = useState(true);
	const stepRef = useRef<HTMLDivElement>(null);

	const handleSubmit = async () => {
		setStatus("submitting");
		const rawFormData = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			rawFormData.append(key, value);
		});
		rawFormData.append("_honeypot", "");

		const result = await sendContactEmail(rawFormData);

		if (result.success) {
			setStatus("success");
		} else {
			setStatus("idle");
			toast.error(result.error || "Failed to send message.");
		}
	};

	const nextStep = () => {
		if (step === 1 && !formData.name) {
			toast.error("Please enter your name.");
			return;
		}
		if (step === 2 && !formData.email) {
			toast.error("Please enter a valid email.");
			return;
		}
		if (step === 4 && !formData.message) {
			toast.error("Please tell us more about your project.");
			return;
		}

		if (step < 4) {
			gsap.to(stepRef.current, {
				opacity: 0,
				y: -20,
				duration: 0.4,
				ease: "power2.inOut",
				onComplete: () => {
					setStep((prev) => prev + 1);
					setIsTyping(true);
					gsap.fromTo(
						stepRef.current,
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
					);
				},
			});
		} else {
			handleSubmit();
		}
	};

	const magneticRef = useRef<HTMLButtonElement>(null);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!magneticRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			magneticRef.current.getBoundingClientRect();
		const x = clientX - (left + width / 2);
		const y = clientY - (top + height / 2);

		gsap.to(magneticRef.current, {
			x: x * 0.3,
			y: y * 0.3,
			duration: 0.6,
			ease: "power3.out",
		});
	};

	const handleMouseLeave = () => {
		if (!magneticRef.current) return;
		gsap.to(magneticRef.current, {
			x: 0,
			y: 0,
			duration: 0.6,
			ease: "elastic.out(1, 0.3)",
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			if (step === 3) return;
			e.preventDefault();
			if (!isTyping) nextStep();
		}
	};

	if (status === "success") {
		return (
			<div className="py-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<div className="text-7xl mb-10">🛸</div>
				<h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6">
					Transmission <br /> <span className="text-primary">Complete</span>
				</h3>
				<p className="text-muted-foreground max-w-sm mx-auto text-[10px] uppercase tracking-[0.5em] font-black opacity-40">
					Establishment Successful — Stand by for feedback
				</p>
				<Button
					variant="link"
					onClick={() => {
						setStep(0);
						setStatus("idle");
						setIsTyping(true);
						setFormData({
							name: "",
							email: "",
							projectType: "Web Development",
							message: "",
						});
					}}
					className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:text-foreground transition-all"
				>
					Re-initiate Protocol
				</Button>
			</div>
		);
	}

	return (
		<section
			className="min-h-[500px] flex flex-col justify-center relative px-4 md:px-0 outline-none"
			onKeyDown={handleKeyDown}
			aria-label="Contact Form"
			tabIndex={-1}
		>
			<div ref={stepRef} className="space-y-16">
				{step === 0 && (
					<div className="space-y-12">
						<Typewriter
							text="Hello. We've been waiting for you. Let's build something legendary."
							onComplete={() => setIsTyping(false)}
							className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic"
						/>
						{!isTyping && (
							<div className="animate-in fade-in zoom-in-95 duration-1000">
								<button
									ref={magneticRef}
									type="button"
									onClick={nextStep}
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}
									className="group relative flex items-center justify-center px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[14px] font-black uppercase tracking-[0.4em] text-white hover:text-primary transition-colors shadow-[0_0_50px_rgba(207,63,153,0.1)] hover:shadow-[0_0_80px_rgba(207,63,153,0.3)] transform-gpu"
								>
									<span className="relative z-10 flex items-center gap-4">
										Initiate Sequence
										<span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(207,63,153,0.8)]" />
									</span>
									<div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
								</button>
							</div>
						)}
					</div>
				)}

				{step === 1 && (
					<div className="space-y-10">
						<Typewriter
							text="First off, what should we call you?"
							onComplete={() => setIsTyping(false)}
							className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic"
						/>
						{!isTyping && (
							<Input
								autoFocus
								placeholder="TYPE YOUR NAME..."
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								className="bg-transparent border-0 border-b-2 border-primary/20 focus:border-primary rounded-none px-0 h-20 text-3xl md:text-5xl font-black uppercase tracking-tighter transition-all placeholder:opacity-10 ring-0 focus-visible:ring-0"
							/>
						)}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-10">
						<Typewriter
							text="Excellent. And your digital coordinate?"
							onComplete={() => setIsTyping(false)}
							className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic"
						/>
						{!isTyping && (
							<Input
								autoFocus
								type="email"
								placeholder="YOUR@EMAIL.COM"
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, email: e.target.value }))
								}
								className="bg-transparent border-0 border-b-2 border-primary/20 focus:border-primary rounded-none px-0 h-20 text-3xl md:text-5xl font-black uppercase tracking-tighter transition-all placeholder:opacity-10 ring-0 focus-visible:ring-0"
							/>
						)}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-10">
						<Typewriter
							text="What kind of project are we launching?"
							onComplete={() => setIsTyping(false)}
							className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic"
						/>
						{!isTyping && (
							<div className="flex flex-wrap gap-4 animate-in fade-in duration-1000">
								{PROJECT_TYPES.map((type) => (
									<button
										key={type}
										type="button"
										onClick={() => {
											setFormData((prev) => ({
												...prev,
												projectType: type,
											}));
											setTimeout(nextStep, 300);
										}}
										className={cn(
											"px-10 py-4 border-2 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all transform-gpu",
											formData.projectType === type
												? "bg-primary text-black border-primary scale-105 shadow-[0_0_30px_rgba(var(--primary),0.2)]"
												: "border-white/5 hover:border-primary/50 opacity-50 hover:opacity-100",
										)}
									>
										{type}
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{step === 4 && (
					<div className="space-y-10">
						<Typewriter
							text="Tell us about the mission parameters..."
							onComplete={() => setIsTyping(false)}
							className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic"
						/>
						{!isTyping && (
							<Textarea
								autoFocus
								placeholder="DESCRIBE YOUR VISION..."
								value={formData.message}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, message: e.target.value }))
								}
								className="bg-transparent border-0 border-b-2 border-primary/20 focus:border-primary rounded-none px-0 min-h-[150px] text-2xl md:text-4xl font-black uppercase tracking-tighter transition-all placeholder:opacity-10 resize-none ring-0 focus-visible:ring-0 leading-[1.1]"
							/>
						)}
					</div>
				)}

				{step > 0 && !isTyping && status !== "submitting" && (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-primary/40">
						<span className="animate-pulse">Press Enter to continue</span>
						<span className="h-px grow bg-white/5" />
					</div>
				)}

				{status === "submitting" && (
					<div className="flex flex-col items-center gap-6 py-10">
						<div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
						<div className="text-[12px] font-black uppercase tracking-[0.6em] text-primary animate-pulse">
							Transmitting Signal...
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
