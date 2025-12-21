"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Container } from "~/components/container";
import { Link } from "~/components/ui/link";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../../_components";
import type { Post } from "~/libs/sanity";


interface BlogViewProps {
	posts: Post[];
}

export function BlogView({ posts }: BlogViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const featuredPost = posts[0];
	const otherPosts = posts.slice(1);

	useGSAP(
		() => {
			gsap.to(".ticker-track", {
				xPercent: -50,
				repeat: -1,
				duration: 20,
				ease: "none",
			});

			gsap.from(".blog-hero > *", {
				opacity: 0,
				y: 30,
				duration: 1,
				stagger: 0.1,
				ease: "power3.out",
			});
		},
		{ scope: containerRef },
	);

	if (!posts || posts.length === 0) {
		return (
			<Wrapper>
				<Navbar />
				<main className="grow bg-background">
					<Container className="py-48 text-center">
						<h1 className="text-4xl font-bold mb-4">No Posts Available</h1>
						<p className="text-muted-foreground">
							We&apos;re working on some great content. Check back soon!
						</p>
					</Container>
				</main>
				<Footer />
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<Navbar />
			<main ref={containerRef} className="grow bg-background">
				<div className="relative border-b border-border bg-muted/30 py-4 overflow-hidden">
					<div className="ticker-track flex whitespace-nowrap gap-12 font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
						{new Array(10)
							.fill(
								"Insights & Stories — From Our Think Tank — Innovation Through Design — ",
							)
							.map((t, i) => (
								<span key={`ticker-${i}-${t.length}`}>{t}</span>
							))}
					</div>
				</div>

				<section className="blog-hero py-24 lg:py-48">
					<Container className="grid lg:grid-cols-2 gap-20 items-end">
						<Link href={`/blog/${featuredPost.slug}`} className="group block">
							{featuredPost && (
								<>
									<div className="mb-6 flex items-center gap-4">
										<span className="text-primary font-bold uppercase tracking-widest text-[10px]">
											Featured Article
										</span>
										<div className="h-px w-12 bg-primary/20" />
									</div>
									<h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground mb-8 group-hover:text-primary transition-colors">
										{featuredPost.title}
									</h1>
									<p className="text-xl text-muted-foreground/80 font-light leading-relaxed max-w-xl mb-12">
										{featuredPost.excerpt}
									</p>
									<div className="flex items-center gap-8">
										<div className="flex flex-col">
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
												Author
											</span>
											<span className="text-sm font-medium">
												{featuredPost.author}
											</span>
										</div>
										<div className="size-1 bg-border rounded-full" />
										<div className="flex flex-col">
											<span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
												Published
											</span>
											<span className="text-sm font-medium">
												{new Date(
													featuredPost.publishedAt,
												).toLocaleDateString()}
											</span>
										</div>
									</div>
								</>
							)}
						</Link>

						<Link
							href={`/blog/${featuredPost.slug}`}
							className="relative block aspect-4/5 bg-muted rounded-[3rem] overflow-hidden group shadow-2xl transition-transform hover:scale-[1.02] duration-500"
						>
							<div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
							<div className="absolute inset-x-8 bottom-8 flex justify-between items-end">
								<div className="size-20 rounded-full bg-background flex items-center justify-center p-6 shadow-2xl group-hover:scale-110 transition-transform">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="size-full text-foreground"
									>
										<title>Read Article</title>
										<path
											d="M7 17L17 7M17 7H7M17 7V17"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 tabular-nums">
									{featuredPost &&
										new Date(featuredPost.publishedAt).toLocaleDateString()}
								</span>
							</div>
						</Link>
					</Container>
				</section>

				<section className="pb-32 lg:pb-64 border-t border-border pt-32">
					<Container>
						<div className="grid lg:grid-cols-[1fr_2fr] gap-20">
							<div>
								<h2 className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground sticky top-32">
									Archive_All
								</h2>
							</div>
							<div className="flex flex-col border-t border-border">
								{otherPosts.map((post) => (
									<Link
										key={post.title}
										href={`/blog/${post.slug}`}
										className="group py-12 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted transition-colors px-4 -mx-4"
									>
										<div className="flex flex-col gap-2">
											<span className="text-[10px] uppercase tracking-widest text-primary font-bold">
												Design & Tech
											</span>
											<h3 className="text-3xl md:text-5xl font-medium tracking-tighter group-hover:text-primary transition-colors">
												{post.title}
											</h3>
										</div>
										<div className="flex flex-col items-end gap-2 shrink-0">
											<span className="text-[10px] font-bold text-muted-foreground tabular-nums opacity-60 uppercase tracking-widest">
												Released
											</span>
											<span className="text-lg font-medium tracking-tight whitespace-nowrap">
												{new Date(post.publishedAt).toLocaleDateString()}
											</span>
										</div>
									</Link>
								))}
							</div>
						</div>
					</Container>
				</section>

				<section className="py-24 bg-foreground text-background">
					<Container className="text-center">
						<span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-8 block">
							Stay Updated
						</span>
						<h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12">
							{" "}
							Join our mailing list. No fluff.{" "}
						</h2>
						<div className="max-w-md mx-auto relative">
							<input
								type="email"
								placeholder="address@email.com"
								className="w-full bg-transparent border-b border-background/20 py-4 px-2 focus:outline-none focus:border-background text-xl font-light placeholder:opacity-30"
							/>
							<button
								type="submit"
								className="absolute right-0 bottom-4 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
							>
								Submit
							</button>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</Wrapper>
	);
}
