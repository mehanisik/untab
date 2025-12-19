"use client";

import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { ANIMATIONS } from "~/libs/gsap/presets";
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";
import { THEME_REGISTRY } from "~/libs/themes";
import { useAdaptiveTheme } from "~/hooks/use-adaptive-theme";
import { generateAIMetadata } from "~/app/actions/ai";

/**
 * Component Playground
 */
export default function PlaygroundPage() {
	const [activeComponent, setActiveComponent] = useState("buttons");
	const [activeThemeKey, setActiveThemeKey] = useState<string | undefined>(
		undefined,
	);
	const [isGenerating, setIsGenerating] = useState(false);
	const [aiResult, setAiResult] = useState<{
		seoTitle: string;
		seoDescription: string;
		keywords: string[];
	} | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { theme, setTheme } = useTheme();

	// Enable adaptive theme shifting
	useAdaptiveTheme(activeThemeKey);

	useGSAP(() => {
		if (containerRef.current) {
			const children = Array.from(containerRef.current.children);
			ANIMATIONS.staggerReveal(children);
		}
	}, [activeComponent]);

	const handleGenerateAI = async () => {
		setIsGenerating(true);
		try {
			const result = await generateAIMetadata({
				title: "Future Frontiers: AI & Adaptive UI",
				excerpt:
					"Exploring the next generation of digital product studio workflows at Untab.",
			});
			setAiResult(result);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<main className="min-h-screen bg-background p-8 md:p-16">
			<div className="max-w-6xl mx-auto">
				<header className="mb-12">
					<h1 className="text-4xl font-bold tracking-tighter mb-2 italic">
						Orchestra Playground
					</h1>
					<p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
						Sandbox / Atomic Design / Motion Presets
					</p>
				</header>

				<Tabs defaultValue="buttons" onValueChange={setActiveComponent}>
					<TabsList className="mb-8 flex-wrap">
						<TabsTrigger value="buttons">Buttons</TabsTrigger>
						<TabsTrigger value="motion">Motion Presets</TabsTrigger>
						<TabsTrigger value="typography">Typography</TabsTrigger>
						<TabsTrigger value="adaptive">Adaptive UI</TabsTrigger>
						<TabsTrigger value="ai">AI Content</TabsTrigger>
					</TabsList>

					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<aside className="lg:col-span-1 space-y-6">
							<div className="p-6 bg-muted/20 border border-white/5 rounded-2xl">
								<h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
									Theme Lab
								</h3>
								<div className="space-y-4">
									<div className="space-y-2">
										<p className="text-[10px] uppercase font-semibold text-muted-foreground">
											Active Mode
										</p>
										<div className="flex gap-2">
											<div
												className={`size-6 rounded-full border border-white/10 ${theme === "dark" ? "bg-zinc-950" : "bg-white"}`}
											/>
											<code className="text-[10px] py-1 text-muted-foreground uppercase">
												{theme}
											</code>
										</div>
									</div>
									<Tabs value={theme} onValueChange={(v) => setTheme(v)}>
										<TabsList className="w-full">
											<TabsTrigger value="light" className="flex-1">
												Light
											</TabsTrigger>
											<TabsTrigger value="dark" className="flex-1">
												Dark
											</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
							</div>

							<div className="p-6 bg-muted/20 border border-white/5 rounded-2xl">
								<h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
									Breakpoints
								</h3>
								<div className="grid grid-cols-3 gap-2">
									<Button variant="outline" size="sm" className="text-[10px]">
										MOB
									</Button>
									<Button variant="outline" size="sm" className="text-[10px]">
										TAB
									</Button>
									<Button variant="outline" size="sm" className="text-[10px]">
										DSK
									</Button>
								</div>
							</div>
						</aside>

						<div
							ref={containerRef}
							className="lg:col-span-3 bg-muted/10 border border-white/5 rounded-3xl p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden"
						>
							<TabsContent value="buttons" className="w-full">
								<div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
									<Button variant="default">Default</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="outline">Outline</Button>
									<Button variant="ghost">Ghost</Button>
									<Button variant="destructive">Destructive</Button>
									<Button variant="link">Link</Button>
								</div>
							</TabsContent>

							<TabsContent value="motion" className="w-full text-center">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div className="p-12 bg-primary/20 rounded-3xl border border-primary/20 flex flex-col items-center gap-4">
										<div className="size-16 bg-primary rounded-full transition-colors duration-500" />
										<span className="text-xs font-mono uppercase tracking-widest">
											revealUp
										</span>
									</div>
									<div className="p-12 bg-secondary/20 rounded-3xl border border-secondary/20 flex flex-col items-center gap-4 animate-pulse">
										<div className="size-16 bg-secondary rounded-full" />
										<span className="text-xs font-mono uppercase tracking-widest">
											fadeIn
										</span>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="typography" className="w-full">
								<div className="space-y-6 max-w-2xl">
									<h1 className="text-6xl font-extrabold tracking-tighter leading-none italic">
										Satoshi Variable
									</h1>
									<h2 className="text-3xl font-medium tracking-tight">
										Geist Sans
									</h2>
									<p className="text-base/relaxed text-muted-foreground">
										The quick brown fox jumps over the lazy dog. A showcase of
										the studio's selected typefaces and their weights.
									</p>
									<div className="flex gap-4">
										<span className="px-3 py-1 bg-muted rounded text-[10px] font-mono">
											inter: 400
										</span>
										<span className="px-3 py-1 bg-muted rounded text-[10px] font-mono">
											inter: 600
										</span>
										<span className="px-3 py-1 bg-muted rounded text-[10px] font-mono italic">
											inter: 900
										</span>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="adaptive" className="w-full">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
									<div className="space-y-6">
										<h2 className="text-2xl font-bold tracking-tight">
											Adaptive Theme Shifting
										</h2>
										<p className="text-sm text-muted-foreground">
											Click a category below to see the entire site's primary
											token smoothly interpolate to a new brand palette.
										</p>
										<div className="flex flex-wrap gap-3">
											{Object.keys(THEME_REGISTRY).map((key) => (
												<Button
													key={key}
													variant={
														activeThemeKey === key ? "default" : "outline"
													}
													size="sm"
													onClick={() => setActiveThemeKey(key)}
													className="capitalize"
												>
													{key}
												</Button>
											))}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setActiveThemeKey(undefined)}
											>
												Reset
											</Button>
										</div>
									</div>
									<div className="p-12 border-2 border-dashed border-primary/40 rounded-3xl flex items-center justify-center">
										<div className="size-24 bg-primary rounded-full shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-500" />
									</div>
								</div>
							</TabsContent>

							<TabsContent value="ai" className="w-full">
								<div className="max-w-xl mx-auto space-y-8">
									<div className="text-center space-y-4">
										<h2 className="text-2xl font-bold tracking-tight">
											AI Content Assistant
										</h2>
										<p className="text-sm text-muted-foreground">
											Test the automated SEO metadata generation using our
											server action content engine.
										</p>
										<Button
											onClick={handleGenerateAI}
											disabled={isGenerating}
											className="w-full md:w-auto"
										>
											{isGenerating
												? "Analyzing Content..."
												: "Generate Test Metadata"}
										</Button>
									</div>

									{aiResult && (
										<div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
											<div>
												<p className="text-[10px] uppercase font-bold text-primary mb-1">
													SEO Title
												</p>
												<p className="text-sm font-semibold">
													{aiResult.seoTitle}
												</p>
											</div>
											<div>
												<p className="text-[10px] uppercase font-bold text-primary mb-1">
													SEO Description
												</p>
												<p className="text-sm leading-relaxed">
													{aiResult.seoDescription}
												</p>
											</div>
											<div className="flex gap-2">
												{aiResult.keywords.map((k: string) => (
													<span
														key={k}
														className="px-2 py-0.5 bg-primary/10 rounded text-[10px] font-mono text-primary"
													>
														#{k}
													</span>
												))}
											</div>
										</div>
									)}
								</div>
							</TabsContent>
						</div>
					</div>
				</Tabs>
			</div>
		</main>
	);
}
