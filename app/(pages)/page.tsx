import { getSettings } from "~/libs/live";
import { getPosts } from "~/libs/posts";
import { getProjects } from "~/libs/projects";
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
	const [projects, posts, settings] = await Promise.all([
		getProjects(),
		getPosts(),
		getSettings(),
	]);

	return (
		<main className="grow">
			<Hero projects={projects} videoUrl={settings?.heroVideo ?? "/hero.mp4"} />
			<Intro />
			<Showcase />
			<Services />
			<Features />
			<CaseStudies projects={projects} />
			<Pillars />
			<Vision />
			<Journal posts={posts} />
		</main>
	);
}
