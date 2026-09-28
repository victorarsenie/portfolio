// The three timeline entries that are not case studies: what is being built
// now, what the person is, and what is planned but not built. They break the
// alternating rhythm deliberately — a full-width card in the middle of a
// left/right cadence reads as a change of voice rather than as another item in
// the list, which is what all three are.

// Three entries, not four. The first three are work that actually happened:
// route parity, typed facades over the untyped models, and session bridging
// between PHP and Next.js middleware. The fourth — a strangler-pattern cutover
// plan — was invented to fill a slot and has been removed, along with the
// "40+ legacy controllers" count, which was never more than a guess at a
// number. Padding to a round four would have meant a visitor could check one
// claim, find nothing, and discount the other three with it.
//
// No dates, and no "Week N" either: the sequence is real but the timeline
// around it is not something to assert. If a date becomes worth having, it
// should come from the commit log rather than from here.
const BUILDING_LOGS = [
	"Route parity between the CodeIgniter front controller and the Next.js app router",
	"Typed facades wrapping untyped CodeIgniter models",
	"Session bridging between PHP sessions and Next.js middleware",
];

// The personal data CMS, as a plan rather than a result. It is listed here
// because the research behind it is real and written, but nothing behind the
// sections exists yet — so it carries no metric, no "live" dot, and says
// plainly that it is unbuilt. The medical half is the reason the plan exists:
// a poor local healthcare system means re-explaining a history to every new
// doctor, and this is meant to fix that. Naming the motive is the honest
// version of the feature; the scans themselves are the user's own data and
// are not on a portfolio site.
const ROADMAP_ITEMS = [
	{
		name: "Local LLM research",
		detail: "Full benchmark data, configurations and the failures — the material behind the case study above, without the summary.",
	},
	{
		name: "Medical records",
		detail: "My own history in one place, so any doctor I see is current in a minute rather than a conversation from scratch.",
	},
	{
		name: "Further sections",
		detail: "More of the same once the first two earn their keep.",
	},
];

export function RoadmapEntry() {
	return (
		<article className="case-card case-entry-card case-entry-roadmap">
			<header className="case-card-id">
				<p className="case-card-meta">
					<span>Planned</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>Next</span>
				</p>
				<h3 className="case-card-title">A private CMS for data I own</h3>
			</header>

			<div className="case-card-body">
				<p className="case-build-copy">
					Two sections behind a password, backed by Cloudflare — R2 for the files, a Worker at
					the edge to serve them. Nothing leaves the site, and nothing is public.
				</p>

				{/* No dates and no completion language. This is a plan someone
				    could check against the repo, so it is written as one. */}
				<ol className="case-build-log">
					{ROADMAP_ITEMS.map(item => (
						<li key={item.name}>
							<strong>{item.name}</strong> — {item.detail}
						</li>
					))}
				</ol>

				<p className="case-build-soon">
					<i className="fa fa-pencil" aria-hidden="true" /> Not built yet. No sections, no
					backend, no access controls to test — this is the design, stated so it can be held
					to.
				</p>
			</div>
		</article>
	);
}

// The competencies, grouped the same way the case-study stack lists are —
// Core / Data / APIs / Output — so this card argues with the same vocabulary
// the case studies above it use. Every entry is evidenced by a case study in
// the timeline rather than asserted here. The AI group leads because it is the
// work everything else now runs through, and it is the one a reader cannot
// get from a job title.
const COMPETENCIES = [
	{ label: "AI tooling", items: ["Local LLM stacks", "Benchmarking", "VRAM budgeting", "Vision pipelines"] },
	{ label: "Core", items: ["PHP", "CodeIgniter", "WHMCS", "Bespoke CMS"] },
	{ label: "Data", items: ["MySQL", "XML ingestion", "Schema mapping", "Cron scheduling"] },
	{ label: "APIs", items: ["REST", "Webhooks", "R1Soft", "Cloudflare", "Freshdesk"] },
	{ label: "Output", items: ["TCPDF", "InDesign templates", "Scheduled reports"] },
];

export function BuildingEntry() {
	return (
		<article className="case-card case-entry-card case-entry-build">
			<header className="case-card-id">
				<p className="case-card-meta">
					<span className="case-live" aria-hidden="true" />
					<span>Currently building</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>Now</span>
				</p>
				<h3 className="case-card-title">Migration Notes: CodeIgniter to Next.js</h3>
			</header>

			<div className="case-card-body">
				<p className="case-build-copy">
					Moving a legacy CodeIgniter codebase to Next.js and TypeScript — route by route, documenting
					what each step actually cost. This site is the same work: every case study above was
					rewritten into the stack it now runs on.
				</p>

				{/* A running log rather than a result: this work has no finished
				    metric to quote yet, and inventing one would be worse than
				    showing where it actually is. The dashed border above and
				    the note below both say so, so the card cannot be mistaken
				    for delivered work. */}
				<ol className="case-build-log">
					{BUILDING_LOGS.map(entry => (
						<li key={entry}>{entry}</li>
					))}
				</ol>

				{/* Deliberately not a link. There is no public migration-notes repo
				    yet, and a href pointing at nothing would be the one part of
				    this card a visitor could check and find wanting. It says so
				    instead, and will become a link when there is something to
				    point at. */}
				<p className="case-build-soon">
					<i className="fa fa-pencil" aria-hidden="true" /> In progress, nothing published
					yet. No public migration-notes repo — this becomes a link when there is one.
				</p>
			</div>
		</article>
	);
}

export function AboutEntry() {
	return (
		<article className="case-card case-entry-card case-entry-about">
			<header className="case-card-id">
				<p className="case-card-meta">
					<span>About me</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>Throughout</span>
				</p>
				<h3 className="case-card-title">The space between systems</h3>
			</header>

			<div className="case-card-body">
				<p className="case-about-copy">
					I spend my time on the plumbing — schema mismatches, duplicate records, providers down
					at 3am — so nobody using it has to. Then I run the models that help me move it, on
					hardware I control.
				</p>

				<div className="case-about-skills">
					{COMPETENCIES.map(group => (
						<div key={group.label} className="case-about-skill">
							<h4 className="case-label">{group.label}</h4>
							<p>{group.items.join("  •  ")}</p>
						</div>
					))}
				</div>
			</div>
		</article>
	);
}
