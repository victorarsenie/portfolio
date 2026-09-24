"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
	text: string;
	delay?: number;
	speed?: number;
}

// Types the tagline out character-by-character after the greeting's entrance
// fade completes. With prefers-reduced-motion the full text shows instantly.
export default function Typewriter({ text, delay = 6000, speed = 55 }: TypewriterProps) {
	const [typed, setTyped] = useState("");

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			const id = window.requestAnimationFrame(() => setTyped(text));
			return () => window.cancelAnimationFrame(id);
		}
		let i = 0;
		let interval: number | undefined;
		const timer = window.setTimeout(() => {
			interval = window.setInterval(() => {
				i += 1;
				setTyped(text.slice(0, i));
				if (i >= text.length && interval) window.clearInterval(interval);
			}, speed);
		}, delay);
		return () => {
			window.clearTimeout(timer);
			if (interval) window.clearInterval(interval);
		};
	}, [text, delay, speed]);

	return (
		<span>
			{typed}
			<span className="typewriter-caret" aria-hidden="true">
				&#9612;
			</span>
		</span>
	);
}