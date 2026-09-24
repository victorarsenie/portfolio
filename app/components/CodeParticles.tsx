"use client";

import { useEffect, useRef } from "react";

interface CodeParticlesProps {
	count?: number;
}

const GLYPHS = ["</>", "{ }", "[ ]", "=>", "const", "let", "$", "#", "01", "~", "&&", "()", "..."];

interface Particle {
	x: number;
	y: number;
	size: number;
	speed: number;
	sway: number;
	phase: number;
	glyph: string;
	accent: boolean;
	opacity: number;
}

// Code-symbol particles drifting slowly upward over the hero photo.
// Canvas-based so it stays cheap at scale; pauses when the hero is off-screen
// or the tab is hidden; honours prefers-reduced-motion.
export default function CodeParticles({ count = 0 }: CodeParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let w = 0;
		let h = 0;
		let running = false;
		let raf = 0;

		const resize = () => {
			w = Math.max(canvas.clientWidth, 1);
			h = Math.max(canvas.clientHeight, 1);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();

		const target = count > 0 ? count : Math.round(Math.min(70, Math.max(18, w / 24)));
		const particles: Particle[] = Array.from({ length: target }, () => {
			const size = 13 + Math.random() * 15;
			const accent = Math.random() < 0.15;
			return {
				x: Math.random() * w,
				y: Math.random() * h,
				size,
				speed: 10 + Math.random() * 18,
				sway: 6 + Math.random() * 10,
				phase: Math.random() * Math.PI * 2,
				glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
				accent,
				opacity: accent ? 0.45 + Math.random() * 0.15 : 0.28 + Math.random() * 0.17,
			};
		});

		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			ctx.clearRect(0, 0, w, h);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			for (const p of particles) {
				p.y -= p.speed * dt;
				p.phase += dt;
				if (p.y < -40) {
					p.y = h + 40;
					p.x = Math.random() * w;
				}
				const px = p.x + Math.sin(p.phase) * p.sway;
				ctx.font = `400 ${p.size}px "Courier New", monospace`;
				ctx.fillStyle = p.accent
					? `rgba(38, 173, 244, ${p.opacity})`
					: `rgba(255, 255, 255, ${p.opacity})`;
				ctx.fillText(p.glyph, px, p.y);
			}
			if (running) raf = requestAnimationFrame(tick);
		};

		const start = () => {
			if (running) return;
			running = true;
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(raf);
		};

		new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) start();
				else stop();
			},
			{ threshold: 0 }
		).observe(canvas);

		const onResize = () => resize();
		const onVisibility = () => (document.hidden ? stop() : start());
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			stop();
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [count]);

	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
			aria-hidden="true"
		/>
	);
}