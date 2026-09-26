"use client";

import { useRef, type ElementType, type MouseEvent, type ReactNode } from "react";

const MAX_TILT = 9;

export default function TiltCard({
	as: Tag = "div",
	className,
	href,
	target,
	rel,
	onClick,
	children,
}: {
	as?: ElementType;
	className?: string;
	href?: string;
	target?: string;
	rel?: string;
	onClick?: (e: MouseEvent<HTMLElement>) => void;
	children: ReactNode;
}) {
	const ref = useRef<HTMLElement>(null);

	const onMouseMove = (e: MouseEvent<HTMLElement>) => {
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
		<Tag
			ref={ref}
			className={className}
			href={href}
			target={target}
			rel={rel}
			onClick={onClick}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</Tag>
	);
}
