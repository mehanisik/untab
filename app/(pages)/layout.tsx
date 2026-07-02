import { Footer, Navbar } from "./_components";

export default function PagesLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="container relative flex flex-col bg-background text-foreground transition-colors duration-500">
			<Navbar />
			{children}
			<Footer />
		</div>
	);
}
