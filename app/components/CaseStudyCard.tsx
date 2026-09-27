import AmpText from "./AmpText";
import type { CaseStudy } from "../lib/caseStudies";

// Three-node trace: a solid base rail that draws itself in, then round dots
// run left-to-right to show data moving. Dot travel is a whole number of dash
// periods (24px period, -240px travel) so the loop has no visible seam.
//
// The nodes are named per study rather than generic "Source → Normalise →
// Output", because the stage names are the actual proof: "XML feeds →
// Reconcile → Live database" says more in three words than the generic trio.
const NODE_X = [80, 300, 520] as const;
const NODE_Y = 40;
const LABEL_Y = 84;
const VIEW_W = 600;
const VIEW_H = 102;

// The second rail is tagged so CSS can stagger it behind the first — the
// stagger is what makes the pair read as flow rather than two static lines.
const SEGMENTS = [
	[NODE_X[0], NODE_X[1]],
	[NODE_X[1], NODE_X[2]],
] as const;

export default function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
	const [entry, , exit] = study.pipeline;
	const ordinal = String(index + 1).padStart(2, "0");

	return (
		<article className="case-card">
			{/* Identity rail — who it was for and what it was called. Kept
			    deliberately sparse so the narrative column is the one that
			    carries the reading weight. */}
			<div className="case-card-id">
				<div className="case-card-id-top">
					<span className="case-card-ord">{ordinal}</span>
					<p className="case-card-meta">
						<span>{study.client}</span>
						<i className="case-card-sep" aria-hidden="true" />
						<span>{study.year}</span>
					</p>
				</div>
				<h3 className="case-card-title">
					<AmpText text={study.title} />
				</h3>
				<ul className="case-stack">
					{study.stack.map((tech) => (
						<li key={tech}>{tech}</li>
					))}
				</ul>
			</div>

			{/* Narrative column — problem, plumbing, payoff, in that order. */}
			<div className="case-card-body">
				<div className="case-block">
					<span className="case-label">The problem</span>
					<p className="case-problem">{study.problem}</p>
				</div>

				<div className="case-pipe" aria-hidden="true">
					<svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
						{SEGMENTS.map(([x1, x2], i) => (
							<g key={x1} className={i === 1 ? "case-seg case-seg-late" : "case-seg"}>
								<line className="case-pipe-base" x1={x1} y1={NODE_Y} x2={x2} y2={NODE_Y} />
								<line className="case-pipe-dots" x1={x1} y1={NODE_Y} x2={x2} y2={NODE_Y} />
							</g>
						))}

						<g>
							<circle className="case-pipe-ring" cx={NODE_X[0]} cy={NODE_Y} r={12} />
							<circle className="case-pipe-node" cx={NODE_X[0]} cy={NODE_Y} r={5.5} />
							<text className="case-pipe-label" x={NODE_X[0]} y={LABEL_Y}>
								{entry}
							</text>
						</g>
						<g>
							<circle className="case-pipe-ring case-pipe-ring-b" cx={NODE_X[1]} cy={NODE_Y} r={12} />
							<circle className="case-pipe-node" cx={NODE_X[1]} cy={NODE_Y} r={5.5} />
							<text className="case-pipe-label" x={NODE_X[1]} y={LABEL_Y}>
								{study.pipeline[1]}
							</text>
						</g>
						<g>
							<circle className="case-pipe-ring case-pipe-ring-c" cx={NODE_X[2]} cy={NODE_Y} r={12} />
							<circle className="case-pipe-node" cx={NODE_X[2]} cy={NODE_Y} r={5.5} />
							<text className="case-pipe-label" x={NODE_X[2]} y={LABEL_Y}>
								{exit}
							</text>
						</g>
					</svg>
				</div>

				<div className="case-block case-outcome">
					<span className="case-label">The result</span>
					<p className="case-result">{study.result}</p>
					<p className="case-detail">{study.detail}</p>
				</div>
			</div>
		</article>
	);
}
