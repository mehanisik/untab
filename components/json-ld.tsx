/**
 * Renders a JSON-LD structured-data <script>. Server component; the data is
 * app-controlled (never user HTML), so dangerouslySetInnerHTML is safe here.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: static, app-controlled SEO schema
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
