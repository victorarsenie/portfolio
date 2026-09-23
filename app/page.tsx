"use client";

import Image from "next/image";
import { Fragment, useState, useEffect, type MouseEvent } from "react";
import Swal from "sweetalert2";
import ParallaxHeroBackground from "./components/ParallaxHeroBackground";

// TypeScript interfaces for component props
interface Logo {
	label: string;
	src: string;
	alt: string;
}

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

// Skills navigation component
function SkillsTabs() {
	const [activeTab, setActiveTab] = useState("front-end");

	const skillsData = [
		{
			id: "front-end",
			title: "Front-end",
			icon: "fa fa-laptop",
			logos: [
				{ label: "HTML5", src: "/images/logos/html5.png", alt: "html" },
				{ label: "CSS3", src: "/images/logos/css3.png", alt: "css" },
				{ label: "JavaScript", src: "/images/logos/javascript.png", alt: "javascript" },
				{ label: "jQuery", src: "/images/logos/jquery.png", alt: "jquery" },
				{ label: "Bootstrap", src: "/images/logos/bootstrap.png", alt: "bootstrap" },
				{ label: "AJAX", src: "/images/logos/ajax.png", alt: "ajax" },
				{ label: "JSON", src: "/images/logos/json.png", alt: "json" },
				{ label: "XML", src: "/images/logos/xml.png", alt: "xml" },
			],
		},
		{
			id: "back-end",
			title: "Back-end",
			icon: "fa fa-database",
			logos: [
				{ label: "PHP", src: "/images/logos/php.png", alt: "php" },
				{ label: "MySQL", src: "/images/logos/mysql.png", alt: "mysql" },
				{ label: "CodeIgniter", src: "/images/logos/codeigniter.png", alt: "codeigniter" },
			],
		},
		{
			id: "version-control",
			title: "Version control",
			icon: "fa fa-code-fork",
			logos: [
				{ label: "SourceTree", src: "/images/logos/sourcetree.png", alt: "sourcetree" },
				{ label: "TortoiseSVN", src: "/images/logos/tortoisesvn.png", alt: "tortoisesvn" },
			],
		},
		{
			id: "bug-tracking",
			title: "Bug tracking",
			icon: "fa fa-code",
			logos: [{ label: "JIRA", src: "/images/logos/jira.png", alt: "jira" }],
		},
		{
			id: "design",
			title: "Design",
			icon: "fa fa-paint-brush",
			logos: [
				{ label: "Photoshop", src: "/images/logos/photoshop.png", alt: "photoshop" },
				{ label: "Illustrator", src: "/images/logos/illustrator.png", alt: "illustrator" },
				{ label: "Acrobat DC", src: "/images/logos/acrobat-dc.png", alt: "acrobat-dc" },
				{ label: "InDesign", src: "/images/logos/indesign.png", alt: "indesign" },
			],
		},
		{
			id: "software",
			title: "Software",
			icon: "fa fa-windows",
			text: "Windows (installing, troubleshooting, backup, maintenance), Adobe Acrobat Pro DC, Microsoft Visual Studio, Microsoft Office, Norton Partition Magic, memory diagnostic tools, data recovery tools",
		},
		{
			id: "hardware",
			title: "Hardware",
			icon: "fa fa-desktop",
			text: "PC components (building, troubleshooting), peripherals, audio-video, networking, electronics",
		},
	];

	return (
		<>
			<h1 className="skills-heading">
				<strong>Skills</strong>
			</h1>

			<div className="skill-tabs">
				<div className="w-1/4 tab-btn">
					<ul className="tabs-left">
						{skillsData.map((skill) => (
							<li key={skill.id} className={activeTab === skill.id ? "active" : ""}>
								<a
									href={`#${skill.id}`}
									onClick={(e) => {
										e.preventDefault();
										setActiveTab(skill.id);
									}}
									className="no-underline"
								>
									<i className={skill.icon} aria-hidden="true"></i>&nbsp; {skill.title}
								</a>
							</li>
						))}
					</ul>
				</div>

				<div className="w-3/4 tab-panel">
					<div className="tab-content">
						{skillsData.map(
							(skill) =>
								skill.id === activeTab &&
								(skill.logos ? (
									<div key={skill.id} id={skill.id} className="tab-pane">
										<div className="grid grid-cols-4 justify-items-center items-center">
											{skill.logos.map((logo) => (
												<Image
													key={logo.label}
													src={logo.src}
													alt={logo.alt}
													width={100}
													height={100}
												/>
											))}
										</div>
									</div>
								) : (
									<div key={skill.id} id={skill.id} className="tab-pane">
										<p>{skill.text}</p>
									</div>
								))
						)}
					</div>
				</div>
			</div>

			<ul className="skill-tabs-mobile">
				{skillsData.map((skill) => (
					<li key={skill.id} className="skill-tabs-mobile-item">
						{skill.title}
						<br />
						{skill.logos ? (
							skill.logos.map((logo) => (
								<Image
									key={logo.label}
									src={logo.src}
									alt={logo.alt}
									width={100}
									height={100}
								/>
							))
						) : (
							<p>{skill.text}</p>
						)}
					</li>
				))}
			</ul>
		</>
	);
}

