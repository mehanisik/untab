#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SEED = path.join(ROOT, "sanity/seed/projects.ndjson");
const IMAGE_ROOT = path.join(ROOT, "sanity/seed/images");
const CAPTURE_ROOT = path.join(ROOT, "sanity/seed/captures");
const CHROME = process.env.CHROME_BIN || "google-chrome-stable";
const CAPTURE_WAIT_MS = Number(process.env.CAPTURE_WAIT_MS || 10000);

const CARD_W = 1600;
const CARD_H = 1200;
const MEDIA = {
	x: 552,
	y: 118,
	w: 496,
	h: 902,
	radius: 26,
};

const THEMES = {
	"atik-import-export": {
		paper: "#f8f7f3",
		accent: "#f25b18",
		ink: "#070707",
	},
	"royal-world": {
		paper: "#fbf8ef",
		accent: "#be57da",
		ink: "#090805",
	},
	"sagando-bungalows": {
		paper: "#f5fbf8",
		accent: "#0f766e",
		ink: "#061211",
	},
	wooah: {
		paper: "#f8f4fb",
		accent: "#7c3aed",
		ink: "#08050e",
	},
	"girit-healthcare": {
		paper: "#f6fbf8",
		accent: "#0f9f7a",
		ink: "#06130f",
	},
	"crypto-predict": {
		paper: "#f7f8fb",
		accent: "#2563eb",
		ink: "#05070c",
	},
	"interactive-3d-portfolio": {
		paper: "#f8f7fb",
		accent: "#7c3aed",
		ink: "#07060b",
	},
	"untab-studio": {
		paper: "#f8f8f6",
		accent: "#111111",
		ink: "#050505",
	},
	default: {
		paper: "#f8f8f6",
		accent: "#111827",
		ink: "#050505",
	},
};
const PREFER_HERO = new Set(["atik-import-export", "wooah"]);

const escapeXml = (value) =>
	String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

function withCaptureParam(rawUrl) {
	if (process.env.USE_CAPTURE_PARAM !== "1") return rawUrl;
	const url = new URL(rawUrl);
	url.searchParams.set("capture", "1");
	return url.toString();
}

async function readProjects() {
	const text = await readFile(SEED, "utf8");
	const projects = text
		.split("\n")
		.filter(Boolean)
		.map((line) => JSON.parse(line))
		.map((project) => ({
			slug: project.slug?.current,
			title: project.title,
			year: project.year,
			url: project.links?.live || project.client?.website,
			tags: [
				...(project.services ?? []).slice(0, 2),
				...(project.techStack ?? []).slice(0, 1),
			],
		}))
		.filter((project) => project.slug && project.title && project.url);
	return projects.map((project, index) => ({ ...project, index: index + 1 }));
}

async function capture(project) {
	const output = path.join(CAPTURE_ROOT, `${project.slug}.png`);
	await mkdir(CAPTURE_ROOT, { recursive: true });
	const userDataDir = path.join(
		os.tmpdir(),
		`untab-card-capture-${project.slug}-${Date.now()}`,
	);
	const port = 9300 + Math.floor(Math.random() * 400);
	const chrome = spawn(
		CHROME,
		[
			"--headless=new",
			"--disable-gpu",
			"--no-sandbox",
			"--disable-dev-shm-usage",
			"--hide-scrollbars",
			"--disable-background-networking",
			"--disable-features=Translate,BackForwardCache",
			`--remote-debugging-port=${port}`,
			`--user-data-dir=${userDataDir}`,
			"about:blank",
		],
		{ stdio: ["ignore", "ignore", "pipe"] },
	);

	try {
		chrome.stderr?.setEncoding("utf8");
		await waitForDebugger(port, chrome);
		const client = await CdpClient.connect(port);
		try {
			await client.openPage(withCaptureParam(project.url));
			await client.wait(CAPTURE_WAIT_MS);
			await client.forceCaptureState();
			await client.wait(800);
			const text = await client.pageText();
			if (/something went wrong|\\b404\\b|not found/i.test(text)) {
				throw new Error("Captured page appears to be an error state");
			}
			const png = await client.screenshot();
			await writeFile(output, png);
		} finally {
			client.close();
		}
	} finally {
		chrome.kill("SIGTERM");
		await rm(userDataDir, { recursive: true, force: true }).catch(() => {
			// Best-effort cleanup for the temporary browser profile.
		});
	}
	return output;
}

