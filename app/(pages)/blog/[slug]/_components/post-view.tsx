"use client";

import { PortableText } from "@portabletext/react";
import { Container } from "~/components/container";
import { Wrapper } from "~/components/wrapper";
import { Footer, Navbar } from "../../../_components";
import { Image } from "~/components/ui/image";

import type { Post } from "~/libs/sanity";

interface PostViewProps {
	post: Post;
}

export function PostView({ post }: PostViewProps) {
	return (
		<Wrapper>
			<Navbar />
			<main className="grow bg-background">
				<article className="pt-32 pb-48">
					<Container className="max-w-4xl">
						<header className="mb-16">
							<div className="flex items-center gap-4 mb-8">
								<span className="text-primary font-bold uppercase tracking-widest text-[10px]">
									Blog Post
								</span>
								<div className="h-px w-12 bg-primary/20" />
							</div>
							<h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-foreground mb-8">
								{post.title}
							</h1>
							<div className="flex items-center gap-8 border-t border-border pt-8 mt-12">
								<div className="flex flex-col">
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
										Author
									</span>
									<span className="text-sm font-medium">
										{post.author.name}
									</span>
								</div>
								<div className="size-1 bg-border rounded-full" />
								<div className="flex flex-col">
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
										Published
									</span>
									<span className="text-sm font-medium">
										{new Date(post.publishedAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</header>

						{post.mainImage && (
							<div className="relative aspect-video rounded-[2rem] overflow-hidden mb-20 bg-muted">
								<Image
									src={post.mainImage}
									alt={post.title}
									fill
									className="object-cover"
									priority
								/>
							</div>
						)}

						<div className="prose prose-lg prose-invert max-w-none">
							<div className="text-foreground text-xl leading-relaxed space-y-8 font-light">
								{post.body && <PortableText value={post.body} />}
							</div>
						</div>
					</Container>
				</article>
			</main>
			<Footer />
		</Wrapper>
	);
}
