// Journey section — hover-synced vertical timeline + world map
const { useState, useEffect } = React;

const COUNTRY_INFO = {
  US: {
    name: 'United States', code: 'USA', years: '2020 — 2026',
    cities: ['Villanova, PA', 'Arlington, VA', 'Orlando, FL'],
    summary: 'Undergraduate at Villanova, summer internship at Area2Farms, incoming Ph.D. at UCF.',
    chips: ['Villanova', 'Area2Farms', 'UCF']
  },
  KR: {
    name: 'South Korea', code: 'KOR', years: '2022 — 2026',
    cities: ['Seoul (Yonsei)', 'Seoul (SNU)'],
    summary: 'Year-long Yonsei exchange, SNU research internship, M.S. on GaussianFeels and PoP-SLAM.',
    chips: ['Yonsei', 'SNU', 'SRBL']
  },
  IN: {
    name: 'India', code: 'IND', years: 'Origin',
    cities: ['Home'],
    summary: 'Roots before university — the foundation behind the international academic path.',
    chips: ['Origin']
  }
};

const HIGHLIGHT = { '840': 'US', '410': 'KR', '356': 'IN' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── World map SVG — driven entirely by parent activeCountry ── */
function JourneyMapSVG({ activeCountry, onCountryEnter }) {
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(w => setGeo(topojson.feature(w, w.objects.countries).features))
      .catch(() => {});
  }, []);

  const W = 700, H = 330;

  if (!geo || typeof d3 === 'undefined') {
    return <div className="wmap-loading">{!geo ? 'Loading map…' : 'Loading libraries…'}</div>;
  }

  const proj = d3.geoNaturalEarth1().scale(122).translate([W / 2, H / 2 + 8]);
  const path = d3.geoPath().projection(proj);
  const sphere = { type: 'Sphere' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="jv2-svg" aria-label="World map">
      <defs>
        <clipPath id="jmap-clip">
          <path d={path(sphere)} />
        </clipPath>
      </defs>
      <path d={path(sphere)} className="wmap-ocean" />
      <path d={path(d3.geoGraticule()())} className="wmap-graticule" clipPath="url(#jmap-clip)" />
      {geo.map((f, i) => {
        const key = HIGHLIGHT[String(f.id)];
        const isActive = key === activeCountry;
        const d = path(f);
        if (!d) return null;
        return (
          <path key={i} d={d}
            className={'country' + (key ? ' visited' : '') + (isActive ? ' active' : '')}
            clipPath="url(#jmap-clip)"
            onMouseEnter={key ? () => onCountryEnter(key) : undefined}
            style={{ cursor: key ? 'pointer' : 'default' }}
          />
        );
      })}
      <path d={path(sphere)} className="wmap-sphere" />
    </svg>
  );
}

function JourneySection() {
  const events = window.JOURNEY_EVENTS || [];
  const [activeIdx, setActiveIdx] = useState(
    Math.max(0, events.findIndex(e => e.title === 'GaussianFeels'))
  );

  if (!events.length) return null;

  const active = events[activeIdx];
  const info = COUNTRY_INFO[active.country] || COUNTRY_INFO.KR;

  /* Hover on map country → jump to most recent event in that country */
  const handleCountryEnter = (country) => {
    // Find the LAST event in that country (most recent)
    let match = -1;
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].country === country) { match = i; break; }
    }
    if (match >= 0) setActiveIdx(match);
  };

  return (
    <section id="journey" data-screen-label="Journey">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 02.b / JOURNEY</div>
          <div>
            <h2 className="section-title">The path,<br /><span style={{ fontStyle: 'italic' }}>mapped.</span></h2>
            <p className="section-sub">Every milestone — degrees, labs, internships, competitions. Hover to explore.</p>
          </div>
        </div>

        <div className="journey-v2">
          {/* ── Vertical timeline — hover sets active ── */}
          <div className="jv2-list">
            {events.map((ev, i) => (
              <div
                key={i}
                className={'jv2-event in' + (i === activeIdx ? ' active' : '')}
                onMouseEnter={() => setActiveIdx(i)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveIdx(i)}
                aria-pressed={i === activeIdx}
              >
                <div className="jv2-date">
                  <span className="jv2-mon">{MONTHS[ev.month - 1]}</span>
                  <span className="jv2-yr">{ev.year}</span>
                </div>
                <div className="jv2-axis">
                  <div className="jv2-dot" />
                  {i < events.length - 1 && <div className="jv2-line" />}
                </div>
                <div className="jv2-body">
                  <span className="jv2-flag">{ev.country}</span>
                  <div className="jv2-title">{ev.title}</div>
                  <div className="jv2-sum">{ev.summary}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sticky map + info panel ── */}
          <div className="jv2-map-wrap">
            <div className="jv2-map-card wmap">
              <JourneyMapSVG
                activeCountry={active.country}
                onCountryEnter={handleCountryEnter}
              />
            </div>
            <div className="wmap-legend">
              <span><span className="sw active" />Active chapter</span>
              <span><span className="sw visited" />Studied / worked</span>
            </div>
            <div className="jv2-info">
              <div className="jv2-info-code">{info.code} · {info.years}</div>
              <h4 className="jv2-info-name">{info.name}</h4>
              <div className="jv2-info-cities">{info.cities.join(' · ')}</div>
              <p className="jv2-info-text">{info.summary}</p>
              <div className="wmap-chips">
                {info.chips.map(c => <span key={c} className="chip">{c}</span>)}
              </div>
              <div className="jv2-event-preview">
                <div className="jv2-ep-date">{MONTHS[active.month - 1]} {active.year}</div>
                <div className="jv2-ep-title">{active.title}</div>
                <div className="jv2-ep-sum">{active.summary}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { JourneyMap: JourneyMapSVG, JourneySection });
