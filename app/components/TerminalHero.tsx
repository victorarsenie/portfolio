import { handleAnchorClick } from "../lib/scroll";
import PipelineFlow from "./PipelineFlow";

const CAPABILITIES = ["data sync", "legacy migration", "integration", "automation", "monitoring"];

// The measured facts, in the order they answer "how much, and where does it
// run". Every figure is a real number from the benchmark write-up, and the
// short label underneath says what it is rather than restating the value -
// a bare "175 t/s" is not a claim anyone can check.
const STATS = [
	{ value: "175 t/s", label: "35B MoE, 256K context" },
	{ value: "54 t/s", label: "27B dense, 128K context" },
	{ value: "16 GB", label: "one consumer GPU" },
	{ value: "0", label: "rate limit · training · upload" },
] as const;

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

				{/* The claim is the work, not the tooling. "AI-assisted" would lead with
				    a means; the LLM stack is the thing that makes the migration
				    possible at this rate, and it gets the evidence strip below the
				    fold rather than the headline. */}
				<h1 className="terminal-hero-title">I make systems talk to each other.</h1>

				<PipelineFlow />

				<p className="terminal-hero-sub">
					PHP, CodeIgniter, WHMCS and jQuery — the kind of stack that outlives the frameworks
					built on top of it. I migrate it to modern tooling, and I run the AI that helps me do
					it on my own GPU, where it has no rate limit and nothing leaves the machine.
				</p>

				{/* The evidence for that claim, at the size a claim deserves. Each
				    figure is measured and each label says what it measures, so the
				    strip can be checked rather than taken on trust. */}
				<ul className="terminal-hero-stats">
					{STATS.map(stat => (
						<li key={stat.label}>
							<span className="terminal-hero-stat-value">{stat.value}</span>
							<span className="terminal-hero-stat-label">{stat.label}</span>
						</li>
					))}
				</ul>

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
