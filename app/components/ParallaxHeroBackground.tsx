import { useEffect, useRef } from "react";
import Image from "next/image";

interface ParallaxHeroBackgroundProps {
	imageSrc: string;
	alt: string;
	speed?: number;
	mediaW?: number;
	mediaH?: number;
	mobileSrc?: string;
}

// Exact port of the old portfolio's jquery.imageScroll hero effect
// (coverRatio: 1, speed: 0.3, desktop-only >769px, rAF-throttled).
//
// This replicates the plugin's DOM structure, not just its math: the image
// does NOT live inside the scrolled document-flow layer. It sits in a
// `position: fixed` "scroller" that is out of the document flow and gets
// positioned each frame to track the hero holder, with the image panning
// inside it. On high-DPI displays the compositor scrolls content by
// sub-CSS-pixel amounts between integer scroll positions; an in-flow
// translated image rides those fractional moves and visibly shimmers during
// a slow scrollbar drag, while the plugin's fixed scroller moves in crisp
// integer jumps. Porting the fixed scroller keeps both pixels identical.
//
// Values (window [W,H]) mirror _adjustImgHolderHeights / _updatePositions:
//   d         = holder width (the plugin uses $window.width(); on this page
//               the holder is full-width so holder.clientWidth matches)
//   a/c       = viewport height (coverRatio 1 -> holder height = viewport)
//   r         = rendered image height (round-ed, never fractional)
//   hdt       = holder on-screen distance (hero at doc top: -scrollY)
//   ratio     = (hdt + c) / travel            (0.5 at scroll 0)
//   imgY      = round(fromY + sDistance * (1 - ratio))   (= t + 0.7*scrollY)
//   scrollerY = round(hdt)                    (positions the fixed scroller at the holder)
// Kept hidden while the holder is off-screen.
export default function ParallaxHeroBackground({
	imageSrc,
	alt,
	speed = 0.3,
	mediaW = 1600,
	mediaH = 900,
	mobileSrc,
}: ParallaxHeroBackgroundProps) {
	const imgRef = useRef<HTMLImageElement>(null);
	const holderRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const holder = holderRef.current;
		const scroller = scrollerRef.current;
		const img = imgRef.current;
		if (!holder || !scroller || !img) return;

		let a = 0; // viewport height (= holder height, coverRatio 1)
		let c = 0; // scroller height = holder height
		let fromY = 0;
		let sDistance = 0;
		let travel = 0;

		const layout = () => {
			const d = Math.max(holder.clientWidth, 1);
			a = holder.clientHeight;
			c = a;
			const h = Math.floor(a - (a - c) * speed);
			let n = Math.round(mediaW * (h / mediaH));
			let r;
			if (n >= d) {
				r = h;
			} else {
				n = d;
				r = Math.round(mediaH * (n / mediaW));
			}
			img.style.width = `${n}px`;
			img.style.height = `${r}px`;
			scroller.style.width = `${n}px`;
			scroller.style.height = `${c}px`;
			const l = h - c;
			const t = -(l / 2 + (r - h) / 2);
			travel = a + c;
			sDistance = 2 * a * (1 - speed) - l;
			fromY = t - sDistance / 2;
		};

		const update = () => {
			const hdt = holder.getBoundingClientRect().top;
			if (hdt <= a && hdt >= -c) {
				const ratio = (hdt + c) / travel;
				const y = Math.round(fromY + sDistance * (1 - ratio));
				scroller.style.transform = `translate3d(0, ${Math.round(hdt)}px, 0)`;
				img.style.transform = `translate3d(0, ${y}px, 0)`;
				scroller.style.visibility = "visible";
				img.style.visibility = "visible";
			} else {
				scroller.style.visibility = "hidden";
				img.style.visibility = "hidden";
			}
		};

		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					update();
					ticking = false;
				});
			}
		};

		const onResize = () => {
			layout();
			update();
		};

		const desktop = window.matchMedia("(min-width: 770px)");
		const apply = () => {
			if (desktop.matches) {
				scroller.style.display = "block";
				holder.style.backgroundImage = "none";
				window.addEventListener("scroll", onScroll, { passive: true });
				window.addEventListener("resize", onResize);
				layout();
				update();
			} else {
				window.removeEventListener("scroll", onScroll);
				window.removeEventListener("resize", onResize);
				scroller.style.display = "none";
				img.style.transform = "";
				img.style.visibility = "visible";
				holder.style.backgroundImage = `url(${mobileSrc || imageSrc})`;
			}
		};

		const onChange = desktop.addEventListener
			? () => desktop.addEventListener("change", apply)
			: () => {};
		const offChange = desktop.removeEventListener
			? () => desktop.removeEventListener("change", apply)
			: () => {};
		onChange();
		apply();

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
			offChange();
		};
	}, [imageSrc, alt, speed, mediaW, mediaH, mobileSrc]);

	return (
		<div
			ref={holderRef}
			className="absolute inset-0"
			style={{ backgroundSize: "cover", backgroundPosition: "center" }}
		>
			<div ref={scrollerRef} className="overflow-hidden" style={{ position: "fixed", top: 0, left: 0, visibility: "hidden" }}>
				<Image
					ref={imgRef}
					src={imageSrc}
					alt={alt}
					width={mediaW}
					height={mediaH}
					priority
					unoptimized
					className="absolute top-0 left-0 object-cover"
					style={{ maxWidth: "none", transform: "translate3d(0,0,0)" }}
				/>
			</div>
		</div>
	);
}