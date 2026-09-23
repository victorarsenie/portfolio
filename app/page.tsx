"use client";

import Image from "next/image";
import { useState, useEffect, type MouseEvent } from "react";
import ParallaxHeroBackground from "./components/ParallaxHeroBackground";

// TypeScript interfaces for component props
interface Logo {
	label: string;
	src: string;
	alt: string;
}

interface Project {
	title: string;
	images?: string[];
	links?: { url: string; text: string; alt: string }[];
	description: string;
}

interface Employment {
	company: string;
	duration: string;
	description: string;
	imageSrc: string;
	website?: string;
	projects?: Project[];
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

// Employment card component
function EmploymentCard({ employment }: { employment: Employment }) {
	return (
		<section className="mb-12">
			<div className="flex flex-col md:flex-row gap-8 items-start">
				<div className="md:w-1/2 relative">
					<Image
						src={employment.imageSrc}
						alt={employment.company}
						width={600}
						height={400}
						className="rounded-lg shadow-lg"
					/>
					{employment.website && (
						<div className="absolute -bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
							<a
								href={employment.website}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 font-bold hover:underline"
							>
								Visit {employment.company}
							</a>
						</div>
					)}
				</div>
				<div className="md:w-1/2 md:ml-12">
					<h3 className="text-xl font-bold mb-2">{employment.company}</h3>
					<p className="text-sm text-gray-500 mb-4">{employment.duration}</p>
					<p className="text-gray-700">{employment.description}</p>
				</div>
			</div>

			{employment.projects && employment.projects.length > 0 && (
				<div className="mt-8">
					{employment.projects.map((project, index) => (
						<article key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
							{project.links && project.links.length > 0 && (
								<div className="flex flex-col justify-center">
											{project.links.map((link, i) => (
												<a
													key={i}
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="block mb-4"
												>
													<img
														src={link.url}
														alt={link.alt}
														width={400}
														height={300}
														className="rounded-lg shadow-md"
														style={{ border: '0' }}
													/>
												</a>
											))}
								</div>
							)}
							<div>
								<h4 className="text-lg font-bold mb-2">{project.title}</h4>
								{project.description.split("\n\n").map((paragraph, i) => (
									<p key={i} className="text-gray-700 mb-4">
										{paragraph}
									</p>
								))}
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	);
}

// Contact form component
function ContactForm({ onSubmit }: { onSubmit: (formData: ContactFormData) => Promise<void> }) {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.currentTarget));
		await onSubmit(formData as unknown as ContactFormData);
	};

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div>
				<input
					type="text"
					name="name"
					placeholder="Name"
					required
					className="w-full p-3 border rounded-lg mb-4 text-base"
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					required
					className="w-full p-3 border rounded-lg mb-4 text-base"
				/>
				<input
					type="text"
					name="subject"
					placeholder="Subject"
					required
					className="w-full p-3 border rounded-lg mb-4 text-base"
				/>
			</div>
			<div>
				<textarea
					name="message"
					placeholder="Message"
					required
					rows={10}
					className="w-full p-3 border rounded-lg mb-4 text-base"
				/>
			</div>
			<div className="col-span-2">
				<button
					type="submit"
					className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
				>
					Send Message
				</button>
			</div>
		</form>
	);
}

// Footer component
function Footer() {
	return (
		<footer className="bg-[#737373] text-white py-20">
			<div className="container mx-auto relative">
				<div className="flex flex-col md:flex-row items-center justify-between mb-8">
					<div className="flex items-center">
						<div className="footer-logo">
							<img src="/images/logo.png" alt="Victor ARsenie" className="w-[70px] h-auto" />
						</div>
						<div className="footer-contact">
							<a href="tel:+447761325270" className="text-white hover:text-blue-400 block mb-1">+44 7761 325 279</a>
							<a href="mailto:victor.arsenie@yahoo.com" className="text-white hover:text-blue-400">victor.arsenie@yahoo.com</a>
						</div>
					</div>
					<div className="flex gap-4">
						<a href="https://www.facebook.com/arsenie.victoralexandru" target="_blank" rel="noopener noreferrer">
							<img src="/images/social-sprite.png" alt="Facebook" className="w-10 h-10 cursor-pointer" />
						</a>
						<a href="https://www.linkedin.com/in/victor-arsenie-391a3bb7/" target="_blank" rel="noopener noreferrer">
							<img src="/images/social-sprite.png" alt="LinkedIn" className="w-10 h-10 cursor-pointer" />
						</a>
					</div>
				</div>
				<div className="border-t border-white pt-10 mt-10 text-center">
					<em>© Victor Alexandru Arsenie - {new Date().getFullYear()}</em>
				</div>
			</div>
		</footer>
	);
}// Page header component for all sections
function PageHeader({ title, description }: { title: string; description?: string }) {
	return (
		<div className="text-center mb-12">
			<h1 className="text-3xl" style={{ fontFamily: "'Hype', serif", margin: 0, marginBottom: "40px", color: "#26adf4" }}>{title}</h1>
			{description && <p className="text-lg text-gray-600 mt-4">{description}</p>}
		</div>
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

// Page header component for all sections
export default function HomePage() {
	const employmentData: Employment[] = [
		{
			company: "CWCS (CompuWeb Communications Services)",
			duration: "August 2017 - February 2021",
			description:
				"CompuWeb Communications Services is a managed hosting specialist with thousands of clients across the world. I work as the sole developer on everything related to frontend, backend and design. My tasks include maintaining and improving of the website, designing (promotional) banners and social media images, creating PDF datasheets and working on internal systems. For design and datasheets I've been using Photoshop, Illustrator and Adobe Acrobat DC, including working with isometric vectors. I am constantly working with the WHMCS billing and support system, which includes creating custom reports and add-ons, improving and adding new functionalities. I've also worked with APIs to make user-friendly systems for data manipulation with specific functionality for R1Soft, Cloudflare and Freshdesk.",
			imageSrc: "/images/cwcs-employment.png",
			website: "https://www.cwcs.co.uk/",
			projects: [
				{
					title: "CWCS Website",
					description:
						"CompuWeb Communications Services is a managed hosting specialist with thousands of clients across the world. I work as the sole developer on everything related to frontend, backend and design.",
					links: [
						{
							url: "https://www.cwcs.co.uk/",
							text: "Visit website",
							alt: "CWCS website",
						},
					],
				},
			],
		},
		{
			company: "Iceberg Digital",
			duration: "March 2016 - May 2017",
			description:
				"I've been working with a great team of developers, designers and content creators who were also amazing colleagues. During this time, I have developed websites, created email signatures, magazine templates with TCPDF, CMS, SEO, managed databases for estate agents with thousands of properties imported daily from data providers and also did customer support, using Team Viewer for remote access. I have built custom CMS to meet the needs of the client; banner systems where the client can select what banner to show when, to use for promotional periods; valuation tools with the use of API's to get the address using the postcode and get the price range using the address and property details.",
			imageSrc: "/images/iceberg-employment.png",
			website: "http://www.iceberg-digital.co.uk/",
			projects: [
				{
					title: "Neil King Residential (NKRES)",
					description: `Fully responsive website based on a premium template with custom CMS to meet the client's needs.\n\nIt benefits of a custom search systems to help users search easily for the desired property and a custom banner system where the client can add an unlimited number of banners for different promotions, change the order and select the period of time for the banner to be live on the website.`,
					links: [
						{
							url: "http://www.nkres.co.uk/",
							text: "NKRES",
							alt: "NKRES",
						},
					],
				},
				{
					title: "Monthly Magazines",
					description: `Magazine created by the client with the use of our system. The system involves importing the client's properties from data providers, usually as XML files.\n\nI have built the HTML and PDF template using the Indesign document created by the design team. Once applyed to the client's account, the client can simply go to the system, add pages, drag the properties to the desired pages and create the magazine with the push of a button. The can then be accessed live as a page turner and the client has the options of printing.`,
					links: [
						{
							url: "http://www.digitalmag.co.uk/mag/bseenmagazine",
							text: "magazine",
							alt: "magazine",
						},
					],
				},
				{
					title: "Online Property Valuation",
					description: `With the use of API's I get the property address by sending the postcode and the property valuation by sending the address and details.\n\nThe valuation can be either shown after all the fields have been filled or sent to the user by email.`,
					links: [
						{
							url: "http://outlook.mypropertyprices.com/",
							text: "valuation",
							alt: "valuation",
						},
					],
				},
				{
					title: "Email Signatures",
					description: `All signatures are made to fit the customers' needs and to work on any device.\n\nThe magazine image on the signature is automatically being updated when the client creates a new magazine.`,
					links: [
						{
							url: "/images/morganalexandersig.gif",
							text: "signature",
							alt: "signature",
						},
					],
				},
			],
		},
		{
			company: "KeyElement",
			duration: "June 2015 - December 2015",
			description:
				"Working at Key Element I have been part of large and small projects, but mostly I had my own projects which consisted of building websites from scratch and integrating them with our bespoke CMS. During this time I have used HTML 5, CSS 3, JavaScript, JQuery, AJAX and JSON for the front-end. For the back-end I have used PHP and MySQL. I have also used Source Tree for version control and JIRA for bug tracking.",
			imageSrc: "/images/keyelement-employment.png",
			website: "http://www.keyelement.co.uk/",
		},
	];

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

			<section id="work" className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<PageHeader
						title="My work"
						description="I enjoy equally working on front-end and back-end. I provide quality work, fully responsive websites, cross-browser compliant with extensive testing on all platforms and modular components easily maintainable. I have a good eye for detail and knowledge of design and usability."
					/>
					<h2 className="text-2xl font-bold mb-8">Employment</h2>
					{employmentData.map((employment, index) => (
						<EmploymentCard key={index} employment={employment} />
					))}

					<div className="mt-12 text-center">
						<a href="/old_website/" target="_blank" className="text-blue-600 font-bold hover:underline">
							Old website
						</a>
					</div>
				</div>
			</section>

			<section id="contact" className="py-12 bg-white">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<PageHeader
						title="Contact me"
						description="If you have any queries, or just want to say hi, drop me a few lines and I'll get back to you in no time."
					/>
					<h2 className="text-2xl font-bold mb-8">Get in touch</h2>
					<ContactForm onSubmit={handleContactSubmit} />
					<div className="mt-12">
						<Image
							src="/images/eu.jpg"
							alt="Victor Arsenie"
							width={800}
							height={600}
							className="rounded-lg shadow-lg"
						/>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
