import { getSettings } from "~/libs/live";
import { Footer, Navbar } from "./_components";

export default async function PagesLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const settings = await getSettings();

	return (
		<div className="container relative flex flex-col bg-background text-foreground transition-colors duration-500">
			<a
				href="#main-content"
				className="sr-only z-40 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
			>
				Skip to content
			</a>
			<Navbar />
			{/* display:contents keeps the flex layout while giving the skip link
			    a stable anchor around whatever <main> each page renders. */}
			<div id="main-content" className="contents">
				{children}
			</div>
			<Footer
				footerTagline={settings?.footerTagline}
				studioTypeLabel={settings?.studioTypeLabel}
				contactEmail={settings?.contactEmail}
				studioCity={settings?.studioCity}
				timezone={settings?.timezone}
			/>
		</div>
	);
}