async function waitForDebugger(port, chrome) {
	const started = Date.now();
	while (Date.now() - started < 10000) {
		if (chrome.exitCode !== null) {
			throw new Error(`Chrome exited before DevTools was ready`);
		}
		try {
			const response = await fetch(`http://127.0.0.1:${port}/json/version`);
			if (response.ok) return;
		} catch {
			// Chrome is still booting.
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	throw new Error("Timed out waiting for Chrome DevTools");
}

class CdpClient {
	static async connect(port) {
		const version = await fetch(`http://127.0.0.1:${port}/json/version`).then(
			(response) => response.json(),
		);
		const client = new CdpClient(version.webSocketDebuggerUrl);
		await client.ready;
		return client;
	}

	constructor(url) {
		this.id = 0;
		this.pending = new Map();
		this.events = new Map();
		this.ws = new WebSocket(url);
		this.ready = new Promise((resolve, reject) => {
			this.ws.addEventListener("open", resolve, { once: true });
			this.ws.addEventListener("error", reject, { once: true });
		});
		this.ws.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.id && this.pending.has(data.id)) {
				const { resolve, reject } = this.pending.get(data.id);
				this.pending.delete(data.id);
				if (data.error) reject(new Error(data.error.message));
				else resolve(data.result);
				return;
			}
			if (data.method) {
				for (const listener of this.events.get(data.method) ?? []) {
					listener(data);
				}
			}
		});
	}

	send(method, params, sessionId) {
		const id = ++this.id;
		const payload = { id, method, params: params ?? {} };
		if (sessionId) payload.sessionId = sessionId;
		this.ws.send(JSON.stringify(payload));
		return new Promise((resolve, reject) => {
			this.pending.set(id, { resolve, reject });
		});
	}

	once(method, timeout = 15000) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error(`Timed out waiting for ${method}`));
			}, timeout);
			const listener = (event) => {
				clearTimeout(timer);
				this.events.set(
					method,
					(this.events.get(method) ?? []).filter((item) => item !== listener),
				);
				resolve(event);
			};
			this.events.set(method, [...(this.events.get(method) ?? []), listener]);
		});
	}

	async openPage(url) {
		const { targetId } = await this.send("Target.createTarget", {
			url: "about:blank",
		});
		const { sessionId } = await this.send("Target.attachToTarget", {
			targetId,
			flatten: true,
		});
		this.sessionId = sessionId;
		await this.send("Page.enable", {}, sessionId);
		await this.send("Runtime.enable", {}, sessionId);
		await this.send(
			"Emulation.setDeviceMetricsOverride",
			{
				width: 1440,
				height: 1000,
				deviceScaleFactor: 1,
				mobile: false,
			},
			sessionId,
		);
		const loaded = this.once("Page.loadEventFired").catch(() => null);
		await this.send("Page.navigate", { url }, sessionId);
		await loaded;
	}

	async forceCaptureState() {
		await this.send(
			"Runtime.evaluate",
			{
				expression: `(() => {
					const style = document.createElement("style");
					style.setAttribute("data-untab-capture", "true");
					style.textContent = [
						"html{scroll-behavior:auto!important}",
						"body{overflow:auto!important}",
						"*,*::before,*::after{animation-delay:0s!important;transition-delay:0s!important;animation-duration:0.001s!important;transition-duration:0.001s!important}",
						"[class*='loader'],[class*='Loader'],[class*='preloader'],[class*='Preloader'],[id*='loader'],[id*='Loader']{opacity:0!important;visibility:hidden!important;pointer-events:none!important}"
					].join("\\n");
					document.head.appendChild(style);
					window.scrollTo(0, 0);
					return true;
				})()`,
				awaitPromise: true,
			},
			this.sessionId,
		);
	}

	async screenshot() {
		const { data } = await this.send(
			"Page.captureScreenshot",
			{
				format: "png",
				captureBeyondViewport: false,
				fromSurface: true,
			},
			this.sessionId,
		);
		return Buffer.from(data, "base64");
	}

	async pageText() {
		const result = await this.send(
			"Runtime.evaluate",
			{
				expression: "document.body?.innerText || ''",
				returnByValue: true,
			},
			this.sessionId,
		);
		return result.result?.value || "";
	}

	wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	close() {
		this.ws.close();
	}
}

