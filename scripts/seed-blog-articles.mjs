import { readFile } from "node:fs/promises";
import path from "node:path";

// Seeds the studio blog with researched long-form articles. Idempotent:
// documents use fixed ids derived from slugs, so re-running replaces the
// same posts instead of duplicating them.
//
//   node scripts/seed-blog-articles.mjs            # create or replace posts
//   node scripts/seed-blog-articles.mjs --dry-run  # print summary only
//
// After seeding, run `node scripts/generate-blog-posters.mjs` so every new
// post gets its halftone poster cover.

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, ".env.local");
const API_VERSION = "v2023-05-03";

const AUTHOR_ID = "bbdbf6dd-1cae-4897-889c-7f0df1c136b8";
const CATEGORIES = {
	design: "159be5e7-a4d6-4ea5-ae50-fd4dd0ee87f8",
	insight: "541287e2-058d-4a5f-ab45-1cfcc5b9ce61",
	culture: "77dcc9e9-43d1-41f6-968f-288d486ad975",
	development: "7af5d9be-dfe5-4459-9e3f-857c808f847b",
	productivity: "9311369a-87fc-4fd4-8bc1-2dfec64ee941",
	tech: "e698ea05-7c89-4b7a-96cf-d96cf25f8229",
};

function unquote(value) {
	return value.replace(/^['"]|['"]$/g, "");
}

async function loadEnv() {
	const raw = await readFile(ENV_FILE, "utf8");
	for (const line of raw.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		const value = unquote(trimmed.slice(eq + 1).trim());
		if (!process.env[key]) process.env[key] = value;
	}
}

let keyCounter = 0;
const key = () => `sk${(keyCounter++).toString(36).padStart(6, "0")}`;

const block = (text, style = "normal") => ({
	_type: "block",
	_key: key(),
	style,
	markDefs: [],
	children: [{ _type: "span", _key: key(), marks: [], text }],
});

const bullet = (text) => ({
	_type: "block",
	_key: key(),
	style: "normal",
	listItem: "bullet",
	level: 1,
	markDefs: [],
	children: [{ _type: "span", _key: key(), marks: [], text }],
});

function buildBody(sections) {
	const blocks = [];
	for (const section of sections) {
		if (section.h2) blocks.push(block(section.h2, "h2"));
		for (const p of section.paras ?? []) blocks.push(block(p));
		for (const b of section.bullets ?? []) blocks.push(bullet(b));
		for (const p of section.after ?? []) blocks.push(block(p));
	}
	return blocks;
}

function wordCount(sections) {
	let words = 0;
	for (const s of sections) {
		const texts = [s.h2, ...(s.paras ?? []), ...(s.bullets ?? []), ...(s.after ?? [])];
		for (const t of texts) if (t) words += t.split(/\s+/).length;
	}
	return words;
}

const ARTICLES = [
	{
		title: "Motion Design That Sells Without Slowing Your Site Down",
		slug: "motion-design-that-sells-without-slowing-your-site",
		category: "design",
		publishedAt: "2026-06-30T08:00:00Z",
		featured: false,
		excerpt:
			"Animation earns attention when it carries meaning and costs nothing in speed. Here is how we decide what moves, what stays still, and how to keep both fast.",
		keywords: [
			"web motion design",
			"gsap animation",
			"website animation performance",
			"scroll animation",
		],
		sections: [
			{
				paras: [
					"Visitors form an opinion about your product in about fifty milliseconds. Motion is one of the few tools that can shape that first impression before a single word is read. It is also one of the fastest ways to ruin a site when it is applied without judgement.",
					"We use animation on almost every project we ship, and we cut more animation than we keep. This article covers the rules we apply when deciding what earns movement, plus the technical guardrails that keep animated sites scoring well on speed.",
				],
			},
			{
				h2: "Motion needs a job",
				paras: [
					"Every animation on a page should do one of three things. It can direct attention toward the next action, it can give feedback that an interaction registered, or it can express brand character in moments where the visitor is already waiting. If a movement does none of those, it is decoration competing with your message.",
					"A reveal that staggers a headline into view directs attention. A button that responds within two hundred milliseconds of a press gives feedback. A loader with personality expresses character during unavoidable dead time. An icon that spins forever next to static text does nothing and should go.",
				],
			},
			{
				h2: "The performance rules we never break",
				paras: [
					"Browsers can move and fade elements on the compositor thread without recalculating layout. Everything else is expensive. That single fact drives most of our technical decisions.",
				],
				bullets: [
					"Animate transform and opacity only. Width, height, top and margin trigger layout work on every frame.",
					"Respect the reduced motion preference. Users who turn animation off in their system settings get an instant, static experience.",
					"Pause anything that loops when it leaves the viewport. Off screen animation burns battery for nobody.",
					"Keep interaction feedback under two hundred milliseconds and content transitions under half a second. Beyond that, motion reads as lag.",
					"Test on a mid range Android phone, not on your studio laptop. That is where jank lives.",
				],
			},
			{
				h2: "Scroll animation without the regret",
				paras: [
					"Scroll driven reveals are the signature of modern studio sites, and they age badly when overdone. Our rule is that scrolling must always feel like the visitor is in control. Content appears as it enters the view, it never hijacks the wheel, and a reveal never hides information a visitor already scrolled to reach.",
					"We also make reveals reversible. Elements that animate in while scrolling down animate out when scrolling back up. It sounds like a detail, and it is exactly the kind of detail that separates a site that feels engineered from one that feels templated.",
				],
			},
			{
				h2: "Where the budget goes",
				paras: [
					"A tasteful motion pass on a marketing site adds roughly ten to fifteen percent to the design and build budget. Spend it on the hero, on primary calls to action, and on one signature moment visitors will remember. Spend nothing animating body text, footers or forms beyond basic feedback.",
					"Motion is seasoning. The meal is your content, your offer and your speed. Season accordingly.",
				],
			},
		],
	},
	{
		title: "Website Redesign or Iteration: How to Decide",
		slug: "website-redesign-or-iteration-how-to-decide",
		category: "insight",
		publishedAt: "2026-06-16T08:00:00Z",
		featured: false,
		excerpt:
			"Most sites do not need a full rebuild. Some absolutely do. A practical framework for telling the difference before you spend six figures finding out.",
		keywords: [
			"website redesign",
			"website refresh",
			"redesign cost",
			"when to redesign website",
		],
		sections: [
			{
				paras: [
					"The most expensive sentence in web projects is we should just redo everything. Sometimes it is true. More often it is frustration talking, and a fraction of the budget spent on targeted fixes would have moved the numbers further.",
					"We have rebuilt sites from scratch and we have talked clients out of rebuilds that would have wasted a year. The deciding factors are surprisingly consistent.",
				],
			},
			{
				h2: "Signals that iteration will win",
				paras: [
					"If your site structure matches how customers think, your platform is not fighting you, and your brand is broadly right, you almost certainly do not need a rebuild. You need a punch list.",
				],
				bullets: [
					"Conversion is soft on specific pages while others perform. Fix the weak pages.",
					"The site is slow, and the causes are oversized images, too many scripts or cheap hosting. All fixable in weeks.",
					"Content is stale because publishing is painful. A CMS cleanup is cheaper than a new site.",
					"The design looks dated in details like typography, spacing and color. A visual refresh on the existing structure can ship in a month.",
				],
			},
			{
				h2: "Signals that a rebuild is honest",
				paras: [
					"Rebuilds are justified when the foundation itself is the constraint. No amount of iteration fixes a foundation.",
				],
				bullets: [
					"Your business changed and the site architecture no longer matches what you sell or who buys it.",
					"The platform blocks you. Every new feature request gets quoted in months because the codebase resists change.",
					"You are repositioning the brand. New market, new audience or new pricing tier that the current design actively undermines.",
					"Technical debt compounds. Each fix breaks something else, and your developers describe the codebase with words we cannot print.",
				],
			},
			{
				h2: "The audit that settles it",
				paras: [
					"Before deciding, spend one or two weeks on a structured audit. Pull analytics for your top twenty pages and note traffic, conversion and exit rates. Run speed tests on the five pages that matter commercially. Interview three customers about how they actually use the site. List every change you wanted in the last year and what blocked it.",
					"Read the results cold. If the blockers cluster around content and polish, iterate. If they cluster around structure and platform, rebuild. If you rebuild, carry the audit into the new project as its first brief. The teams that skip this step rebuild the same problems with nicer fonts.",
				],
			},
			{
				h2: "What each path costs",
				paras: [
					"A focused iteration sprint with a senior team typically runs four to eight weeks. A proper rebuild for a business site runs three to six months once strategy, design, build and migration are counted honestly. The rebuild is not just bigger, it also carries opportunity cost, because your team spends those months reviewing and deciding instead of selling.",
					"Choose the smallest intervention that removes the real constraint. That is the whole framework.",
				],
			},
		],
	},
	{
		title: "Why We Build Business Websites on Next.js",
		slug: "why-we-build-business-websites-on-nextjs",
		category: "development",
		publishedAt: "2026-05-28T08:00:00Z",
		featured: true,
		excerpt:
			"Our default stack for marketing sites and products is Next.js. This is the reasoning, the trade offs we accept, and the cases where we recommend something simpler.",
		keywords: [
			"next.js for business",
			"next.js agency",
			"react website",
			"choosing web framework",
		],
		sections: [
			{
				paras: [
					"Every studio has a default stack. Ours is Next.js with React, and it has been for years, across marketing sites, e commerce storefronts and full products. A default is only useful if you can defend it, so here is the defense in plain terms.",
				],
			},
			{
				h2: "Speed that search engines can measure",
				paras: [
					"Next.js renders pages on the server and ships them as ready HTML, so visitors and crawlers get real content immediately instead of waiting for a script bundle to boot. Combined with built in image optimization and font handling, this is why our sites routinely score green on Core Web Vitals without heroics.",
					"For a business, that translates directly. Google uses page experience in ranking, and every study of load time against conversion points the same direction. Faster sites sell more.",
				],
			},
			{
				h2: "Content that updates without redeploys",
				paras: [
					"Modern Next.js caches pages and revalidates them when content changes. Practically, your marketing team edits a page in the CMS, publishes, and the live site updates within seconds while still serving cached, fast pages to everyone else. You get the speed of a static site with the freshness of a dynamic one, and nobody files a ticket to deploy.",
				],
			},
			{
				h2: "One codebase from brochure to product",
				paras: [
					"Plenty of companies start with a marketing site and grow into a product, a portal or a store. Because Next.js is a full application framework, that growth happens inside one codebase and one deployment pipeline. The alternative is the classic mess where the site lives on one platform, the app on another, and the login page belongs to nobody.",
					"Hiring matters here too. React has the deepest talent pool in front end development. Choosing a niche framework saves nothing if every future hire needs three months of onboarding.",
				],
			},
			{
				h2: "The trade offs we accept",
				paras: [
					"Next.js is heavier machinery than a page builder. It needs a developer to change layouts, and hosting is more involved than an FTP upload. Build tooling evolves quickly, which means someone has to own upgrades. These are real costs and we quote them honestly.",
				],
			},
			{
				h2: "When we recommend something else",
				paras: [
					"If your site is five pages, changes twice a year and has no product ambitions, a well built Webflow or WordPress site is the right call and we will say so. If your entire business lives inside Shopify and the standard theme serves you, keep it. Frameworks are tools, not identities.",
					"But when the site is a growth channel, when speed and search visibility carry revenue, and when the roadmap includes anything interactive, Next.js is the strongest foundation we know. That is why it is the default.",
				],
			},
		],
	},
	{
		title: "Core Web Vitals Explained for Business Owners",
		slug: "core-web-vitals-explained-for-business-owners",
		category: "tech",
		publishedAt: "2026-05-07T08:00:00Z",
		featured: false,
		excerpt:
			"Three numbers from Google describe how your site feels to real visitors. What LCP, INP and CLS mean, why they move revenue, and what to ask your developer.",
		keywords: [
			"core web vitals",
			"LCP INP CLS",
			"page speed business",
			"web performance",
		],
		sections: [
			{
				paras: [
					"Google grades every site on three measurements taken from real visitors, and those grades influence both your search ranking and your conversion rate. Most owners have seen the acronyms in a report and nodded politely. This is the plain language version.",
				],
			},
			{
				h2: "The three numbers",
				bullets: [
					"Largest Contentful Paint, or LCP, measures how long the main content takes to appear. Good is under 2.5 seconds. This is your first impression.",
					"Interaction to Next Paint, or INP, measures how quickly the page responds when someone taps or clicks. Good is under 200 milliseconds. This is whether your site feels alive or stuck.",
					"Cumulative Layout Shift, or CLS, measures how much the page jumps around while loading. Good is under 0.1. This is why people misclick and swear at their phones.",
				],
			},
			{
				h2: "Why the numbers move money",
				paras: [
					"The research here is unusually consistent. Deloitte found that a tenth of a second improvement in load time lifted retail conversions by around eight percent. Google and others have published the inverse, where every added second of load time increases the share of visitors who leave before the page finishes. On mobile connections the effect is stronger.",
					"Search is the second channel. Page experience is a ranking signal, and in competitive niches where content quality is even, the faster site tends to win the position. Vitals will not rescue thin content, but slow scores quietly tax every page you rank for.",
				],
			},
			{
				h2: "How to see your real scores",
				paras: [
					"Put your address into PageSpeed Insights and look at the top section labeled with real user data. That is measured from actual Chrome visitors over the last month, and it is what Google uses. The lab score below it is a diagnostic, useful for engineers, not the number that counts.",
					"Check your money pages, not just the homepage. A fast homepage feeding a slow checkout is a leaky bucket.",
				],
			},
			{
				h2: "The usual suspects and the fixes",
				paras: [
					"Most failing scores trace back to a short list. Oversized images ship at full resolution to phones. Third party scripts for chat, analytics and ads pile onto the main thread. Fonts load late and shove the layout around. Cheap hosting takes a second to serve the first byte.",
					"All of these are fixable without a redesign. A competent developer can usually take a failing site to green in two to four weeks of focused work. Ask them for the real user vitals report before and after, and hold the work to that standard rather than to a lab score screenshot.",
				],
			},
		],
	},
	{
		title: "What a Headless CMS Is and When Your Business Needs One",
		slug: "what-a-headless-cms-is-and-when-you-need-one",
		category: "tech",
		publishedAt: "2026-04-15T08:00:00Z",
		featured: false,
		excerpt:
			"Headless content management, translated from jargon. What actually changes for your team, what it costs, and the honest signals that you need it or do not.",
		keywords: [
			"headless cms",
			"sanity cms",
			"structured content",
			"cms migration",
		],
		sections: [
			{
				paras: [
					"A traditional CMS like WordPress stores your content and renders your website as one inseparable system. A headless CMS only stores and organizes content, then hands it over an API to whatever needs it. Your website becomes one consumer of that content. A mobile app, a store kiosk or a partner integration can be others.",
					"That is the entire concept. The interesting part is what it changes in practice.",
				],
			},
			{
				h2: "What your team notices",
				paras: [
					"Editors get a focused writing environment with live preview of the real site, instead of a page builder fighting a theme. Content becomes structured, so a case study is fields like title, client, industry and results rather than one blob of formatted text. That structure is what lets the same content power a card, a detail page and search results without copy paste.",
					"Developers stop working around a theme and build the front end with modern tools. In our projects that is Next.js, which is a large part of why headless sites tend to be fast.",
				],
			},
			{
				h2: "Honest signals you need one",
				bullets: [
					"Your content appears in more than one place and you currently update each place by hand.",
					"You want a custom designed front end and your current CMS keeps bending it back toward templates.",
					"Publishing involves a developer for anything beyond a blog post.",
					"You manage content in multiple languages or markets and the current tool makes it miserable.",
					"Editors and developers block each other constantly on the same system.",
				],
			},
			{
				h2: "Honest signals you do not",
				paras: [
					"If your site is a standard blog or brochure, one language, one channel, and your team is comfortable in WordPress, going headless buys you complexity without benefit. The plugin ecosystem you rely on does not come with you. Budget matters too, since a headless build is a custom front end plus a CMS, not a theme install.",
				],
			},
			{
				h2: "What it costs and where the money goes",
				paras: [
					"The CMS itself is often cheap or free at business scale. Sanity, which we use on most projects, has a generous free tier and grows from there. The real investment is the front end build, which for a business site runs from the mid five figures with a studio, depending on scope. Migration of existing content is the line item everyone underestimates, so ask for it explicitly in any quote.",
					"When the signals above are real, that investment pays back in publishing speed, site performance and the freedom to change your front end without touching your content ever again.",
				],
			},
		],
	},
	{
		title: "Headless Shopify: When It Pays Off and When It Does Not",
		slug: "headless-shopify-when-it-pays-off",
		category: "development",
		publishedAt: "2026-04-02T08:00:00Z",
		featured: false,
		excerpt:
			"Keeping Shopify as the engine while replacing the storefront buys speed and design freedom at a real cost. The thresholds that tell you whether it is worth it.",
		keywords: [
			"headless shopify",
			"shopify storefront api",
			"shopify performance",
			"ecommerce replatform",
		],
		sections: [
			{
				paras: [
					"Headless Shopify means keeping everything that makes Shopify valuable, the products, inventory, orders and checkout, while replacing the customer facing storefront with a custom front end that talks to Shopify through its Storefront API. We have shipped these builds, and the pattern for when they make sense is clear.",
				],
			},
			{
				h2: "What you gain",
				paras: [
					"Speed is the headline. A server rendered storefront built on a modern framework routinely cuts load times in half against a theme carrying years of app scripts. Every product page renders as clean HTML, which search engines reward.",
					"Design freedom is the second win. Themes are templates, and ambitious brands feel the walls quickly. A custom storefront makes the brand experience yours end to end, from navigation patterns to product storytelling that no theme section supports.",
				],
			},
			{
				h2: "What you give up",
				paras: [
					"The app store mostly stops working for your storefront. Apps that inject widgets into themes have nothing to inject into. Reviews, upsells, search and personalization either come from apps with proper APIs or get built by your team. Checkout remains Shopify hosted on most plans, so the final step of the funnel stays standard no matter what the rest looks like.",
					"You also take on a real codebase. There is no theme editor for marketing to tweak, so content workflows need a CMS alongside Shopify, and changes go through developers or structured content, not drag and drop.",
				],
			},
			{
				h2: "The thresholds that matter",
				bullets: [
					"Revenue around seven figures annually, where a conversion lift of even half a percent funds the build.",
					"Brand ambition that themes demonstrably block, not vaguely annoy.",
					"Access to development capacity, in house or through a partner, for the storefront you now own.",
					"A catalog or content model complex enough that structured content pays for itself.",
				],
				after: [
					"Below those thresholds, an optimized theme is the honest recommendation. A good theme with disciplined app hygiene and compressed images gets surprisingly far, and we have told more than one merchant exactly that.",
				],
			},
			{
				h2: "If you go ahead",
				paras: [
					"Budget three to five months for a proper build including content modeling, migration and a season of polish. Instrument everything from day one, because the entire argument for headless is measurable, and you want the before and after in one dashboard. Keep checkout untouched, keep the theme as a fallback during transition, and cut over by traffic percentage rather than all at once.",
				],
			},
		],
	},
	{
		title: "The Business Case for Web Accessibility",
		slug: "business-case-for-web-accessibility",
		category: "design",
		publishedAt: "2025-11-12T08:00:00Z",
		featured: false,
		excerpt:
			"Accessibility is usually pitched as compliance. It is better understood as market reach, search performance and build quality, with regulation as the deadline.",
		keywords: [
			"web accessibility",
			"WCAG",
			"european accessibility act",
			"accessible design",
		],
		sections: [
			{
				paras: [
					"Around one in six people live with a significant disability, and that share grows as populations age. Add temporary situations like a broken wrist, a bright screen in sunlight or a noisy commute, and the share of visits that benefit from accessible design gets large enough to treat as a market, not a checkbox.",
				],
			},
			{
				h2: "The regulation is no longer theoretical",
				paras: [
					"The European Accessibility Act applies to a wide range of digital services since June 2025, covering e commerce among other sectors, with enforcement handled by member states. In the United States, digital accessibility lawsuits continue in the thousands per year, aimed disproportionately at retail sites. If you sell to consumers in Europe or the US, the legal floor now exists and audits against it are routine.",
				],
			},
			{
				h2: "The commercial upside nobody advertises",
				paras: [
					"Accessible sites are better sites for everyone. Real text instead of text baked into images, proper heading structure, descriptive links and captions all overlap almost perfectly with what search engines parse and rank. Keyboard support and visible focus states make power users faster. Sufficient contrast makes every screen readable outdoors. Forms that explain their errors get completed more often, by everyone.",
					"Teams notice a quality effect too. Building accessibly forces semantic structure and clear states, which is simply disciplined front end work. Codebases built that way are easier to test and change.",
				],
			},
			{
				h2: "Where to start without boiling the ocean",
				bullets: [
					"Target WCAG 2.2 level AA. It is the standard regulators and courts reference.",
					"Fix contrast first. It is the most common failure and often a pure design token change.",
					"Make the whole primary journey work with a keyboard alone, from landing page to purchase or enquiry.",
					"Give every image that carries meaning a real description, and every decorative image an empty one.",
					"Label every form field and write error messages that say what to do, next to the field that needs it.",
					"Respect reduced motion preferences on any site with animation.",
				],
				after: [
					"An audit of your five most important pages by someone competent takes days, not months, and typically finds a short list where most issues repeat from shared components. Fix the components and the site largely fixes itself.",
				],
			},
		],
	},
	{
		title: "Does Your Startup Need a Design System Yet",
		slug: "does-your-startup-need-a-design-system-yet",
		category: "design",
		publishedAt: "2025-10-21T08:00:00Z",
		featured: false,
		excerpt:
			"Design systems save mature teams enormous time and cost early teams speed they cannot spare. The staged approach that gives you consistency without the ceremony.",
		keywords: [
			"design system",
			"design tokens",
			"component library",
			"startup design",
		],
		sections: [
			{
				paras: [
					"Somewhere between the fifth screen and the fiftieth, every product team faces the same drift. Buttons multiply into variants nobody chose. Spacing becomes a matter of taste. Three blues compete for primary. The instinct is to declare a design system project, and that instinct is right about the problem and frequently wrong about the dose.",
				],
			},
			{
				h2: "What a design system actually is",
				paras: [
					"A design system is three layers. Tokens are the raw decisions, colors, type scale, spacing units and radii, named and stored in one place. Components are reusable pieces built from those tokens, buttons, inputs, cards. Documentation is the layer that explains when and how to use them. Most teams need the layers in exactly that order, and most premature systems fail by starting with documentation for components that keep changing.",
				],
			},
			{
				h2: "The staged approach we recommend",
				paras: [
					"Stage one is tokens only, and every team should do it from day one. It costs a few hours to name your colors, type sizes and spacing scale in Figma and in code. From then on drift becomes visible, because a rogue value looks like the exception it is.",
					"Stage two is a component library, worth building once the same pieces repeat across a handful of screens and more than one person builds UI. Keep it to the ten components you actually reuse. A button with sensible variants beats a component zoo.",
					"Stage three is the documented system with governance, contribution rules and versioning. This pays off when multiple teams ship in parallel and inconsistency starts costing real review time. Before that scale, the documentation ages faster than the product.",
				],
			},
			{
				h2: "Signals you are ready for stage three",
				bullets: [
					"More than one squad ships UI independently and the seams show.",
					"Design reviews keep relitigating solved problems like form validation styles.",
					"Engineers rebuild components that already exist because finding them is harder than writing them.",
					"You maintain more than one product or platform from one brand.",
				],
				after: [
					"Until several of those are true, tokens plus a lean library is the honest optimum. It captures most of the consistency benefit at perhaps a tenth of the ongoing cost, and it leaves your team building product instead of maintaining a system the product has outgrown twice already.",
				],
			},
		],
	},
	{
		title: "How to Scope an MVP That Ships in Eight Weeks",
		slug: "how-to-scope-an-mvp-that-ships-in-eight-weeks",
		category: "productivity",
		publishedAt: "2025-09-30T08:00:00Z",
		featured: false,
		excerpt:
			"Most MVPs fail at the scoping table, not in the code. The cutting rules, the buy list and the weekly cadence that get a real product in front of users in two months.",
		keywords: [
			"mvp development",
			"product scope",
			"startup mvp",
			"ship faster",
		],
		sections: [
			{
				paras: [
					"An MVP has one job, which is to test whether anyone wants the thing enough to use it or pay for it. Every feature that does not serve that test is scope stealing time from the answer. Eight weeks is enough to ship a real product if the scoping is ruthless, and here is the version of ruthless that works.",
				],
			},
			{
				h2: "Find the one loop that matters",
				paras: [
					"Write down the single loop a user completes that delivers the core value. For a booking product it is find a slot, book it, get confirmation. For a training app it is log a workout, see progress. Everything in the MVP either sits on that loop or gets cut. Settings pages, admin panels, profile customization and notification preferences are all real features and none of them are the loop.",
				],
			},
			{
				h2: "The cutting rules",
				bullets: [
					"Buy or borrow everything generic. Authentication, payments, emails and analytics are solved products with free tiers. Building any of them in an MVP is self sabotage.",
					"One platform first. Web reaches everyone with one codebase. The app stores can wait until the loop is proven.",
					"Admin runs on spreadsheets and dashboards you already have. Your operations team of two does not need custom tooling yet.",
					"Design one happy path beautifully and handle errors plainly. Edge case polish is a post launch luxury.",
					"If a feature debate lasts more than ten minutes, the feature is cut. The debate itself is the signal.",
				],
			},
			{
				h2: "The cadence that keeps eight weeks honest",
				paras: [
					"Week one is for decisions, not code. Lock the loop, sketch the screens, pick the stack, set up the pipeline. Weeks two through seven run on a demo every Friday of working software, not slides. The demo forces integration and surfaces drift while it is cheap to correct. Week eight is hardening, real content, error states and a private release to a first circle of users.",
					"The uncomfortable rule is that the deadline wins arguments. Scope flexes, the date does not. Teams that flip that rule ship in eight months instead, with the same loop and nicer settings pages.",
				],
			},
			{
				h2: "What happens after",
				paras: [
					"Keep a visible list of everything you cut. It converts every scoping argument into a postponement instead of a loss, and after launch it becomes your roadmap, reordered by what real users actually ask for. In our experience the list survives contact with users at a rate of about one in three, which is exactly why the cuts were right.",
				],
			},
		],
	},
	{
		title: "A Technical SEO Checklist for Founders",
		slug: "technical-seo-checklist-for-founders",
		category: "insight",
		publishedAt: "2025-08-19T08:00:00Z",
		featured: false,
		excerpt:
			"You do not need to be an engineer to verify your site's technical SEO. Twelve checks, the free tools that run them, and what good looks like for each.",
		keywords: [
			"technical seo",
			"seo checklist",
			"google search console",
			"seo audit",
		],
		sections: [
			{
				paras: [
					"Content earns rankings, but technical problems quietly cap how far it can climb. The good news is that the technical layer is mostly checkable with free tools and an hour of attention. Run this list quarterly and after any site change bigger than a blog post.",
				],
			},
			{
				h2: "Can Google find and read everything",
				bullets: [
					"Search Console is set up and you check the coverage report monthly. It is Google telling you directly what it can and cannot index.",
					"A sitemap exists at a standard address and updates itself when you publish. Hand maintained sitemaps rot.",
					"The robots file is not blocking anything important. One wrong line here has sunk entire launches.",
					"Every page you care about is reachable within three clicks from the homepage. Orphan pages rank poorly because nothing links to them.",
				],
			},
			{
				h2: "Does every page describe itself properly",
				bullets: [
					"Unique title under sixty characters and description under one hundred sixty for every important page. Duplicates waste impressions.",
					"One clear main heading per page that says what the page is about.",
					"Canonical addresses are consistent, so the same content is never live at multiple URLs splitting its authority.",
					"Social preview tags produce a proper card when a link is shared. Paste a URL into a chat and look.",
				],
			},
			{
				h2: "Is the experience holding you back",
				bullets: [
					"Real user Core Web Vitals are green in PageSpeed Insights for your top pages, not just the homepage.",
					"The site is fully usable on a phone, where most first visits happen and where Google evaluates you first.",
					"Every address redirects cleanly to one canonical version, with and without www, and old pages redirect to their replacements instead of dying as 404s.",
					"Structured data marks up your organization, articles and products where relevant, and validates in the rich results test.",
				],
			},
			{
				h2: "What to do with failures",
				paras: [
					"Most items above are an afternoon of developer time each to fix. Prioritize by the pages that earn money, fix the shared templates before individual pages, and re verify in Search Console rather than trusting the deploy. Technical SEO is not a growth hack, it is the tax you pay so your content competes at full strength. Pay it once, properly, and it stays mostly paid.",
				],
			},
		],
	},
	{
		title: "PWA or Native App: Choosing a Mobile Strategy",
		slug: "pwa-or-native-app-choosing-a-mobile-strategy",
		category: "tech",
		publishedAt: "2025-07-22T08:00:00Z",
		featured: false,
		excerpt:
			"Progressive web apps now cover push notifications, offline use and home screen install. Where they genuinely compete with native apps and where they still lose.",
		keywords: [
			"pwa vs native",
			"progressive web app",
			"mobile app strategy",
			"app development cost",
		],
		sections: [
			{
				paras: [
					"The mobile question used to be simple and expensive, build for the app stores or do not exist on phones. Progressive web apps changed the economics. A PWA is your website upgraded with an app manifest, offline support and push notifications, installable to the home screen without any store between you and the user.",
				],
			},
			{
				h2: "What a PWA can genuinely do now",
				paras: [
					"Modern PWAs work offline, sync data in the background, send push notifications on Android and, since iOS 16.4, on iPhone for installed apps as well. They launch full screen from a home icon, cache aggressively for instant startup and update silently on the server without store review cycles. For a large class of products, that is the entire feature list a native app would have shipped.",
					"The economics follow from one codebase. You maintain your web app, and phones get the app experience from the same deployment. Updates land for everyone the moment you ship.",
				],
			},
			{
				h2: "Where native still wins",
				bullets: [
					"Deep hardware access. Bluetooth accessories, background location, health data and advanced camera control remain native territory.",
					"App store presence as a channel. If your customers search the stores for solutions, absence is invisible.",
					"Peak interface performance. Heavy real time graphics and complex gesture driven interfaces still feel better native.",
					"iOS reach with notifications. Push on iPhone requires the user to install the PWA first, which adds a step Android does not have.",
				],
			},
			{
				h2: "The decision in practice",
				paras: [
					"Start from behavior. If your product is used through browsers today and the mobile need is convenience, offline resilience and re engagement, a PWA delivers most of the value at a fraction of the cost of two native apps. If the product depends on hardware, store discovery or platform level polish, budget for native, and consider React Native to keep one codebase across both stores.",
					"The strategies also stack. Shipping a PWA first proves mobile demand with real numbers, and those numbers make the native investment case for you, or save you from it. We have watched a PWA quietly delete a six figure native line item from a roadmap, and we have also recommended native on day one when the product left no choice. The framework is the same both times, match the vehicle to the journey.",
				],
			},
		],
	},
	{
		title: "What Website Maintenance Actually Involves After Launch",
		slug: "what-website-maintenance-actually-involves",
		category: "insight",
		publishedAt: "2025-06-25T08:00:00Z",
		featured: false,
		excerpt:
			"Launch day is the midpoint, not the finish. The unglamorous work that keeps a site fast, secure and accurate, and what it reasonably costs per month.",
		keywords: [
			"website maintenance",
			"website retainer",
			"site security updates",
			"website costs",
		],
		sections: [
			{
				paras: [
					"Websites decay. Not dramatically, but steadily, through dependency updates nobody applied, content that drifted out of date, and performance that eroded one marketing script at a time. Maintenance is the work that resists that decay, and it is worth knowing what it actually contains before you sign or skip a retainer.",
				],
			},
			{
				h2: "The technical baseline",
				paras: [
					"Every modern site sits on a stack of software that updates constantly. Frameworks patch security holes, hosting platforms deprecate old versions, browsers change behavior. Someone needs to apply updates on a schedule, test that nothing broke and keep the site on supported versions. Skipped for a year, this becomes a migration project with a five figure quote. Done monthly, it is routine.",
					"Backups and uptime monitoring belong here too. The test is not whether backups exist but whether anyone has restored one. An untested backup is a hope, not a plan.",
				],
			},
			{
				h2: "The performance and search patrol",
				paras: [
					"Sites get slower after launch because they accumulate. New scripts from marketing tools, heavier images uploaded in a hurry, one more embed on the homepage. A quarterly performance review against real user vitals catches the drift while it is one fix instead of ten. The same rhythm suits search health, broken links, redirect hygiene and Search Console errors, none of which announce themselves.",
				],
			},
			{
				h2: "The content honesty check",
				paras: [
					"Prices, team pages, screenshots, legal pages and case studies all age. A site that says the wrong thing confidently costs more trust than a slow one. Put a twice yearly content review on someone's calendar with actual authority to fix what it finds.",
				],
			},
			{
				h2: "What it should cost",
				paras: [
					"For a business site on a modern stack, sensible maintenance runs a few hundred to low four figures monthly depending on complexity, usually structured as a small retainer covering updates, monitoring and a bucket of improvement hours. That bucket matters, because the best maintenance arrangements ship small improvements continuously instead of banking problems for an annual crisis.",
					"The alternative is the familiar cycle where a site launches, stands still for three years and then needs a rebuild that costs more than the maintenance would have. Decay is cheap to resist and expensive to reverse.",
				],
			},
		],
	},
];

async function main() {
	await loadEnv();

	const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
	const token = process.env.SANITY_ADMIN_TOKEN;
	if (!(projectId && dataset && token)) {
		throw new Error("Missing Sanity env configuration");
	}

	const mutations = ARTICLES.map((article) => {
		const words = wordCount(article.sections);
		const minutes = Math.max(3, Math.round(words / 220));
		return {
			createOrReplace: {
				_id: `post-${article.slug}`,
				_type: "post",
				title: article.title,
				slug: { _type: "slug", current: article.slug },
				featured: article.featured,
				author: { _type: "reference", _ref: AUTHOR_ID },
				categories: [
					{
						_type: "reference",
						_key: key(),
						_ref: CATEGORIES[article.category],
					},
				],
				publishedAt: article.publishedAt,
				readingTime: `${minutes} min read`,
				excerpt: article.excerpt,
				body: buildBody(article.sections),
				seo: {
					title: article.title.slice(0, 60),
					description: article.excerpt.slice(0, 160),
					keywords: article.keywords,
				},
			},
		};
	});

	if (process.argv.includes("--dry-run")) {
		for (const m of mutations) {
			const doc = m.createOrReplace;
			console.log(
				`${doc.publishedAt.slice(0, 10)}  ${doc.readingTime.padEnd(11)} ${doc.title}`,
			);
		}
		console.log(`\n${mutations.length} articles ready`);
		return;
	}

	const url = `https://${projectId}.api.sanity.io/${API_VERSION}/data/mutate/${dataset}`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ mutations }),
	});
	if (!response.ok) {
		throw new Error(`${response.status}: ${await response.text()}`);
	}
	const result = await response.json();
	console.log(`created or replaced ${result.results?.length ?? 0} posts`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
