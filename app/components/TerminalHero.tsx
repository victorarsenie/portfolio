function scrollToId(id: string) {
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function TerminalHero() {
	return (
		<section id="home" className="terminal-hero">
			<div className="terminal-hero-inner">
				<h1 className="terminal-hero-title">I make systems talk to each other.</h1>
				<p className="terminal-hero-sub">
					Years of wiring billing platforms, backup software, and support desks so data entered once actually shows up
					everywhere. I build the pipelines that turn chaos into clarity.
					<span className="terminal-hero-caret" aria-hidden="true" />
				</p>
				<div className="terminal-hero-ctas">
					<a
						className="terminal-hero-btn primary"
						href="#work"
						onClick={(e) => {
							e.preventDefault();
							scrollToId("work");
						}}
					>
						View the Plumbing
					</a>
					<a
						className="terminal-hero-btn ghost"
						href="#skills"
						onClick={(e) => {
							e.preventDefault();
							scrollToId("skills");
						}}
					>
						See My Stack
					</a>
				</div>
			</div>
		</section>
	);
}
