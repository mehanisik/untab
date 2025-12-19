"use client";

import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { FieldLabel } from "~/components/ui/field";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { sendContactEmail } from "~/app/actions/contact";
import { toast } from "sonner";

const PROJECT_TYPES = [
	"Web Development",
	"Mobile App",
	"Branding",
	"UI/UX Design",
	"Other",
] as const;

function Typewriter({
	text,
	className,
	onComplete,
}: { text: string; className?: string; onComplete?: () => void }) {
	const [displayText, setDisplayText] = useState("");
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (text) {
			setDisplayText("");
			setIndex(0);
		}
	}, [text]);

	useEffect(() => {
		if (index < text.length) {
			const timeout = setTimeout(() => {
				setDisplayText((prev) => prev + text[index]);
				setIndex((prev) => prev + 1);
			}, 50);
			return () => clearTimeout(timeout);
		}
		onComplete?.();
		return undefined;
	}, [index, onComplete, text]);

	return <span className={className}>{displayText}</span>;
}

export function ContactForm() {
	const stepRef = useRef<HTMLDivElement>(null);
	const [step, setStep] = useState(0);
	const [showContent, setShowContent] = useState(false);
	const [formData, setFormData] = useState<{
		name: string;
		email: string;
		projectType: string;
		message: string;
	}>({
		name: "",
		email: "",
		projectType: "Web Development",
		message: "",
	});
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	const handleTypingComplete = () => {
		setTimeout(() => setShowContent(true), 600);
	};

	const nextStep = () => {
		setShowContent(false);
		gsap.to(stepRef.current, {
			opacity: 0,
			y: -40,
			duration: 0.6,
			ease: "power3.inOut",
			onComplete: () => {
				setStep((s) => s + 1);
				gsap.fromTo(
					stepRef.current,
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
				);
			},
		});
	};

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
			toast.success("Message shot into space! 🚀");
		} else {
			setStatus("error");
			toast.error(result.error || "Oops! Our carrier pigeon got lost. 🐦");
		}
	};

	if (status === "success") {
		return (
			<div className="py-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<div className="text-6xl mb-8 animate-bounce">✨</div>
				<h3 className="text-4xl font-bold mb-4 uppercase tracking-tighter">
					High Five! ✋
				</h3>
				<p className="text-muted-foreground max-w-sm mx-auto">
					Your message is currently being decoded by our top-secret team of experts.
				</p>
				<Button
					variant="link"
					onClick={() => {
						setStep(0);
						setStatus("idle");
						setShowContent(false);
						setFormData({
							name: "",
							email: "",
							projectType: "Web Development",
							message: "",
						});
					}}
					className="mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground transition-all"
				>
					Start Over
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-[400px] flex flex-col justify-center max-w-2xl mx-auto">
			<div ref={stepRef} className="space-y-12">
				{step === 0 && (
					<div className="space-y-8 text-center md:text-left">
						<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
							<Typewriter
								text="Ready to build something legendary?"
								onComplete={handleTypingComplete}
							/>
						</h2>
						{showContent && (
							<Button
								onClick={nextStep}
								className="group relative border border-primary px-12 py-8 text-xs font-black uppercase tracking-[0.3em] bg-transparent text-foreground hover:text-black transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
							>
								<span className="relative z-10">Initiate Launch Sequence</span>
								<div className="absolute inset-0 z-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
							</Button>
						)}
					</div>
				)}

				{step === 1 && (
					<div className="space-y-8">
						<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
							<Typewriter
								text="First things first, what's your name?"
								onComplete={handleTypingComplete}
							/>
						</h2>
						{showContent && (
							<div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
								<Input
									autoFocus
									placeholder="e.g. Tony Stark"
									value={formData.name}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, name: e.target.value }))
									}
									onKeyDown={(e) => e.key === "Enter" && formData.name && nextStep()}
									className="text-2xl md:text-4xl bg-transparent border-0 border-b-2 border-primary focus:ring-0 px-0 h-auto font-bold placeholder:opacity-20 transition-all"
								/>
								<div className="flex justify-between items-center">
									<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
										Press Enter to continue
									</p>
									<Button
										disabled={!formData.name}
										onClick={nextStep}
										variant="ghost"
										className="text-primary hover:text-primary/80 font-bold uppercase tracking-widest text-[10px]"
									>
										Next Step →
									</Button>
								</div>
							</div>
						)}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-8">
						<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
							<Typewriter
								text={`Awesome, ${formData.name.split(" ")[0]}! Where can we reach you?`}
								onComplete={handleTypingComplete}
							/>
						</h2>
						{showContent && (
							<div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
								<Input
									autoFocus
									type="email"
									placeholder="your@legendary.email"
									value={formData.email}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, email: e.target.value }))
									}
									onKeyDown={(e) =>
										e.key === "Enter" &&
										formData.email.includes("@") &&
										nextStep()
									}
									className="text-2xl md:text-4xl bg-transparent border-0 border-b-2 border-primary focus:ring-0 px-0 h-auto font-bold placeholder:opacity-20 transition-all"
								/>
								<div className="flex justify-between items-center">
									<Button
										onClick={() => {
											setStep(1);
											setShowContent(true);
										}}
										variant="ghost"
										className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
									>
										← Back
									</Button>
									<Button
										disabled={!formData.email.includes("@")}
										onClick={nextStep}
										variant="ghost"
										className="text-primary hover:text-primary/80 font-bold uppercase tracking-widest text-[10px]"
									>
										Almost there →
									</Button>
								</div>
							</div>
						)}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-8">
						<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
							<Typewriter
								text="What are we building today?"
								onComplete={handleTypingComplete}
							/>
						</h2>
						{showContent && (
							<div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
								<RadioGroup
									value={formData.projectType}
									onValueChange={(val: unknown) => {
										if (typeof val === "string") {
											setFormData((prev) => ({ ...prev, projectType: val }));
										}
									}}
									className="flex flex-wrap gap-3"
								>
									{PROJECT_TYPES.map((type) => (
										<FieldLabel
											key={type}
											className="relative cursor-pointer group flex items-center gap-2 border-2 border-border px-6 py-4 has-data-checked:bg-primary has-data-checked:text-black has-data-checked:border-primary hover:border-primary transition-all duration-300"
										>
											<RadioGroupItem value={type} className="sr-only" />
											<span className="text-xs uppercase tracking-widest font-black">
												{type}
											</span>
										</FieldLabel>
									))}
								</RadioGroup>
								<div className="flex justify-between items-center">
									<Button
										onClick={() => {
											setStep(2);
											setShowContent(true);
										}}
										variant="ghost"
										className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
									>
										← Back
									</Button>
									<Button
										onClick={nextStep}
										variant="ghost"
										className="text-primary hover:text-primary/80 font-bold uppercase tracking-widest text-[10px]"
									>
										Final detail →
									</Button>
								</div>
							</div>
						)}
					</div>
				)}

				{step === 4 && (
					<div className="space-y-8">
						<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
							<Typewriter
								text="Last part! Tell us its destiny."
								onComplete={handleTypingComplete}
							/>
						</h2>
						{showContent && (
							<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
								<Textarea
									autoFocus
									placeholder="Tell us everything. The goals, the dreams, the budget..."
									value={formData.message}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, message: e.target.value }))
									}
									className="text-xl bg-transparent border-0 border-b-2 border-primary focus:ring-0 px-0 min-h-[150px] font-medium placeholder:opacity-20 resize-none transition-all"
								/>
								<div className="flex justify-between items-center">
									<Button
										onClick={() => {
											setStep(3);
											setShowContent(true);
										}}
										variant="ghost"
										className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
									>
										← Back
									</Button>
									<Button
										disabled={status === "submitting" || !formData.message}
										onClick={handleSubmit}
										className="group relative border border-primary px-8 py-4 text-xs font-black uppercase tracking-[0.3em] bg-transparent text-foreground hover:text-black transition-all"
									>
										<span className="relative z-10">
											{status === "submitting" ? "Transmitting..." : "Send Signal"}
										</span>
										<div className="absolute inset-0 z-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
									</Button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
