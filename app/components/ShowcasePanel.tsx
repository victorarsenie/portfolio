import AmpText from "./AmpText";
import PipelineDiagram from "./PipelineDiagram";
import type { CaseStudy } from "../lib/caseStudies";

// A full-width showcase panel: the diagram leads (and each topology — chain,
// cycle, sync — already looks different, which is what keeps four of these from
// reading as a cloned stack), the story sits opposite it, and the diagram side
// alternates across the rail via .showcase--flip. The local-LLM study is the
// current chapter, so it carries a distinct accent frame and is the only one
// that shows the measured figures.
export default function ShowcasePanel({
	study,
	onOpen,
	flip,
}: {
	study: CaseStudy;
	onOpen?: () => void;
	/** Puts the diagram on the opposite side; the timeline alternates it. */
	flip?: boolean;
}) {
	const figures = study.figures ?? [];
	const cls = [
		"showcase",
		"case-entry-card",
		study.slug === "local-llm-setup" ? "showcase--chapter" : "",
		flip ? "showcase--flip" : "",
	].join(" ");
	return (
		<article className={cls}>
			<div className="showcase-diagram">
				<PipelineDiagram topology={study.topology} nodes={study.nodes} />
				<ul className="showcase-chips">
					{study.chips.map(chip => (
						<li key={chip}>{chip}</li>
					))}
				</ul>
				<p className="showcase-tech">{study.tech.join("  •  ")}</p>
			</div>
			<div className="showcase-story">
				<p className="case-card-meta">
					<span>{study.client}</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>{study.year}</span>
				</p>
				<h3 className="showcase-title">
					<AmpText text={study.title} />
				</h3>
				<p className="showcase-metric">{study.metric}</p>
				{figures.length > 0 && (
					<dl className="showcase-figures">
						{figures.map(f => (
							<div key={f.label} className="case-figure">
								<dt className="case-figure-value">{f.value}</dt>
								<dd className="case-figure-label">{f.label}</dd>
							</div>
						))}
					</dl>
				)}
				{study.finding && (
					// Its own line rather than a fifth figure box: a measurement and
					// a diagnosis are different claims, and the grid is for the
					// measurements.
					<p className="showcase-finding">
						<span className="case-finding-value">{study.finding.value}</span>
						<span className="case-finding-text">{study.finding.text}</span>
					</p>
				)}
				{onOpen && (
					<button type="button" className="case-more" onClick={onOpen} aria-haspopup="dialog">
						Read case study
						<i className="fa fa-long-arrow-right" aria-hidden="true" />
					</button>
				)}
			</div>
		</article>
	);
}
