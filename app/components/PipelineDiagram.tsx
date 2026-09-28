"use client";

import { useId, type CSSProperties } from "react";
import type { CaseTopology } from "../lib/caseStudies";

// A schematic of the plumbing, not a picture of it: thin grey rails that draw
// themselves in, then accent dots run along them. The geometry is declared once
// in TOPOLOGY_CONFIG, because the shape is the argument: a chain runs one way,
// a cycle closes on itself, a sync is a two-way exchange.
//
// Each topology is a single continuous path rather than a path per segment, so
// the dots form one unbroken stream with no gap at the joints, and a cycle gets a
// genuinely circular dot loop instead of four arcs restarting out of step.
//
// Dot speed is identical in all three. That falls out of the dash pattern
// rather than needing per-rail tuning: the pattern has a fixed 24-unit period
// and the animation shifts it by exactly five of those periods, so the loop is
// seamless, and because both the period and the duration are constant the dots
// cover the same ground in the same time on a 780-unit loop and a 440-unit
// chain. Only the reveal differs, because each rail animates over its own
// measured length.

const VIEW_W = 600;

/** Dash pattern period. Fixed, so dot speed never varies between topologies. */
const DOT_PERIOD = 24;
const DOT_PERIODS_PER_RUN = 5;
const DOT_RUN_SECONDS = 2;
/** 5 Ã— 24 units over 2s. Divided out so CSS and the comment cannot drift. */
const DOT_TRAVEL = DOT_PERIOD * DOT_PERIODS_PER_RUN;

interface Pt {
	x: number;
	y: number;
}

interface NodeSpot extends Pt {
	/** Baseline of the label, and which side of the node it sits on. */
	labelY: number;
	anchor: "middle" | "start" | "end";
}

type RailSpec =
	| { kind: "line"; points: Pt[]; closed?: boolean }
	| { kind: "curve"; p0: Pt; c1: Pt; c2: Pt; p3: Pt };

interface TopologyConfig {
	description: string;
	height: number;
	spots: NodeSpot[];
	rails: RailSpec[];
	/** Bidirectional rails carry arrowheads; a chain and a cycle rely on dots. */
	arrows: boolean;
}

// The three shapes. Coordinates live in a 600-unit viewBox, which is what the
// diagram scales into, so the label bands are placed to clear both the node
// rings and the rail the label belongs to.
const TOPOLOGY_CONFIG: Record<CaseTopology, TopologyConfig> = {
	chain: {
		description: "Sequential processing",
		height: 128,
		spots: [
			{ x: 80, y: 58, labelY: 108, anchor: "middle" },
			{ x: 300, y: 58, labelY: 108, anchor: "middle" },
			{ x: 520, y: 58, labelY: 108, anchor: "middle" },
		],
		rails: [{ kind: "line", points: [{ x: 80, y: 58 }, { x: 300, y: 58 }, { x: 520, y: 58 }] }],
		arrows: false,
	},
	cycle: {
		description: "State machine / loop",
		height: 210,
		// A cycle has to be geometrically closed or it reads as a chain that got
		// cut off, hence the four points and the closing rail. Each label sits
		// outside the diamond on its own side so none crowd the loop.
		spots: [
			{ x: 300, y: 30, labelY: 16, anchor: "middle" },
			{ x: 480, y: 106, labelY: 140, anchor: "middle" },
			{ x: 300, y: 182, labelY: 200, anchor: "middle" },
			{ x: 120, y: 106, labelY: 140, anchor: "middle" },
		],
		rails: [
			{
				kind: "line",
				closed: true,
				points: [
					{ x: 300, y: 30 },
					{ x: 480, y: 106 },
					{ x: 300, y: 182 },
					{ x: 120, y: 106 },
				],
			},
		],
		arrows: false,
	},
	sync: {
		description: "Bidirectional sync",
		height: 128,
		spots: [
			{ x: 110, y: 58, labelY: 108, anchor: "middle" },
			{ x: 490, y: 58, labelY: 108, anchor: "middle" },
		],
		// Two rails carrying state in opposite directions: the upper one reads
		// left to right, the lower one right to left, which is the exchange.
		rails: [
			{
				kind: "curve",
				p0: { x: 110, y: 58 },
				c1: { x: 110, y: 24 },
				c2: { x: 490, y: 24 },
				p3: { x: 490, y: 58 },
			},
			{
				kind: "curve",
				p0: { x: 490, y: 58 },
				c1: { x: 490, y: 92 },
				c2: { x: 110, y: 92 },
				p3: { x: 110, y: 58 },
			},
		],
		arrows: true,
	},
};

