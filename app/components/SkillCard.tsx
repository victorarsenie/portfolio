"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

const MAX_TILT = 9;

export default function SkillCard({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLLIElement>(null);

	const onMouseMove = (e: MouseEvent<HTMLLIElement>) => {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width - 0.5;
		const py = (e.clientY - r.top) / r.height - 0.5;
		el.style.setProperty("--rx", `${(-py * MAX_TILT).toFixed(2)}deg`);
		el.style.setProperty("--ry", `${(px * MAX_TILT).toFixed(2)}deg`);
	};

	const onMouseLeave = () => {
		const el = ref.current;
		if (!el) return;
		el.style.setProperty("--rx", "0deg");
		el.style.setProperty("--ry", "0deg");
	};

	return (
		<li ref={ref} className="skill-card" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
			{children}
		</li>
	);
}