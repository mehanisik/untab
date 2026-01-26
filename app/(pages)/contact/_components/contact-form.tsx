"use client";

import gsap from "gsap";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { sendContactEmail } from "~/app/actions/contact";
import { toast } from "sonner";
import { cn } from "~/libs/utils";
import { Typewriter } from "./typewriter";

const PROJECT_TYPES = [
	"Web Design",
	"Development",
	"Branding",
	"Creative Tech",
	"Full Product",
] as const;

export function ContactForm() {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		projectType: "Web Design" as string,
		message: "",
	});
	const [status, setStatus] = useState<"idle" | "submitting" | "success">(
		"idle",
	);
	const [isTyping, setIsTyping] = useState(true);
	const stepRef = useRef<HTMLDivElement>(null);
	const magneticRef = useRef<HTMLButtonElement>(null);

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
			toast.error(result.error || "Something went wrong.");
		}
	};

	const nextStep = () => {
		if (step === 1 && !formData.name) {
			toast.error("May we know your name?");
			return;
		}
		if (step === 2 && !formData.email) {
			toast.error("We'll need a valid email to reach you.");
			return;
		}
		if (step === 4 && !formData.message) {
			toast.error("Tell us just a little bit more.");
			return;
		}

		if (step < 4) {
			gsap.to(stepRef.current, {
				opacity: 0,
				filter: "blur(10px)",
				y: -20,
				duration: 0.5,
				ease: "power2.inOut",
				onComplete: () => {
					setStep((prev) => prev + 1);
					setIsTyping(true);
					gsap.fromTo(
						stepRef.current,
						{ opacity: 0, y: 20, filter: "blur(10px)" },
						{
							opacity: 1,
							y: 0,
							filter: "blur(0px)",
							duration: 0.8,
							ease: "expo.out",
						},
					);
				},
			});
		} else {
			handleSubmit();
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!magneticRef.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			magneticRef.current.getBoundingClientRect();
		const x = clientX - (left + width / 2);
		const y = clientY - (top + height / 2);

		gsap.to(magneticRef.current, {
			x: x * 0.2,
			y: y * 0.2,
			duration: 0.8,
			ease: "power3.out",
		});
	};

	const handleMouseLeave = () => {
		if (!magneticRef.current) return;
		gsap.to(magneticRef.current, {
			x: 0,
			y: 0,
			duration: 0.8,
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
			<div className="py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
				<div className="text-4xl text-primary opacity-60 italic font-extralight tracking-widest uppercase">
					Thank you.
				</div>
				<h3 className="text-5xl md:text-7xl font-light tracking-tighter leading-none mb-6">
					Your message has <br /> been received.
				</h3>
				<p className="text-muted-foreground max-w-sm mx-auto text-sm font-light opacity-60">
					We will review your request and get back to you shortly.
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
							projectType: "Web Design",
							message: "",
						});
					}}
					className="mt-12 text-[10px] uppercase tracking-[0.4em] font-medium text-primary hover:text-foreground transition-all"
				>
					Send another message
				</Button>
			</div>
		);
	}

	return (
		<section
			className="min-h-[350px] md:min-h-[450px] flex flex-col justify-center relative outline-none"
			onKeyDown={handleKeyDown}
			aria-label="Contact Form"
			tabIndex={-1}
		>
			<div ref={stepRef} className="space-y-8 md:space-y-12">
				{step === 0 && (
					<div className="space-y-8 md:space-y-12">
						<Typewriter
							text="Welcome. We're ready to start a new journey with you."
							onComplete={() => setIsTyping(false)}
							className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-tight md:leading-[1.1]"
						/>
						{!isTyping && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
								<button
									ref={magneticRef}
									type="button"
									onClick={nextStep}
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}
									className="group relative flex items-center justify-center px-8 md:px-12 py-4 md:py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] transition-all duration-500"
								>
									<span className="relative z-10 flex items-center gap-3 md:gap-4">
										Start Conversation
										<span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
									</span>
								</button>
							</div>
						)}
					</div>
				)}

				{step === 1 && (
					<div className="space-y-6 md:space-y-10">
						<Typewriter
							text="Who are we speaking with?"
							onComplete={() => setIsTyping(false)}
							className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-tighter leading-tight"
						/>
						{!isTyping && (
							<Input
								autoFocus
								placeholder="Enter your name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								className="bg-transparent border-0 border-b border-white/10 focus:border-primary rounded-none px-0 h-16 md:h-20 text-2xl md:text-4xl lg:text-5xl font-light tracking-tighter transition-all placeholder:opacity-10 ring-0 focus-visible:ring-0"
							/>
						)}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-6 md:space-y-10">
						<Typewriter
							text="And how can we reach you?"
							onComplete={() => setIsTyping(false)}
							className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-tighter leading-tight"
						/>
						{!isTyping && (
							<Input
								autoFocus
								type="email"
								placeholder="your@email.com"
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, email: e.target.value }))
								}
								className="bg-transparent border-0 border-b border-white/10 focus:border-primary rounded-none px-0 h-16 md:h-20 text-2xl md:text-4xl lg:text-5xl font-light tracking-tighter transition-all placeholder:opacity-10 ring-0 focus-visible:ring-0"
							/>
						)}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-6 md:space-y-10">
						<Typewriter
							text="What kind of project is this?"
							onComplete={() => setIsTyping(false)}
							className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-tighter leading-tight"
						/>
						{!isTyping && (
							<div className="flex flex-wrap gap-2 md:gap-4 animate-in fade-in duration-1000">
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
											"px-4 md:px-8 py-2 md:py-3 border rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-widest transition-all",
											formData.projectType === type
												? "bg-white text-black border-white"
												: "border-white/10 hover:border-white/40 opacity-50 hover:opacity-100",
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
					<div className="space-y-6 md:space-y-10">
						<Typewriter
							text="Tell us more about your vision"
							onComplete={() => setIsTyping(false)}
							className="text-2xl md:text-4xl lg:text-5xl font-extralight tracking-tighter leading-tight"
						/>
						{!isTyping && (
							<Textarea
								autoFocus
								placeholder="Describe your goals..."
								value={formData.message}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, message: e.target.value }))
								}
								className="bg-transparent border-0 border-b border-white/10 focus:border-primary rounded-none px-0 min-h-[100px] md:min-h-[120px] text-xl md:text-3xl lg:text-4xl font-light tracking-tighter transition-all placeholder:opacity-10 resize-none ring-0 focus-visible:ring-0 leading-tight"
							/>
						)}
					</div>
				)}

				{step > 0 && !isTyping && status !== "submitting" && (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 flex items-center gap-4 md:gap-6 text-[8px] md:text-[9px] font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">
						<span>Press Enter to continue</span>
						<div className="h-px grow bg-white/5" />
					</div>
				)}

				{status === "submitting" && (
					<div className="flex flex-col items-center gap-4 md:gap-6 py-10">
						<div className="w-10 h-10 md:w-12 md:h-12 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
						<div className="text-[9px] font-medium uppercase tracking-[0.4em] md:tracking-[0.5em] text-primary animate-pulse">
							Our team is listening...
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
