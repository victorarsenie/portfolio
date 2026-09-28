"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseStudyDetails, TechGroup } from "../lib/caseStudies";

// The full account, on demand. Built on the native <dialog> element rather than
// a div with a hand-rolled trap: showModal() puts it in the top layer, gives it
// a real focus trap, closes it on Escape, and restores focus to whatever opened
// it. All four of those are behaviours we would otherwise be maintaining by hand
// and getting subtly wrong.
//
// A single instance serves all eight cards, which is what makes "only one open at
// a time" structural rather than enforced — there is nothing to open a second of.
const SLIDE_MS = 200;

const GROUPS: { key: keyof TechGroup; label: string }[] = [
	{ key: "core", label: "Core" },
	{ key: "data", label: "Data" },
	{ key: "infra", label: "Infrastructure" },
];

/** Three labelled rows to say "PHP" under Core, "MySQL" under Data and
    "Cron" under Infrastructure is worse than one honest line, so a thin set
    collapses to the flat list instead. */
const MIN_GROUPED_ITEMS = 4;

function usableGroups(grouped: Partial<TechGroup> | undefined) {
	if (!grouped) return [];
	return GROUPS.flatMap(({ key, label }) => {
		const items = grouped[key];
		return items && items.length > 0 ? [{ key, label, items }] : [];
	});
}

export default function CaseStudyDrawer({
	title,
	meta,
	details,
	tech,
	onClose,
}: {
	title: string;
	meta: string;
	details: CaseStudyDetails | null;
	/** The summary's flat tech line, used as the fallback when the grouped
	    data is absent or too thin to be worth three labelled rows. */
	tech: readonly string[];
	onClose: () => void;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const [leaving, setLeaving] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Whatever had focus when the drawer opened. The browser restores focus to
	// the previously-focused element on close, but that element is not reliably
	// the card control: a tap on touch, or any activation that does not move
	// focus, leaves focus on <body> and the reader loses their place in the rail.
	const trigger = useRef<HTMLElement | null>(null);

	// Resolved from the details rather than trusted: every access is guarded, so
	// a half-filled or absent stackGrouped degrades to the flat line instead of
	// throwing inside the render and taking the whole drawer down with it.
	const groups = usableGroups(details?.stackGrouped);
	const groupedItems = groups.reduce((n, g) => n + g.items.length, 0);
	const flat = tech.filter(Boolean);
	const useGrouped = groupedItems >= MIN_GROUPED_ITEMS;
	// The invariant: a heading is only ever rendered when something follows it.
	const stackBody = useGrouped
		? groups.map(({ key, label, items }) => ({ key, label, text: items.join("  •  ") }))
		: flat.length > 0
			? [{ key: "flat", label: "", text: flat.join("  •  ") }]
			: [];

	// Open on mount of a selection, and hand the page its scroll back on teardown
	// or on a mid-animation close, so the body can never be left locked.
	useEffect(() => {
		const el = ref.current;
		if (details && el && !el.open) {
			// Captured before showModal, which is what moves focus inward.
			trigger.current = document.activeElement as HTMLElement | null;
			el.showModal();
			document.body.style.overflow = "hidden";
		}
		return () => {
			if (timer.current) clearTimeout(timer.current);
			document.body.style.overflow = "";
		};
	}, [details]);

	// Closing runs the same curve in reverse rather than snapping shut, so the
	// panel leaves the way it arrived. Escape is intercepted only to get that
	// timing; the dismissal itself is still the browser's.
	function requestClose() {
		const el = ref.current;
		if (!el?.open) return onClose();
		setLeaving(true);
		timer.current = setTimeout(() => {
			el.close();
			setLeaving(false);
			onClose();
			// Back to the card that opened this one, so a reader comparing two
			// studies can tab onward instead of restarting at the top.
			const back = trigger.current;
			if (back?.isConnected) back.focus();
			trigger.current = null;
		}, SLIDE_MS);
	}

	return (
		<dialog
			ref={ref}
			className={`case-drawer${leaving ? " case-drawer--leaving" : ""}`}
			aria-label={title}
			onCancel={event => {
				event.preventDefault();
				requestClose();
			}}
			onClick={event => {
				// The panel is the dialog's own box; a click that lands on the
				// element itself rather than the article is a click on the backdrop.
				if (event.target === ref.current) requestClose();
			}}
		>
			{details && (
				<article className="case-drawer-panel">
					<header className="case-drawer-head">
						<div>
							<p className="case-drawer-meta">{meta}</p>
							<h2 className="case-drawer-title">{title}</h2>
						</div>
						<button
							type="button"
							className="case-drawer-close"
							onClick={requestClose}
							aria-label="Close case study"
						>
							<i className="fa fa-times" aria-hidden="true" />
						</button>
					</header>

					<div className="case-drawer-body">
						<section className="case-drawer-section">
							<h3 className="case-drawer-label">The problem</h3>
							<p>{details.problem}</p>
						</section>

						<section className="case-drawer-section">
							<h3 className="case-drawer-label">The pipeline</h3>
							<p>{details.pipeline}</p>
						</section>

						<section className="case-drawer-section">
							<h3 className="case-drawer-label">Outcome</h3>
							<p className="case-drawer-outcome">{details.outcome}</p>
						</section>

					{/* Nothing below means no heading: an empty "Stack" label above a
					    blank space reads as a rendering fault, not a gap in the data. */}
					{stackBody.length > 0 && (
						<section className="case-drawer-section">
							<h3 className="case-drawer-label">Stack</h3>
							{useGrouped ? (
								/* Grouped rather than one flat list, so a reader can tell
								   the language from the datastore from the plumbing. */
								<dl className="case-drawer-stack">
									{stackBody.map(({ key, label, text }) => (
										<div key={key} className="case-drawer-stack-row">
											<dt>{label}</dt>
											<dd>{text}</dd>
										</div>
									))}
								</dl>
							) : (
								<p className="case-drawer-tech">{stackBody[0].text}</p>
							)}
						</section>
					)}
					</div>
				</article>
			)}
		</dialog>
	);
}
