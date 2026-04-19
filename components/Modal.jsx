// Modal component + icons
const { useState, useEffect, useRef, useCallback } = React;

function Icon({ name, size = 16 }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    arrow: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="m10 14 11-11"/></>,
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Modal({ open, onClose, kicker, children, sourceRect }) {
  const closeRef = useRef(null);
  const overlayRef = useRef(null);

  // Keyboard + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 120);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  // Clip-path expansion from source card rect
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (open && sourceRect) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { top, left, width, height } = sourceRect;
      // Clip the overlay to the card's exact viewport position
      const clipStart = `inset(${top}px ${vw - left - width}px ${vh - top - height}px ${left}px round 6px)`;
      el.style.transition = 'none';
      el.style.clipPath = clipStart;
      // Double rAF forces a layout flush so transition actually fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'clip-path 0.58s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.clipPath = 'inset(0px round 0px)';
        });
      });
    } else if (open && !sourceRect) {
      // Fallback: no rect → just clear any stale clip
      el.style.clipPath = '';
      el.style.transition = '';
    } else if (!open) {
      // Reset on close
      setTimeout(() => {
        if (el) { el.style.clipPath = ''; el.style.transition = ''; }
      }, 320);
    }
  }, [open, sourceRect]);

  return (
    <div
      ref={overlayRef}
      className={"modal-overlay" + (open ? " open" : "")}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>{kicker || 'Detail'}</span>
          <button ref={closeRef} className="modal-close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={14} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);
  if (!item) return null;
  return (
    <div className="lightbox open" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
      {item.video
        ? <video src={item.src} controls autoPlay style={{ maxHeight: '90vh', maxWidth: '100%' }} />
        : <img src={item.src} alt={item.caption || ''} />
      }
      {item.caption && <div className="lb-cap">{item.caption}</div>}
    </div>
  );
}

Object.assign(window, { Icon, Modal, Lightbox });