// Employment component renders the two-column row used in the work section.
function EmploymentRow({ entry }: { entry: WorkEntry }) {
	return (
		<>
			<div className="col-sm-12 col-md-6">
				<img className="img" src={entry.photo} alt={entry.photoAlt} width={555} height={375} />
			</div>
			<div className="col-sm-12 col-md-6 half">
				<div className="screenshot">
					<a href={entry.siteUrl} target="_blank" rel="noopener noreferrer">
						<img src={entry.screenshot} alt={entry.screenshotAlt} width={585} height={396} />
					</a>
					<div className="screenshot-caption screenshot-caption_top">
						<h3>{entry.title}</h3>
						<p className="lead">{entry.duration}</p>
						<a href={entry.siteUrl} target="_blank" rel="noopener noreferrer">
							Visit website
						</a>
					</div>
				</div>
			</div>
		</>
	);
}

// Work section component - mirrors the original site's live structure:
// an "Employment" heading, one 2-column row + one projects block per job,
// and a left-aligned "Old website" link at the bottom.
function WorkSection() {
	return (
		<section id="work" className="section work">
			<div className="max-w-[1170px] mx-auto px-[15px]">
				<div className="page-header">
					<h1>
						<strong>My work</strong>
					</h1>
					<p className="lead">
						I enjoy equally working on front-end and back-end. I provide quality work, fully responsive
						websites, cross-browser compliant with extensive testing on all platforms and modular components
						easily maintainable. I have a good eye for detail and knowledge of design and usability.
					</p>
				</div>

				{workData.map((entry, index) => (
					<Fragment key={entry.title}>
						{index === 0 ? (
							<div className="employment">
								<h1>Employment</h1>
								<div className="row">
									<EmploymentRow entry={entry} />
								</div>
							</div>
						) : (
							<div className="row">
								<EmploymentRow entry={entry} />
							</div>
						)}

						<div className="projects">
							<div className="row work-bg">
								<div className="col-md-12">
									<h2>
										<i className="fa fa-at" aria-hidden="true"></i> {entry.title}
									</h2>
									<p className="lead">{entry.blurb}</p>
								</div>
								{entry.projects?.map((project) => (
									<Fragment key={project.heading}>
										<div className="col-md-12">
											<h1>{project.heading}</h1>
										</div>
										<div className="col-md-6">
											<a href={project.link} target="_blank" rel="noopener noreferrer">
												<img src={project.image} alt={project.imageAlt} width={555} height={416} />
											</a>
										</div>
										<div className="col-md-6">
											<h2>{project.title}</h2>
											{project.paragraphs.map((paragraph, i) => (
												<p key={i}>{paragraph}</p>
											))}
										</div>
									</Fragment>
								))}
							</div>
						</div>

						{/* Spacer between employment blocks, like the original site */}
						{index < workData.length - 1 ? <><br /><br /><br /></> : null}
					</Fragment>
				))}

				{/* Spacing between the last projects block and the Old website link */}
				<br />
				<br />
				<a className="old-site" href="/old_website/" target="_blank" rel="noopener noreferrer">
					<p className="lead">Old website</p>
				</a>
			</div>
		</section>
	);
}

