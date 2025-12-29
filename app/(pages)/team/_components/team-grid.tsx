import { Image } from "~/components/ui/image";

interface TeamMember {
	name: string;
	role?: string;
	imageUrl?: string;
	bio?: string;
}

interface TeamGridProps {
	members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
	if (members.length === 0) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 aspect-4/3 md:aspect-video gap-4 overflow-hidden rounded-[3rem]">
				<div className="bg-muted flex items-center justify-center">
					<div className="size-20 bg-primary/20 blur-xl animate-pulse" />
				</div>
				<div className="bg-primary/80" />
				<div className="bg-muted/50" />
				<div className="bg-muted" />
				<div className="bg-muted col-span-2" />
				<div className="bg-primary" />
				<div className="bg-muted/80" />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
			{members.map((member) => (
				<div key={member.name} className="group relative flex flex-col gap-6">
					<div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-muted">
						{member.imageUrl ? (
							<Image
								src={member.imageUrl}
								alt={member.name}
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<span className="text-4xl font-black text-muted-foreground/20 italic">
									{member.name.charAt(0)}
								</span>
							</div>
						)}
						<div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-2xl font-bold uppercase tracking-tighter">
							{member.name}
						</h3>
						{member.role && (
							<p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
								{member.role}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
