import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../_components";
import { TeamView } from "./_components/team-view";
import { TeamGrid } from "./_components/team-grid";
import { getAuthors, type Author } from "~/libs/sanity";
import { generatePageMetadata } from "~/libs/metadata";

export async function generateMetadata() {
	return generatePageMetadata({
		title: "Our Team",
		description:
			"Meet the decentralized network of thinkers, makers, and dreamers unified by a single obsession: humanizing technology through exceptional design.",
	});
}

const values = [
	{
		title: "Radical Transparency",
		description:
			"No black boxes. We share our process, challenges, and successes openly with our partners.",
	},
	{
		title: "Continuous Evolution",
		description:
			"Digital is never static. We constantly iterate, learn, and push the boundaries of what's possible.",
	},
	{
		title: "Obsessive Utility",
		description:
			"Aesthetics serve purpose. Every pixel and every line of code must contribute to the user's ultimate goal.",
	},
];

export default async function TeamPage() {
	const authors = await getAuthors();
	const members = authors.map((a: Author) => ({
		name: a.name,
		imageUrl: a.imageUrl,
		bio: a.bio,
	}));

	return (
		<Wrapper>
			<Navbar />
			<TeamView>
				<section className="relative pt-48 pb-32 md:pt-64 md:pb-48">
					<Container>
						<div className="max-w-6xl">
							<h1 className="team-title text-[clamp(2.5rem,10vw,8rem)] font-black leading-[0.8] tracking-tighter uppercase italic py-4">
								<span className="block mb-4 text-foreground">Collective</span>
								<span className="block text-primary">Intelligence</span>
							</h1>
							<div className="mt-20 grid lg:grid-cols-2 gap-12 lg:gap-32">
								<div className="h-px w-full bg-border lg:hidden" />
								<p className="text-2xl md:text-3xl font-light text-muted-foreground leading-tight">
									We are a decentralized network of thinkers, makers, and
									dreamers unified by a single obsession: humanizing technology
									through exceptional design.
								</p>
								<div className="flex flex-col gap-8">
									<div className="h-px w-full bg-border" />
									<div className="grid grid-cols-2 gap-8">
										<div className="flex flex-col gap-1">
											<span className="text-4xl font-bold tabular-nums text-foreground">
												12
											</span>
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
												Core Savants
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="text-4xl font-bold tabular-nums text-foreground">
												03
											</span>
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
												Continents
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section className="py-32 lg:py-64 bg-muted/10 border-y border-border/5">
					<Container>
						<div className="flex flex-col gap-32">
							<div className="max-w-4xl">
								<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-12 text-foreground">
									Mindset is our most valuable asset.
								</h2>
								<p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed italic">
									&ldquo;We don&apos;t just hire talent; we curate perspective.
									Our multi-disciplinary approach ensures that every problem is
									attacked from multiple angles simultaneously.&rdquo;
								</p>
							</div>

							<div className="grid md:grid-cols-3 gap-12 lg:gap-20">
								{values.map((value, i) => (
									<div
										key={value.title}
										className="value-card flex flex-col gap-6"
									>
										<div className="size-10 rounded-full border border-border flex items-center justify-center font-bold text-xs text-primary">
											0{i + 1}
										</div>
										<h3 className="text-2xl font-bold uppercase tracking-tight text-foreground">
											{value.title}
										</h3>
										<p className="text-muted-foreground font-medium leading-relaxed">
											{value.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</Container>
				</section>

				<section className="py-32 lg:py-48">
					<Container>
						<TeamGrid members={members} />
						<div className="mt-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t border-border pt-12">
							<div className="max-w-xs">
								<h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">
									Our Base
								</h4>
								<p className="text-xl font-light text-foreground">
									Warsaw — London — NYC. Available globally.
								</p>
							</div>
							<div className="size-32 rounded-full border border-border flex items-center justify-center p-8 animate-spin-slow">
								<div className="size-full border-t-2 border-primary rounded-full" />
							</div>
						</div>
					</Container>
				</section>
			</TeamView>
			<Footer />
		</Wrapper>
	);
}
