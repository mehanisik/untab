"use client";

import { useGSAP } from "@gsap/react";
import { type PortableTextComponents, PortableText } from "@portabletext/react";
import gsap from "gsap";
import { useRef } from "react";
import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { withMotion } from "~/libs/gsap/presets";
import { type Post, urlFor } from "~/libs/sanity";

const PAGE_PADDING = "px-6 md:px-12 lg:px-24";

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/** Sanity asset refs encode dimensions as `image-<id>-<w>x<h>-<format>`. */
function dimensionsFromRef(ref?: string) {
	const fallback = { width: 1600, height: 900 };
	if (!ref) return fallback;
	const match = /-(\d+)x(\d+)-/.exec(ref);
	if (!match) return fallback;
	return { width: Number(match[1]), height: Number(match[2]) };
}

const portableComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => (
			<p className="mt-5 text-[1.0625rem] leading-[1.75] text-foreground/80">
				{children}
			</p>
		),
		h2: ({ children }) => (
			<h2 className="mt-12 text-balance text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="mt-10 text-[clamp(1.25rem,2.2vw,1.5rem)] font-medium leading-snug tracking-[-0.015em] text-foreground">
				{children}
			</h3>
		),
		h4: ({ children }) => (
			<h4 className="mt-8 text-lg font-medium text-foreground">{children}</h4>
		),
		blockquote: ({ children }) => (
			<blockquote className="my-8 border-l-2 border-foreground/30 pl-6 text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-foreground">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="mt-5 flex list-disc flex-col gap-2 pl-6 text-[1.0625rem] leading-[1.7] text-foreground/80 marker:text-foreground/40">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="mt-5 flex list-decimal flex-col gap-2 pl-6 text-[1.0625rem] leading-[1.7] text-foreground/80 marker:text-foreground/40">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li className="pl-1.5">{children}</li>,
		number: ({ children }) => <li className="pl-1.5">{children}</li>,
	},
	marks: {
		strong: ({ children }) => (
			<strong className="font-semibold text-foreground">{children}</strong>
		),
		em: ({ children }) => <em className="italic">{children}</em>,
		code: ({ children }) => (
			<code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.9em]">
				{children}
			</code>
		),
		link: ({ value, children }) => (
			<a
				href={value?.href}
				target="_blank"
				rel="noopener noreferrer"
				className="font-medium text-foreground underline underline-offset-4 transition-opacity duration-200 hover:opacity-60"
			>
				{children}
			</a>
		),
	},
	types: {
		image: ({ value }) => {
			if (!value?.asset) return null;
			const { width, height } = dimensionsFromRef(value.asset._ref);
			return (
				<figure className="my-10">
					<Image
						src={urlFor(value).width(1600).url()}
						alt={value.alt ?? ""}
						width={width}
						height={height}
						sizes="(min-width: 768px) 70ch, 100vw"
						className="h-auto w-full rounded-xl"
					/>
					{value.caption ? (
						<figcaption className="mt-3 text-center text-[13px] text-foreground/55">
							{value.caption}
						</figcaption>
					) : null}
				</figure>
			);
		},
	},
};

export function Article({ post }: { post: Post }) {
	const rootRef = useRef<HTMLElement>(null);
	const categories = post.categories?.map((category) => category.title) ?? [];

	useGSAP(
		() =>
			withMotion(() => {
				const root = rootRef.current;
				if (!root) return;
				gsap.from(root.querySelectorAll<HTMLElement>(".article-reveal"), {
					y: 28,
					opacity: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
				});
			}),
		{ scope: rootRef },
	);

	return (
		<article
			ref={rootRef}
			className="w-full bg-background pt-8 pb-24 text-foreground sm:pt-12 md:pb-32"
		>
			<div className={`mx-auto w-full max-w-[1440px] ${PAGE_PADDING}`}>
				{/* Back link */}
				<Link
					href="/blog"
					className="article-reveal inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/55 transition-colors hover:text-foreground"
				>
					<span aria-hidden>←</span> All articles
				</Link>

				{/* Header */}
				<header className="article-reveal mx-auto mt-10 max-w-3xl sm:mt-14">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/50">
						{categories.length > 0 ? (
							<span className="text-foreground/75">{categories[0]}</span>
						) : null}
						{categories.length > 0 ? <span aria-hidden>·</span> : null}
						<time dateTime={post.publishedAt}>
							{formatDate(post.publishedAt)}
						</time>
						{post.readingTime ? (
							<>
								<span aria-hidden>·</span>
								<span>{post.readingTime}</span>
							</>
						) : null}
					</div>

					<h1 className="mt-6 text-balance text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
						{post.title}
					</h1>

					{post.excerpt ? (
						<p className="mt-6 text-pretty text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-foreground/70">
							{post.excerpt}
						</p>
					) : null}

					{post.author?.name ? (
						<div className="mt-8 flex items-center gap-3">
							{post.author.image ? (
								<span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-foreground/10">
									<Image
										src={post.author.image}
										alt=""
										fill
										sizes="36px"
										className="size-full object-cover"
									/>
								</span>
							) : null}
							<span className="text-[14px] text-foreground/75">
								{post.author.name}
							</span>
						</div>
					) : null}
				</header>

				{/* Cover */}
				{post.mainImage ? (
					<div className="article-reveal mx-auto mt-10 max-w-5xl sm:mt-14">
						<div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-foreground/[0.04]">
							<Image
								src={post.mainImage}
								alt={post.title}
								fill
								priority
								sizes="(min-width: 1024px) 64rem, 100vw"
								className="size-full object-cover"
							/>
						</div>
					</div>
				) : null}

				{/* Body */}
				<div className="article-reveal mx-auto mt-12 max-w-[68ch] sm:mt-16">
					{post.body && post.body.length > 0 ? (
						<PortableText value={post.body} components={portableComponents} />
					) : (
						<p className="text-[1.0625rem] leading-[1.75] text-foreground/80">
							{post.excerpt}
						</p>
					)}
				</div>

				{/* Footer */}
				<div className="mx-auto mt-16 max-w-[68ch] border-t border-foreground/15 pt-8 sm:mt-20">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground transition-opacity hover:opacity-60"
					>
						<span aria-hidden>←</span> Back to all articles
					</Link>
				</div>
			</div>
		</article>
	);
}
