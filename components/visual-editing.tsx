"use client";

import { VisualEditing } from "next-sanity/visual-editing";
import { useEffect } from "react";

/**
 * Visual Editing component for Sanity Live Preview.
 * Only renders in development/preview modes.
 */
export function VisualEditingWrapper() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;
		
		// Optional: Add logic to handle overlay state or deep links
		console.log("Sanity Visual Editing Active");
	}, []);

	if (process.env.NODE_ENV !== "development") return null;

	return <VisualEditing />;
}
