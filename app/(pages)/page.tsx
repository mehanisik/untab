import { getHomepage } from "~/libs/homepage";
import { getSettings } from "~/libs/live";
import { getPosts } from "~/libs/posts";
import { getProjects } from "~/libs/projects";
import { getServices } from "~/libs/services";
import {
	CaseStudies,
	Features,
	Hero,
	Intro,
	Journal,
	Pillars,
	Services,
	Showcase,
	Vision,
} from "./_components";

export default async function Page() {
	const [projects, posts, settings, services, homepage] = await Promise.all([
		getProjects(),
		getPosts(),
		getSettings(),
		getServices(),
		getHomepage(),
	]);

	return (
		<main className="grow">
			<Hero projects={projects} videoUrl={settings?.heroVideo ?? "/hero.mp4"} />
			<Intro
				eyebrow={homepage.intro?.eyebrow}
				headingLines={homepage.intro?.headingLines}
			/>
			<Showcase
				title={homepage.showcase?.title}
				heading={homepage.showcase?.headingLines}
				description={homepage.showcase?.description}
			/>
			<Services services={services} />
			<Features
				title={homepage.features?.title}
				features={homepage.features?.items}
			/>
			<CaseStudies projects={projects} />
			<Pillars
				title={homepage.collaboration?.title}
				quote={homepage.collaboration?.quote}
				attribution={homepage.collaboration?.attribution}
				note={homepage.collaboration?.note}
				pillars={homepage.collaboration?.pillars}
			/>
			<Vision
				kicker={homepage.vision?.kicker}
				description={homepage.vision?.description}
				linkText={homepage.vision?.linkText}
				heading={homepage.vision?.heading}
			/>
			<Journal posts={posts} label={settings?.journalLabel} />
		</main>
	);
}