function railPath(spec: RailSpec): { d: string; len: number } {
	if (spec.kind === "curve") {
		const { p0, c1, c2, p3 } = spec;
		// Sampled rather than solved, so the reveal matches the path the browser
		// actually strokes to within a fraction of a unit.
		const steps = 32;
		let len = 0;
		let px = p0.x;
		let py = p0.y;
		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			const m = 1 - t;
			const x = m * m * m * p0.x + 3 * m * m * t * c1.x + 3 * m * t * t * c2.x + t * t * t * p3.x;
			const y = m * m * m * p0.y + 3 * m * m * t * c1.y + 3 * m * t * t * c2.y + t * t * t * p3.y;
			len += Math.hypot(x - px, y - py);
			px = x;
			py = y;
		}
		return { d: `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`, len };
	}

	const { points, closed } = spec;
	const legs = [...points, ...(closed ? [points[0]] : [])];
	let len = 0;
	for (let i = 1; i < legs.length; i++) {
		len += Math.hypot(legs[i].x - legs[i - 1].x, legs[i].y - legs[i - 1].y);
	}
	const d = legs.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
	return { d: closed ? `${d} Z` : d, len };
}

export default function PipelineDiagram({
	topology,
	nodes,
}: {
	topology: CaseTopology;
	nodes: readonly string[];
}) {
	// Eight diagrams share the document, so marker ids have to be unique or the
	// second card's arrowheads resolve against the first card's defs.
	const markerId = `case-arrow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
	const config = TOPOLOGY_CONFIG[topology];
	const rails = config.rails.map(railPath);
	const head = () => (config.arrows ? { markerEnd: `url(#${markerId})` } : {});

	return (
		<div
			className="case-pipe"
			aria-hidden="true"
			style={{ "--case-dot-travel": `${-DOT_TRAVEL}px`, "--case-dot-run": `${DOT_RUN_SECONDS}s` } as CSSProperties}
		>
			<svg viewBox={`0 0 ${VIEW_W} ${config.height}`} preserveAspectRatio="xMidYMid meet">
				<title>{config.description}</title>
				{config.arrows && (
					<defs>
						<marker
							id={markerId}
							viewBox="0 0 10 10"
							refX="9"
							refY="5"
							markerWidth="4.5"
							markerHeight="4.5"
							orient="auto"
						>
							<path d="M 0 1 L 10 5 L 0 9 z" className="case-pipe-head" />
						</marker>
					</defs>
				)}

				{rails.map((rail, i) => (
					<g
						key={rail.d}
						className={i === 0 ? "case-seg" : "case-seg case-seg-late"}
						style={{ "--case-len": rail.len } as CSSProperties}
					>
						<path className="case-pipe-base" d={rail.d} {...head()} />
						<path className="case-pipe-dots" d={rail.d} {...head()} />
					</g>
				))}

				{config.spots.map((spot, i) => (
					<g key={`${spot.x}-${spot.y}`}>
						<circle
							className="case-pipe-ring"
							cx={spot.x}
							cy={spot.y}
							r={12}
							style={{ animationDelay: `${i * 0.4}s` }}
						/>
						<circle className="case-pipe-node" cx={spot.x} cy={spot.y} r={5.5} />
						<text className="case-pipe-label" x={spot.x} y={spot.labelY} textAnchor={spot.anchor}>
							{nodes[i]}
						</text>
					</g>
				))}
			</svg>
		</div>
	);
}
