import { useCallback, useState } from "react";
import { Box, Button, Card, Stack, Text, useToast } from "@sanity/ui";
import { type ObjectInputProps, set, useFormValue } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { generateAIMetadata } from "../../app/actions/ai";

interface BlockChild {
	text: string;
	_type: string;
}

interface PortableTextBlock {
	_type: string;
	children?: BlockChild[];
}

/**
 * Custom Sanity Input Component for the SEO object.
 * Adds a "Generate with AI" button that uses the updated Gemini 3 model.
 */
export function AISeoInput(props: ObjectInputProps) {
	const { onChange } = props;
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	// Extract context from the parent document
	const title = useFormValue(["title"]) as string;
	const excerpt = useFormValue(["excerpt"]) as string; // from post
	const description = useFormValue(["description"]) as string; // from project general
	const mission = useFormValue(["content", "mission"]) as string; // from project content
	const body = useFormValue(["body"]); // from post

	const handleGenerate = useCallback(async () => {
		if (!title) {
			toast.push({
				title: "Title required",
				description: "Please enter a title before generating SEO metadata.",
				status: "warning",
			});
			return;
		}

		setLoading(true);
		try {
			// Convert Portable Text body to plain text for the AI
			let bodyText = "";
			if (Array.isArray(body)) {
				bodyText = (body as PortableTextBlock[])
					.filter((b) => b._type === "block")
					.map((b) => b.children?.map((c) => c.text).join(""))
					.join("\n");
			}

			const result = await generateAIMetadata({
				title,
				excerpt: excerpt || description || mission,
				body: bodyText,
			});

			// Patch the object fields
			// Note: These paths are relative to the object root
			onChange([
				set(result.seoTitle, ["title"]),
				set(result.seoDescription, ["description"]),
				set(result.keywords, ["keywords"]),
			]);

			toast.push({
				title: "AI Generation Complete",
				status: "success",
			});
		} catch (error) {
			console.error("AI Generation failed:", error);
			toast.push({
				title: "AI Generation failed",
				description:
					error instanceof Error ? error.message : "Check console for details.",
				status: "error",
			});
		} finally {
			setLoading(false);
		}
	}, [title, excerpt, description, mission, body, onChange, toast]);

	return (
		<Stack space={4}>
			<Card border padding={3} radius={2} tone="transparent">
				<Stack space={3}>
					<Box>
						<Text weight="bold" size={1}>
							AI SEO Assistant
						</Text>
						<Text size={1} muted style={{ marginTop: "4px" }}>
							Generate optimized Meta Title, Description, and Keywords using
							Gemini 3 Flash.
						</Text>
					</Box>
					<Button
						icon={SparklesIcon}
						text={loading ? "Generating..." : "Generate with AI"}
						tone="primary"
						padding={3}
						fontSize={2}
						onClick={handleGenerate}
						disabled={loading}
					/>
				</Stack>
			</Card>

			{/* Render the actual form fields */}
			{props.renderDefault(props)}
		</Stack>
	);
}
