import { PerformanceTracker } from "./performance/tracker";

/**
 * Orchestra: The developer control panel for Untab Studio.
 * Only rendered in development mode.
 */
export function Orchestra() {
	if (process.env.NODE_ENV !== "development") return null;

	return (
		<>
			<PerformanceTracker />
			{/* Future tools like ThemePlayground or CMSPreview can be added here */}
		</>
	);
}
