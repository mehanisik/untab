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

Return a JSON object exactly with these fields:
{
  "seoTitle": "Optimized title (max 60 chars)",
  "seoDescription": "Engaging description (max 160 chars)",
  "keywords": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Focus on digital product design, web development, and modern technology (Next.js 15+, React 19).`;

		const models = ["gemini-3-flash-preview", "gemini-1.5-flash"];
		let lastError: Error | null = null;

		for (const model of models) {
			try {
				const response = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							contents: [{ parts: [{ text: prompt }] }],
							generationConfig: {
								response_mime_type: "application/json",
							},
						}),
					},
				);

				if (!response.ok) {
					throw new Error(
						`Google API error (${model}): ${response.statusText}`,
					);
				}

				const data = await response.json();
				const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

				if (!text) {
					throw new Error(`No response from AI model (${model})`);
				}

				const parsed = JSON.parse(text);
				return {
					seoTitle: parsed.seoTitle || `${input.title} | Untab Studio`,
					seoDescription: parsed.seoDescription || input.excerpt || "",
					keywords: parsed.keywords || ["digital studio", "product design"],
				};
			} catch (error) {
				console.warn(`AI model ${model} failed, trying next...`, error);
				lastError = error as Error;
			}
		}

		throw lastError || new Error("All AI models failed");
	} catch (error) {
		console.error("AI Content Engine Error:", error);
		return {
			seoTitle: `${input.title} | Untab Studio`,
			seoDescription: input.excerpt || "",
			keywords: ["digital studio", "product design"],
		};
	}
}
