"use server";

interface GenerateMetadataInput {
	title: string;
	excerpt?: string;
	body?: string;
}

export async function generateAIMetadata(input: GenerateMetadataInput) {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

	if (!apiKey) {
		console.warn(
			"AI Content Engine: GOOGLE_GENERATIVE_AI_API_KEY not found. Using fallback.",
		);
		return {
			seoTitle: `${input.title} | Untab Studio`,
			seoDescription:
				input.excerpt ||
				`Explore ${input.title} and discover how Untab Studio creates high-performance digital products.`,
			keywords: ["digital studio", "product design", "next.js", "react 19"],
		};
	}

	try {
		const prompt = `Generate SEO metadata for a blog post with the following information:
Title: ${input.title}
${input.excerpt ? `Excerpt: ${input.excerpt}` : ""}
${input.body ? `Content preview: ${input.body.slice(0, 500)}` : ""}

Please respond with a JSON object containing:
- seoTitle: An optimized SEO title (max 60 characters)
- seoDescription: An engaging meta description (max 160 characters)
- keywords: An array of 5-7 relevant keywords

Focus on digital product design, web development, and modern technology.`;

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Google API error: ${response.statusText}`);
		}

		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!text) {
			throw new Error("No response from AI model");
		}

		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			return {
				seoTitle: parsed.seoTitle || `${input.title} | Untab Studio`,
				seoDescription: parsed.seoDescription || input.excerpt || "",
				keywords: parsed.keywords || ["digital studio", "product design"],
			};
		}

		return {
			seoTitle: `${input.title} | Untab Studio`,
			seoDescription: input.excerpt || "",
			keywords: ["digital studio", "product design"],
		};
	} catch (error) {
		console.error("AI Content Engine Error:", error);
		return {
			seoTitle: `${input.title} | Untab Studio`,
			seoDescription: input.excerpt || "",
			keywords: ["digital studio", "product design"],
		};
	}
}
