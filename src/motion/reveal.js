// Motion utilities: scroll reveals + count-up helpers.
//
// Prerender-safe by construction: the hidden pre-reveal state is gated
// under `html.js` in styles.css (no-JS readers never hide), the document
// prerender ships no JS at all, and reduced-motion / no-IO environments
// render final state immediately.
import { useEffect } from "react";

/* Observe `.reveal` descendants of a room scroller and land them once
   (adds `.in`). Call from RoomShell so each room arms on mount. */
export function useReveals(scrollerRef) {
  useEffect(() => {
    const scroller = scrollerRef?.current;
    if (!scroller) return;
    const els = scroller.querySelectorAll(".reveal:not(.in)");
    if (!els.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { root: scroller, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [scrollerRef]);
}

/* Cursor spotlight: one delegated pointermove per room paints --mx/--my
   on the hovered card (no re-renders); hover-capable pointers only. */
export function useSpotlight(scrollerRef) {
  useEffect(() => {
    const scroller = scrollerRef?.current;
    if (!scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    let last = null;
    const onMove = e => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const card = last.target?.closest?.(".sheet, .sw, .gv-pub");
        if (!card || !scroller.contains(card)) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${last.clientX - r.left}px`);
        card.style.setProperty("--my", `${last.clientY - r.top}px`);
      });
    };
    scroller.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      scroller.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollerRef]);
}

/* Only plain numerics count up (units ride separately in <small>);
   ranges like "7.0–12.4×" or fractions like "18/18" stay static. */
export function isCountable(value) {
  return /^\d[\d,]*(\.\d+)?$/.test(value);
}

/* easeOutExpo interpolation formatted to `decimals`; endpoints exact. */
export function formatCount(target, decimals, t) {
  if (t >= 1) return target.toFixed(decimals);
  if (t <= 0) return (0).toFixed(decimals);
  const eased = 1 - Math.pow(2, -10 * t);
  return (target * eased).toFixed(decimals);
}
