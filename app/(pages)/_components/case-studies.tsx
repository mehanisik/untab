import { Image } from "~/components/ui/image";
import { Link } from "~/components/ui/link";
import { projectCardImage, sanityFitMax } from "~/libs/project-media";
import type { Project } from "~/libs/projects";
import { PinnedTrack } from "./fx/pinned-track";

interface CaseStudiesProps {
	projects: Project[];
}

export function CaseStudies({ projects }: CaseStudiesProps) {
	const featured = projects;

	const header = (
		<header className="container flex items-end justify-between gap-6 px-6 md:absolute md:inset-x-0 md:top-12 md:z-10 md:px-12 lg:px-24">
			<div>
				<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
					Selected Work
				</p>
				<p className="mt-3 max-w-xl text-pretty text-[clamp(1.25rem,2.4vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.02em] text-foreground">
					A few projects we&apos;re proud of.
				</p>
			</div>

			<Link
				href="/work"
				className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-foreground/20 bg-foreground/[0.03] px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
			>
				View all
				<span
					aria-hidden
					className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
				>
					&rarr;
				</span>
			</Link>
		</header>
	);

	return (
		<PinnedTrack header={header} itemCount={featured.length}>
			{featured.map((project) => (
				<ProjectCard key={project._id ?? project.slug} project={project} />
			))}
		</PinnedTrack>
	);
}

function ProjectCard({ project }: { project: Project }) {
	const cardImage = projectCardImage(project);

	return (
		<Link
			href={project.href ?? `/work/${project.slug}`}
			className="group flex w-[88vw] shrink-0 snap-start flex-col sm:w-[66vw] md:w-[50vw] lg:w-[44vw]"
		>
			<div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-foreground/[0.035]">
				<Image
					src={sanityFitMax(cardImage, 1600)}
					alt={project.title}
					fill
					sizes="(max-width: 640px) 88vw, (max-width: 768px) 66vw, (max-width: 1024px) 50vw, 44vw"
					quality={90}
					objectFit="cover"
					className="size-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
				/>
				{project.previewVideo ? (
					<video
						aria-hidden
						className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						src={project.previewVideo}
						poster={sanityFitMax(cardImage, 1600)}
						autoPlay
						muted
						loop
						playsInline
						preload="metadata"
					/>
				) : null}
			</div>

			<div className="mt-3 flex items-baseline justify-between gap-4 md:mt-4">
				<h3 className="text-[clamp(1.25rem,1.55vw,1.75rem)] font-medium leading-tight tracking-tight text-foreground">
					{project.title}
				</h3>
				<span className="shrink-0 text-sm tabular-nums text-foreground/50">
					{project.year}
				</span>
			</div>
		</Link>
	);
}
