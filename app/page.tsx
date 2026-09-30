"use client";
import Image from "next/image";
import { Fragment, useState, useEffect, type MouseEvent } from "react";
import Swal from "sweetalert2";
import TerminalHero from "./components/TerminalHero";
import { handleAnchorClick } from "./lib/scroll";
import SkillCard from "./components/SkillCard";
import TiltCard from "./components/TiltCard";
import HappyChip from "./components/HappyChip";
import AmpText from "./components/AmpText";
import ShowcasePanel from "./components/ShowcasePanel";
import ShowcaseTile from "./components/ShowcaseTile";
import CaseStudyLedger from "./components/CaseStudyLedger";
import CaseStudyDrawer from "./components/CaseStudyDrawer";
import { AboutEntry, FutureEntry } from "./components/TimelineNotes";
import { caseStudiesByRecency, chapterCaseStudy, tileCaseStudies, ledgerGroups } from "./lib/caseStudies";

const CONTACT_EMAIL = "victor.arsenie@yahoo.com";

// Skills navigation component
function SkillsTabs() {
	type SkillLogo = { label: string; src: string; alt: string };
	type SkillCategory = {
		id: string;
		title: string;
		icon: string;
		logos?: SkillLogo[];
		tools?: string[];
		text?: string;
		live?: boolean;
	};
	// Grouped by what the work actually is — bridging systems — rather than by
	// technology. Logos carry the recognisable tools, plain chips name the
	// vendor APIs and practices that have no logo. The two cards that show he's
	// active right now lead; the accumulated competencies follow.
	const skillsData: SkillCategory[] = [
		{
			id: "currently-building",
			title: "Currently building",
			icon: "fa fa-refresh",
			logos: [
				{ label: "CodeIgniter", src: "/images/logos/codeigniter.png", alt: "codeigniter" },
				{ label: "JavaScript", src: "/images/logos/javascript.png", alt: "javascript" },
				{ label: "npm", src: "/images/logos/npm.png", alt: "npm" },
				{ label: "Lighthouse", src: "/images/logos/lighthouse.png", alt: "lighthouse" },
			],
			tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
			live: true,
		},
		{
			id: "ai-coding",
			title: "AI-assisted coding",
			icon: "fa fa-microchip",
			logos: [
				{ label: "Qwen3", src: "/images/logos/qwen.png", alt: "qwen" },
				{ label: "Gemma 4", src: "/images/logos/gemma.png", alt: "gemma" },
				{ label: "gpt-oss-20b", src: "/images/logos/openai.png", alt: "openai" },
				{ label: "Llama (llama.cpp)", src: "/images/logos/meta.png", alt: "meta" },
				{ label: "Ollama (Hermes, Pi)", src: "/images/logos/ollama.png", alt: "ollama" },
				{ label: "LM Studio", src: "/images/logos/lmstudio.png", alt: "lmstudio" },
				{ label: "opencode", src: "/images/logos/opencode.png", alt: "opencode" },
				{ label: "Cline", src: "/images/logos/cline.png", alt: "cline" },
				{ label: "Playwright", src: "/images/logos/playwright.png", alt: "playwright" },
			],
			tools: ["Benchmarking", "VRAM budgeting", "Speculative decoding", "Reasoning budgets"],
			text: "A local model stack tuned to one RTX 5070 Ti: a 27B dense model doing multi-file edits at 54 t/s across 128K with vision, and a 35B MoE at 175 t/s across 256K. Private, offline, no rate limit — and documented as ongoing work, including what failed.",
			live: true,
		},
		{
			// Chips rather than logos: Git, Playwright and Lighthouse already appear
			// in the marquee rails above, and the same logo twice on one page reads
			// as an oversight rather than as emphasis.
			id: "delivery-tooling",
			title: "Automated verification & delivery",
			icon: "fa fa-check-square",
			tools: [
				"Headless Chrome (CDP)",
				"Playwright",
				"Lighthouse",
				"Computed-style inspection",
				"Responsive geometry checks",
				"Conventional commits",
				"CI lint + build gates",
			],
			text: "I verify in a real browser before calling anything done — DOM and computed styles rather than guessing from a screenshot, at desktop and mobile widths. Then it ships as a conventional commit behind lint and build gates.",
		},
		{
			id: "api-orchestration",
			title: "API orchestration",
			icon: "fa fa-plug",
			logos: [
				{ label: "XML", src: "/images/logos/xml.png", alt: "xml" },
				{ label: "JSON", src: "/images/logos/json.png", alt: "json" },
				{ label: "AJAX", src: "/images/logos/ajax.png", alt: "ajax" },
			],
			tools: ["REST APIs", "Webhooks", "R1Soft", "Cloudflare", "Freshdesk"],
		},
		{
			id: "platform-extension",
			title: "Platform extension",
			icon: "fa fa-cubes",
			logos: [
				{ label: "PHP", src: "/images/logos/php.png", alt: "php" },
				{ label: "CodeIgniter", src: "/images/logos/codeigniter.png", alt: "codeigniter" },
			],
			tools: ["WHMCS hooks", "Bespoke CMS", "TCPDF"],
		},
		{
			id: "data-pipelines",
			title: "Data pipelines",
			icon: "fa fa-database",
			logos: [
				{ label: "MySQL", src: "/images/logos/mysql.png", alt: "mysql" },
				{ label: "MySQL Workbench", src: "/images/logos/mysqlworkbench.png", alt: "mysqlworkbench" },
				{ label: "phpMyAdmin", src: "/images/logos/phpmyadmin.png", alt: "phpmyadmin" },
			],
			tools: ["XML ingestion", "Schema mapping", "Cron scheduling", "Automated reporting"],
		},
		{
			id: "frontend-backend",
			title: "Front-end / back-end",
			icon: "fa fa-laptop",
			logos: [
				{ label: "HTML5", src: "/images/logos/html5.png", alt: "html" },
				{ label: "CSS3", src: "/images/logos/css3.png", alt: "css" },
				{ label: "JavaScript", src: "/images/logos/javascript.png", alt: "javascript" },
				{ label: "jQuery", src: "/images/logos/jquery.png", alt: "jquery" },
				{ label: "Bootstrap", src: "/images/logos/bootstrap.png", alt: "bootstrap" },
				{ label: "npm", src: "/images/logos/npm.png", alt: "npm" },
			],
			tools: ["Next.js", "TypeScript"],
		},
	];
	// Rails carry the supporting toolkit — the tools that don't define the work
	// but show how it's done day to day. Kept separate from the cards above so
	// the same logo never appears twice on the page.
	const marqueeRails = [
		[
			{ label: "Git", src: "/images/logos/git.png", alt: "git" },
			{ label: "SourceTree", src: "/images/logos/sourcetree.png", alt: "sourcetree" },
			{ label: "TortoiseSVN", src: "/images/logos/tortoisesvn.png", alt: "tortoisesvn" },
			{ label: "JIRA", src: "/images/logos/jira.png", alt: "jira" },
			{ label: "VS Code", src: "/images/logos/vscode.png", alt: "vscode" },
			{ label: "Notepad++", src: "/images/logos/notepadpp.png", alt: "notepadpp" },
			{ label: "Sublime Text", src: "/images/logos/sublime.png", alt: "sublime" },
			{ label: "Atom", src: "/images/logos/atom.png", alt: "atom" },
			{ label: "Playwright", src: "/images/logos/playwright.png", alt: "playwright" },
			{ label: "Lighthouse", src: "/images/logos/lighthouse.png", alt: "lighthouse" },
		],
		[
			{ label: "Photoshop", src: "/images/logos/photoshop.png", alt: "photoshop" },
			{ label: "Illustrator", src: "/images/logos/illustrator.png", alt: "illustrator" },
			{ label: "InDesign", src: "/images/logos/indesign.png", alt: "indesign" },
			{ label: "Acrobat DC", src: "/images/logos/acrobat-dc.png", alt: "acrobat-dc" },
			{ label: "MySQL Workbench", src: "/images/logos/mysqlworkbench.png", alt: "mysqlworkbench" },
			{ label: "phpMyAdmin", src: "/images/logos/phpmyadmin.png", alt: "phpmyadmin" },
		],
	];
	const chip = (logo: SkillLogo, keySuffix = "") => (
		<HappyChip key={logo.label + keySuffix}>
			<Image src={logo.src} alt={logo.alt} width={100} height={100} /> {logo.label}
		</HappyChip>
	);
	return (
		<div className="skills-band">
			<header className="skills-header">
				<span className="skills-kicker">{"// 02 — core competencies"}</span>
				<h1 className="skills-heading">
					<strong>Skills</strong>
				</h1>
			</header>
			{marqueeRails.map((rail, i) => (
				<div key={i} className={i === 1 ? "skills-marquee reverse" : "skills-marquee"}>
					<div className="skills-marquee-track">
						{rail.map((logo) => chip(logo))} <div aria-hidden="true">{rail.map((logo) => chip(logo, "-b"))}</div>
					</div>
				</div>
			))}
			<ul className="skills-cards">
				{skillsData.map((skill) => (
					<SkillCard key={skill.id}>
						<div className="skill-card-head">
							<span className="skill-card-icon">
								<i className={skill.icon} aria-hidden="true"></i>
							</span>
							<span className="skill-card-title">{skill.title}</span>
							{skill.live ? (
								<span className="skill-card-live">
									<span className="skill-card-live-dot" aria-hidden="true" /> live
								</span>
							) : null}
						{skill.logos || skill.tools ? (() => {
							const total = (skill.logos?.length ?? 0) + (skill.tools?.length ?? 0);
							return (
								<span className="skill-card-count">
									{total} {total === 1 ? "skill" : "skills"}
								</span>
							);
						})() : null}
						</div>
						<div className="skill-card-body">
							{skill.logos?.map((logo) => (
								<span key={logo.label} className="skill-card-chip">
									<Image src={logo.src} alt={logo.alt} width={100} height={100} /> {logo.label}
								</span>
							))}
							{skill.tools?.map((tool) => (
								<span key={tool} className="skill-card-chip plain">
									{tool}
								</span>
							))}
							{skill.text ? <p className="skill-card-text">{skill.text}</p> : null}
						</div>
					</SkillCard>
				))}
			</ul>
		</div>
	);
}

