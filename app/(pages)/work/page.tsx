import { getProjects, type Project } from "~/libs/projects";
import { WorkView } from "./_components/work-view";

export default async function WorkPage() {
	let projects: Project[] = [];

	try {
		projects = await getProjects();
	} catch (error) {
		console.error("Failed to fetch projects:", error);
	}

	if (!Array.isArray(projects)) {
		projects = [];
	}

	return <WorkView projects={projects} />;
}
