// Case studies — the proof layer. Every entry is a real deliverable, recast
// into a Problem → Pipeline → Result shape so the reader sees the mechanics
// rather than a job title. Seven client builds across two employers, the early
// xHumanity protocol work, the 2015 start at KeyElement, and the local LLM work.
//
// Each record is split in two, because the card and the drawer do different
// jobs. The summary is the billboard: what it was called, what it moved, what it
// was made of — everything that has to survive being read at a glance. The
// details are the argument behind those numbers, and they only cost anything
// once the reader has opted in. Keeping them apart is what stops the same
// paragraph appearing twice in the same viewport.
//
// The Iceberg entries use the site's existing copy verbatim; the CWCS entries
// are written to match it from their one-line descriptions. No metric here is
// invented, and no time period is asserted that the source did not already claim.

/**
 * The shape of the plumbing. The diagram draws this rather than describing it,
 * so each topology fixes how many stages the pipeline has: a chain runs one way
 * through three, a cycle closes on itself through four, and a sync is a two-way
 * exchange between a pair. The union below makes the stage count a compile-time
 * consequence of the topology, so a `sync` cannot be given three nodes.
 */
type ChainShape = { topology: "chain"; nodes: readonly [string, string, string] };
type CycleShape = { topology: "cycle"; nodes: readonly [string, string, string, string] };
type SyncShape = { topology: "sync"; nodes: readonly [string, string] };

export type CaseTopology = ChainShape["topology"] | CycleShape["topology"] | SyncShape["topology"];

interface SummaryBase {
	slug: string;
	client: string;
	year: string;
	title: string;
	/** The one line worth remembering, and the largest thing on the card. */
	metric: string;
	/** Short capability words naming the mechanism. */
	chips: readonly string[];
	/** The technologies, short enough for a single muted line. */
	tech: readonly string[];
	link: string;
	/**
	 * Optional measured figures, for a study whose result is a set of numbers
	 * rather than a single outcome. One metric cannot say "54 t/s across 128K
	 * with vision" without becoming a sentence, and a sentence stops being a
	 * headline. These render as a compact row under the metric, so the
	 * benchmark card can carry the actual readings while the rest of the
	 * timeline keeps its single line. Optional by design: a study with an
	 * outcome rather than a benchmark omits it and nothing shifts.
	 */
	figures?: readonly { value: string; label: string }[];
	/**
	 * Optional: the one finding worth keeping, for a study whose most
	 * interesting result is a diagnosis rather than a measurement. A figure
	 * says "this is what it did"; a finding says "this was broken, and it did
	 * not look broken". The two cannot share a row without implying they are
	 * the same kind of claim - a 4x speedup and the bug that explains a 4x
	 * slowdown are opposites, and setting them side by side flattens the
	 * second into the first. Given its own line, the diagnosis reads as the
	 * harder half of the work, which is what it was.
	 */
	finding?: { value: string; text: string };
}

/** Everything the card is allowed to know. */
export type CaseStudySummary = SummaryBase & (ChainShape | CycleShape | SyncShape);

export interface TechGroup {
	core: readonly string[];
	data: readonly string[];
	infra: readonly string[];
}

/** Everything the drawer holds, and the card never sees. */
export interface CaseStudyDetails {
	problem: string;
	pipeline: string;
	outcome: string;
	/** Optional: a study may carry only the summary's flat `tech` line, and the
	    drawer falls back to rendering that instead of an empty Stack section. */
	stackGrouped?: Partial<TechGroup>;
	/** Optional: a screenshot of the running deliverable, shown framed at the
	    top of the drawer. Absent for a study with no public UI to point at. */
	screenshot?: string;
}

export type CaseStudy = CaseStudySummary & {
	/** The four the case-study section leads with; the rest stay billboard rows.
	    Curation marker for the timeline lead/row split - inert until that layout
	    lands, but it names the lead set in one place. */
	featured?: boolean;
	/** Optional: an entry may be a billboard with nothing to expand (KeyElement),
	    in which case the card renders without a "Read case study" trigger. */
	details?: CaseStudyDetails;
};

const CWCS = "https://www.cwcs.co.uk/";