async function roundedPng(input, width, height, radius, position = "top") {
	const image = await sharp(input)
		.resize(width, height, { fit: "cover", position })
		.png()
		.toBuffer();
	const mask = Buffer.from(`
		<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
			<rect width="${width}" height="${height}" rx="${radius}" fill="#fff" />
		</svg>
	`);
	return sharp(image).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

function splitTitle(title) {
	const words = title.split(/\s+/).filter(Boolean);
	const left = words.shift() ?? title;
	const right = words.length ? words : ["Interface"];
	return { left, right };
}

function titleSize(word) {
	if (word.length > 13) return 68;
	if (word.length > 10) return 78;
	if (word.length > 8) return 90;
	return 112;
}

function rightTitleLines(words) {
	if (words.length <= 2) return words;
	return [words.slice(0, -1).join(" "), words.at(-1)];
}

function textLines(lines, x, y, size, attrs = "") {
	return lines
		.map(
			(line, index) =>
				`<tspan x="${x}" y="${y + index * size * 0.96}" ${attrs}>${escapeXml(line)}</tspan>`,
		)
		.join("");
}

function backgroundSvg(project, theme) {
	const { left, right } = splitTitle(project.title);
	const rightLines = rightTitleLines(right);
	const rightSize = rightLines.some((line) => line.length > 10) ? 84 : 108;
	const tag = project.tags.filter(Boolean).slice(0, 2).join(" / ");
	const tech = project.tags.at(-1) || "Digital product";
	const sequence = String(project.index).padStart(2, "0");
	return Buffer.from(`
		<svg width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" xmlns="http://www.w3.org/2000/svg">
			<rect width="${CARD_W}" height="${CARD_H}" fill="${theme.paper}" />
			<rect x="0" y="0" width="${CARD_W}" height="${CARD_H}" fill="#fff" opacity="0.45" />
			<text x="124" y="304" fill="${theme.ink}" font-family="Georgia, Times New Roman, serif" font-size="${titleSize(left)}" font-weight="400" letter-spacing="0">${escapeXml(left)}</text>
			<text fill="${theme.ink}" font-family="Georgia, Times New Roman, serif" font-size="${rightSize}" font-weight="400" letter-spacing="0">
				${textLines(rightLines, 1076, 782, rightSize)}
			</text>
			<text x="1220" y="304" fill="${theme.ink}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="400" letter-spacing="0">${escapeXml(tech)}</text>
			<text x="94" y="1094" fill="${theme.ink}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" letter-spacing="0">EST. ${escapeXml(project.year || "2026")}</text>
			<text x="674" y="1094" fill="${theme.ink}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" letter-spacing="0">${sequence} -> ${String(project.index + 1).padStart(2, "0")}</text>
			<text x="1296" y="1094" fill="${theme.ink}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" letter-spacing="0">UNTAB STUDIO</text>
			<text x="94" y="988" fill="${theme.ink}" opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="400" letter-spacing="0">${escapeXml(tag)}</text>
			<rect x="1218" y="334" width="124" height="4" rx="2" fill="${theme.accent}" />
		</svg>
	`);
}

function mediaShadowSvg() {
	return Buffer.from(`
		<svg width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" xmlns="http://www.w3.org/2000/svg">
			<rect x="${MEDIA.x + 14}" y="${MEDIA.y + 18}" width="${MEDIA.w}" height="${MEDIA.h}" rx="${MEDIA.radius}" fill="#000" opacity="0.08" />
		</svg>
	`);
}

async function compose(project, capturePath) {
	const theme = THEMES[project.slug] || THEMES.default;
	const screenshot = await roundedPng(
		capturePath,
		MEDIA.w,
		MEDIA.h,
		MEDIA.radius,
		project.slug === "wooah" ? "right" : "top",
	);
	const outputDir = path.join(IMAGE_ROOT, project.slug);
	const output = path.join(outputDir, "card.png");
	await mkdir(outputDir, { recursive: true });

	await sharp(backgroundSvg(project, theme))
		.composite([
			{ input: mediaShadowSvg(), left: 0, top: 0 },
			{ input: screenshot, left: MEDIA.x, top: MEDIA.y },
		])
		.png()
		.toFile(output);

	return output;
}

async function main() {
	const only = new Set(process.argv.slice(2));
	const projects = (await readProjects()).filter(
		(project) => only.size === 0 || only.has(project.slug),
	);

	for (const project of projects) {
		process.stdout.write(`Capturing ${project.slug}... `);
		const hero = path.join(IMAGE_ROOT, project.slug, "hero.png");
		try {
			const capturePath = PREFER_HERO.has(project.slug) ? hero : await capture(project);
			const cardPath = await compose(project, capturePath);
			console.log(path.relative(ROOT, cardPath));
		} catch (error) {
			try {
				await readFile(hero);
				const cardPath = await compose(project, hero);
				console.log(`${path.relative(ROOT, cardPath)} (hero fallback)`);
			} catch {
				console.error(`failed`);
				console.error(error instanceof Error ? error.message : error);
			}
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
