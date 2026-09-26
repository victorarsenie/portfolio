"use client";
import Image from "next/image";
import { Fragment, useState, useEffect, useRef, type MouseEvent } from "react";
import Swal from "sweetalert2";
import ParallaxHeroBackground from "./components/ParallaxHeroBackground";
import CodeParticles from "./components/CodeParticles";
import Typewriter from "./components/Typewriter";
import SkillCard from "./components/SkillCard";
import TiltCard from "./components/TiltCard";
import HappyChip from "./components/HappyChip";

const CONTACT_EMAIL = "contact@victorsenie.com";

// TypeScript interfaces for component props
interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
} // Skills navigation component
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
			],
			text: "Local models on my own hardware for refactoring, review and boilerplate — private, offline and free to re-run.",
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
							<h4>{project.title}</h4> <p className="bento-snippet">{project.problem}</p>
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
} // Contact commands — each one pre-fills the subject/message and retitles the
// console, so the visitor starts from a template instead of a blank page.
interface ContactCommand {
	id: string;
	label: string;
	path: string;
	note: string;
	subject: string;
	message: string;
}
const CONTACT_COMMANDS: ContactCommand[] = [
	{
		id: "hi",
		label: "/say hi",
		path: "C:\\contact\\say-hi",
		note: "No agenda needed — just say hello.",
		subject: "Hello",
		message: "Hi Victor,\n\nJust wanted to say hi.\n\n",
	},
	{
		id: "project",
		label: "/new project",
		path: "C:\\contact\\new-project",
		note: "Tell me what you need built.",
		subject: "New project enquiry",
		message: "Hi Victor,\n\nI have a project I would like to discuss.\n\nWhat I need: \nTimeline: \nBudget: \n",
	},
	{
		id: "role",
		label: "/work together",
		path: "C:\\contact\\work-together",
		note: "Contract, freelance or a full-time role.",
		subject: "Working together",
		message: "Hi Victor,\n\nI would like to talk about working together.\n\nRole: \nAvailability: \n",
	},
	{ id: "custom", label: "/custom", path: "C:\\contact\\custom", note: "Blank canvas — write your own.", subject: "", message: "" },
];
const CONTACT_FIELDS = ["name", "email", "subject", "message"] as const;
type ContactField = (typeof CONTACT_FIELDS)[number];
type ContactValues = Record<ContactField, string>; // Contact console — a command bar picks the starting template, the form fills
// in, and the transmission panel mirrors the mailto payload as you type.
function ContactConsole({ onSubmit }: { onSubmit: (formData: ContactFormData) => Promise<void> }) {
	const [command, setCommand] = useState<ContactCommand>(CONTACT_COMMANDS[0]);
	const [values, setValues] = useState<ContactValues>({
		name: "",
		email: "",
		subject: CONTACT_COMMANDS[0].subject,
		message: CONTACT_COMMANDS[0].message,
	});
	const [dirty, setDirty] = useState<{ subject: boolean; message: boolean }>({ subject: false, message: false });
	const [sent, setSent] = useState(false);
	const [handoffFailed, setHandoffFailed] = useState(false);
	const [copied, setCopied] = useState(false);
	const fields = useRef<Partial<Record<ContactField, HTMLElement | null>>>({});
	const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	const selectCommand = (next: ContactCommand) => {
		const merged: ContactValues = {
			...values,
			subject: dirty.subject ? values.subject : next.subject,
			message: dirty.message ? values.message : next.message,
		};
		setCommand(next);
		setValues(merged);
		setSent(false);
		setHandoffFailed(false);
		setCopied(false);
		const empty = CONTACT_FIELDS.find((field) => !merged[field].trim());
		if (empty) fields.current[empty]?.focus();
	};
	const update = (field: ContactField, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		setSent(false);
		setHandoffFailed(false);
		if (field === "subject" || field === "message") setDirty((prev) => ({ ...prev, [field]: true }));
	};
	const mark = (form: HTMLFormElement, bad: boolean) => {
		form
			.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".form-field")
			.forEach((field) => field.classList.toggle("warning", bad && !field.value.trim()));
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		form.querySelectorAll(".form-field").forEach((field) => field.classList.remove("warning"));
		if (!values.name.trim() || !values.email.trim() || !values.subject.trim() || !values.message.trim()) {
			mark(form, true);
			Swal.fire({ title: "Ooops! Not so fast!", text: "Please fill in the highlighted fields.", icon: "warning", scrollbarPadding: false });
			return;
		}
		if (!isEmail(values.email.trim())) {
			form.querySelector<HTMLInputElement>("#email")?.classList.add("warning");
			Swal.fire({ title: "Email not valid!", text: "Please input a correct email address.", icon: "warning", scrollbarPadding: false });
			return;
		}
		await onSubmit({ name: values.name, email: values.email, subject: values.subject, message: values.message });
		setSent(true);
		// A mailto hand-off either hands the window to a mail client (which flips
		// document visibility) or silently does nothing. No false "sent!" claim —
		// if we're still visible a moment later, no client took it, so offer a
		// copyable fallback rather than letting the message disappear.
		window.setTimeout(() => {
			if (document.visibilityState === "visible") {
				setSent(false);
				setHandoffFailed(true);
			}
		}, 1500);
	};
	const copyMessage = async () => {
		const text = `${values.subject}\n\n${values.message}\n\n— ${values.name} (${values.email})`;
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// navigator.clipboard needs a secure context; this site is served over
			// plain HTTP, so fall back to a throwaway textarea + execCommand.
			const scratch = document.createElement("textarea");
			scratch.value = text;
			scratch.setAttribute("readonly", "");
			scratch.style.position = "fixed";
			scratch.style.opacity = "0";
			document.body.appendChild(scratch);
			scratch.select();
			document.execCommand("copy");
			scratch.remove();
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};
	const ready = values.name.trim() !== "" && isEmail(values.email.trim()) && values.subject.trim() !== "" && values.message.trim() !== "";
	const messageLength = values.message.trim().length;
	return (
		<section id="contact" className="section contact">
			<div className="bootstrap-container">
				<div className="contact-cmdbar" aria-hidden="true">
					<span className="contact-cmdbar-title">C:\contact\message.txt</span>
					<span className="contact-cmdbar-btns">
						<i className="btn-min" /> <i className="btn-max" /> <i className="btn-close" />
					</span>
				</div>
				<header className="contact-header">
					<span className="contact-kicker">{"// 03 — get in touch"}</span> <h1 className="contact-title">Contact me</h1>
					<p className="contact-lede">
						Have a system that needs connecting, or a pipeline that needs automating? Drop me a few lines and I&rsquo;ll get back to you
						quickly. Pick a command to start from a template.
					</p>
					<div className="cmd-chips" role="group" aria-label="Pick a starting point for your message">
						{CONTACT_COMMANDS.map((cmd) => (
							<button
								key={cmd.id}
								type="button"
								className={"cmd-chip" + (cmd.id === command.id ? " is-active" : "")}
								aria-pressed={cmd.id === command.id}
								onClick={() => selectCommand(cmd)}>
								{cmd.label}
							</button>
						))}
					</div>
					<p className="cmd-prompt">
						<span className="cmd-path">{command.path}</span> <span className="cmd-prompt-note">{command.note}</span>
						<span className="cmd-caret" aria-hidden="true" />
					</p>
				</header>
				<div className="contact-grid">
					<form className="sweet tx-form" id="contactform" name="contactform" method="post" onSubmit={handleSubmit} noValidate>
						{CONTACT_FIELDS.filter((field) => field !== "message").map((field) => (
							<div className="tx-field" key={field}>
								<label htmlFor={field}>{field}</label>
								<input
									className="form-field"
									id={field}
									name={field}
									type={field === "email" ? "email" : "text"}
									value={values[field]}
									placeholder={field === "name" ? "Your name" : field === "email" ? "you@domain.com" : "Subject"}
									autoComplete={field === "name" ? "name" : field === "email" ? "email" : "off"}
									ref={(el) => {
										fields.current[field] = el;
									}}
									onChange={(e) => update(field, e.target.value)}
								/>
							</div>
						))}
						<div className="tx-field">
							<label htmlFor="message">message</label>
							<textarea
								className="form-field"
								id="message"
								name="message"
								rows={7}
								value={values.message}
								placeholder="Type your message…"
								ref={(el) => {
									fields.current.message = el;
								}}
								onChange={(e) => update("message", e.target.value)}
							/>
						</div>
						<div className="tx-actions">
							<button type="submit" className="tx-submit" id="submit" name="submit" value="Submit">
								<i className="fa fa-paper-plane-o" aria-hidden="true" /> Send message
							</button>
							<span className="tx-hint">Opens in your mail app &mdash; you press send</span>
						</div>
						{handoffFailed ? (
							<div className="tx-fallback" role="status">
								<p className="tx-fallback-title">
									<i className="fa fa-exclamation-triangle" aria-hidden="true" /> Your mail app didn&rsquo;t open
								</p>
								<p className="tx-fallback-body">
									Some browsers block it, and there&rsquo;s no configured mail client on every machine. Copy the message and send
									it to <a href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a> from wherever you already email.
								</p>
								<button type="button" className="tx-copy" onClick={copyMessage}>
									<i className={"fa " + (copied ? "fa-check" : "fa-clipboard-o")} aria-hidden="true" /> {copied ? "Copied to clipboard" : "Copy message"}
								</button>
							</div>
						) : null}
					</form>
					<aside className="tx-panel" aria-hidden="true">
						<div className="tx-panel-head">
							<span className="tx-panel-label">transmission</span> <span className="tx-panel-cmd">{command.label}</span>
						</div>
						<dl className="tx-meta">
							<div>
								<dt>from</dt> <dd>{values.name.trim() || "—"}</dd>
							</div>
							<div>
								<dt>reply</dt> <dd>{values.email.trim() || "—"}</dd>
							</div>
							<div>
								<dt>subject</dt> <dd>{values.subject.trim() || "—"}</dd>
							</div>
						</dl>
						<pre className="tx-body">{values.message.trim() || "awaiting input…"}</pre>
						<div className="tx-panel-foot">
							<span className="tx-count">{messageLength} chars</span>
							<span className={"tx-state " + (sent ? "is-sent" : ready ? "is-ready" : "")}>
								<i /> {sent ? "handed to mail app" : ready ? "ready to send" : "incomplete"}
							</span>
						</div>
						<div className="whoami">
							<Image src="/images/eu.jpg" alt="" width={1100} height={1100} sizes="72px" className="whoami-avatar" />
							<div className="whoami-text">
								<span className="whoami-name">Victor Arsenie</span> <span className="whoami-role">Full-stack web developer</span>
								<span className="whoami-status">
									<i /> open to new work
								</span>
							</div>
						</div>
					</aside>
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
} // Matches the original jQuery smoothScroll: animate scroll to the section's
// document offset over 500ms with the default "swing" easing.
function smoothScrollTo(targetId: string) {
	const target = document.getElementById(targetId);
	if (!target) return;
	const nav = document.querySelector("nav.navbar-default");
	const offset = (nav?.getBoundingClientRect().height ?? 0) + 12;
	const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
	const startY = window.scrollY;
	const diff = targetY - startY;
	const duration = 500;
	const start = performance.now();
	const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2;
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		window.scrollTo(0, startY + diff * swing(t));
		if (t < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}
function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, targetId: string) {
	e.preventDefault();
	smoothScrollTo(targetId);
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
	const handleContactSubmit = async (formData: ContactFormData): Promise<void> => {
		// Hand the visitor a prefilled draft in their own mail client. This cannot
		// send on their behalf — the form deliberately makes no claim that it did.
		const subject = encodeURIComponent(formData.subject);
		const name = encodeURIComponent(formData.name);
		const email = encodeURIComponent(formData.email);
		const message = encodeURIComponent(formData.message);
		const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=From: ${name} (${email})%0D%0A%0D%0A${message}`;
		window.location.href = mailtoLink;
	};
	return (
		<main id="main-content" className="min-h-screen bg-white">
			<Navigation />
			<section id="home" className="relative min-h-screen overflow-hidden bg-stone-600">
				<ParallaxHeroBackground imageSrc="/images/bg-code-grain2.webp" mobileSrc="/images/bg-code-grain2-mobile.webp" alt="Background" />
				<CodeParticles />
				<div className="relative z-10 text-center text-white greeting">
					<h1 id="greet_1">Hi</h1> <h2 id="greet_2">I’m Victor</h2>
					<p id="greet_3">
						<Typewriter text="Full-stack developer. PHP → TypeScript." delay={2000} />
					</p>
					<p id="hero_role">
						Legacy migrations that don't break production.
					</p>
					<p id="hero_now">
						<span className="hero-now-dot" aria-hidden="true" /> Currently migrating legacy CodeIgniter to Next.js + TypeScript
					</p>
					<div className="flex justify-center" id="work-arrow">
						<a href="#work" onClick={(e) => handleAnchorClick(e, "work")} aria-label="View Work">
							<Image
								src="/images/cmd-hang-nails.png"
								alt="My Work"
								width={260}
								height={163}
								className="work-hang-img"
								loading="eager"
								style={{ width: "auto", height: "auto" }}
							/>
						</a>
					</div>
				</div>
			</section>
			<WorkSection />
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
							I work in the space between systems — wiring up billing platforms, backup software, DNS and support desks so data in one
							actually shows up in the others. Ten years of WHMCS add-ons and hooks, multi-API orchestration and automated data
							pipelines.
						</p>
						<p className="lead">
							Most of that work is invisible once it works. A property feed that ingests thousands of listings a night without anyone
							opening a spreadsheet. A magazine generated from live data instead of a designer. Support tickets that appear next to the
							server they belong to. I spend my time on the plumbing — schema mismatches, duplicate records, providers down at 3am — so
							nobody using it has to.
						</p>
						<p className="lead">
							Photoshop, Illustrator and Acrobat for the design side; Git, Sourcetree and JIRA for the work around the code.
						</p>
						<p className="lead">
							Currently migrating a decade of CodeIgniter to Next.js and TypeScript.
						</p>
					</div>
				</div>
			</section>
			<SkillsSection />
			<ContactConsole onSubmit={handleContactSubmit} />
			<Footer />
		</main>
	);
}
