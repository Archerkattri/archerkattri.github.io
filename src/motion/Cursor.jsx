// ════════════════════════════════════════════════════════════
// Cursor — teal dot + trailing ring replacing the native arrow.
// Fine pointers only (touch keeps the native behavior); under
// prefers-reduced-motion the ring follows 1:1 with the hand instead
// of lerping. The native cursor is hidden only while this component
// is mounted (html.has-custom-cursor), so failure = normal cursor.
// ════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, summary, input, textarea, select, [role=\"button\"], [role=\"option\"]";

export default function Cursor({ reduced }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, visible = false;
    document.documentElement.classList.add("has-custom-cursor");

    const place = (el, px, py) => {
      el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
    };
    const show = () => {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) { rx = x; ry = y; show(); }
      place(dot, x, y);
      if (reduced) place(ring, x, y);
    };
    const onOver = (e) => {
      const hot = e.target instanceof Element && !!e.target.closest(INTERACTIVE);
      ring.classList.toggle("is-hover", hot);
    };
    const onLeave = (e) => { if (!e.relatedTarget) hide(); };
    const loop = () => {
      if (!reduced) {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        place(ring, rx, ry);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
