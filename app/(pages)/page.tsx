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
	const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

	return (
		<main className="grow">
			<Hero projects={projects} />
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
