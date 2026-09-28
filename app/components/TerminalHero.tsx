import { handleAnchorClick } from "../lib/scroll";
import PipelineFlow from "./PipelineFlow";

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
					<span aria-hidden="true">▸</span> legacy modernization, on hardware I control
				</p>

				{/* One job per element, and the headline is the only thing doing
				    headline work. The stat strip that lived here was four measured
				    figures competing with the sub-line for the same glance, and
				    both lost. The numbers are real and they stayed — the case
				    study and the About section are where a reader goes looking
				    for them, and there they have room to say what each one
				    measures. */}
				<h1 className="terminal-hero-title">I make systems talk to each other.</h1>

				<PipelineFlow />

				<p className="terminal-hero-sub">
					Migrating legacy stacks to modern tooling.<br />
					AI-assisted, on local LLMs — private, offline, unlimited.
				</p>

				<div className="terminal-hero-ctas">
					<a
						className="terminal-hero-btn primary"
						href="#case-studies"
						onClick={(e) => handleAnchorClick(e, "case-studies")}
					>
						See the Work
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
