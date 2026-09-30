import type { CSSProperties } from "react";
import AmpText from "./AmpText";
import PipelineDiagram from "./PipelineDiagram";
import CaseLink from "./CaseLink";
import type { CaseStudy } from "../lib/caseStudies";

// The current chapter, and the only card in the section built around a diagram.
// It leads because it is the newest work and the only study whose result is a
// set of numbers, so it has something a half-width tile cannot show: a
// throughput comparison, drawn to scale. The other topologies - chain, cycle,
// sync - are drawn rather than described, which is what keeps the section from
// reading as one card cloned four times, but only the studies that earned a
// tile keep them.
export default function ShowcasePanel({
	study,
	onOpen,
}: {
	study: CaseStudy;
	onOpen?: () => void;
}) {
	// Split on the same field the data is split on: a figure with a `share` is a
	// speed and belongs in the comparison, one without is a price and is a note
	// under it. Deciding this here rather than in the data keeps "what counts as
	// comparable" a rendering decision, where the alternative is a second
	// boolean on every figure.
	const measured = (study.figures ?? []).filter(figure => figure.share !== undefined);
	const noted = (study.figures ?? []).filter(figure => figure.share === undefined);

	return (
		<article className="showcase showcase--chapter case-card">
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
				{measured.length > 0 && (
					// A bar each, on one scale, so the claim is the comparison: 54
					// and 175 tokens a second are not three facts on a card, they
					// are one fact with three measurements. Four boxes said it
					// less well and took more room.
					<dl className="case-bench">
						{measured.map(figure => (
							<div key={figure.label} className="case-bench-row">
								<dt className="case-bench-value">{figure.value}</dt>
								<dd className="case-bench-cell">
									<span className="case-bench-track">
										<span
											className="case-bench-bar"
											style={{ "--share": `${figure.share}%` } as CSSProperties}
										/>
									</span>
									<span className="case-bench-label">{figure.label}</span>
								</dd>
							</div>
						))}
					</dl>
				)}
				{noted.length > 0 && (
					<ul className="case-bench-aside">
						{noted.map(figure => (
							<li key={figure.label}>
								<span className="case-bench-aside-value">{figure.value}</span>
								{` ${figure.label}`}
							</li>
						))}
					</ul>
				)}
				{study.finding && (
					// Its own line rather than a fifth bar: a measurement and
					// a diagnosis are different claims, and a diagnosis has no
					// width on a scale it was never measured against. Setting
					// it as an open left rule says it argues rather than reports.
					<p className="showcase-finding">
						<span className="case-finding-value">{study.finding.value}</span>
						<span className="case-finding-text">{study.finding.text}</span>
					</p>
				)}
				{(onOpen || study.link) && (
					<div className="case-actions">
						{onOpen && (
							<button type="button" className="case-more" onClick={onOpen} aria-haspopup="dialog">
								Read case study
								<i className="fa fa-long-arrow-right" aria-hidden="true" />
							</button>
						)}
						{study.link ? <CaseLink href={study.link} /> : null}
					</div>
				)}
			</div>
		</article>
	);
}