export const caseStudies: CaseStudy[] = [
	{
		// This one is not a client deliverable, so it breaks the section's
		// "two employers" frame deliberately. It is also the newest work and the
		// one everything else now runs through, which is why it sorts to the top
		// of the timeline on its own - not as an employer entry, but as the
		// current chapter.
		slug: "local-llm-setup",
		featured: true,
		title: "Stack of local LLMs tuned to their limits",
		client: "Ongoing research",
		year: "2026",
		// A cycle rather than a chain, because that is the shape of the work:
		// every answer produced a new measurement, and every measurement
		// produced a new question. Nothing here was finished once.
		nodes: ["Benchmark", "Diagnose", "Tune", "Re-measure"],
		topology: "cycle",
		// The headline leads with the number, because that is the claim worth
		// remembering, and carries the constraint as the frame rather than the
		// other way round. "Overcoming hardware constraints" described the work;
		// this states what it produced, and the 16 GB is the flex - 256K of
		// context at that rate is not something the card has to defend, because
		// the figures underneath it are the defence.
		metric: "175 t/s at 256K on a single 16 GB GPU",
		// Every box here is a result - something the stack did. The 4x below is
		// deliberately not one of them: it is the diagnosis that explains one.
		figures: [
			{ value: "54 t/s", label: "27B dense · 128K · vision" },
			{ value: "175 t/s", label: "35B MoE · 256K" },
			{ value: "85 t/s", label: "3.8 speculative · 64K" },
			{ value: "-3%", label: "vision cost, 0 GB VRAM" },
		],
		// The one thing worth carrying out of this study. The clue that cracked
		// it was an inversion: the 15.8 GB quant ran at 170 t/s while the
		// 13.0 GB one managed 44, and a bigger model should never be the faster
		// one on a memory-bound card. It was not the model. One GGUF was missing
		// the Gated DeltaNet layer metadata, so llama.cpp reserved KV cache for
		// all 40 layers instead of the 10 that actually use it - 2,453 MiB
		// against 720 - and the 1,173 MiB of overspend pushed the surplus layers
		// to CPU. The same model, from a different publisher's blob, ran at 178.
		finding: {
			value: "4x",
			text: "slower on the smaller model — missing Gated DeltaNet metadata",
		},
		chips: ["VRAM budgeting", "Throughput profiling", "Speculative decoding", "Reasoning budgets"],
		tech: ["llama.cpp", "CUDA", "GGUF", "RTX 5070 Ti"],
		// The write-up this study summarises now has a public home: the
		// long-form account of the same measurements. Points at it rather than
		// at an external site, so CaseLink reads it as the internal artifact.
		link: "/notes/local-llm-inference-tuning",
		details: {
			problem:
				"Hosted free tiers are rationed - roughly 200 requests a day, tool calls capped, models that rotate out from under you - and they train on what you send. The alternative is local, but a consumer GPU has a hard ceiling: 16 GB of VRAM, most of which Windows already takes, against models that want far more.",
			pipeline:
				"Every model was benchmarked at fixed context and token counts, then diagnosed down to the layer. Speculative decoding bought 57% more throughput at 64K, but only with 2.4 GB of headroom to stop CUDA graphs thrashing — so it paid in context. A 125B mixture-of-experts beat the 27B on all twelve shared benchmarks and was still thrown out: it ran at 3 to 12 t/s, because 76 GB of weights cannot stream through a SATA disk into 32 GB of RAM. Vision runs on a CPU-resident encoder — 3% throughput, zero VRAM, full context.",
			outcome:
				"A 27B dense model does real multi-file edits at 54 t/s across 128K, vision checking its own work; a 35B MoE runs at 175 t/s across 256K. No rate limit, no training on the code, no model that disappears next quarter — and it works with the network off. The 3.6's hidden reasoning runs 3,000 to 15,000 tokens past the visible answer, 20 to 90 seconds of dead air, so every config caps thinking at 4,096 — verified, the cut lands mid-sentence. The 27B reworked this site's hero from a spec; this build continues from that output.",
			stackGrouped: {
				// No `data` group: "throughput curves / VRAM budget maps /
				// context-length sweeps" are what the research produced, not
				// what the stack is made of, and the card's figures already
				// quote the readings. They are also the three pieces of this
				// that want to be written up rather than listed.
				core: ["Qwen3.8-27B (dense, vision)", "Qwen3.6-35B-A3B (MoE)"],
				infra: ["llama.cpp", "GGUF", "CUDA", "RTX 5070 Ti 16 GB", "OpenAI-compatible API"],
			},
		},
	},
	{
		// Core-team work, not a client build, so it sits outside the "two
		// employers" frame the rest of the timeline runs on. Recent and senior
		// but the least substantive entry, and it shipped nothing publicly, so
		// the copy is about what was done - whitepaper, UI/UX, coordination -
		// not what the protocol achieved.
		slug: "xhumanity",
		client: "xHumanity",
		year: "2021–2023",
		title: "Protocol whitepaper and product design",
		metric: "Whitepaper, UI/UX and team coordination",
		// A chain, not a sync or cycle: the spec was written, then turned into
		// flows, then the team ran against both. There is no feedback loop to
		// draw, so the two-way topologies would overstate the shape.
		nodes: ["Whitepaper", "UI/UX flows", "Distributed team"],
		topology: "chain",
		chips: ["Technical writing", "UI/UX architecture", "Distributed team coordination", "System design"],
		tech: ["Vue.js"],
		link: "",
		details: {
			problem:
				"The project was a decentralized identity protocol aimed at reputation, privacy and reducing disinformation - funded at $150k+ before anything was public. The gap was between a protocol that is hard to explain and a product people could trust: the whitepaper had to be right, and the interface had to make it feel obvious.",
			pipeline:
				"I was on the core team from early on and worked across the product rather than one slice: contributing to the technical whitepaper so the documented behaviour matched the protocol, designing the UI/UX flows against the cryptographic constraints it set, and coordinating the distributed development team - recruiting, onboarding and giving technical direction to developers working from overseas.",
			outcome:
				"The protocol reached a funded, staffed build - a whitepaper that documented the system, UI/UX flows that carried it to an interface, and a remote team moving against both. It never shipped publicly; the project ran into management problems, not engineering ones. So the work lives as the whitepaper and the design, and there is nothing to link to.",
		},
	},
	{
		slug: "property-ingestion",
		featured: true,
		title: "Property ingestion pipeline",
		client: "Iceberg Digital",
		year: "2016",
		nodes: ["XML feeds", "Reconcile", "Live database"],
		topology: "chain",
		// Spelled out rather than "0 raw files opened". Same number, and the
		// zero is the point either way, but a digit-leading metric is optically
		// indented against this card's capital-P title: Hype's caps overhang the
		// text origin by 5px and its digits sit flush, which measured the
		// result 5px right of the title's ink edge. "Zero" gives it a cap to
		// match and lands at -2px. See the .case-result note in case-studies.css.
		metric: "Zero raw files opened",
		chips: ["Deduplication", "Schema normalization", "Cron scheduling"],
		tech: ["PHP", "MySQL", "XML parsing", "Cron"],
		link: "http://www.nkres.co.uk/",
		details: {
			problem:
				"Estate agents receive thousands of listings a night from external XML providers — each with its own schema, its own duplicates and its own idea of what a postcode looks like.",
			pipeline:
				"A bespoke CMS ingests every feed on a schedule and reconciles them into one live database.",
			outcome:
				"Schema mismatches, duplicate detection and provider outages are all handled in the pipeline, so staff never open a raw file. Thousands of listings arrive nightly without anyone reconciling them by hand.",
			stackGrouped: {
				core: ["PHP", "Bespoke CMS"],
				data: ["MySQL", "XML ingestion", "Schema mapping"],
				infra: ["Cron scheduling", "Duplicate detection"],
			},
			screenshot: "/images/nkres.png",
		},
	},
	{
		slug: "automated-magazines",
		title: "Automated magazine generation",
		client: "Iceberg Digital",
		year: "2016",
		nodes: ["Live listings", "Template", "Print-ready PDF"],
		topology: "chain",
		metric: "One click to publish",
		chips: ["Drag & drop", "InDesign templates", "PDF export"],
		tech: ["PHP", "TCPDF", "HTML templates", "XML"],
		link: "http://www.digitalmag.co.uk/mag/bseenmagazine",
		details: {
			problem:
				"Monthly client magazines were laid out by hand from live property data — a process that took hours per issue and could not keep up with the listings changing daily.",
			pipeline:
				"A drag-and-drop interface pulls the client's live properties into InDesign-derived templates. One click produces a print-ready PDF and a digital page-turner.",
			outcome: "Hundreds of magazines now go out this way.",
			stackGrouped: {
				core: ["PHP", "Drag-and-drop interface"],
				data: ["Live listings", "XML import"],
				infra: ["TCPDF", "InDesign templates", "Page-turner export"],
			},
			screenshot: "/images/mag.png",
		},
	},
	{
		slug: "valuation-tool",
		title: "Multi-API valuation tool",
		client: "Iceberg Digital",
		year: "2016",
		nodes: ["Postcode", "Address lookup", "Price range"],
		topology: "chain",
		metric: "No dashboard switching",
		chips: ["API orchestration", "Address lookup", "Email delivery"],
		tech: ["PHP", "REST APIs", "Email"],
		link: "http://outlook.mypropertyprices.com/",
		details: {
			problem:
				"Getting a valuation meant a phone call: postcode in one system, address in another, price range in a third. Staff relayed the answers by hand.",
			pipeline:
				"Two third-party APIs stitched into one flow. A postcode resolves to a full address, and that address returns a price range.",
			outcome:
				"The result is displayed live or emailed, so one screen answers the question instead of three systems and a phone call.",
			stackGrouped: {
				core: ["PHP"],
				data: ["REST APIs", "Third-party API orchestration"],
				infra: ["Address lookup", "Email delivery"],
			},
			screenshot: "/images/outlook.png",
		},
	},
	{
		slug: "email-signatures",
		title: "Dynamic asset linking",
		client: "Iceberg Digital",
		year: "2016",
		nodes: ["Issue published", "Template vars", "Every signature"],
		topology: "chain",
		metric: "One publish, every signature",
		chips: ["Event-driven", "Template variables", "Auto-deploy"],
		tech: ["PHP", "Template variables", "Automated deploy"],
		link: "http://www.digitalagenda.com/email-signatures/",
		details: {
			problem:
				"Agency staff each rebuilt their own email signature, so the brand looked different on every reply. There was no single place to change it once.",
			pipeline:
				"Signature data moved into a managed system and is generated per user, so the brand is updated centrally and the markup stays correct on any device.",
			outcome:
				"Publishing a magazine automatically updates the signature imagery across every client account, so manual asset management disappeared.",
			stackGrouped: {
				core: ["PHP", "Template variables"],
				data: ["Automated deploy"],
				infra: ["Email signatures", "Responsive markup"],
			},
			screenshot: "/images/morganalexandersig.gif",
		},
	},
	{
		slug: "billing-logic",
		featured: true,
		title: "Bespoke billing logic",
		client: "CWCS",
		year: "2017–2021",
		// A cycle has to return to where it started. Renewal is what closes this
		// loop: it opens the next order, which is billed the same way the last one
		// was, which is the claim "billing = provisioning" being made concrete.
		nodes: ["Order", "Invoice", "Provision", "Renew"],
		topology: "cycle",
		metric: "Billing = provisioning",
		chips: ["Hooks", "Modules", "Provisioning"],
		tech: ["PHP", "WHMCS", "MySQL"],
		link: CWCS,
		details: {
			problem:
				"Off-the-shelf WHMCS modules could not express this provider's provisioning rules. Every case they did not cover became manual work, and billing drifted away from what was actually running.",
			pipeline:
				"Custom WHMCS hooks and modules are wired directly into service provisioning, so the charge and the resource it pays for move together.",
			outcome:
				"The charge and the resource it pays for are created in the same run, so a customer who has paid is provisioned before anyone thinks to ask for it.",
			stackGrouped: {
				core: ["PHP", "WHMCS"],
				data: ["MySQL"],
				infra: ["WHMCS hooks", "Custom modules", "Provisioning automation"],
			},
		},
	},
	{
		slug: "backup-tickets",
		featured: true,
		title: "Backup state in support tickets",
		client: "CWCS",
		year: "2017–2021",
		// Two systems, one flow of state. Not three stages: R1Soft pushes status
		// into Freshdesk, and the pair keep each other current.
		nodes: ["R1Soft", "Freshdesk"],
		topology: "sync",
		metric: "Tickets know their server",
		chips: ["Status sync", "Context attach"],
		tech: ["R1Soft API", "Freshdesk API"],
		link: CWCS,
		details: {
			problem:
				"Agents were troubleshooting blind. Nobody knew whether a client's backups were actually passing while they were trying to fix something else entirely.",
			pipeline:
				"R1Soft backup status is attached to ticket context in Freshdesk, so it travels with the ticket instead of being looked up in a separate system.",
			outcome:
				"The agent answering the ticket already sees whether backups are passing before they ask a single question, so troubleshooting starts from the server's real state rather than an assumption.",
			stackGrouped: {
				core: ["R1Soft API", "Freshdesk API"],
				data: ["Status synchronisation", "Ticket context"],
				infra: ["REST APIs", "Webhooks"],
			},
		},
	},
	{
		slug: "dns-automation",
		title: "Provisioning-time DNS automation",
		client: "CWCS",
		year: "2017–2021",
		nodes: ["Service activated", "Zone created", "Propagated"],
		topology: "chain",
		metric: "Zero typed DNS records",
		chips: ["Event-driven", "Zone automation"],
		tech: ["Cloudflare API", "cPanel / WHMCS"],
		link: CWCS,
		details: {
			problem:
				"Activating a service meant manual DNS and SSL steps spread across separate panels. Every gap between them was a window where the customer had no site at all.",
			pipeline:
				"The activation event drives zone creation and propagation automatically, across the DNS provider and the hosting panel together.",
			outcome:
				"DNS and certificates are in place the moment the service exists, rather than in the gap after activation where the customer has no site at all.",
			stackGrouped: {
				core: ["Cloudflare API", "cPanel / WHMCS"],
				data: ["DNS zone automation"],
				infra: ["SSL provisioning", "Event-driven hooks"],
			},
		},
	},
	{
		// Six months, but a full arc: hand-built front-ends wired into a bespoke
		// modular CMS the client could then drive itself. The drawer is real, not
		// invented - the projects (VW Ireland, Tom Murphy, Pivotal, Grace) are
		// documented on the original site's projects page.
		slug: "keyelement",
		client: "KeyElement",
		year: "2015",
		title: "Bespoke-CMS client sites",
		metric: "Hand-built, CMS-wired",
		nodes: ["Built from scratch", "Modular CMS", "Client-editable"],
		topology: "chain",
		chips: ["Modular CMS", "Dynamic navigation", "Drag-and-drop modules"],
		tech: ["HTML5/CSS3", "jQuery", "PHP", "MySQL"],
		link: "http://www.keyelement.co.uk/",
		details: {
			problem:
				"The clients - car dealers and a corporate finance and aftersales section - wanted fully responsive sites they could update themselves, not hand off a design and wait on a developer. The in-house CMS was bespoke, so every build had to be hand-wired into its own modular page composition.",
			pipeline:
				"Each site was built from scratch, then integrated into the CMS so the client could add, edit and reorder pages and modules - dragging them to a new order. Navigation was generated from the CMS rather than hardcoded, and content ran through carousels, accordions, galleries, iframes and video modals.",
			outcome:
				"A set of client-managed responsive sites - Volkswagen Ireland Finance and Aftersales, Tom Murphy Car Sales, Pivotal Defense and Grace Consulting - where the client adds pages, reorders modules and updates content in the CMS rather than raising a ticket.",
			stackGrouped: {
				core: ["HTML5", "CSS3", "JavaScript", "jQuery"],
				data: ["PHP", "MySQL"],
				infra: ["AJAX", "JSON"],
			},
		},
	},
];

/**
 * The timeline reads newest first, so a visitor meets the most recent work
 * before scrolling back through the career.
 *
 * Ordered off the leading year of the `year` string rather than a separate
 * numeric field — a second year field would be a value that has to be kept in
 * step with the one on screen, and would eventually disagree with it. `sort` is
 * stable, so the three 2017–2021 entries and the four 2016 entries each keep the
 * order they are written in above.
 */
export const caseStudiesByRecency = [...caseStudies].sort(
	(a, b) => parseInt(b.year, 10) - parseInt(a.year, 10),
);

/**
 * The lead set, in array order (not recency) - a deliberate list, not a sort
 * side effect. Consumed by the timeline layout once the lead/row split lands.
 */
export const featuredCaseStudies = caseStudies.filter(study => study.featured);
