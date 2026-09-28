import AmpText from "./AmpText";
import PipelineDiagram from "./PipelineDiagram";
import type { CaseStudySummary } from "../lib/caseStudies";

// A billboard, deliberately. On the timeline it competes vertically with six
// other entries, so it gets one job: say what this was and what it moved, at a
// glance. The diagram carries the mechanics, the metric is the largest thing on
// the card, and every paragraph lives in the drawer — which is why this
// component is typed against the summary alone. If a paragraph is ever wanted
// here, the type will point at the details object and out.
export default function CaseStudyCard({
	study,
	onOpen,
}: {
	study: CaseStudySummary;
	onOpen: () => void;
}) {
	return (
		// case-entry-card is what the timeline's alternation rule keys on, so it
		// has to be here and not only on the two non-case-study entries.
		<article className="case-card case-entry-card">
			{/* Header — what it was called, and when. Client is kept because the
			    section spans two employers and the split is the point of it. */}
			<header className="case-card-id">
				<p className="case-card-meta">
					<span>{study.client}</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>{study.year}</span>
				</p>
				{/* The project title stays the heading element even though the metric
				    is what the eye lands on. Headings are the document outline: a
				    screen reader listing this section should read "Property ingestion
				    pipeline", not "0 raw files opened". */}
				<h3 className="case-card-title">
					<AmpText text={study.title} />
				</h3>
			</header>

			<div className="case-card-body">
				<PipelineDiagram topology={study.topology} nodes={study.nodes} />

				<div className="case-block case-outcome">
					<span className="case-label">The result</span>
					{/* Visual headline. Not a heading — see the note above the title. */}
					<p className="case-result">{study.metric}</p>

					{/* What the work was, in the plainest words available. */}
					<ul className="case-chips">
						{study.chips.map(chip => (
							<li key={chip}>{chip}</li>
						))}
					</ul>

					{/* And what it was made with — quieter, and last. */}
					<p className="case-tech">{study.tech.join("  •  ")}</p>
				</div>

				<button
					type="button"
					className="case-more"
					onClick={onOpen}
					aria-haspopup="dialog"
				>
					Read case study
					<i className="fa fa-long-arrow-right" aria-hidden="true" />
				</button>
			</div>
		</article>
	);
}
