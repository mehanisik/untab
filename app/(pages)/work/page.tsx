import { getProjects } from "~/libs/projects";
import { WorkView } from "./_components/work-view";

export default async function WorkPage() {
	const projects = await getProjects();

	return <WorkView projects={projects} />;
}
