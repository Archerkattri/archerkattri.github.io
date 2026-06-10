// Portfolio data — edit this file to update content.
// Sections map: profile/hero → Shell.jsx · research / personal projects
// (software+adapters) / experience / school / school projects (archive) /
// gallery / contact → components/Sections.jsx
//
// Copy rule: no em dashes in any user-visible string (commas, colons,
// parens, "·" instead). Date ranges use the en dash "–".

export const PORTFOLIO_DATA = {
  profile: {
    name: "Krishi Attri",
    // Identity block, in reading order: name (display scale) → role line →
    // the one-liner. A first-time visitor gets who/what/why in two seconds.
    roleLine: "Robotics and AI researcher. M.S. SNU, incoming Ph.D. UCF.",
    headlineLines: ["I give robots", "a sense of touch."],
    sub: "Perception systems that see, feel, and reconstruct the world in real time: visuo-tactile SLAM on 3D Gaussian Splatting maps, plus the open-source tools that make the stack verifiable and fast.",
    meta: [
      "M.S. Mechanical Engineering · Seoul National University",
      "Soft Robotics & Bionics Laboratory · Advisor: Prof. Yong-Lae Park",
      "Incoming Ph.D. · University of Central Florida · ORCGS Doctoral Fellow · Aug 2026",
    ],
    headshot: "assets/images/headshot-sm.png",
    headshotWebp: "assets/images/headshot-sm.webp",
    figcaption: "Krishi Attri · Seoul, 2025",
    contact: {
      email: "krishiattriwork@gmail.com",
      github: "https://github.com/Archerkattri",
      linkedin: "https://linkedin.com/in/krishi-attri15",
      cv: "assets/docs/Krishi_Attri_CV.pdf",
      resume: "assets/docs/Krishi_Attri_Resume.pdf",
      siteSource: "https://github.com/Archerkattri/archerkattri.github.io",
      location: "Seoul, South Korea → Orlando, FL (Aug 2026)",
    },
    // Hero proof line: the flagship, its two headline numbers, and the
    // released libraries; every part deep-links into its room (hashes
    // resolve through grid.js aliases; the cards carry matching ids).
    proofLine: {
      flagship: {
        href: "#gaussianfeels",
        pre: "GaussianFeels: ",
        statA: "3.37 mm",
        mid: " object tracking during in-hand manipulation, at ",
        statB: "7.6×",
        post: " the frame rate of the neural-field baseline.",
      },
      libraries: [
        { label: "splatreg", href: "#splatreg" },
        { label: "mathlas", href: "#mathlas" },
        { label: "HiCache++", href: "#hicache-pp" },
      ],
      librariesTail: " on PyPI.",
    },
  },

  /* ──────────────── 01 / RESEARCH ──────────────── */
  research: [
    {
      id: "gaussianfeels",
      flagship: true,
      title: "GaussianFeels",
      subtitle: "Object-centric Gaussian SLAM for visuo-tactile in-hand manipulation",
      role: "M.S. Thesis · Soft Robotics & Bionics Lab, Seoul National University",
      date: "Dec 2024 – Present",
      tag: "Thesis · release upcoming",
      summary:
        "When a robot hand grasps an object, it occludes exactly the region it most needs to perceive. GaussianFeels fuses RGB-D vision, DIGIT tactile contact geometry, and hand proprioception into one explicit object-centric 3D Gaussian Splatting map, reconstructing and tracking objects online, through the occlusion, with no CAD model.",
      media: {
        video: "assets/videos/gaussianfeels-forming.mp4",
        poster: "assets/videos/gaussianfeels-forming-poster.jpg",
        caption: "Live: the Gaussian map forming during in-hand manipulation. Raw camera input · the reconstruction forming · the accumulated map orbiting, tactile contacts in magenta.",
      },
      stats: [
        { value: "0.83", unit: "mm", label: "median ADD-S · simulation" },
        { value: "3.37", unit: "mm", label: "median ADD-S · real hardware" },
        { value: "7.6×", unit: "", label: "frame rate vs NeuralFeels" },
        { value: "94%", unit: "", label: "sim F-score retained on real" },
      ],
      // Expanded-card copy distilled from the thesis abstract.
      details: [
        "One map, every job: a single object-centric 3D Gaussian state serves training, rendering, frozen-map SDF pose tracking, reconstruction evaluation, and manipulation-facing geometry. It replaces the neural-implicit SDF as the shared representation for online, model-free visuo-tactile object SLAM.",
        "Pose is recovered by a multi-residual Levenberg-Marquardt optimiser solving SE(3) against a frozen dual-sigma Gaussian-density anchor SDF, fusing synchronized RGB-D, tactile, and proprioceptive observations in one canonical frame.",
        "A frame-zero branch generates a shape estimate from a single RGB crop with an image-to-3D model, then progressively replaces generated geometry with measured geometry as the episode progresses.",
        "Real time, no CAD model: map and pose modes clear the 25 FPS target; slam mode runs ≈28 FPS in simulation and ≈23.5 FPS on real hardware across the 14-cell FeelSight primary sweep (multi-seed medians).",
        "Sim-to-real is strong reconstruction transfer with a harder real tracking bottleneck: 94% of simulation F-score@5mm is retained on real hardware (0.946 → 0.888), versus 80% for NeuralFeels (0.898 → 0.716).",
        "Frame-matched against model-free NeuralFeels: more accurate in simulation (0.91 vs 2.51 mm ADD-S), real-hardware parity (3.34 vs 3.42 mm), at ≈7.6× the mean frame rate (frame-matched protocol, hence the small shift from the 0.83 / 3.37 mm headline medians). The implicit baseline wins only when handed an exact CAD model.",
        "Paired tactile ablation isolates a domain-dependent finding: tactile improves reconstruction in simulation but degrades it on real hardware (noisy DIGIT depth drags the map), while pose accuracy stays near-neutral in both domains.",
        "Developed inside Korea's national “Alchemist” humanoid programme (MOTIE), bringing visuo-tactile SLAM from research prototype to the Phase-2 full-scale humanoid.",
      ],
      tools: ["3D Gaussian Splatting", "PyTorch", "CUDA", "gsplat", "LM SE(3)", "UR5e", "Allegro Hand", "DIGIT tactile", "NVIDIA Omniverse"],
      note: "Thesis & code release upcoming, 2026.",
    },
    {
      id: "popslam",
      title: "PoP-SLAM",
      subtitle: "Point-cloud projection for dense visual SLAM",
      role: "Co-author · with S. Jung, J. Marchand, M. L. Paolicchi · Seoul National University",
      date: "Sept – Dec 2024",
      tag: "Paper",
      summary:
        "Replaces the per-pixel nearest-neighbour queries that bottleneck neural point-cloud SLAM with a projection-first pipeline: project ~15,000 neural points into the image plane by vectorised matrix multiplication, mask by multi-keyframe depth consistency, render. No volumetric queries.",
      stats: [
        { value: "0.75", unit: "cm", label: "best ATE RMSE · TUM-RGBD" },
        { value: "0.38", unit: "cm", label: "avg ATE RMSE · Replica" },
        { value: "3×", unit: "", label: "faster than Point-SLAM" },
      ],
      details: [
        "Outperforms Point-SLAM, NICE-SLAM, ESLAM, and SplaTAM on TUM-RGBD trajectory accuracy.",
        "~4 FPS on a single consumer RTX 4070; <3.3% overhead from point pruning.",
        "Direct occlusion detection via multi-keyframe depth masking: retain only points consistent with measured depth across nearby keyframes.",
      ],
      tools: ["PyTorch", "CUDA", "Open3D", "TUM-RGBD", "Replica"],
      links: [
        { label: "Paper (PDF)", href: "assets/docs/PoP_SLAM_Paper.pdf" },
        { label: "Paper (Drive)", href: "https://drive.google.com/file/d/1JT2TqpzqHVoeGwcp_y6MgJ7XKNKrY2k6/view" },
      ],
    },
    {
      id: "gnss-denied",
      title: "GNSS-denied SLAM",
      subtitle: "LiDAR-camera fusion navigation for an outdoor robot without GPS",
      role: "B.S. thesis research · Villanova University",
      date: "2023 – 2024",
      tag: "B.S. research",
      summary:
        "Where GPS fails, the robot must localise itself from what it can see. The main research project of the bachelor's: a full LiDAR-camera fusion navigation stack for a quad-wheel outdoor robot, built alongside a Ph.D. dissertation on autonomous localisation and navigation in GNSS-denied environments at Villanova University.",
      details: [
        "Full ROS navigation stack on the quad-wheel platform: path planning and obstacle avoidance running on Arduino and Raspberry Pi for real-time control.",
        "CNN-based feature extraction and point-cloud generation from fused LiDAR-camera data; visual odometry for motion estimates without GPS.",
        "Real-time 3D environment mapping with computer-vision landmark identification and edge detection.",
        "Probabilistic localisation: a 2D histogram filter with a 1D Kalman tracker over probabilistic motion models.",
      ],
      tools: ["ROS", "LiDAR", "Visual odometry", "CNN features", "Histogram filter", "Kalman filter", "Arduino", "Raspberry Pi"],
      links: [
        { label: "EOD robot (video)", href: "https://drive.google.com/file/d/1j4MmrqF4hBtm72m31q-CMhZi1sH-XFUF/view" },
        { label: "Drone (photo)", href: "https://drive.google.com/file/d/1ZDJsIq9ADl9KiKW8shVL8m0QTG8ocDcO/view" },
      ],
    },
    {
      id: "semg",
      compact: true,
      title: "Stretchable sEMG sensing",
      subtitle: "PDMS + vapour-deposited silver-nanoparticle stretchable electromyography with CNN-GRU/ViT gesture classification. Winter research internship at the SNU Soft Robotics & Bionics Lab that seeded the M.S.",
      date: "Jan 2024",
      tag: "Research placement",
    },
  ],

  publications: [
    {
      title: "GaussianFeels: Object-Centric Gaussian SLAM for Visuo-Tactile In-Hand Manipulation",
      venue: "M.S. Thesis · Seoul National University",
      date: "2026",
      status: "release upcoming",
    },
    {
      title: "PoP-SLAM: Point Cloud Projection for SLAM",
      venue: "S. Jung, K. Attri, J. Marchand, M. L. Paolicchi · course project, SNU",
      date: "2024",
      href: "assets/docs/PoP_SLAM_Paper.pdf",
      status: "PDF",
    },
  ],

  /* ──────── E1 / PERSONAL PROJECTS — released libraries ──────── */
  software: [
    {
      id: "splatreg",
      name: "splatreg",
      install: "pip install splatreg",
      spec: "BSD-3-Clause · pure PyTorch",
      oneliner: "Register Gaussian splats.",
      summary:
        "Aligning independently captured 3D Gaussian-Splatting scans usually means falling back to point-cloud registration that throws away the splat structure. splatreg registers natively on the Gaussian representation (a Gaussian-SDF residual with a closed-form Jacobian over SE(3)/Sim(3)), then merges the registered scans into one coherent splat scene, with photometric refinement where geometry alone under-constrains the solution.",
      stats: [
        { value: "91.5%", label: "official 3DMatch registration recall" },
        { value: "10.3 → 2.0 mm", label: "splat-merge Chamfer vs naïve concat" },
        { value: "5° → 0.36°", label: "photometric refine where geometry under-constrains" },
      ],
      links: [
        { label: "Docs & guide", href: "https://archerkattri.github.io/splatreg/" },
        { label: "PyPI", href: "https://pypi.org/project/splatreg/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/splatreg" },
        { label: "DOI 10.5281/zenodo.20618389", href: "https://doi.org/10.5281/zenodo.20618389" },
      ],
    },
    {
      id: "mathlas",
      name: "mathlas",
      install: "pip install mathlas-mcp",
      spec: "MCP server · 13 tools · no LLM inside · no API key",
      oneliner: "Airtight math tools an AI uses.",
      summary:
        "Language models hallucinate theorems, and prose is not verification. mathlas is an MCP server of 13 deterministic, data-returning tools an AI agent drives: search over 3.7M theorems (dense + BM25 + rank fusion), PSLQ constant identification, OEIS sequence lookup, and real Lean-kernel formal checks. The agent is the brain; mathlas is the hands.",
      stats: [
        { value: "59.1 vs 45.0", label: "Hit@20 vs TheoremSearch, on its own 110 human queries" },
        { value: "0.96", label: "mathlib formal-search Hit@5" },
        { value: "3.7M", label: "theorems searchable, LLM-free" },
      ],
      links: [
        { label: "PyPI", href: "https://pypi.org/project/mathlas-mcp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/mathlas" },
      ],
    },
    {
      id: "hicache-pp",
      name: "HiCache++",
      install: "pip install hicache-pp",
      spec: "training-free · model-agnostic · 14-repo accelerator family",
      oneliner: "Diffusion acceleration by exponential forecasting.",
      summary:
        "Diffusion and flow samplers spend most of their compute re-deriving smoothly varying features. HiCache++ forecasts them with a Dynamic-Mode-Decomposition exponential basis, exact on the feature-ODE class these caches actually face, so prediction error stays flat across the skip horizon where polynomial bases (TaylorSeer, Hermite) diverge. Ships as a drop-in basis upgrade with per-model adapters across the TRELLIS, Hunyuan3D, and SAM 3D families, plus a ComfyUI node.",
      stats: [
        { value: "0.86 vs 0.74", label: "F-score held vs polynomial basis at skip-interval 5, Hunyuan3D-2.1" },
        { value: "flat", label: "forecast error in the skip horizon where polynomial bases diverge" },
        { value: "14", label: "repos in the family: TRELLIS · Hunyuan3D · SAM 3D · ComfyUI" },
      ],
      links: [
        { label: "PyPI", href: "https://pypi.org/project/hicache-pp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/hicache-plus-plus" },
      ],
      adaptersNote: "Per-model adapter cluster",
    },
  ],

  // HiCache accelerator family — the constellation closing the
  // PERSONAL PROJECTS room (expandable cluster under HiCache++ in doc view).
  // 13 accelerator repos (12 adapters + the TaylorSeer baseline) + 1 ComfyUI node.
  adapters: [
    { name: "hunyuan2.1-plus-plus", url: "https://github.com/Archerkattri/hunyuan2.1-plus-plus", desc: "HiCache++ (DMD) · Hunyuan3D-2.1" },
    { name: "hunyuan2.1-plus", url: "https://github.com/Archerkattri/hunyuan2.1-plus", desc: "HiCache (Hermite) · Hunyuan3D-2.1" },
    { name: "hunyuan2-plus-plus", url: "https://github.com/Archerkattri/hunyuan2-plus-plus", desc: "HiCache++ (DMD) · Hunyuan3D-2 mini" },
    { name: "hunyuan2-plus", url: "https://github.com/Archerkattri/hunyuan2-plus", desc: "HiCache (Hermite) · Hunyuan3D-2 mini" },
    { name: "hermit-trellis2-plus-plus", url: "https://github.com/Archerkattri/hermit-trellis2-plus-plus", desc: "HiCache++ (DMD) · TRELLIS.2-4B" },
    { name: "hermit-trellis2", url: "https://github.com/Archerkattri/hermit-trellis2", desc: "HiCache (Hermite) · TRELLIS.2-4B" },
    { name: "fast-trellis2", url: "https://github.com/Archerkattri/fast-trellis2", desc: "TaylorSeer baseline · TRELLIS.2-4B" },
    { name: "faster-trellis-plus-plus", url: "https://github.com/Archerkattri/faster-trellis-plus-plus", desc: "HiCache++ (DMD) · TRELLIS v1" },
    { name: "faster-trellis", url: "https://github.com/Archerkattri/faster-trellis", desc: "HiCache (Hermite) · TRELLIS v1" },
    { name: "sam3d-plus-plus", url: "https://github.com/Archerkattri/sam3d-plus-plus", desc: "HiCache++ (DMD) · SAM 3D Objects" },
    { name: "sam3d-plus", url: "https://github.com/Archerkattri/sam3d-plus", desc: "HiCache (Hermite) · SAM 3D Objects" },
    { name: "fastsam3d-plus-plus", url: "https://github.com/Archerkattri/fastsam3d-plus-plus", desc: "HiCache++ (DMD) · Fast-SAM3D" },
    { name: "fastsam3d-plus", url: "https://github.com/Archerkattri/fastsam3d-plus", desc: "HiCache (Hermite) · Fast-SAM3D" },
    { name: "ComfyUI-HiCache", url: "https://github.com/Archerkattri/ComfyUI-HiCache", desc: "ComfyUI node · Hunyuan3D via hicache-pp" },
  ],

  /* ──────────────── 03 / EXPERIENCE ──────────────── */
  experience: [
    {
      id: "snu-grad",
      title: "Graduate Research Student",
      org: "Soft Robotics & Bionics Laboratory, Seoul National University",
      location: "Seoul, KR",
      date: "2024 – 2026",
      summary: "GSFS Scholar. GaussianFeels thesis; PoP-SLAM; perception integration for the Phase-2 “Alchemist” humanoid (MOTIE).",
      bullets: [
        "Built GaussianFeels: online visuo-tactile reconstruction and pose tracking on an object-centric 3DGS map. 0.83 mm ADD-S sim / 3.37 mm real at ≈28 / ≈23.5 FPS, matching or beating model-free NeuralFeels at ≈7.6× the frame rate with no CAD model.",
        "Co-developed PoP-SLAM: projection-first dense visual SLAM, 0.75 cm ATE RMSE on TUM-RGBD on a consumer GPU.",
        "Leading integration of visuo-tactile SLAM and dexterous in-hand manipulation into the Phase-2 full-scale humanoid prototype of Korea's “Alchemist” programme.",
      ],
    },
    {
      id: "villanova-research",
      title: "Robotics & Mechatronics Researcher",
      org: "Villanova University",
      location: "Villanova, PA",
      date: "2023 – 2024",
      summary: "SLAM for GNSS-denied navigation with a Ph.D. dissertation project: quad-wheel outdoor robot.",
      bullets: [
        "Full ROS navigation stack: LiDAR-camera fusion with CNN feature extraction and visual odometry; path planning and obstacle avoidance.",
        "Probabilistic localisation (2D histogram filter + 1D Kalman tracker); Arduino and Raspberry Pi integration for real-time control.",
      ],
      links: [
        { label: "EOD robot (video)", href: "https://drive.google.com/file/d/1j4MmrqF4hBtm72m31q-CMhZi1sH-XFUF/view" },
        { label: "Drone (photo)", href: "https://drive.google.com/file/d/1ZDJsIq9ADl9KiKW8shVL8m0QTG8ocDcO/view" },
      ],
    },
    {
      id: "snu-intern",
      title: "Undergraduate Research Intern",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      location: "Seoul, KR",
      date: "Jan 2024",
      summary: "Winter research internship: stretchable sEMG sensing with deep-learned gesture recognition (PDMS, AgNP; CNN-GRU/ViT).",
      bullets: [],
      links: [
        { label: "Host letter", href: "https://drive.google.com/file/d/1Yjn6YxkFP2IrZ6nIX6LEbd2ud4eL7K1a/view" },
      ],
    },
    {
      id: "area2farms",
      title: "Indoor Farm Robotics Intern",
      org: "Area2Farms",
      location: "Arlington, VA",
      date: "Summer 2023",
      summary: "“Silo” vertical-farming automation: extruded-aluminium construction, pneumatics, industrial robotics, Arduino/Raspberry Pi, irrigation systems.",
      bullets: [],
      links: [
        { label: "Silo demo (video)", href: "https://drive.google.com/file/d/1jpMCaSRMn2I4JdgEA4p3HflIqo8gyRIV/view" },
      ],
    },
    {
      id: "ampere",
      title: "Product Design Intern",
      org: "Ampere LLC",
      location: "Remote, USA",
      date: "Summer 2022",
      summary: "3D product modelling for consumer technology; structural-integrity and physics analysis.",
      bullets: [],
      links: [
        { label: "Certificate", href: "https://drive.google.com/file/d/1AxBRIwhP1UCBmPsHwwNoF6xFk7Vxxkzu/view" },
      ],
    },
  ],

  // Non-research university jobs, kept compact (CV-complete, low signal).
  earlierRoles: [
    {
      title: "Distance Education Operator",
      org: "Villanova University",
      date: "2021, 2023 – 2024",
      note: "A/V support, live-stream recording, and archiving for online course production.",
    },
    {
      title: "Collections & Stewardship Technician",
      org: "Villanova University",
      date: "Jan – May 2022",
      note: "Digitisation, cataloguing, and preservation of rare and special collections for the university Digital Library.",
    },
  ],

  /* ──────── W2 / SCHOOL — education · honors · documents · stack ──────── */
  education: [
    {
      id: "ucf",
      degree: "Ph.D., Mechanical Engineering",
      school: "University of Central Florida",
      date: "from Aug 2026",
      note: "ORCGS Doctoral Fellow · Rehabilitation Engineering & Assistive Device Lab · Prof. Hwan Choi",
      status: "incoming",
      links: [{ label: "REAL lab", href: "https://mae.ucf.edu/REAL/" }],
    },
    {
      id: "snu",
      degree: "M.S., Mechanical Engineering",
      school: "Seoul National University",
      date: "2024 – 2026",
      note: "GSFS Scholar · Soft Robotics & Bionics Laboratory · Prof. Yong-Lae Park",
      status: "current",
    },
    {
      id: "villanova",
      degree: "B.S., Mechanical Engineering",
      school: "Villanova University",
      date: "2020 – 2024",
      note: "Minor in Mechatronics · Concentration: Control & Dynamics",
      status: "complete",
      links: [{ label: "Diploma", href: "https://drive.google.com/file/d/1uuABMpQOmXiOJIfSTqjgK9fICTAbfD8I/view" }],
    },
    {
      id: "yonsei",
      degree: "Exchange year, Mechanical Engineering",
      school: "Yonsei University",
      date: "2022 – 2023",
      note: "Controls · vibrations · circuit theory · probability",
      status: "complete",
    },
  ],

  honors: [
    { title: "ORCGS Doctoral Fellowship", org: "University of Central Florida", date: "2026" },
    { title: "GSFS Government Science Fellowship", org: "Seoul National University", date: "2024 – 2026" },
    { title: "Capstone 1st Place · Most Innovative Solution", org: "Villanova Capstone Showcase (FMC-sponsored)", date: "2024", href: "https://drive.google.com/file/d/10xUe6ecTiCBn9V9kp71g2aW9AZvQxZij/view" },
    { title: "NVIDIA Computer Vision Nanodegree", org: "Udacity × NVIDIA", date: "2024", href: "https://www.udacity.com" },
    { title: "Innovative Robot Technologies Certificate", org: "K-MOOC × Seoul National University", date: "2024", href: "https://drive.google.com/file/d/1eh473NGpXMR3spEjdZRsCS8XmjvXrOWi/view" },
    { title: "Robotics Specialization", org: "Coursera × UPenn", date: "2021", href: "assets/docs/UPenn_Robotics_Specialization.pdf" },
    { title: "Dean's List", org: "Villanova University", date: "2020 – 2021", href: "https://drive.google.com/drive/folders/1IBO5K6Gcza6jphcpmcG4xfOGqCaFuG6h" },
  ],

  leadership: [
    { title: "Secretary", org: "Villanova CubeSat Club", date: "2021 – 2023" },
    { title: "Representative & Head of Special Events", org: "Villanova International Students' Organisation (VISO)", date: "2020 – 2022", href: "https://drive.google.com/file/d/1RzqYPIy86B79B5MqpK0XlrJt-7_AM2fN/view" },
    { title: "Member", org: "Society of Asian Scientists & Engineers (SASE)", date: "2021 – 2022" },
    { title: "Member", org: "American Society of Mechanical Engineers (ASME)", date: "2021 – 2022" },
  ],

  // `drive` renders as a second "Drive" link on the row (CV link mirrors).
  documents: [
    { title: "Curriculum Vitae", href: "assets/docs/Krishi_Attri_CV.pdf" },
    { title: "Resume", href: "assets/docs/Krishi_Attri_Resume.pdf" },
    { title: "PoP-SLAM paper", href: "assets/docs/PoP_SLAM_Paper.pdf", drive: "https://drive.google.com/file/d/1JT2TqpzqHVoeGwcp_y6MgJ7XKNKrY2k6/view" },
    { title: "Capstone award", href: "assets/docs/Capstone.pdf", drive: "https://drive.google.com/file/d/10xUe6ecTiCBn9V9kp71g2aW9AZvQxZij/view" },
    { title: "NVIDIA CV Nanodegree certificate", href: "assets/docs/NVIDIA_CV_Nanodegree.pdf" },
    { title: "UPenn Robotics Specialization", href: "assets/docs/UPenn_Robotics_Specialization.pdf" },
    { title: "K-MOOC robotics certificate", href: "assets/docs/KMOOC_Robotics_Certificate.pdf", drive: "https://drive.google.com/file/d/1eh473NGpXMR3spEjdZRsCS8XmjvXrOWi/view" },
    { title: "GRE report (ETS-verified)", href: "assets/docs/GRE_Report.pdf", drive: "https://drive.google.com/file/d/1M7Dh0DLPcqoVYxbkJMNK0gV8tKxPSFgQ/view" },
    { title: "SNU internship host letter", href: "assets/docs/SNU_Host_Letter.pdf", drive: "https://drive.google.com/file/d/1Yjn6YxkFP2IrZ6nIX6LEbd2ud4eL7K1a/view" },
    { title: "CIEE internship certificate", href: "assets/docs/CIEE_Internship_Certificate.pdf" },
  ],

  skills: {
    "Perception & SLAM": ["3D Gaussian Splatting", "visuo-tactile SLAM", "RGB-D reconstruction", "SE(3)/Sim(3) registration", "pose tracking", "sensor fusion"],
    "ML & acceleration": ["PyTorch", "CUDA kernels", "diffusion / flow models", "image-to-3D", "feature caching (DMD)", "differentiable rendering"],
    "Agents & formal methods": ["MCP servers", "dense + BM25 retrieval", "Lean 4 kernel", "PSLQ / OEIS"],
    "Robotics & hardware": ["ROS", "UR5e", "Allegro Hand", "DIGIT tactile", "LiDAR + IMU + RTK", "Arduino / Raspberry Pi", "NVIDIA Omniverse"],
    "Languages & tools": ["Python", "C/C++", "MATLAB", "LaTeX", "SOLIDWORKS", "Linux", "Git"],
  },

  /* ──────── E2 / SCHOOL PROJECTS — capstone first, then earlier builds ──────── */
  capstoneLinks: [
    { label: "Demo (video)", href: "https://drive.google.com/file/d/1zEG6LDlZCQA53AZkhExszn-gvobSY_eJ/view" },
    { label: "Award (PDF)", href: "assets/docs/Capstone.pdf" },
    { label: "Build photos", href: "https://drive.google.com/drive/folders/1OnC6WH0cYxu9iah17IazbRR_e9FZAVe_" },
  ],
  archive: [
    { title: "Plant-lifting device for 3D imaging", date: "2024", note: "FMC-sponsored capstone: 1st place, Most Innovative Solution. Team lead.", href: "assets/docs/Capstone.pdf" },
    { title: "CV object-detection web app", date: "2024", note: "React + Flask; benchmarked five detectors on COCO.", href: "https://github.com/Archerkattri/computervisionproj" },
    { title: "EOD robot platform", date: "2023", note: "Explosive-ordnance-disposal robotics; teleoperation and manipulation." },
    { title: "Arduino puzzle box", date: "2022", note: "Randomised solution algorithm; glitter-spray penalty for wrong inputs." },
    { title: "Beetle-Bot combat robot", date: "2021", note: "3rd place, Villanova mechatronics. Four-person scratch build.", href: "https://drive.google.com/file/d/12ev4UjjLiQ6n4_rTCk3_GcAre4CsAFtV/view" },
    { title: "Wi-Fi drone + swarm coordination", date: "2021", note: "Custom stability firmware; multi-drone sync experiments.", href: "https://drive.google.com/drive/folders/1bzEPNABtsGoq2RYjYHbbVUkUtQjvijcg" },
    { title: "Servo robotic arm", date: "2021", note: "Servo-actuated arm programmed for pick-and-place." },
    { title: "Self-assembled 3D printer", date: "2021", note: "Frame, wiring, firmware, slicer; full bring-up." },
    { title: "SOLIDWORKS scooter model", date: "2021", note: "Four-person team; designed and 3D-printed a functional scooter." },
    { title: "Assistive wearable concept", date: "2020", note: "3rd place, Villanova ICE competition." },
    { title: "Basketball outcome prediction", date: "2020", note: "Python ML mini-project; three-person team." },
  ],

  gallery: [
    { src: "assets/images/robotics-mechatronics.jpg", caption: "Quad-wheel research robot · LiDAR + vision SLAM · 2023" },
    { src: "assets/images/aerial-robot.jpg", caption: "Custom carbon-fibre aerial platform" },
    { src: "assets/images/silo.jpg", caption: "Vertical farming rack · Area2Farms · 2023" },
    { src: "assets/images/silo-circuit.jpg", caption: "Relay control circuit · Silo automation" },
    { src: "assets/images/beetlebot.jpg", caption: "Beetle-Bot · combat robotics · 2021" },
    { src: "assets/images/personal-drone.jpg", caption: "Wi-Fi drone · personal build · 2021" },
  ],
  galleryVideos: [
    { src: "assets/videos/eod-robot.mp4", poster: "assets/videos/eod-robot-poster.jpg", caption: "EOD robot · undergraduate research" },
    { src: "assets/videos/silo-internship.mp4", poster: "assets/videos/silo-internship-poster.jpg", caption: "Silo automation · Area2Farms" },
  ],

  openTo: [
    "Robotics / AI research collaborations",
    "Internships in robot perception or 3D vision",
    "Roles in SLAM, applied ML & manipulation",
  ],
};
