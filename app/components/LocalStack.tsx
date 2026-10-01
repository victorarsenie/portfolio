// The toolchain as a stack rather than a trace: four layers, hardware at the
// bottom, the work at the top. It replaced a left-to-right pipeline
// (`legacy system -> pipeline -> modern app -> user`), which was the wrong
// shape twice over - it described the old client work, and it told a story the
// "Data pipelines" and "API orchestration" skill cards already tell.
//
// Deliberately structural rather than an inventory. The skills section lists
// these same tools as flat chips, so naming them all here would repeat that
// list; what a stack can say and a chip row cannot is what sits on top of
// what. Each layer is one line of consequence, not a product.
//
// Not a cycle, and not a chain: the chapter case study's diagram is a cycle
// (benchmark -> diagnose -> tune -> re-measure) and this is not, so the two
// diagrams on the page stay visibly different. The travelling pulse is the
// only thing carried over from the old pipe, kept because it reads as the
// stack doing work rather than sitting still.
const LAYERS = [
	{ key: "work", label: "the work", value: "your repo" },
	{ key: "tool", label: "interface", value: "opencode · Cline" },
	{ key: "model", label: "models", value: "Qwen3.8-27B · Qwen3.6-35B-A3B" },
	{ key: "gpu", label: "hardware", value: "RTX 5070 Ti · 16 GB" },
];

export default function LocalStack() {
	return (
		<div className="stack" aria-hidden="true">
			{LAYERS.map((layer, i) => (
				<div className="stack-layer" key={layer.key} style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
					<span className="stack-pin" />
					<span className="stack-label">{layer.label}</span>
					<span className="stack-value">{layer.value}</span>
				</div>
			))}
			<span className="stack-pulse" />
		</div>
	);
}
