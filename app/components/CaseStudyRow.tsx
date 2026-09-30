import AmpText from "./AmpText";
import CaseLink from "./CaseLink";
import type { CaseStudySummary } from "../lib/caseStudies";

// A slim row, not a card. The studies that are not featured still earn a place
// on the timeline and still open the same drawer, but they do not repeat the
// diagram, chips and tech line a full card carries - they say what the work
// was and what it moved, and point at the drawer for the rest. It keeps the
// case-entry-card class (on the article) so the timeline's alternating rail
// places it exactly like a full card; the .case-row class does all the styling.
export default function CaseStudyRow({
	study,
	onOpen,
}: {
	study: CaseStudySummary;
	/** Omitted when the study has no drawer - the row then renders without the
	    trigger, mirroring the full card. */
	onOpen?: () => void;
}) {
	return (
		<article className="case-row case-entry-card">
			<div className="case-row-main">
				<p className="case-card-meta">
					<span>{study.client}</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>{study.year}</span>
				</p>
				<h3 className="case-row-title">
					<AmpText text={study.title} />
				</h3>
				<p className="case-row-metric">{study.metric}</p>
			</div>
			{(onOpen || study.link) && (
				<div className="case-actions case-row-actions">
					{onOpen && (
						<button
							type="button"
							className="case-more case-row-more"
							onClick={onOpen}
							aria-haspopup="dialog"
						>
							Read case study
							<i className="fa fa-long-arrow-right" aria-hidden="true" />
						</button>
					)}
					{study.link ? <CaseLink href={study.link} /> : null}
				</div>
			)}
		</article>
	);
}
