import { IntroFx } from "./fx/intro-fx";

interface IntroProps {
	eyebrow?: string;
	headingLines?: string[];
}

export function Intro({ eyebrow, headingLines = [] }: IntroProps) {
	return (
		<IntroFx
			id="intro"
			className="relative w-full bg-background text-foreground py-24 md:py-32 lg:py-40"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
					<div className="md:col-span-3 lg:col-span-3">
						<p className="intro-eyebrow flex items-center gap-2 text-sm md:text-base font-normal text-foreground">
							<span
								aria-hidden
								className="size-1.5 rounded-full bg-foreground"
							/>
							{eyebrow}
						</p>
					</div>

					<div className="md:col-span-9 lg:col-span-9">
						<h2 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.75rem,1.5rem+3.2vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
							{headingLines.map((line) => (
								<span key={line} className="intro-line block">
									{line}
								</span>
							))}
						</h2>
					</div>
				</div>
			</div>
		</IntroFx>
	);
}
