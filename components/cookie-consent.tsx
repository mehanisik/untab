"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import * as CookieConsent from "vanilla-cookieconsent";

const CONSENT_KEY = "cookie-consent";

export function getStoredPreferences(): { analytics: boolean } | null {
	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		if (!stored) return null;
		return JSON.parse(stored);
	} catch {
		return null;
	}
}

function syncConsent() {
	const analyticsAccepted = CookieConsent.acceptedCategory("analytics");
	localStorage.setItem(
		CONSENT_KEY,
		JSON.stringify({ analytics: analyticsAccepted }),
	);

	if (analyticsAccepted) {
		posthog.opt_in_capturing();
	} else {
		posthog.opt_out_capturing();
	}
}

function CookieConsentBanner() {
	useEffect(() => {
		CookieConsent.run({
			guiOptions: {
				consentModal: {
					layout: "box inline",
					position: "bottom left",
				},
				preferencesModal: {
					layout: "box",
					position: "right",
				},
			},

			categories: {
				necessary: {
					enabled: true,
					readOnly: true,
				},
				analytics: {
					autoClear: {
						cookies: [{ name: /^ph_/ }],
					},
				},
				marketing: {},
			},

			onConsent: () => {
				syncConsent();
			},

			onChange: () => {
				syncConsent();
			},

			language: {
				default: "en",
				translations: {
					en: {
						consentModal: {
							title: "We use cookies",
							description:
								"We use cookies and other tracking technologies to improve your browsing experience on our website, to analyze our website traffic, and to understand where our visitors are coming from.",
							acceptAllBtn: "I agree",
							acceptNecessaryBtn: "I decline",
							showPreferencesBtn: "Change my preferences",
						},
						preferencesModal: {
							title: "Cookie preferences",
							acceptAllBtn: "Accept all",
							acceptNecessaryBtn: "Reject all",
							savePreferencesBtn: "Save preferences",
							sections: [
								{
									title: "Cookie usage",
									description:
										"We use cookies to ensure the basic functionalities of the website, to enhance your browsing experience, and to analyze website traffic.",
								},
								{
									title: "Strictly necessary cookies",
									description:
										"These cookies are essential for the website to function properly. They cannot be disabled.",
									linkedCategory: "necessary",
								},
								{
									title: "Analytics",
									description:
										"These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
									linkedCategory: "analytics",
									cookieTable: {
										headers: {
											name: "Name",
											description: "Description",
											duration: "Duration",
										},
										body: [
											{
												name: "ph_*",
												description:
													"PostHog analytics cookies for tracking page views and user interactions.",
												duration: "1 year",
											},
										],
									},
								},
								{
									title: "Marketing",
									description:
										"These cookies are used to show you personalized content and targeted ads.",
									linkedCategory: "marketing",
								},
								{
									title: "More information",
									description:
										'For any questions about our cookie policy, please <a href="/contact">contact us</a>.',
								},
							],
						},
					},
				},
			},
		});
	}, []);

	return null;
}

export { CookieConsentBanner };
