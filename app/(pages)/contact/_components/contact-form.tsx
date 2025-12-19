"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Field, FieldLabel } from "~/components/ui/field";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

const PROJECT_TYPES = ["Web Development", "Mobile App", "Branding", "UI/UX Design", "Other"];

export function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

	useGSAP(() => {
		gsap.from(".form-item", {
			opacity: 0,
			y: 20,
			duration: 0.8,
			stagger: 0.1,
			ease: "power3.out",
			delay: 0.5,
		});
	}, { scope: formRef });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("submitting");
		
		setTimeout(() => {
			setStatus("success");
		}, 1500);
	};

	if (status === "success") {
		return (
			<div className="py-20 text-center">
				<h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Thank you!</h3>
				<p className="text-muted-foreground">We&apos;ve received your message and will get back to you shortly.</p>
				<Button 
					variant="link"
					onClick={() => setStatus("idle")}
					className="mt-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
				>
					Send another message
				</Button>
			</div>
		);
	}

	return (
		<form 
			ref={formRef} 
			onSubmit={handleSubmit}
			className="flex flex-col gap-12"
		>
			<div className="grid md:grid-cols-2 gap-8">
				<Field className="form-item group flex flex-col gap-3">
					<FieldLabel htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold group-focus-within:text-primary transition-colors">
						Your Name *
					</FieldLabel>
					<Input 
						id="name" 
						name="name" 
						required 
						placeholder="John Doe" 
						className="border-0 border-b border-border hover:border-muted-foreground/50 focus:border-primary focus:ring-0 transition-all px-0 py-4 h-auto text-lg placeholder:opacity-30"
					/>
				</Field>
				<Field className="form-item group flex flex-col gap-3">
					<FieldLabel htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold group-focus-within:text-primary transition-colors">
						Email Address *
					</FieldLabel>
					<Input 
						id="email" 
						name="email" 
						type="email" 
						required 
						placeholder="john@example.com"
						className="border-0 border-b border-border hover:border-muted-foreground/50 focus:border-primary focus:ring-0 transition-all px-0 py-4 h-auto text-lg placeholder:opacity-30"
					/>
				</Field>
			</div>

			<Field className="form-item flex flex-col gap-4">
				<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
					What can we help you with?
				</span>
				<RadioGroup className="flex flex-wrap gap-3" name="projectType">
					{PROJECT_TYPES.map((type) => (
						<FieldLabel 
							key={type}
							className="relative cursor-pointer group flex items-center gap-2 border border-border px-4 py-2 has-data-checked:bg-primary has-data-checked:text-black has-data-checked:border-primary hover:border-primary transition-all duration-300"
						>
							<RadioGroupItem value={type} className="sr-only" />
							<span className="text-[10px] uppercase tracking-widest font-bold">
								{type}
							</span>
						</FieldLabel>
					))}
				</RadioGroup>
			</Field>

			<Field className="form-item group flex flex-col gap-3">
				<FieldLabel htmlFor="message" className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold group-focus-within:text-primary transition-colors">
					Your Message *
				</FieldLabel>
				<Textarea 
					id="message" 
					name="message" 
					required 
					placeholder="Tell us about your project goals, timeline, and any specific requirements..."
					className="border-0 border-b border-border hover:border-muted-foreground/50 focus:border-primary focus:ring-0 transition-all px-0 py-4 min-h-32 text-lg placeholder:opacity-30"
				/>
			</Field>

			<div className="form-item">
				<button 
					type="submit"
					disabled={status === "submitting"}
					className="group relative w-fit overflow-hidden border border-primary px-12 py-6 text-xs font-black uppercase tracking-[0.3em] bg-transparent text-foreground hover:text-black transition-colors"
				>
					<span className="relative z-10">
						{status === "submitting" ? "Sending..." : "Send Message"}
					</span>
					<div className="absolute inset-0 z-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
				</button>
			</div>
		</form>
	);
}
