"use server";

/**
 * AI Content Engine - Edge Actions
 * Handles LLM communication for metadata generation.
 */

interface GenerateMetadataInput {
	title: string;
	excerpt?: string;
	body?: string;
}

export async function generateAIMetadata(input: GenerateMetadataInput) {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		// Mocked response for development/testing without keys
		console.warn("AI Content Engine: OPENAI_API_KEY not found. Using mock data.");
		
		await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

		return {
			seoTitle: `${input.title} | Untab Studio Insight`,
			seoDescription: input.excerpt || `Deep dive into ${input.title}. Explore how Untab Studio approaches modern digital product design and performance.`,
			keywords: ["digital studio", "product design", "next.js", "react 19"],
		};
	}

	try {
		// Placeholder for actual LLM implementation
		// This would use a lightweight fetch to OpenAI or Anthropic
		return {
			seoTitle: "AI Generated Title",
			seoDescription: "AI Generated Description",
			keywords: ["ai", "automated"],
		};
	} catch (error) {
		console.error("AI Content Engine Error:", error);
		throw new Error("Failed to generate metadata via AI");
	}
}
