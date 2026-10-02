import type { MouseEvent } from "react";

// The site header is position:fixed (see Navigation), so a bare
// scrollIntoView would park the target section underneath it. Land the section
// flush against the nav's bottom edge instead, so the section top sits exactly
// on the nav's bottom line and the nav covers the previous section's tail.
// `swing` is the same 500ms ease-out the original site used.
export const NAV_GAP = 0;
// Scroll threshold (px ahead of #about's top) at which the nav collapses to its
// shorter .scrolled form. Kept in one place so scrolling and the active-section
// detector agree on how far the nav will be on arrival.
const NAV_COLLAPSE_LEAD = 90;

function navElement(): HTMLElement | null {
	return document.querySelector<HTMLElement>("nav.navbar-default");
}

export function navHeight(): number {
	return navElement()?.getBoundingClientRect().height ?? 0;
}

// Whether a potential scroll position has passed the hero and would leave the
// nav in its collapsed .scrolled state.
export function navCollapsedAt(scrollPosition: number): boolean {
	const about = document.getElementById("about");
	if (!about) return false;
	return scrollPosition > about.getBoundingClientRect().top + window.scrollY - NAV_COLLAPSE_LEAD;
}

// The .scrolled height, measured from a detached clone. The class is applied
// before the clone is inserted so no transition runs, and the clone is hidden
// off-screen so it never paints or affects layout while being measured.
function scrolledNavHeight(): number {
	const nav = navElement();
	if (!nav) return 0;
	const clone = nav.cloneNode(true) as HTMLElement;
	clone.classList.add("scrolled");
	clone.style.cssText = "position:absolute;visibility:hidden;top:-9999px;left:0;right:0;border:none;";
	document.body.appendChild(clone);
	const height = clone.getBoundingClientRect().height;
	clone.remove();
	return height;
}

export function smoothScrollTo(targetId: string) {
	const target = document.getElementById(targetId);
	if (!target) return;
	const targetEl = target;
	const targetDocTop = target.getBoundingClientRect().top + window.scrollY;
	const currentNav = navHeight();
	const provisional = targetDocTop - (currentNav + NAV_GAP);
	// The nav shrinks as the page leaves the hero, so the offset must be the
	// height it will have when the scroll settles, not the height it had when
	// the click happened.
	const arrivalNav = navCollapsedAt(provisional) ? scrolledNavHeight() : currentNav;
	const targetY = targetDocTop - (arrivalNav + NAV_GAP);
	const startY = window.scrollY;
	const diff = targetY - startY;
	const duration = 500;
	const start = performance.now();
	const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2;
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		window.scrollTo(0, startY + diff * swing(t));
		if (t < 1) requestAnimationFrame(step);
		else settle();
	};
	requestAnimationFrame(step);

	// The nav's collapse is its own 500ms transition, so it can still be
	// settling when the scroll animation ends every now and then - and the
	// browser clamps scroll positions to integers. Re-check against the nav's
	// settled height and nudge any leftover fraction, so the section lands
	// flush against the nav bottom no matter how the two timers overlap.
	// The nav's own .scrolled transition also runs ~500ms, and for an anchor
	// just past the collapse point it only starts as the scroll is ending. If we
	// corrected against the moving height we'd chase it up and down, so settle
	// waits for the nav height to stop changing, then nudge the leftover
	// fraction once the landing and the transition both stand still.
	function settle() {
		let lastNav = navHeight();
		let stableCount = 0;
		let attempts = 0;
		const timer = window.setInterval(() => {
			if (attempts++ >= 30) {
				window.clearInterval(timer);
				return;
			}
			const currentNav = navHeight();
			if (Math.abs(currentNav - lastNav) > 0.5) {
				lastNav = currentNav;
				stableCount = 0;
				return;
			}
			lastNav = currentNav;
			stableCount++;
			if (stableCount < 2) return;
			const top = targetEl.getBoundingClientRect().top;
			// Positive when the section sits below the nav bottom (a sliver of the
			// previous section visible above): scroll further down until flush.
			const correction = top - (currentNav + NAV_GAP);
			if (Math.abs(correction) <= 0.5) {
				window.clearInterval(timer);
				return;
			}
			window.scrollTo(0, window.scrollY + correction);
		}, 60);
	}
}

export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, targetId: string) {
	e.preventDefault();
	smoothScrollTo(targetId);
}