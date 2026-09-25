"use client";

import { useState, type ReactNode } from "react";

export default function HappyChip({ children }: { children: ReactNode }) {
	const [flipping, setFlipping] = useState(false);

	return (
		<span
			className={"skills-chip" + (flipping ? " is-flipping" : "")}
			onMouseEnter={() => {
				if (!flipping) setFlipping(true);
			}}
			onAnimationEnd={() => setFlipping(false)}
		>
			{children}
		</span>
	);
}