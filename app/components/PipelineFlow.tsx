// "Living plumbing": four services joined by a trace that draws itself in, then
// carries a moving dash stream. Shallow S-curve so it reads as a routed pipe
// rather than a graph edge. x positions are inset far from the viewBox edges so
// the labels still have room when the type is scaled up on narrow screens.
const PATH = "M 170 108 C 300 108, 360 72, 520 72 C 680 72, 740 108, 880 108 C 1000 108, 1060 72, 1230 72";

const NODES = [
	{ label: "legacy system", x: 170, y: 108 },
	{ label: "pipeline", x: 520, y: 72 },
	{ label: "modern app", x: 880, y: 108 },
	{ label: "user", x: 1230, y: 72 },
];

const LEADER_END = 156;
const LABEL_Y = 182;

export default function PipelineFlow() {
	return (
		<div className="pipe" aria-hidden="true">
			<svg viewBox="0 0 1400 210" preserveAspectRatio="xMidYMid meet">
				<path className="pipe-base" d={PATH} />
				<path className="pipe-flow" d={PATH} />

				{NODES.map((n, i) => (
					<g key={n.label}>
						<line className="pipe-leader" x1={n.x} y1={n.y + 13} x2={n.x} y2={LEADER_END} />
						<circle className="pipe-ring" cx={n.x} cy={n.y} r={13} style={{ animationDelay: `${i * 0.75}s` }} />
						<circle className="pipe-node" cx={n.x} cy={n.y} r={5.5} />
						<text className="pipe-label" x={n.x} y={LABEL_Y}>
							{n.label}
						</text>
					</g>
				))}
			</svg>
		</div>
	);
}
