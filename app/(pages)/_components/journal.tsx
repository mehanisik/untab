"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import type { Post } from "~/libs/sanity";

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
	const sectionRef = useRef<HTMLElement>(null);

	const items = posts.slice(0, 3);

	useGSAP(
		() =>
			withMotion(() => {
				const root = sectionRef.current;
				if (!root) return;

				const title = root.querySelector<HTMLElement>(".journal-title");
				const cta = root.querySelector<HTMLElement>(".journal-cta");
				const cards = root.querySelectorAll<HTMLElement>(".journal-card");

				// One timeline, one ScrollTrigger; reverses out when scrolling
				// back above the section.
				const tl = gsap.timeline({
					defaults: { ease: "expo.out" },
					scrollTrigger: {
						trigger: root,
						start: "top 75%",
						toggleActions: "play reverse play reverse",
					},
				});

				if (title) {
					tl.from(title, { y: 24, autoAlpha: 0, duration: 0.8 }, 0);
				}

				if (cards.length) {
					tl.from(
						cards,
						{ y: 56, autoAlpha: 0, duration: 0.9, stagger: 0.1 },
						0.15,
					);
				}

				if (cta) {
					tl.from(cta, { y: 14, autoAlpha: 0, duration: 0.7 }, 0.2);
				}
			}),
		{ scope: sectionRef, dependencies: [items.length] },
	);

	if (items.length === 0) return null;

	return (
		<section
			ref={sectionRef}
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
		</section>
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
