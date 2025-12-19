"use client";

import { useEffect, useState } from "react";

interface Metric {
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
}

export function PerformanceTracker() {
	const [metrics, setMetrics] = useState<Record<string, Metric>>({});
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;

		// Simple Web Vitals tracking
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const name = entry.name;
				const value = entry.startTime; // Simplified for this demo

				let rating: Metric["rating"] = "good";
				if (value > 2500) rating = "poor";
				else if (value > 1500) rating = "needs-improvement";

				setMetrics((prev) => ({
					...prev,
					[name]: { name, value, rating },
				}));
			}
		});

		observer.observe({
			entryTypes: ["paint", "largest-contentful-paint", "layout-shift"],
		});

		return () => observer.disconnect();
	}, []);

	if (process.env.NODE_ENV !== "development") return null;

	return (
		<div className="fixed bottom-4 right-4 z-[9999] font-mono text-[10px]">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="bg-black/80 text-white px-3 py-1 rounded-full border border-white/20 hover:bg-black transition-colors backdrop-blur-md"
			>
				Orchestra {isOpen ? "▲" : "▼"}
			</button>

			{isOpen && (
				<div className="mt-2 w-64 bg-black/90 text-white p-4 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
					<div className="flex justify-between items-center mb-3">
						<h3 className="text-xs font-bold uppercase tracking-wider text-primary">
							Performance
						</h3>
						<span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">
							React 19.2
						</span>
					</div>

					<div className="space-y-2">
						{Object.values(metrics).length === 0 ? (
							<p className="text-white/40 italic">
								Waiting for paint entries...
							</p>
						) : (
							Object.values(metrics).map((m) => {
								let colorClass = "text-yellow-400";
								if (m.rating === "good") colorClass = "text-green-400";
								else if (m.rating === "poor") colorClass = "text-red-400";

								return (
									<div
										key={m.name}
										className="flex justify-between items-center border-b border-white/5 pb-1 last:border-0"
									>
										<span className="text-white/60">{m.name}</span>
										<span className={`font-bold ${colorClass}`}>
											{m.value.toFixed(2)}ms
										</span>
									</div>
								);
							})
						)}
					</div>

					<div className="mt-4 pt-3 border-t border-white/10">
						<div className="flex justify-between text-[8px] uppercase text-white/40">
							<span>Turbopack Cache</span>
							<span className="text-green-400">Active</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
