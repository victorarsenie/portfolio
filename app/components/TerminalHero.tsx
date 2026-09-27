import { handleAnchorClick } from "../lib/scroll";

const CAPABILITIES = ["data sync", "legacy migration", "integration", "automation", "monitoring"];

// Read as a piece of instrumentation rather than a poster: a viewfinder frame, a
// scanlined grid, and a capability ticker pinned to the bottom edge. Every layer
// is CSS, so the first paint costs no image requests.
export default function TerminalHero() {
	return (
		<section id="home" className="terminal-hero">
			<div className="terminal-hero-frame" aria-hidden="true" />

			<div className="terminal-hero-inner">
				<p className="terminal-hero-tag">
					<span aria-hidden="true">▸</span> available for integration work
				</p>

				<h1 className="terminal-hero-title">I make systems talk to each other.</h1>

				<p className="terminal-hero-sub">
					I&rsquo;m the one other teams call when billing, backups, and support data refuse to line up. I build
					the pipes between them, then keep them running.
				</p>

				<div className="terminal-hero-ctas">
					<a
						className="terminal-hero-btn primary"
						href="#work"
						onClick={(e) => handleAnchorClick(e, "work")}
					>
						View the Plumbing
					</a>
					<a
						className="terminal-hero-btn ghost"
						href="#skills"
						onClick={(e) => handleAnchorClick(e, "skills")}
					>
						See My Stack
					</a>
				</div>
			</div>

			<div className="terminal-hero-ticker" aria-hidden="true">
				{CAPABILITIES.map((item) => (
					<span key={item}>{item}</span>
				))}
			</div>
		</section>
	);
}
