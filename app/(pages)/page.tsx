import { Wrapper } from "~/components/wrapper";
import { getPosts } from "~/libs/posts";
import { getProjects } from "~/libs/projects";
import {
	CaseStudies,
	Features,
	Footer,
	Hero,
	Intro,
	Journal,
	Navbar,
	Pillars,
	Showcase,
	Vision,
} from "./_components";

export default async function Page() {
	const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<Hero />
				<Intro />
				<Showcase />
				<Features />
				<CaseStudies projects={projects} />
				<Pillars />
				<Vision />
				<Journal posts={posts} />
			</main>
			<Footer />
		</Wrapper>
	);
}
