"use client";

import { useGSAP } from "@gsap/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { type ReactNode, useRef, useState } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import type { Post } from "~/libs/sanity";

interface BlogFeedProps {
	posts: Post[];
}

export function BlogFeed({ posts }: BlogFeedProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const categories = Array.from(
		new Set(posts.flatMap((p) => p.categories?.map((c) => c.title) ?? [])),
	);

	const visible = activeCategory
		? posts.filter((p) => p.categories?.some((c) => c.title === activeCategory))
		: posts;

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const intro = root.querySelector(".feed-intro");
				if (intro) {
					gsap.from(intro, {
						y: 32,
						opacity: 0,
						duration: 0.9,
						ease: "expo.out",
						scrollTrigger: {
							trigger: intro,
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
				}

				const cards = root.querySelectorAll(".grid-card");
				if (cards.length > 0) {
					gsap.from(cards, {
						y: 56,
						opacity: 0,
						duration: 1,
						ease: "expo.out",
						stagger: 0.07,
						scrollTrigger: {
							trigger: root.querySelector(".post-grid"),
							start: "top 85%",
							toggleActions: "play reverse play reverse",
						},
					});
				}
			}),
		{ scope: sectionRef, dependencies: [activeCategory] },
	);

	return (
		<section
			ref={sectionRef}
			className="w-full bg-background py-16 sm:py-20 md:py-24"
		>
			<div className="container px-6 md:px-12 lg:px-24">
				{/* Intro */}
				<div className="feed-intro mb-12 max-w-2xl md:mb-16">
					<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
						The Latest
					</p>
					<p className="mt-6 text-pretty text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.02em] text-foreground">
						Bold ideas on design, engineering, and brand. Built for business
						impact.
					</p>
				</div>

				{/* Category filters */}
				{categories.length > 0 ? (
					<div className="mb-10 md:mb-14">
						<p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-foreground/40">
							Type
						</p>
						<div className="flex flex-wrap gap-2">
							{categories.map((cat) => (
								<button
									key={cat}
									type="button"
									onClick={() =>
										setActiveCategory(activeCategory === cat ? null : cat)
									}
									className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
										activeCategory === cat
											? "border-foreground bg-foreground text-background"
											: "border-foreground/20 text-foreground hover:border-foreground/40"
									}`}
								>
									{cat}
								</button>
							))}
						</div>
					</div>
				) : null}

				{/* Post grid */}
				<ul className="post-grid grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
					{visible.map((post, i) => (
						<li key={post._id} className="grid-card">
							<PostCard post={post} priority={i < 3} index={i} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

const ACCENTS = [
	{ bg: "#6E56FF", fg: "#FFFFFF" }, // purple
	{ bg: "#F2FF5C", fg: "#0A0A0B" }, // lime
	{ bg: "#FF6B4A", fg: "#FFFFFF" }, // coral
] as const;

function PostCard({
	post,
	priority,
	index,
}: {
	post: Post;
	priority: boolean;
	index: number;
}) {
	const categories = post.categories?.map((c) => c.title) ?? [];
	const primaryTag = categories[0] ?? "Article";
	const extra = categories.length - 1;
	const author = post.author?.name;
	const accent = ACCENTS[index % ACCENTS.length];

	let metaTrail: ReactNode = null;
	if (extra > 0) {
		metaTrail = <span className="shrink-0 tabular-nums">+{extra}</span>;
	} else if (author) {
		metaTrail = (
			<span className="max-w-[45%] shrink-0 truncate text-foreground/45">
				{author}
			</span>
		);
	}

	return (
		<Link
			href={`/blog/${post.slug}`}
			className="group block"
			title={post.title}
		>
			{/* Cover */}
			<div className="relative aspect-[5/6] overflow-hidden rounded-xl bg-foreground/[0.04]">
				{post.mainImage ? (
					<Image
						src={post.mainImage}
						alt=""
						fill
						priority={priority}
						sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
						className="size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04]"
					/>
				) : (
					<div className="flex size-full items-center justify-center bg-muted" />
				)}
			</div>

			{/* Title + arrow */}
			<div className="mt-4 flex items-start justify-between gap-3 sm:mt-5">
				<h3 className="min-w-0 line-clamp-2 text-pretty break-words text-[clamp(1.05rem,1.4vw,1.5rem)] font-semibold leading-snug tracking-[-0.02em] text-foreground">
					{post.title}
				</h3>
				<span
					aria-hidden
					style={{ backgroundColor: accent.bg, color: accent.fg }}
					className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				>
					<HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.2} />
				</span>
			</div>

			{/* Divider */}
			<div className="mt-3 border-t border-foreground/15 sm:mt-4" />

			{/* Meta */}
			<div className="mt-3 flex items-center justify-between gap-3 text-[12px] leading-tight text-foreground/55 sm:text-[13px]">
				<span className="flex min-w-0 flex-1 items-center gap-2">
					<span
						aria-hidden
						style={{ backgroundColor: accent.bg }}
						className="size-2 shrink-0 rounded-full"
					/>
					<span className="truncate">{primaryTag}</span>
				</span>
				{metaTrail}
			</div>
		</Link>
	);
}
