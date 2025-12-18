import { cn } from "~/libs/utils";

interface LogoProps {
	className?: string;
	showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
	return (
		<div className={cn("flex items-center gap-3", className)}>
			<div className="relative size-8 shrink-0">
				<svg
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
					aria-label="untab studio logo"
				>
					<title>untab studio logo</title>
					<path
						d="M6 10L16 6L26 10L16 14L6 10Z"
						fill="currentColor"
						className="opacity-20"
					/>
					<path
						d="M6 22L16 18L26 22L16 26L6 22Z"
						fill="currentColor"
						className="opacity-40"
					/>
					<path
						d="M16 6L26 10V22L16 26L6 22V10L16 6Z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
					<path
						d="M16 14V18M6 10V22M26 10V22"
						stroke="currentColor"
						strokeWidth="1"
						strokeLinecap="round"
						className="opacity-20"
					/>
				</svg>
			</div>
			{showText && (
				<div className="flex flex-col leading-none">
					<span className="text-sm font-bold tracking-tighter uppercase whitespace-nowrap">
						untab
					</span>
					<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
						studio
					</span>
				</div>
			)}
		</div>
	);
}
