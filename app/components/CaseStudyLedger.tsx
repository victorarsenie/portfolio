import AmpText from "./AmpText";
import CaseLink from "./CaseLink";
import type { CaseStudy, CaseStudyGroup } from "../lib/caseStudies";

// The other studies, grouped by employer.
//
// Ten lead/row entries on one running list gave every study the same box, which
// made the two with measured results and the one with a diagnosis look exactly
// like four CMS builds nobody can check. Grouping says something the flat list
// could not - four of these were the same pipeline work at one employer, two
// were a different shape of problem at another - and it earns the height back:
// a row is a title, a result and a way in, so the whole group costs less than
// one card did.
//
// The rows are still full accounts, not stubs: each opens the same drawer, and
// the ones with a public artifact still link out. Nothing is summarised away.
function LedgerRow({ study, onOpen }: { study: CaseStudy; onOpen: (slug: string) => void }) {
	// A study with neither a drawer nor an artifact (KeyElement) has no way in,
	// so it renders as a plain entry rather than as a control that does nothing.
	const hasActions = Boolean(study.details) || study.link !== "";
	return (
		<li className="ledger-item">
			<article className="ledger-row">
				<div className="ledger-main">
					<h4 className="ledger-title">
						<AmpText text={study.title} />
					</h4>
					<p className="ledger-metric">{study.metric}</p>
					<p className="ledger-tech">{study.tech.join("  •  ")}</p>
				</div>
				{hasActions && (
					<div className="case-actions ledger-actions">
						{study.details ? (
							<button
								type="button"
								className="case-more ledger-more"
								onClick={() => onOpen(study.slug)}
								aria-haspopup="dialog"
							>
								Read
								<i className="fa fa-long-arrow-right" aria-hidden="true" />
							</button>
						) : null}
						{study.link ? <CaseLink href={study.link} /> : null}
					</div>
				)}
			</article>
		</li>
	);
}

export default function CaseStudyLedger({
	groups,
	onOpen,
}: {
	groups: CaseStudyGroup[];
	onOpen: (slug: string) => void;
}) {
	return (
		<div className="ledger-groups">
			{groups.map(group => (
				<section className="ledger" key={group.client} aria-label={`${group.client} case studies`}>
					{/* The employer is the heading and the years sit beside it, so the
					    grouping states its own span instead of making the reader
					    reconstruct the chronology from nine separate rows. The years
					    stay outside the heading: a heading whose accessible name is
					    "Iceberg Digital2016" is not a heading, it is a caption. */}
					<div className="ledger-head">
						<h3 className="ledger-employer">{group.client}</h3>
						<span className="ledger-years">{group.years}</span>
					</div>
					<ul className="ledger-list">
						{group.studies.map(study => (
							<LedgerRow key={study.slug} study={study} onOpen={onOpen} />
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