function SkillsSection() {
	return (
		<section id="skills" className="section skills">
			<div className="bootstrap-container">
				<div className="skills-cmdbar" aria-hidden="true">
					<span className="skills-cmdbar-title">C:\skills\core-competencies</span>
					<span className="skills-cmdbar-btns">
						<i className="btn-min" /> <i className="btn-max" /> <i className="btn-close" />
					</span>
				</div>
				<SkillsTabs />
			</div>
		</section>
	);
} // Employment component renders the two-column row used in the work section.
// Faux browser window wrapping a screenshot. Kept deliberately static — it is// positioned in a floating gallery and carries the site's window chrome.
function BrowserFrame({
	url,
	title,
	screenshot,
	screenshotAlt,
	extra = "",
}: {
	url: string;
	title: string;
	screenshot: string;
	screenshotAlt: string;
	extra?: string;
}) {
	const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
	return (
		<div className={"browser-frame " + extra}>
			<div className="browser-bar">
				<span className="browser-dots">
					<i /> <i /> <i />
				</span>
				<span className="browser-url">
					<i className="fa fa-lock" aria-hidden="true" /> {domain}
				</span>
			</div>
			<div className="browser-body">
				<a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${title}`}>
					<Image src={screenshot} alt={screenshotAlt} width={800} height={541} className="browser-shot" />
				</a>
			</div>
		</div>
	);
} // Editorial index row for one employment: mono index + company name + meta on
// the left, a floating gallery of browser windows on the right.
function ExperienceRow({ entry, index }: { entry: WorkEntry; index: number }) {
	const pad = String(index + 1).padStart(2, "0");
	const shot2Extra = index % 2 === 0 ? "back-left" : "back-right";
	const projFrame = entry.projects && entry.projects.length > 0;
	return (
		<article className="experience-row">
			<div className="experience-meta">
				<span className="work-idx">/{pad}</span>
				<div className="experience-head">
					<h2 className="work-company">{entry.title}</h2> <p className="work-duration">{entry.duration}</p>
				</div>
				<p className="work-blurb">{entry.blurb}</p>
				<a className="work-visit" href={entry.siteUrl} target="_blank" rel="noopener noreferrer">
					Visit website <i className="fa fa-arrow-right" aria-hidden="true" />
				</a>
			</div>
			<div className={"work-gallery" + (projFrame ? " has-proj" : "")}>
				<BrowserFrame
					url={entry.siteUrl}
					title={entry.title}
					screenshot={entry.screenshot}
					screenshotAlt={entry.screenshotAlt}
					extra="lead-frame"
				/>
				<BrowserFrame
					url={entry.siteUrl}
					title={entry.title}
					screenshot={entry.photo}
					screenshotAlt={entry.photoAlt}
					extra={`alt-frame ${shot2Extra}`}
				/>
				{projFrame ? (
					<BrowserFrame
						url={entry.projects![0].link}
						title={entry.projects![0].title}
						screenshot={entry.projects![0].image}
						screenshotAlt={entry.projects![0].imageAlt}
						extra="proj-frame"
					/>
				) : null}
			</div>
		</article>
	);
} // Project links that point straight at an image file open in the lightbox
// popup instead of a new tab.
const IMAGE_LINK = /\.(?:png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i;
function openImagePreview(e: MouseEvent<HTMLElement>, project: WorkProject) {
	if (!IMAGE_LINK.test(project.link)) return;
	e.preventDefault();
	Swal.fire({
		title: project.heading,
		html: `<img class="swal-shot" src="${project.link}" alt="${project.imageAlt}" />`,
		confirmButtonText: "Close",
		width: 860,
		scrollbarPadding: false,
		background: "#141417",
		color: "#e8e8ec",
		customClass: { title: "swal-shot-title", confirmButton: "swal-shot-btn" },
	});
} // Bento grid of a company's showcased projects: asymmetric card spans, a mono
// category tag, title, short snippet and a visit link.
function ProjectBento({ entry, index }: { entry: WorkEntry; index: number }) {
	return (
		<div className="project-bento">
			<h3 className="bento-heading">
				<span className="bento-kicker">Selected deliverables</span> <span className="bento-company">{entry.title}</span>
			</h3>
			<div className="bento-grid">
				{(entry.projects ?? []).map((project, i) => (
					<TiltCard
						key={project.heading}
						as="a"
						className={`bento-card card-${i + 1}`}
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => openImagePreview(e, project)}>
						<div className="bento-media">
							<Image
								src={project.image}
								alt={project.imageAlt}
								width={project.imageWidth}
								height={project.imageHeight}
								className="bento-img"
							/>
						</div>
						<div className="bento-body">
							<span className="bento-proj-idx">
								/{String(index + 1)}.{String(i + 1)}
							</span>
							<h4><AmpText text={project.title} /></h4> <p className="bento-snippet">{project.problem}</p>
							<p className="bento-solution">{project.solution}</p>
							<ul className="bento-stack">
								{project.stack.map((tech) => (
									<li key={tech}>{tech}</li>
								))}
							</ul>
							<span className="bento-cta">
								{project.heading} <i className="fa fa-arrow-right" aria-hidden="true" />
							</span>
						</div>
					</TiltCard>
				))}
			</div>
		</div>
	);
} // Work section — dark editorial index of employment + project bento grids.
// Static composition by design; motion can be layered on later.
function WorkSection() {
	return (
		<section id="work" className="section work">
			<div className="bootstrap-container">
				<div className="work-cmdbar" aria-hidden="true">
					<span className="work-cmdbar-title">C:\work\selected</span>
					<span className="work-cmdbar-btns">
						<i className="btn-min" /> <i className="btn-max" /> <i className="btn-close" />
					</span>
				</div>
				<header className="work-header">
					<span className="work-kicker">{"// 01 — selected work"}</span> <h1 className="work-title">My work</h1>
					<p className="work-lede">
						Front-end and back-end in equal measure — fully responsive, cross-browser compliant, tested across platforms, and built from
						maintainable modular components. A good eye for detail and a working knowledge of design and usability.
					</p>
				</header>
				{workData.map((entry, index) => (
					<Fragment key={entry.title}>
						<ExperienceRow entry={entry} index={index} />
						{entry.projects && entry.projects.length > 0 ? <ProjectBento entry={entry} index={index} /> : null}
					</Fragment>
				))}
				<footer className="work-footer">
					<a className="old-site" href="/old_website/" target="_blank" rel="noopener noreferrer">
						<span className="old-site-label">Looking for the archive?</span>
						<span className="old-site-link">
							Old website <i className="fa fa-arrow-right" aria-hidden="true" />
						</span>
					</a>
				</footer>
			</div>
		</section>
	);
} // Case studies — a proof section, in three bands.
//
// It replaced a horizontal rail that needed a drag or swipe to reach a case and
// hid whatever was off-screen; a vertical column is the one scroll direction
// every input already knows. What it got wrong next was the rail's other half:
// ten studies laid end to end, each in the same box, so the two with measured
// results and the one with a real diagnosis in it looked exactly like four CMS
// builds nobody can check. Ten studies is more than a portfolio can sell, and
// pretending otherwise hid the strongest three.
//
// So: the current chapter gets a full-width panel because it is the only study
// whose result is a set of numbers, two client builds get half-width tiles
// because a single result does not need a diagram, and the remaining seven go
// into a ledger grouped by employer — which is the thing a flat list of ten
// could not say, that four of them were the same pipeline problem at one
// employer. Building and planned close it as a strip, not as two more cards
// the same size as a delivered project. Every study still opens the same
// drawer, and one selection is tracked so opening a study replaces whatever was
// open rather than stacking panels.
function CaseStudiesPreview() {
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const open = caseStudiesByRecency.find(study => study.slug === openSlug) ?? null;
	// Bound before the JSX rather than tested inside it: the arrow function that
	// closes over the chapter would otherwise widen the type back to `| null`
	// and every use inside it would need its own guard.
	const chapter = chapterCaseStudy;
	const chapterOnOpen = chapter?.details ? () => setOpenSlug(chapter.slug) : undefined;

	return (
		<section id="case-studies" className="section work">
			<div className="bootstrap-container">
				<header className="work-header">
					<span className="work-kicker">{"// 02 — case studies"}</span>
					<h1 className="work-title">Case studies</h1>
				</header>
			</div>

			<div className="case-timeline">
				{/* The reading-progress spine. A 1px rule in the left margin that
				    fills as the section passes, so the column of work says how far
				    through it you are — the one thing the old centre rail was
				    reaching for and never got, because a line that sits between two
				    alternating cards carries no information. Neutral on purpose:
				    the accent colour means a measured result on this site, and a
				    progress bar is not one. Hidden below 1180px with the rest of
				    the desktop rig. */}
				<span className="case-spine" aria-hidden="true" />

				<AboutEntry />

				<section className="case-band" aria-labelledby="case-lead-title">
					<div className="case-band-head">
						<span className="case-band-kicker">{"// selected"}</span>
						<h2 className="case-band-title" id="case-lead-title">
							Three worth the scroll
						</h2>
					</div>
					<div className="case-bento">
						{chapter ? (
							<ShowcasePanel study={chapter} onOpen={chapterOnOpen} />
						) : null}
						{tileCaseStudies.map(study => (
							<ShowcaseTile
								key={study.slug}
								study={study}
								onOpen={study.details ? () => setOpenSlug(study.slug) : undefined}
							/>
						))}
					</div>
				</section>

				<section className="case-band" aria-labelledby="case-ledger-title">
					<div className="case-band-head">
						<span className="case-band-kicker">{"// the rest"}</span>
						<h2 className="case-band-title" id="case-ledger-title">
							The other seven, by employer
						</h2>
					</div>
					<CaseStudyLedger groups={ledgerGroups} onOpen={setOpenSlug} />
				</section>

				<section className="case-band" aria-labelledby="case-future-title">
					<div className="case-band-head">
						<span className="case-band-kicker">{"// not yet"}</span>
						<h2 className="case-band-title" id="case-future-title">
							In progress and planned
						</h2>
					</div>
					<FutureEntry />
				</section>
			</div>

			<CaseStudyDrawer
				title={open?.title ?? ""}
				meta={open ? `${open.client} · ${open.year}` : ""}
				details={open?.details ?? null}
				tech={open?.tech ?? []}
				onClose={() => setOpenSlug(null)}
			/>
		</section>
	);
} // Contact — one click, no form. The form this replaces asked a visitor to type
// a name, an address, a subject and a message only for the browser to hand the
// same text to their own mail client: the slowest possible version of a mailto:
// link, with four fields of validation and a live preview panel to maintain for
// it. One click does the same job, so the terminal framing stays as decoration
// rather than being put to work as an interface.
function ContactSection() {
	return (
		<section id="contact" className="section contact">
			<div className="bootstrap-container">
				<div className="contact-cmdbar" aria-hidden="true">
					<span className="contact-cmdbar-title">C:\contact\inbox</span>
					<span className="contact-cmdbar-btns">
						<i className="btn-min" /> <i className="btn-max" /> <i className="btn-close" />
					</span>
				</div>
				<header className="contact-header">
					<span className="contact-kicker">{"// 03 — get in touch"}</span> <h1 className="contact-title">How to reach me.</h1>
					<p className="contact-lede">No forms. No agenda. Just open a line.</p>
				</header>
				<div className="contact-reach">
					<a className="contact-cmd" href={"mailto:" + CONTACT_EMAIL + "?subject=Integration%20Inquiry"}>
						<span className="contact-cmd-caret" aria-hidden="true">
							&gt;
						</span> email {CONTACT_EMAIL}
					</a>
					<p className="contact-status">
						<i aria-hidden="true" /> Available for integration work
					</p>
					<dl className="tx-meta">
						<div>
							<dt>from</dt> <dd>Victor Arsenie</dd>
						</div>
						<div>
							<dt>subject</dt> <dd>Integration Inquiry</dd>
						</div>
						<div>
							<dt>body</dt> <dd>[blank]</dd>
						</div>
					</dl>
					<p className="contact-note">
						<i className="fa fa-paper-plane-o" aria-hidden="true" /> Clicking the link opens your mail client. I respond within 24 hours.
					</p>
					<p className="contact-links">
						<a href="https://www.linkedin.com/in/victor-arsenie-391a3bb7/" target="_blank" rel="noopener noreferrer">
							LinkedIn
						</a>
						<span aria-hidden="true">·</span>
						<a href="https://github.com/victorarsenie" target="_blank" rel="noopener noreferrer">
							GitHub
						</a>
					</p>
				</div>
			</div>
		</section>
	);
} // Footer component — mirrors the original footer structure and icons.
function Footer() {
	return (
		<footer className="site-footer">
			<div className="bootstrap-container">
				<div className="footer-top">
					<div className="footer-brand">
						<Image src="/images/logo.png" alt="Victor Arsenie" width={70} height={54} sizes="70px" className="footer-logo" />
						<div className="footer-contact">
							<p>
								<i className="fa fa-phone-square" aria-hidden="true"></i>
								<a className="phone" href="tel:+447761325270">
									+44 7761 325 279
								</a>
							</p>
							<p>
								<i className="fa fa-envelope" aria-hidden="true"></i>
								<a className="email" href={"mailto:" + CONTACT_EMAIL}>
									{CONTACT_EMAIL}
								</a>
							</p>
						</div>
					</div>
					<nav className="footer-social" aria-label="Social profiles">
						<a href="https://www.linkedin.com/in/victor-arsenie-391a3bb7/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path
									d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
								/>
							</svg>
						</a>
						<a href="https://www.facebook.com/arsenie.victoralexandru" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.51 1.66-4.51 4.7v2.6H7v3.56h2.75V22h3.36v-9.14h2.66l.35-3.56h-3.01V6.95c0-1.03.28-1.63 1.01-1.63z" />
							</svg>
						</a>
					</nav>
				</div>
				<div className="copy">
					<em>
						<i className="fa fa-copyright" aria-hidden="true"></i> Victor Alexandru Arsenie — {new Date().getFullYear()}
					</em>
					<span className="footer-built">
						Built with Next.js + Tailwind. Migrated from CodeIgniter, which felt appropriate.
					</span>
				</div>
			</div>
		</footer>
	);
} // Scroll back to the top, matching the original's "slow" (600ms) animation.
function scrollToTop() {
	const startY = window.scrollY;
	const duration = 600;
	const start = performance.now();
	const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2;
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		window.scrollTo(0, startY * (1 - swing(t)));
		if (t < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
} // Navigation component
function Navigation() {
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("");
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			const about = document.getElementById("about");
			if (!about) return;
			const aboutTop = about.getBoundingClientRect().top + window.scrollY;
			setScrolled(window.scrollY > aboutTop - 90);
			const scrollPosition = window.scrollY;
			setShowScrollTop(scrollPosition > 600);
			let current = "";
			for (const section of ["work", "about", "skills", "contact"]) {
				const el = document.getElementById(section);
				if (!el) continue;
				const top = el.getBoundingClientRect().top + scrollPosition;
				const positionTop = top - 30;
				if (positionTop <= scrollPosition && positionTop + el.offsetHeight > scrollPosition) {
					current = section;
					break;
				}
			}
			setActiveSection(current);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<>
			<a className="skip-link" href="#main-content">
				Skip to content
			</a>
			<nav
				className={`navbar-default fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "scrolled" : ""}`}
				style={{ border: "none" }}>
				<div className="relative bootstrap-container flex items-center justify-between">
					<div className="navbar-header">
						<a href="#home" className="navbar-brand">
							<Image src="/images/logo-text.png" alt="Victor Arsenie" width={208} height={36} priority />
						</a>
						<button
							type="button"
							className={`navbar-toggle ${menuOpen ? "open" : ""}`}
							onClick={() => setMenuOpen((open) => !open)}
							aria-label="Toggle navigation"
							aria-expanded={menuOpen}
							aria-controls="main-navbar-collapse">
							<span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span>
						</button>
					</div>
					<div className={`navbar-collapse ${menuOpen ? "open" : ""}`} id="main-navbar-collapse">
						<ul className="navbar-nav flex list-none">
							{[
								["work", "Work"],
								["about", "About"],
								["skills", "Skills"],
								["contact", "Contact"],
							].map(([section, label]) => (
								<li key={section} className={activeSection === section ? "active" : undefined}>
									<a
										href={`#${section}`}
										onClick={(e) => {
											handleAnchorClick(e, section);
											setMenuOpen(false);
										}}
										className="block transition-colors duration-200 no-underline">
										{label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</nav>
			<div className={`scroll-top ${showScrollTop ? "show" : ""}`} onClick={scrollToTop} aria-label="Scroll to top" role="button"></div>
		</>
	);
} // Work section data — mirrors the original site's live work section.
interface WorkProject {
	heading: string;
	image: string;
	imageWidth: number;
	imageHeight: number;
	imageAlt: string;
	link: string;
	title: string;
	problem: string;
	solution: string;
	stack: string[];
	paragraphs: string[];
}
interface WorkEntry {
	photo: string;
	photoAlt: string;
	screenshot: string;
	screenshotAlt: string;
	siteUrl: string;
	title: string;
	duration: string;
	blurb: string;
	projects?: WorkProject[];
}
const workData: WorkEntry[] = [
	{
		photo: "/images/cwcs-employment.png",
		photoAlt: "CWCS",
		screenshot: "/images/cwcs.png",
		screenshotAlt: "CWCS",
		siteUrl: "https://www.cwcs.co.uk/",
		title: "CWCS",
		duration: "August 2017 - February 2021",
		blurb:
			"Sole developer on a managed hosting provider serving thousands of clients worldwide — frontend, backend and design, plus WHMCS extensions and R1Soft, Cloudflare and Freshdesk integrations.",
	},
	{
		photo: "/images/iceberg-employment.png",
		photoAlt: "Iceberg Digital",
		screenshot: "/images/iceberg.png",
		screenshotAlt: "Iceberg",
		siteUrl: "http://www.iceberg-digital.co.uk/",
		title: "Iceberg Digital",
		duration: "March 2016 - May 2017",
		blurb:
			"Built estate-agency CMS, property ingestion pipelines, automated magazine generation and valuation tooling for a digital agency — working closely with the design team on every build.",
		projects: [
			{
				heading: "Property ingestion",
				image: "/images/nkres.png",
				imageWidth: 640,
				imageHeight: 416,
				imageAlt: "NKRES",
				link: "http://www.nkres.co.uk/",
				title: "Custom CMS & property ingestion pipeline",
				problem:
					"Estate agents receive thousands of listings a night from external XML providers — each with its own schema, its own duplicates and its own idea of what a postcode looks like.",
				solution:
					"A bespoke CMS that ingests every feed on a schedule and reconciles them into one live database. Schema mismatches, duplicate detection and provider outages are handled in the pipeline, so staff never open a raw file.",
				stack: ["PHP", "MySQL", "XML parsing", "Cron"],
				paragraphs: [
					"Fully responsive website based on a premium template with custom CMS to meet the client's needs.",
					"It benefits of a custom search systems to help users search easily for the desired property and a custom banner system where the client can add an unlimited number of banners for different promotions, change the order and select the period of time for the banner to be live on the website.",
				],
			},
			{
				heading: "Magazines",
				image: "/images/mag.png",
				imageWidth: 580,
				imageHeight: 522,
				imageAlt: "magazine",
				link: "http://www.digitalmag.co.uk/mag/bseenmagazine",
				title: "Automated magazine generation",
				problem:
					"Monthly client magazines were laid out by hand from live property data — a process that took hours per issue and could not keep up with the listings changing daily.",
				solution:
					"A drag-and-drop web interface that pulls the client's live properties into InDesign-derived templates. One click produces a print-ready PDF and a digital page-turner. Hundreds of magazines now go out this way.",
				stack: ["PHP", "TCPDF", "HTML templates", "XML"],
				paragraphs: [
					"Magazine created by the client with the use of our system. The system involves importing the client's properties from data providers, usually as XML files",
					"I have built the HTML and PDF template using the Indesign document created by the design team. Once applyed to the client's account, the client can simply go to the system, add pages, drag the properties to the desired pages and create the magazine with the push of a button. The can then be accessed live as a page turner and the client has the options of printing.",
				],
			},
			{
				heading: "Instant Online Valuations",
				image: "/images/outlook.png",
				imageWidth: 640,
				imageHeight: 309,
				imageAlt: "valuation",
				link: "http://outlook.mypropertyprices.com/",
				title: "Multi-API valuation tool",
				problem:
					"Getting a valuation meant a phone call: postcode in one system, address in another, price range in a third. Staff relayed the answers by hand.",
				solution:
					"Two third-party APIs stitched into one flow. A postcode resolves to a full address, that address returns a price range, and the result is displayed live or emailed — no dashboard switching.",
				stack: ["PHP", "REST APIs", "Email"],
				paragraphs: [
					"With the use of API's I get the property address by sending the postcode and the property valuation by sending the address and details.",
					"The valuation can be either shown after all the fields have been filled or sent to the user by email.",
				],
			},
			{
				heading: "Email Signatures",
				image: "/images/morganalexandersig.gif",
				imageWidth: 640,
				imageHeight: 200,
				imageAlt: "signature",
				link: "/images/morganalexandersig.gif",
				title: "Dynamic asset linking",
				problem:
					"Every client's email signature showed their latest magazine cover. When a new issue published, hundreds of signatures had to be regenerated by hand.",
				solution:
					"Two systems linked so one event triggers the other: publishing a magazine automatically updates the signature imagery across every client account. Manual asset management disappeared.",
				stack: ["PHP", "Template variables", "Automated deploy"],
				paragraphs: [
					"All signatures are made to fit the customers' needs and to work on any device.",
					"The magazine image on the signature is automatically being updated when the client creates a new magazine.",
				],
			},
		],
	},
	{
		photo: "/images/keyelement-employment.png",
		photoAlt: "Keyelement",
		screenshot: "/images/keyelement.png",
		screenshotAlt: "Keyelement",
		siteUrl: "http://www.keyelement.co.uk/",
		title: "KeyElement",
		duration: "June 2015 - December 2015",
		blurb:
			"Built sites from scratch and integrated them with a bespoke CMS — HTML5, CSS3, JavaScript, jQuery, AJAX and JSON on the front, PHP and MySQL behind it.",
	},
]; // Page header component for all sections
export default function HomePage() {
	return (
		<main id="main-content" className="min-h-screen bg-white">
			<Navigation />
			<TerminalHero />
			<WorkSection />
			<CaseStudiesPreview />
				<section id="about" className="pt-5 pb-20 bg-white">
					<div className="bootstrap-container">
						<div className="page-header">
							<h1>About me</h1>
							<p className="lead">
								<a id="my_cv" href="/documents/cv.docx" target="_blank" rel="noopener noreferrer">
									<Image
										src="/images/cv.png"
										alt="Download my CV"
										width={66}
										height={87}
										className="inline float-left mr-[15px]"
										style={{ width: "auto", height: "auto" }}
									/>
								</a>
								I work in the space between systems — wiring up billing platforms, backup software, DNS and
								support desks so data in one actually shows up in the others. WHMCS add-ons and hooks,
								multi-API orchestration, and automated data pipelines.
							</p>
							<p className="lead">
								Most of that work is invisible once it works. A property feed that ingests thousands of
								listings a night without anyone opening a spreadsheet. A magazine generated from live
								data instead of a designer. I spend my time on the plumbing — schema mismatches,
								duplicate records, providers down at 3am — so nobody using it has to.
							</p>

							{/* The current chapter. The framing that matters here is that
							    the framework is the cheap part: the fundamentals are
							    what make a migration routine rather than a rewrite. */}
							<p className="lead">
								What I&rsquo;m doing now is taking that same kind of legacy system — CodeIgniter, plain
								PHP, jQuery, AJAX, MySQL — and moving it to Next.js and TypeScript. The base is the
								same either way. Having written the fundamentals directly, I can change what sits on
								top of them without relearning the problem.
							</p>
							<p className="lead">
								What makes that tractable is that I run the AI myself. I benchmarked and tuned a
								local model stack against one RTX 5070 Ti until a 27B dense model was doing real
								multi-file edits at 54 tokens per second across a 128K context, with vision, and a
								35B mixture-of-experts running at 175 tokens per second across 256K. No rate limit, no
								training on client code, nothing uploaded, and every run re-runnable for free. It is
								documented as an ongoing project rather than a weekend experiment — including the
								configurations I measured, the ones that failed, and why.
							</p>
							<p className="lead">
								Photoshop, Illustrator and Acrobat for the design side; Git, Sourcetree and JIRA for the
								work around the code.
							</p>
						</div>
					</div>
				</section>
			<SkillsSection />
			<ContactSection />
			<Footer />
		</main>
	);
}
