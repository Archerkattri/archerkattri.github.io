// Journey timeline data + synced timeline/map section

const JOURNEY_EVENTS = [
  { year: 2019, month: 1, country: 'IN', title: 'India roots', summary: 'The pre-university chapter in India that set up the maker mindset, early builds, and the broader move toward robotics.' },
  { year: 2020, month: 9, country: 'US', title: 'Villanova begins', summary: "Started the B.S. in Mechanical Engineering at Villanova and landed on the Dean's List in the first semester." },
  { year: 2020, month: 12, country: 'US', title: 'ICE Competition — 3rd', summary: 'Led a four-person team to 3rd place with an assistive wearable concept for visually impaired users.' },
  { year: 2021, month: 7, country: 'US', title: 'UPenn Robotics', summary: 'Completed the UPenn Robotics Specialization across aerial robotics, planning, perception, estimation, and learning.' },
  { year: 2021, month: 12, country: 'US', title: 'Beetle-Bot — 3rd', summary: "Built a miniature combat robot with a Villanova team and placed 3rd in the mechatronics course competition." },
  { year: 2022, month: 8, country: 'KR', title: 'Yonsei exchange', summary: 'Moved to Seoul for a year-long exchange focused on controls, vibrations, fluids, and heat transfer.' },
  { year: 2023, month: 6, country: 'US', title: 'Area2Farms (SILO)', summary: 'Spent the summer in Arlington building automation for indoor vertical farming with pneumatics and custom controls.' },
  { year: 2023, month: 9, country: 'US', title: 'Villanova research', summary: 'Started undergraduate robotics research on SLAM in GNSS-denied environments with LiDAR-camera fusion and ROS.' },
  { year: 2024, month: 1, country: 'KR', title: 'SNU intern', summary: "Joined SNU's Soft Robotics & Bionics Lab for a short research placement on stretchable sEMG and gesture recognition." },
  { year: 2024, month: 5, country: 'US', title: 'Capstone — 1st', summary: 'Graduated Villanova and won 1st Place / Most Innovative Solution for the plant-lifting imaging capstone.' },
  { year: 2024, month: 9, country: 'KR', title: 'SNU M.S.', summary: 'Moved back to Seoul for the M.S. at Seoul National University as a GSFS Scholar.' },
  { year: 2024, month: 12, country: 'KR', title: 'PoP-SLAM', summary: 'Co-authored PoP-SLAM, a projection-first dense visual SLAM system that beat heavier baselines on consumer GPUs.' },
  { year: 2025, month: 3, country: 'KR', title: 'GaussianFeels', summary: 'Began the thesis work on visuo-tactile SLAM and object-centric Gaussian maps for in-hand manipulation.' },
  { year: 2026, month: 8, country: 'US', title: 'UCF Ph.D.', summary: 'Incoming Ph.D. at UCF as an ORCGS Doctoral Fellow in the Rehabilitation Engineering & Assistive Device Lab.' },
];

function JourneyTimeline({ events, activeIndex, onChange }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="journey-line" role="list" aria-label="Career timeline">
      <div className="journey-line-rail" aria-hidden="true"></div>
      <div className="journey-line-items" style={{ '--journey-columns': events.length }}>
        {events.map((event, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={`${event.year}-${event.month}-${event.title}`}
              type="button"
              className={"journey-marker" + (active ? ' active' : '')}
              onMouseEnter={() => onChange(index)}
              onFocus={() => onChange(index)}
              onClick={() => onChange(index)}
              aria-pressed={active}
            >
              <span className="journey-marker-labels">
                <span className="journey-marker-month">{months[event.month - 1]}</span>
                <span className="journey-marker-year">{event.year}</span>
              </span>
              <span className="journey-marker-dot" aria-hidden="true"></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { JOURNEY_EVENTS, JourneyTimeline };
