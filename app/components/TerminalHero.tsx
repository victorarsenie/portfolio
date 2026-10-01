import { handleAnchorClick } from "../lib/scroll";
import LocalStack from "./LocalStack";

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
					<span aria-hidden="true">▸</span> integration &amp; legacy migration
				</p>

				{/* The headline is the ongoing practice, not a completed credential.
				    "I tuned" is past tense, which reads as something finished and
				    banked; the work is a standing one - the stack gets re-benchmarked
				    and re-tuned as models and quantizations land. So the sentence is
				    present continuous, and "keep" is carrying the load: it is the
				    difference between a portfolio line and a habit.

				    This reverses an earlier call. "Old systems forward, on a stack I
				    tuned" led with the client work and demoted the models to a
				    closing clause, on the reasoning that the subject is the legacy
				    systems. That was defensible and it was wrong for this hero: the
				    local stack is the more unusual claim, it is what the stack
				    diagram below is actually drawing, and it is the part that keeps
				    being true. The legacy work is not lost - it is the tag above and
				    the first half of the sub-line below. */}
				<h1 className="terminal-hero-title">A local stack I keep tuning.</h1>

				<LocalStack />

				<p className="terminal-hero-sub">
					Billing, backups, DNS and support desks — the unglamorous half, and the half that has
					to keep working. A 27B and a 35B on one consumer GPU do the edits and the diagnostics:
					no rate limit, nothing uploaded, every run reproducible.
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
