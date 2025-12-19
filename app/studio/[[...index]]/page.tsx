import { Studio } from "./studio";

/**
 * Sanity Studio Server Page
 * This server component allows for generateStaticParams and metadata
 * without conflicting with the client-side NextStudio component.
 */

export function generateStaticParams() {
	return [{ index: [] }];
}

export default function StudioPage() {
	return <Studio />;
}
