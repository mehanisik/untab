/**
 * HTML Escaping Utility
 * Escapes HTML special characters to prevent XSS attacks
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#x27;",
	"/": "&#x2F;",
};

/**
 * Escapes HTML special characters in a string
 */
export function escapeHtml(text: string): string {
	return String(text).replace(
		/[&<>"'/]/g,
		(char) => HTML_ESCAPE_MAP[char] || char,
	);
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Sanitizes and validates form input
 */
export function sanitizeInput(input: string, maxLength: number): string {
	// Strip control characters except newlines and tabs, which are legitimate
	// in multi-line message bodies.
	return (
		input
			// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the point
			.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
			.trim()
			.slice(0, maxLength)
	);
}
