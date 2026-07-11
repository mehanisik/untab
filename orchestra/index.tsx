import { PerformanceTracker } from "./performance/tracker";

export function Orchestra() {
	if (process.env.NODE_ENV !== "development") return null;

	return <PerformanceTracker />;
}
