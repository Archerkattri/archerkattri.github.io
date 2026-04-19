// Detail renderer for the modal — research/project/experience/award

function DetailBody({ item, kind, onLightbox }) {
  if (!item) return null;

  if (kind === 'research' || kind === 'project') {
    return (
      <>
        <h2>{item.title}</h2>
        <p className="modal-sub">{item.subtitle}</p>
        <dl className="modal-kv">
          {item.role && (<><dt>Role</dt><dd>{item.role}</dd></>)}
          {item.org && (<><dt>Org</dt><dd>{item.org}</dd></>)}
          {item.date && (<><dt>Date</dt><dd>{item.date}</dd></>)}
          {item.tag && (<><dt>Status</dt><dd>{item.tag}</dd></>)}
          {item.category && (<><dt>Type</dt><dd>{item.category}</dd></>)}
        </dl>

        {/* Hero image — shown first, above body text */}
        {item.hero && (
          <div className="modal-hero" style={{ cursor: onLightbox ? 'zoom-in' : 'default' }}
            onClick={() => onLightbox && onLightbox({ src: item.hero, caption: item.title })}>
            <img src={item.hero} alt={item.title} />
          </div>
        )}

        {/* Demo video or embed — near the top */}
        {item.videoEmbed && (
          <><h3>Demo Video</h3>
          <div className="modal-video">
            <iframe src={item.videoEmbed} allow="autoplay" allowFullScreen
              style={{ width: '100%', height: 460, border: 'none', background: '#000' }} />
          </div></>
        )}
        {item.video && (
          <><h3>Demo</h3>
          <div className="modal-video">
            <video src={item.video} controls style={{ width: '100%', maxHeight: 460, background: '#000' }} />
          </div></>
        )}

        {item.overview && item.overview.length > 0 && (
          <><h3>Overview</h3>{item.overview.map((t, i) => <p key={i}>{t}</p>)}</>
        )}
        {item.contributions && item.contributions.length > 0 && (
          <><h3>Contributions</h3><ul>{item.contributions.map((t, i) => <li key={i}>{t}</li>)}</ul></>
        )}
        {item.tools && item.tools.length > 0 && (
          <><h3>Tools & Technologies</h3>
          <div className="skill-chips" style={{ marginBottom: 14 }}>
            {item.tools.map(s => <span key={s} className="chip">{s}</span>)}
          </div></>
        )}
        {item.outcomes && item.outcomes.length > 0 && (
          <><h3>Outcomes</h3><ul>{item.outcomes.map((t, i) => <li key={i}>{t}</li>)}</ul></>
        )}

        {/* Image gallery with lightbox */}
        {item.gallery && item.gallery.length > 0 && (
          <><h3>Gallery</h3>
          <div className="modal-gallery">
            {item.gallery.map((g, i) => (
              <figure key={i}
                onClick={() => onLightbox && onLightbox(g)}
                style={{ cursor: onLightbox ? 'zoom-in' : 'default' }}>
                <img src={g.src} alt={g.caption} loading="lazy" />
                {g.caption && <figcaption>{g.caption}</figcaption>}
              </figure>
            ))}
          </div></>
        )}

        {/* Nested research programme */}
        {item.programme && (
          <><h3>Research Programme</h3>
          <div className="modal-programme">
            <div className="mp-meta">
              <span className="tag">{item.programme.tag}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-soft)' }}>{item.programme.date}</span>
            </div>
            <h4 className="mp-title">{item.programme.title}</h4>
            <p className="mp-sub">{item.programme.subtitle}</p>
            <p>{item.programme.description}</p>
            <div className="skill-chips" style={{ marginTop: 10 }}>
              {item.programme.tools.map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div></>
        )}

        {item.placeholder && (<div className="modal-placeholder">◇ {item.placeholder}</div>)}

        {item.links && item.links.length > 0 && (
          <><h3>Links</h3>
          <div className="modal-links">
            {item.links.map((l, i) => (
              <a key={i} className="btn" href={l.href} target="_blank">
                <Icon name="external" size={12} /> {l.label}
              </a>
            ))}
          </div></>
        )}
      </>
    );
  }

  if (kind === 'experience') {
    return (
      <>
        <h2>{item.title}</h2>
        <p className="modal-sub">{item.org}</p>
        <dl className="modal-kv">
          <dt>Date</dt><dd>{item.date}</dd>
          <dt>Location</dt><dd>{item.location}</dd>
        </dl>
        <h3>Summary</h3>
        <p>{item.summary}</p>
        {item.bullets && item.bullets.length > 0 && (
          <><h3>Responsibilities</h3><ul>{item.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul></>
        )}
      </>
    );
  }

  if (kind === 'award') {
    return (
      <>
        <h2>{item.title}</h2>
        <p className="modal-sub">{item.org}</p>
        <dl className="modal-kv">
          <dt>Date</dt><dd>{item.date}</dd>
          <dt>Type</dt><dd>{item.kind}</dd>
        </dl>
        <h3>Overview</h3>
        <p>{item.summary}</p>

        {/* Single image certificate */}
        {item.image && (
          <><h3>Certificate</h3>
          <div className="modal-gallery" style={{ gridTemplateColumns: '1fr' }}>
            <figure
              onClick={() => onLightbox && onLightbox({ src: item.image, caption: item.title })}
              style={{ cursor: onLightbox ? 'zoom-in' : 'default' }}>
              <img src={item.image} alt={item.title}
                style={{ maxHeight: 520, objectFit: 'contain', background: 'var(--bg-hush)' }} />
            </figure>
          </div></>
        )}

        {/* Multiple images */}
        {item.images && item.images.length > 0 && (
          <><h3>Certificates</h3>
          <div className="modal-gallery">
            {item.images.map((g, i) => (
              <figure key={i}
                onClick={() => onLightbox && onLightbox(g)}
                style={{ cursor: onLightbox ? 'zoom-in' : 'default' }}>
                <img src={g.src} alt={g.caption}
                  style={{ maxHeight: 420, objectFit: 'contain', background: 'var(--bg-hush)' }} />
                {g.caption && <figcaption>{g.caption}</figcaption>}
              </figure>
            ))}
          </div></>
        )}

        {/* PDF embed */}
        {item.pdf && (
          <>
          <h3>Document</h3>
          <div className="modal-pdf">
            <iframe src={item.pdf + '#view=FitH'} title={item.title}
              style={{ width: '100%', height: 560, border: '1px solid var(--line)', background: 'var(--bg-hush)', display: 'block' }} />
          </div>
          <div className="modal-links" style={{ marginTop: 12 }}>
            <a className="btn primary" href={item.pdf} target="_blank">
              <Icon name="external" size={12} /> Open PDF in new tab
            </a>
          </div>
          </>
        )}

        {item.links && item.links.length > 0 && (
          <><h3>Links</h3>
          <div className="modal-links">
            {item.links.map((l, i) => (
              <a key={i} className="btn" href={l.href} target="_blank">
                <Icon name="external" size={12} /> {l.label}
              </a>
            ))}
          </div></>
        )}
      </>
    );
  }

  return null;
}

Object.assign(window, { DetailBody });
