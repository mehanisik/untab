import type { Metadata } from "next";
import { getAbout, getProjectCount } from "~/libs/about";
import { generatePageMetadata } from "~/libs/metadata";
import type { AboutStat } from "~/libs/sanity";
import { pad } from "~/libs/utils";
import { Impact, Manifesto, Studio } from "./_components";

export const metadata: Metadata = generatePageMetadata({
	title: "About",
	description:
		"We exist between what is and what is emerging. Strategy, design, and engineering from one studio. Same team from kickoff to ship.",
	url: "/about",
});

export default async function AboutPage() {
	const [about, projectCount] = await Promise.all([
		getAbout(),
		getProjectCount(),
	]);

	const projectStat: AboutStat[] =
		projectCount > 0
			? [
					{
						value: pad(projectCount),
						label: "Projects shipped end-to-end, from first call to launch.",
					},
				]
			: [];

	const stats: AboutStat[] = [...projectStat, ...(about.stats ?? [])];

	return (
		<main className="grow">
			<Manifesto
				eyebrow={about.eyebrow}
				headingLines={about.headingLines}
				intro={about.intro}
				studioStatement={about.studioStatement}
				studioLinkLabel={about.studioLinkLabel}
			/>
			<Studio image={about.brandImage} />
			<Impact
				eyebrow={about.statsEyebrow}
				title={about.statsTitle}
				stats={stats}
			/>
		</main>
	);
}