// Contact form component — mirrors the original's validation and SweetAlert
// messages: highlight empty fields with .warning, then SweetAlert prompts.
function ContactForm({ onSubmit }: { onSubmit: (formData: ContactFormData) => Promise<void> }) {
	const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = Object.fromEntries(new FormData(form)) as unknown as ContactFormData;

		form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".form-field").forEach((field) => field.classList.remove("warning"));

		if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
			Swal.fire("Ooops! Not so fast!", "Please fill in the highlighted fields.", "warning");

			form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".form-field").forEach((field) => {
				if (!field.value.trim()) field.classList.add("warning");
			});
			return;
		}

		if (!isEmail(formData.email.trim())) {
			Swal.fire("Email not valid!", "Please input a correct email address.", "warning");
			form.querySelector<HTMLInputElement>("#email")?.classList.add("warning");
			return;
		}

		await onSubmit(formData);
		Swal.fire("Your message has been sent!", "Sit back and relax, you're in good hands now.", "success");
	};

	return (
		<form
			className="sweet"
			method="post"
			name="contactform"
			id="contactform"
			onSubmit={handleSubmit}
			noValidate
		>
			<div className="col-md-6">
				<p style={{ color: "red" }} id="errorMessage"></p>
				<fieldset>
					<input className="form-field" name="name" type="text" id="name" size={30} placeholder="Name" />
					<input className="form-field" name="email" type="email" id="email" size={30} placeholder="Email" />
					<input className="form-field" name="subject" type="text" id="subject" size={30} placeholder="Subject" />
				</fieldset>
			</div>
			<div className="col-md-6">
				<p></p>
				<fieldset>
					<textarea className="form-field" name="message" cols={40} rows={20} id="message" placeholder="Message"></textarea>
				</fieldset>
			</div>
			<div className="col-md-12">
				<fieldset>
					<button name="submit" type="submit" className="btn btn-lg" id="submit" value="Submit">
						<i className="fa fa-paper-plane-o" aria-hidden="true"></i>&nbsp; Send Message
					</button>
				</fieldset>
			</div>
		</form>
	);
}

// Footer component — mirrors the original footer structure and icons.
function Footer() {
	return (
		<footer className="bg-[#737373] text-white">
			<div className="container max-w-[1170px] mx-auto px-[15px]">
				<div className="row">
					<div className="col-md-6">
						<div className="footer-logo">
							<img src="/images/logo.png" alt="Victor Arsenie" className="w-[70px] h-auto" />
						</div>
						<div className="footer-contact">
							<p>
								<i className="fa fa-phone-square" aria-hidden="true"></i>&nbsp;{" "}
								<a className="phone" href="tel:+447761325270">+44 7761 325 279</a>
							</p>
							<p>
								<i className="fa fa-envelope" aria-hidden="true"></i>&nbsp;{" "}
								<a className="email" href="mailto:victor.arsenie@yahoo.com">victor.arsenie@yahoo.com</a>
							</p>
						</div>
					</div>
					<div className="col-md-6 social">
						<a href="https://www.facebook.com/arsenie.victoralexandru" target="_blank" rel="noopener noreferrer">
							<div id="facebook"></div>
						</a>
						<a href="https://www.linkedin.com/in/victor-arsenie-391a3bb7/" target="_blank" rel="noopener noreferrer">
							<div id="linkedin"></div>
						</a>
					</div>
				</div>
				<div className="copy">
					<em>
						<i className="fa fa-copyright" aria-hidden="true"></i> Victor Alexandru Arsenie - {new Date().getFullYear()}
					</em>
				</div>
			</div>
		</footer>
	);
}

// Matches the original jQuery smoothScroll: animate scroll to the section's
// document offset over 500ms with the default "swing" easing.
function smoothScrollTo(targetId: string) {
	const target = document.getElementById(targetId);
	if (!target) return;
	const targetY = target.getBoundingClientRect().top + window.scrollY;
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
}

// Scroll back to the top, matching the original's "slow" (600ms) animation.
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
}

