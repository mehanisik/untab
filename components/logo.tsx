import { cn } from "~/libs/utils";
import { LogoMark } from "./logo-mark";

interface LogoProps {
	className?: string;
	showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
	if (!showText) {
		return (
			<LogoMark aria-label="untab" className={cn("h-7 w-auto", className)} />
		);
	}

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<LogoMark aria-label="untab" className="h-7 w-auto shrink-0" />
			<div className="flex flex-col leading-none font-sans">
				<span className="text-base font-semibold tracking-tight lowercase whitespace-nowrap">
					untab
				</span>
				<span className="text-[10px] font-medium text-muted-foreground lowercase tracking-[0.2em] whitespace-nowrap">
					software studio
				</span>
			</div>
		</div>
	);
}
