import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
	_type: string;
	slug?: string | { current?: string };
};

export async function POST(req: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET;
	if (!secret) {
		return NextResponse.json(
			{ message: "Missing SANITY_REVALIDATE_SECRET" },
			{ status: 500 },
		);
	}

	try {
		const { isValidSignature, body } = await parseBody<WebhookPayload>(
			req,
			secret,
		);

		if (!isValidSignature) {
			return NextResponse.json(
				{ message: "Invalid signature" },
				{ status: 401 },
			);
		}
		if (!body?._type) {
			return NextResponse.json({ message: "Missing _type" }, { status: 400 });
		}

		const tags = [body._type];
		const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
		if (slug) tags.push(`${body._type}:${slug}`);

		for (const tag of tags) {
			revalidateTag(tag, { expire: 0 });
		}

		return NextResponse.json({ revalidated: true, tags });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ message }, { status: 500 });
	}
}