// Navigation component
function Navigation() {
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("");
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const about = document.getElementById("about");
			if (!about) return;
			const aboutTop = about.getBoundingClientRect().top + window.scrollY;
			setScrolled(window.scrollY > aboutTop - 90);

			const scrollPosition = window.scrollY;
			setShowScrollTop(scrollPosition > 600);

			let current = "";
			for (const section of ["about", "work", "contact"]) {
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

		return <>
			<nav
				className={`navbar-default fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'scrolled' : ''}`}
				style={{ border: 'none' }}
			>
			<div className="relative max-w-[1170px] px-[15px] mx-auto flex items-center justify-between">
				<div className="navbar-header">
					<a href="#home" className="navbar-brand">
						<Image src="/images/logo-text.png" alt="Victor Arsenie" width={208} height={36} />
					</a>
				</div>
				<ul className="navbar-nav flex list-none">
					{[['about', 'About'], ['work', 'Work'], ['contact', 'Contact']].map(([section, label]) => (
						<li key={section} className={activeSection === section ? 'active' : undefined}>
							<a
								href={`#${section}`}
								onClick={(e) => handleAnchorClick(e, section)}
								className="block transition-colors duration-200 no-underline"
								style={{
									fontFamily: "'Hype', serif",
									color: scrolled ? '#fff' : '#fff',
								}}
							>
								{label}
							</a>
						</li>
					))}
				</ul>
</div>
		</nav>
		<div
			className={`scroll-top ${showScrollTop ? 'show' : ''}`}
			onClick={scrollToTop}
			aria-label="Scroll to top"
			role="button"
		></div>
	</>;
}

// Work section data — mirrors the original site's live work section.
interface WorkProject {
	heading: string;
	image: string;
	imageAlt: string;
	link: string;
	title: string;
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
			"CompuWeb Communications Services is a managed hosting specialist with thousands of clients across the world. I work as the sole developer on everything related to frontend, backend and design. My tasks include maintaining and improving of the website, designing (promotional) banners and social media images, creating PDF datasheets and working on internal systems. For design and datasheets I've been using Photoshop, Illustrator and Adobe Acrobat DC, including working with isometric vectors. I am constantly working with the WHMCS billing and support system, which includes creating custom reports and add-ons, improving and adding new functionalities. I've also worked with APIs to make user-friendly systems for data manipulation with specific functionality for R1Soft, Cloudflare and Freshdesk.",
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
			"I've been working with a great team of developers, designers and content creators who were also amazing colleagues. During this time, I have developed websites, created email signatures, magazine templates with TCPDF, CMS, SEO, managed databases for estate agents with thousands of properties imported daily from data providers and also did customer support, using Team Viewer for remote access. I have built custom CMS to meet the needs of the client; banner systems where the client can select what banner to show when, to use for promotional periods; valuation tools with the use of API's to get the address using the postcode and get the price range using the address and property details. I have worked closely with the design team to produce the best outcome in the most efficient way.",
		projects: [
			{
				heading: "Websites",
				image: "/images/nkres.png",
				imageAlt: "NKRES",
				link: "http://www.nkres.co.uk/",
				title: "Neil King Residential",
				paragraphs: [
					"Fully responsive website based on a premium template with custom CMS to meet the client's needs.",
					"It benefits of a custom search systems to help users search easily for the desired property and a custom banner system where the client can add an unlimited number of banners for different promotions, change the order and select the period of time for the banner to be live on the website.",
				],
			},
			{
				heading: "Magazines",
				image: "/images/mag.png",
				imageAlt: "magazine",
				link: "http://www.digitalmag.co.uk/mag/bseenmagazine",
				title: "One of hundreds of monthly magazines",
				paragraphs: [
					"Magazine created by the client with the use of our system. The system involves importing the client's properties from data providers, usually as XML files",
					"I have built the HTML and PDF template using the Indesign document created by the design team. Once applyed to the client's account, the client can simply go to the system, add pages, drag the properties to the desired pages and create the magazine with the push of a button. The can then be accessed live as a page turner and the client has the options of printing.",
				],
			},
			{
				heading: "Instant Online Valuations",
				image: "/images/outlook.png",
				imageAlt: "valuation",
				link: "http://outlook.mypropertyprices.com/",
				title: "Online property valuation for estate agents",
				paragraphs: [
					"With the use of API's I get the property address by sending the postcode and the property valuation by sending the address and details.",
					"The valuation can be either shown after all the fields have been filled or sent to the user by email.",
				],
			},
			{
				heading: "Email Signatures",
				image: "/images/morganalexandersig.gif",
				imageAlt: "signature",
				link: "/images/morganalexandersig.gif",
				title: "One of hundreds of email signatures",
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
			"Working at Key Element I have been part of large and small projects, but mostly I had my own projects which consisted of building websites from scratch and integrating them with our bespoke CMS. During this time I have used HTML 5, CSS 3, JavaScript, JQuery, AJAX and JSON for the front-end. For the back-end I have used PHP and MySQL. I have also used Source Tree for version control and JIRA for bug tracking.",
	},
];

// Page header component for all sections
export default function HomePage() {

	const handleContactSubmit = async (formData: ContactFormData): Promise<void> => {
		const subject = encodeURIComponent(formData.subject);
		const name = encodeURIComponent(formData.name);
		const email = encodeURIComponent(formData.email);
		const message = encodeURIComponent(formData.message);

		const mailtoLink = `mailto:contact@victorsenie.com?subject=${subject}&body=From: ${name} (${email})%0D%0A${message}`;
		window.location.href = mailtoLink;
	};

	return (
		<main className="min-h-screen bg-white">
			<Navigation />

			<section id="home" className="relative min-h-screen overflow-hidden bg-stone-600">
				<ParallaxHeroBackground imageSrc="/images/bg.webp" alt="Background" />
				<div className="relative z-10 text-center text-white greeting">
					<h1 id="greet_1">Hi</h1>
					<h2 id="greet_2">I'm Victor</h2>
					<p id="greet_3">a computer geek who likes to code</p>
					<div className="flex justify-center" id="work-arrow">
						<a href="#work" onClick={(e) => handleAnchorClick(e, "work")}>
							<Image
								src="/images/work-arrow.png"
								alt="View Work"
								width={140}
								height={80}
								className="transition-transform hover:scale-110"
							/>
						</a>
					</div>
				</div>
			</section>

			<section id="about" className="pt-5 pb-20 bg-white">
				<div className="max-w-[1170px] mx-auto px-[15px]">
					<div className="page-header">
						<h1>About me</h1>
						<p className="lead"><a id="my_cv" href="/documents/cv.docx" target="_blank" rel="noopener noreferrer"><Image src="/images/cv.png" alt="Download my CV" width={66} height={87} className="inline float-left mr-[15px]" /></a> I am a full-stack web developer with a great passion for coding. I enjoy creating websites of all kinds, with high attention to details. I can develop high quality websites from scratch, fully responsive with a 'mobile first' approach or add a bit of Wow factor and make them 'mobile friendly'.</p>
						<p className="lead">I have always been passionate about computers and had the ability to learn fast on my own, being able to manage any problems I encountered. I am always searching for ways to improve and increase efficiency. I love technology and I am always up to date with what comes out. I have a strong attention to details and I am very determined to get anything I do to high standards and improve where necessary. I have always been the geek of the group and people came to me when they needed help. I love to travel and to drive, but not in London. I like computer games, VR and watching films on my 100" screen LED projector. My newest additions to my hobbies are VR and FPV quad copters.</p>
					</div>
					<SkillsTabs />
				</div>
			</section>

			<WorkSection />

			<section className="section">
				<div id="contact" className="container max-w-[1170px] mx-auto px-[15px]">
					<div className="page-header">
						<h1>
							<strong>Contact me</strong>
						</h1>
						<p className="lead">
							If you have any queries, or just want to say hi, drop me a few lines and I'll get back to you in no time.
						</p>
					</div>
					<div className="row">
						<div className="col-md-12">
							<h2>Get in touch</h2>
						</div>
					</div>
					<div className="row">
						<ContactForm onSubmit={handleContactSubmit} />
					</div>
					<div className="eu">
						<img src="/images/eu.jpg" alt="Victor Arsenie" />
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
