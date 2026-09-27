import type { MouseEvent } from "react";

// The site header is position:fixed (see Navigation), so a bare
// scrollIntoView would park the target section underneath it. Land just below
// the header instead. `swing` is the same 500ms ease-out the original site used.
const NAV_GAP = 12;

export function smoothScrollTo(targetId: string) {
	const target = document.getElementById(targetId);
	if (!target) return;
	const nav = document.querySelector("nav.navbar-default");
	const offset = (nav?.getBoundingClientRect().height ?? 0) + NAV_GAP;
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

export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, targetId: string) {
	e.preventDefault();
	smoothScrollTo(targetId);
}
