"use client";

import { VisualEditing } from "next-sanity/visual-editing";

export function VisualEditingWrapper() {
	if (process.env.NODE_ENV !== "development") return null;

	return <VisualEditing />;
}
