// The secondary action on a case study: the public artifact behind the work.
// Most studies point at the live client site; the local-inference study points
// at its own written account; a product site that is gone points at an Internet
// Archive snapshot and says so. External links open in a new tab, the internal
// write-up does not. Rendered only when `link` is set, so a study whose artifact
// does not exist yet (the migration notes) shows nothing rather than a dead href.
export default function CaseLink({ href }: { href: string }) {
	const external = href.startsWith("http");
	const archived = external && href.includes("web.archive.org");
	return (
		<a
			className="case-link"
			href={href}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		>
			{!external ? "Read the write-up" : archived ? "View archived site" : "Visit site"}
			<i className="fa fa-long-arrow-right" aria-hidden="true" />
		</a>
	);
}
