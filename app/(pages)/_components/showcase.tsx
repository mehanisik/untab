import { Fragment } from "react";
import { AnimatedLine } from "./fx/animated-line";
import { ShowcaseFx } from "./fx/showcase-fx";

interface ShowcaseProps {
	title?: string;
	heading?: string[];
	description?: string;
}

export function Showcase({
	title = "What we deliver",
	heading = ["Minimum", "Perfect", "Experiences"],
	description = "Digital products, webapps, mobile apps, brands and marketing websites you'll be excited to put in front of your customers and investors.",
}: ShowcaseProps) {
	return (
		<ShowcaseFx
			id="showcase"
			className="relative min-h-dvh bg-background py-24"
		>
			<div className="container flex justify-between px-6 md:px-12 lg:px-24">
				<h2 className="showcase-reveal-title text-3xl font-medium tracking-tight text-foreground md:text-4xl">
					{title}
				</h2>

				<AnimatedLine />

				<div className="showcase-reveal-content mt-[544px] flex max-w-[559px] flex-col gap-8">
					<h3 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
						{heading.map((line) => (
							<Fragment key={line}>
								{line}
								<br />
							</Fragment>
						))}
					</h3>
					<p className="text-base text-muted-foreground">{description}</p>
				</div>
			</div>
		</ShowcaseFx>
	);
}
