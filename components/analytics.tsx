import Script from "next/script";

export function Analytics() {
	const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	if (!websiteId) return null;

	return (
		<Script
			async
			defer
			data-website-id={websiteId}
			src="https://cloud.umami.is/script.js"
		/>
	);
}
