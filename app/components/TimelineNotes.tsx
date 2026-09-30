// The two things the case-study timeline cannot be: who this is, and what is
// not finished yet.
//
// They used to be three full-width cards dropped onto the end of the timeline —
// an intro, a build log and a roadmap — each one the same size as a study with a
// measured result behind it, which is how a section of ten real deliverables
// ended up spending most of a viewport on things that have not shipped. The
// intro is still a card, because it is the argument the studies are evidence
// for. Building and planned are now one strip, because side by side they cost a
// third of that and the comparison is the whole point: delivered work has a
// result to quote, this has a list and a promise.

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
// sections exists yet — so it carries no metric, no "live" marker, and says
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

// The competencies, grouped the same way the case-study stack lists are —
// Core / Data / APIs / Output — so this card argues with the same vocabulary
// the case studies below it use. Every entry is evidenced by a case study in
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

export function AboutEntry() {
	return (
		<article className="case-card case-entry-about">
			<header className="case-card-id">
				<p className="case-card-meta">
					<span>Introduction</span>
					<i className="case-card-sep" aria-hidden="true" />
					<span>Ten studies</span>
				</p>
				<h2 className="case-card-title">The same method, ten times</h2>
			</header>

			<div className="case-card-body">
				<p className="case-about-copy">
					The case studies below are the same problem in different clothes: systems that were
					never built to talk to each other. Billing, backups, DNS, support desks — and, more
					recently, the local models I run to move it all. Different clients, same method: find
					where the data breaks, fix the plumbing, measure the result.
				</p>

				<div className="case-about-skills">
					{COMPETENCIES.map(group => (
						<div key={group.label} className="case-about-skill">
							<h3 className="case-label">{group.label}</h3>
							<p>{group.items.join("  •  ")}</p>
						</div>
					))}
				</div>
			</div>
		</article>
	);
}

export function FutureEntry() {
	return (
		<div className="case-future">
			<section className="case-future-col case-future-col--building">
				<p className="case-future-meta">
					<span className="case-future-state">Currently building</span>
				</p>
				<h3 className="case-future-title">Migration Notes: CodeIgniter to Next.js</h3>
				<p className="case-build-copy">
					Moving a legacy CodeIgniter codebase to Next.js and TypeScript — route by route,
					documenting what each step actually cost. This site is the same work: every case
					study above was rewritten into the stack it now runs on.
				</p>
				{/* A running log rather than a result: this work has no finished
				    metric to quote yet, and inventing one would be worse than
				    showing where it actually is. */}
				<ul className="case-build-log">
					{BUILDING_LOGS.map(entry => (
						<li key={entry}>{entry}</li>
					))}
				</ul>
				{/* Deliberately not a link. There is no public migration-notes repo
				    yet, and a href pointing at nothing would be the one part of
				    this a visitor could check and find wanting. It says so
				    instead, and becomes a link when there is something to point
				    at. */}
				<p className="case-build-soon">
					<i className="fa fa-pencil" aria-hidden="true" /> In progress, nothing published
					yet.
				</p>
			</section>

			<section className="case-future-col case-future-col--planned">
				<p className="case-future-meta">
					<span className="case-future-state">Planned</span>
				</p>
				<h3 className="case-future-title">A private CMS for data I own</h3>
				<p className="case-build-copy">
					Two sections behind a password, backed by Cloudflare — R2 for the files, a Worker at
					the edge to serve them. Nothing leaves the site, and nothing is public.
				</p>
				{/* No dates and no completion language. This is a plan someone
				    could check against the repo, so it is written as one. */}
				<ul className="case-build-log">
					{ROADMAP_ITEMS.map(item => (
						<li key={item.name}>
							<strong>{item.name}</strong> — {item.detail}
						</li>
					))}
				</ul>
				<p className="case-build-soon">
					<i className="fa fa-pencil" aria-hidden="true" /> Not built yet. No sections, no
					backend, no access controls to test.
				</p>
			</section>
		</div>
	);
}
