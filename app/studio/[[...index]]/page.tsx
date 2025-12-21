import { Studio } from "./studio";

export function generateStaticParams() {
	return [{ index: [] }];
}

export default function StudioPage() {
	return <Studio />;
}
