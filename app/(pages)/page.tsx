import { Wrapper } from "~/components/wrapper";
import { getProjects } from "~/libs/projects";
import {
	CaseStudies,
	DisplayCards,
	Features,
	Footer,
	Hero,
	Navbar,
	Pillars,
	Showcase,
	Vision,
	WordsWorthBillions,
} from "./_components";

export default async function Page() {
	const projects = await getProjects();

	return (
		<Wrapper>
			<Navbar />
			<main className="grow">
				<Hero />
				<Showcase />
				<DisplayCards />
				<Features />
				<CaseStudies projects={projects} />
				<Pillars />
				<Vision />
				<WordsWorthBillions />
			</main>
			<Footer />
		</Wrapper>
	);
}
