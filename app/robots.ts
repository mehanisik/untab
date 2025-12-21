import type { MetadataRoute } from "next";
import { getEnv } from "~/libs/validate-env";

const env = getEnv();
const APP_BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/studio/", "/api/draft-mode/"],
		},
		sitemap: `${APP_BASE_URL}/sitemap.xml`,
	};
}
