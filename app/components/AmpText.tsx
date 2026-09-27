import { Fragment } from "react";

// The Hype font has no "&" glyph (it renders blank), so ampersands get a
// span that falls back to the site's mono font. Shared by every component
// that renders a user- or data-supplied title.
export default function AmpText({ text }: { text: string }) {
	const parts = text.split("&");
	return (
		<>
			{parts.map((part, i, all) => (
				<Fragment key={i}>
					{part}
					{i < all.length - 1 && <span className="amp">&amp;</span>}
				</Fragment>
			))}
		</>
	);
}
