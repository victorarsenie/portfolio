const FLOW_PATH =
	"M 110 96 C 230 96, 320 76, 460 76 C 600 76, 620 92, 740 92 C 860 92, 960 80, 1090 80";

const NODES = [
	{ label: "Legacy System", x: 110, y: 96 },
	{ label: "Pipeline", x: 460, y: 76 },
	{ label: "Modern App", x: 740, y: 92 },
	{ label: "User", x: 1090, y: 80 },
];

export default function PipelineFlow() {
	return (
		<div className="terminal-hero-pipeline" aria-hidden="true">
			<svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid meet">
				<path className="pipeline-base" d={FLOW_PATH} />
				<path className="pipeline-flow" d={FLOW_PATH} />
				{NODES.map((n, i) => (
					<g key={n.label}>
						<circle className="pipeline-node-ring" cx={n.x} cy={n.y} r={11} style={{ animationDelay: `${i * 0.8}s` }} />
						<circle className="pipeline-node" cx={n.x} cy={n.y} r={4.5} />
						<text className="pipeline-label" x={n.x} y={n.y + 30}>
							{n.label}
						</text>
					</g>
				))}
			</svg>
		</div>
	);
}
