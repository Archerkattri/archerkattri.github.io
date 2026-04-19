// Synced world map + journey section using d3-geo + topojson

function JourneyMap({ activeCountry, onCountryChange }) {
  const [hovered, setHovered] = useState(null);
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);

  const countries = {
    US: {
      name: 'United States',
      code: 'USA',
      years: '2020 — 2026',
      cities: ['Villanova, PA', 'Arlington, VA', 'Orlando, FL'],
      summary: 'Undergraduate degree at Villanova, summer robotics work at Area2Farms in Arlington, and the incoming Ph.D. chapter at UCF in Orlando.',
      chips: ['Villanova', 'Area2Farms', 'UCF (incoming)']
    },
    KR: {
      name: 'South Korea',
      code: 'KOR',
      years: '2022 — 2026',
      cities: ['Seoul'],
      summary: "Year-long Yonsei exchange, SNU research internship, and the current M.S. at Seoul National University focused on PoP-SLAM and GaussianFeels.",
      chips: ['Yonsei', 'SNU', 'Soft Robotics & Bionics Lab']
    },
    IN: {
      name: 'India',
      code: 'IND',
      years: 'Origin',
      cities: ['Home'],
      summary: 'Home base before university, and still part of the through-line behind the broader international academic path.',
      chips: ['Origin']
    }
  };

  const highlight = { '840': 'US', '410': 'KR', '356': 'IN' };

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        const features = topojson.feature(world, world.objects.countries).features;
        setGeo(features);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const shown = hovered || activeCountry;
  const info = countries[shown] || countries.KR;
  const W = 800;
  const H = 380;
  const d3ready = typeof d3 !== 'undefined';
  const projection = d3ready ? d3.geoNaturalEarth1().scale(143).translate([W / 2, H / 2 + 12]) : null;
  const pathGen = d3ready ? d3.geoPath().projection(projection) : null;
  const sphere = { type: 'Sphere' };
  const graticule = d3ready ? d3.geoGraticule()() : null;

  return (
    <div className="journey-map">
      <div className="journey-map-graphic wmap">
        {loading || !d3ready || !pathGen ? (
          <div className="wmap-loading">{!d3ready ? 'Map library loading…' : 'Loading map…'}</div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-label="Map of countries studied and worked in">
            <defs>
              <clipPath id="journey-map-clip">
                <path d={pathGen(sphere)} />
              </clipPath>
            </defs>
            <path d={pathGen(sphere)} className="wmap-ocean" />
            <path d={pathGen(graticule)} className="wmap-graticule" clipPath="url(#journey-map-clip)" />
            {geo.map((feature, idx) => {
              const key = highlight[String(feature.id)];
              const isActive = key === shown;
              const d = pathGen(feature);
              if (!d) return null;
              return (
                <path
                  key={idx}
                  d={d}
                  className={'country' + (key ? ' visited' : '') + (isActive ? ' active' : '')}
                  onMouseEnter={key ? () => setHovered(key) : undefined}
                  onMouseLeave={key ? () => setHovered(null) : undefined}
                  onClick={key ? () => onCountryChange(key) : undefined}
                  clipPath="url(#journey-map-clip)"
                />
              );
            })}
            <path d={pathGen(sphere)} className="wmap-sphere" />
          </svg>
        )}
      </div>
      <div className="wmap-legend">
        <span><span className="sw active"></span>Focused chapter</span>
        <span><span className="sw visited"></span>Worked / studied</span>
      </div>
      <div className="journey-map-info">
        <div className="code">{info.code} · {info.years}</div>
        <h4>{info.name}</h4>
        <dl className="stat-row">
          <dt>Cities</dt><dd>{info.cities.join(' · ')}</dd>
          <dt>Period</dt><dd>{info.years}</dd>
        </dl>
        <p>{info.summary}</p>
        <div className="wmap-chips">
          {info.chips.map(chip => <span key={chip} className="chip">{chip}</span>)}
        </div>
      </div>
    </div>
  );
}

function JourneySection() {
  const events = window.JOURNEY_EVENTS || [];
  const [activeIndex, setActiveIndex] = useState(Math.max(0, events.findIndex(event => event.title === 'GaussianFeels')));

  useEffect(() => {
    if (!events.length) return;
    if (activeIndex >= 0 && activeIndex < events.length) return;
    setActiveIndex(0);
  }, [activeIndex, events.length]);

  if (!events.length) return null;

  const activeEvent = events[activeIndex];

  return (
    <section id="journey">
      <div className="container">
        <div className="section-head">
          <div className="section-num">§ 02.b / JOURNEY</div>
          <div>
            <h2 className="section-title">The path,<br/><span style={{ fontStyle: 'italic' }}>mapped.</span></h2>
            <p className="section-sub">A single timeline line for the milestones, synced to the geography of where each chapter happened.</p>
          </div>
        </div>
        <div className="journey-layout">
          <div className="journey-story">
            <JourneyTimeline events={events} activeIndex={activeIndex} onChange={setActiveIndex} />
            <article className="journey-summary">
              <div className="journey-summary-meta">
                <span>{activeEvent.month}/{activeEvent.year}</span>
                <span>{activeEvent.country}</span>
              </div>
              <h3>{activeEvent.title}</h3>
              <p>{activeEvent.summary}</p>
            </article>
          </div>
          <JourneyMap
            activeCountry={activeEvent.country}
            onCountryChange={(country) => {
              const match = events.findIndex(event => event.country === country);
              if (match >= 0) setActiveIndex(match);
            }}
          />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { JourneyMap, JourneySection });
