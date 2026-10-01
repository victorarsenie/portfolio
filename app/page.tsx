"use client";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import TerminalHero from "./components/TerminalHero";
import { handleAnchorClick } from "./lib/scroll";
import SkillCard from "./components/SkillCard";
import HappyChip from "./components/HappyChip";
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
				<span className="skills-kicker">{"// 03 — core competencies"}</span>
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
				<SkillsTabs />
			</div>
		</section>
	);
}
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
				<header className="section-header">
					<span className="section-kicker">{"// 02 — selected work"}</span>
					<h1 className="section-title">Selected work</h1>
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
				<header className="contact-header">
					<span className="contact-kicker">{"// 04 — get in touch"}</span> <h1 className="contact-title">How to reach me.</h1>
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
					{/* The archive link used to sit at the foot of the work section. That
					    section is gone, so it moved here rather than being dropped. */}
					<a className="footer-archive" href="/old_website/" target="_blank" rel="noopener noreferrer">
						<i className="fa fa-history" aria-hidden="true"></i> Old website
					</a>
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
			for (const section of ["case-studies", "about", "skills", "contact"]) {
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
								["case-studies", "Work"],
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
}
// Page header component for all sections
export default function HomePage() {
	return (
		<main id="main-content" className="min-h-screen bg-white">
			<Navigation />
			<TerminalHero />

			<section id="about" className="about-section pt-5 pb-20">
				<div className="bootstrap-container">
					<header className="section-header">
						<span className="section-kicker">{"// 01 — about me"}</span>
						<h1 className="section-title">About me</h1>
					</header>
					<div className="page-header">
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
							Most of that work is invisible once it works. I spend my time on the plumbing — schema
							mismatches, duplicate records, providers down at 3am — so nobody using it has to.
						</p>

						{/* The current chapter. The framing that matters here is that
						    the framework is the cheap part: the fundamentals are
						    what make a migration routine rather than a rewrite. */}
						<p className="lead">
							What I&rsquo;m doing now is taking that same kind of legacy system — CodeIgniter, plain
							PHP, jQuery, AJAX, MySQL — and moving it to Next.js and TypeScript. The base is the
							same either way, and having written the fundamentals directly, I can change what sits on
							top of them without relearning the problem.
						</p>
						<p className="lead">
							The leverage is a local model stack I benchmarked and tuned against a single consumer GPU.
							No rate limit, nothing uploaded, no training on client code, and every run reproducible. It
							is written up as an ongoing project — including the configurations I measured, the ones
							that failed, and why.
						</p>
					</div>
				</div>
			</section>

			<CaseStudiesPreview />
			<SkillsSection />
			<ContactSection />
			<Footer />
		</main>
	);
}
