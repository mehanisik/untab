import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import type { Post } from "~/libs/sanity";
import { JournalFx } from "./fx/journal-fx";

interface JournalProps {
	posts: Post[];
	label?: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

export function Journal({ posts, label = "Journal" }: JournalProps) {
	const items = posts.slice(0, 3);

	if (items.length === 0) return null;

	return (
		<JournalFx
			id="journal"
			aria-labelledby="journal-title"
			className="relative w-full bg-background py-24 md:py-32 lg:py-40"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				<div className="flex items-end justify-between gap-6">
					<h2
						id="journal-title"
						className="journal-title text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(3rem,2rem+2.4vw,4.25rem)] font-medium leading-none tracking-[-0.03em] text-foreground"
					>
						{label}
					</h2>

					<Link
						href="/blog"
						className="journal-cta group inline-flex shrink-0 items-center gap-2 pb-2 text-sm font-medium text-foreground"
					>
						<span className="border-b border-foreground/30 pb-0.5 transition-colors group-hover:border-foreground">
							All posts
						</span>
						<HugeiconsIcon
							icon={ArrowUpRight01Icon}
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							strokeWidth={2}
						/>
					</Link>
				</div>

				<ul className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
					{items.map((post) => (
						<li key={post._id} className="journal-card">
							<JournalCard post={post} />
						</li>
					))}
				</ul>
			</div>
		</JournalFx>
	);
}

function JournalCard({ post }: { post: Post }) {
	const date = post.publishedAt
		? DATE_FORMATTER.format(new Date(post.publishedAt))
		: null;

	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group relative flex h-full flex-col rounded-[24px] border border-foreground/10 bg-card p-3 text-card-foreground transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform hover:-translate-y-1.5"
		>
			<div className="relative aspect-[5/4] w-full overflow-hidden rounded-[14px] ring-1 ring-inset ring-foreground/10">
				{post.mainImage ? (
					<Image
						src={post.mainImage}
						alt={post.title}
						fill
						sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
						className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
					/>
				) : null}
			</div>

			<div className="flex flex-1 flex-col gap-10 px-3 pb-3 pt-7 md:px-4 md:pb-4 md:pt-8">
				<h3 className="line-clamp-3 text-pretty text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] font-medium leading-[1.18] tracking-[-0.018em]">
					{post.title}
				</h3>

				<div className="mt-auto flex items-center justify-between gap-4">
					{date ? (
						<span className="text-sm font-light text-foreground/55">
							{date}
						</span>
					) : (
						<span />
					)}

					<span
						aria-hidden
						className="inline-flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
					>
						<HugeiconsIcon
							icon={ArrowUpRight01Icon}
							className="size-6"
							strokeWidth={1.5}
						/>
					</span>
				</div>
			</div>
		</Link>
	);
}
