import AmpText from "./AmpText";
import CaseLink from "./CaseLink";
import type { CaseStudy } from "../lib/caseStudies";

// A half-width lead study. Deliberately not the chapter panel at a smaller
// size: these two have a single outcome rather than a set of measurements, so
// the diagram, the figure grid and the capability chips would all be filling
// space with something they have nothing to say. What is left is the strongest
// shape the data can make - the result, at the size the chapter card uses for
// its result, with the machinery underneath it. Three cards, two recipes.
export default function ShowcaseTile({
	study,
	onOpen,
}: {
	study: CaseStudy;
	onOpen?: () => void;
}) {
	return (
		<article className="showcase showcase--tile case-card">
			<div className="showcase-story">
				<p className="case-card-meta">
					<span>{study.client}</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>{study.year}</span>
				</p>
				<h3 className="showcase-title showcase-title--tile">
					<AmpText text={study.title} />
				</h3>
				<p className="showcase-metric showcase-metric--tile">{study.metric}</p>
				<div className="case-actions">
					{onOpen && (
						<button type="button" className="case-more" onClick={onOpen} aria-haspopup="dialog">
							Read case study
							<i className="fa fa-long-arrow-right" aria-hidden="true" />
						</button>
					)}
					{study.link ? <CaseLink href={study.link} /> : null}
				</div>
				<p className="showcase-tech">{study.tech.join("  •  ")}</p>
			</div>
		</article>
	);
}
