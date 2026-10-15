import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const prod = process.argv.includes("--prod");
const PORT = prod ? 3100 : 3000;
const URL = `http://localhost:${PORT}`;
const OUT_DIR = ".lighthouse";
const OUT = `${OUT_DIR}/report`;

function run(cmd) {
	const r = spawnSync(cmd, { stdio: "inherit", shell: true });
	if (r.status !== 0) throw new Error(`\`${cmd}\` exited with ${r.status}`);
}

async function waitFor(url, tries = 60) {
	for (let i = 0; i < tries; i++) {
		try {
			if ((await fetch(url)).ok) return true;
		} catch {}
		await sleep(700);
	}
	return false;
}

let server = null;

function teardown() {
	if (!server) return;
	if (process.platform === "win32") {
		spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
	} else {
		try {
			process.kill(-server.pid, "SIGTERM");
		} catch {}
	}
	server = null;
}

try {
	if (prod) {
		console.log("→ building for production…");
		run("npx next build");
		console.log(`→ serving the production bundle on :${PORT}`);
		server = spawn(`npx next start -p ${PORT}`, {
			stdio: "ignore",
			shell: true,
			detached: process.platform !== "win32",
		});
	}

	if (!(await waitFor(URL))) {
		console.error(`✗ nothing responding at ${URL} — start it first, or use --prod to build and serve one.`);
		process.exit(1);
	}

	mkdirSync(OUT_DIR, { recursive: true });
	console.log("→ running Lighthouse (mobile emulation, headless)…");
	run(
		`lighthouse ${URL} --quiet ` +
			`--chrome-flags="--headless=new --no-sandbox --disable-gpu" ` +
			`--output=json --output=html --output-path=${OUT}`,
	);

	const report = JSON.parse(readFileSync(`${OUT}.report.json`, "utf8"));
	console.log(`\n=== Lighthouse ${report.lighthouseVersion} — ${URL} ===`);
	for (const key of ["performance", "accessibility", "best-practices", "seo"]) {
		const c = report.categories[key];
		if (c) console.log(`${c.title.padEnd(15)} ${Math.round(c.score * 100)}`);
	}
	console.log(`\nreport: ${OUT}.report.html`);
} catch (err) {
	console.error(`\n✗ ${err.message}`);
	process.exitCode = 1;
} finally {
	teardown();
}
