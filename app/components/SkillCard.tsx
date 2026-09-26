"use client";

import type { ReactNode } from "react";
import TiltCard from "./TiltCard";

export default function SkillCard({ children }: { children: ReactNode }) {
	return (
		<TiltCard as="li" className="skill-card">
			{children}
		</TiltCard>
	);
}
