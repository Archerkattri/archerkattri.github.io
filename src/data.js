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
      linkedin: "https://www.linkedin.com/in/krishi-attri15/",
      orcid: "https://orcid.org/0009-0005-4695-6467",
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
        statA: "1.13 mm",
        mid: " object tracking during in-hand manipulation, at ",
        statB: "7.0–12.4×",
        post: " the frame rate of the neural-field baseline (simulation).",
      },
      libraries: [
        { label: "splatreg", href: "#splatreg" },
        { label: "mathlas", href: "#mathlas" },
        { label: "HiCache++", href: "#hicache-pp" },
        { label: "CERT-FLOW", href: "#cert-flow" },
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
        { value: "1.13", unit: "mm", label: "pose ADD-S · simulation · 50 FPS" },
        { value: "2.42", unit: "mm", label: "pose ADD-S · real hardware · 37 FPS" },
        { value: "0.997", unit: "", label: "map F-score@5 mm · sim (0.950 real)" },
        { value: "7.0–12.4×", unit: "", label: "frame rate vs NeuralFeels · sim" },
      ],
      // Expanded-card copy distilled from the thesis abstract.
      details: [
        "One map, every job: a single object-centric 3D Gaussian state serves training, rendering, frozen-map SDF pose tracking, reconstruction evaluation, and manipulation-facing geometry. It replaces the neural-implicit SDF as the shared representation for online, model-free visuo-tactile object SLAM.",
        "Pose is recovered by a multi-residual Levenberg-Marquardt optimiser solving SE(3) against a frozen dual-sigma Gaussian-density anchor SDF, fusing synchronized RGB-D, tactile, and proprioceptive observations in one canonical frame.",
        "A frame-zero branch generates a shape estimate from a single RGB crop with an image-to-3D model, then progressively replaces generated geometry with measured geometry as the episode progresses.",
        "Evaluated on the FeelSight benchmark (8 simulation + 6 real-robot objects) across its simulation, real-robot, and occlusion splits, against the NeuralFeels and V-HOP baselines.",
        "Pose mode: ADD-S 1.13 mm in simulation at 50 FPS and 2.42 mm on coverage-adequate real objects at 37 FPS, on a single RTX 5090. Map mode: observed-surface F-score@5 mm of 0.997 (sim) / 0.950 (real).",
        "Lower pose error than NeuralFeels on every simulation aggregate at 7.0–12.4× the per-frame speed (5.8–8.3× on real); full-surface F-score 0.997 vs 0.908 on the matched object, cutting reconstruction time from ≈52 min to 12 s.",
        "Edges V-HOP on occlusion-split ADD-S (1.45 vs 1.46 mm) at 48.8 vs 32 FPS, all with no supplied CAD model.",
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
      title: "Registering Gaussian Splats Without the Point-Cloud Detour: Accuracy, Representation Semantics, and a Negative Result on Hypothesis-Stage Transfer",
      venue: "K. Attri · engrXiv preprint · companion software: splatreg",
      date: "2026",
      href: "https://doi.org/10.31224/7313",
      status: "DOI 10.31224/7313",
      page: "https://engrxiv.org/preprint/view/7313",
      pageLabel: "engrXiv page",
    },
    {
      title: "No Single Basis Wins: A Cross-Family Study of Diffusion Feature Forecasting and the Limits of Training-Free Basis Selection",
      venue: "K. Attri · engrXiv preprint · companion software: HiCache++",
      date: "2026",
      href: "https://doi.org/10.31224/7309",
      status: "DOI 10.31224/7309",
      page: "https://engrxiv.org/preprint/view/7309",
      pageLabel: "engrXiv page",
    },
    {
      title: "CERT: Certified Route Planning under Drifting Costs, Conformal Certificates, Sense-to-Certify, and the Price of Staleness",
      venue: "K. Attri · engrXiv preprint · companion software: CERT-FLOW",
      date: "2026",
      href: "https://doi.org/10.31224/7306",
      status: "DOI 10.31224/7306",
      page: "https://engrxiv.org/preprint/view/7306",
      pageLabel: "engrXiv page",
    },
    {
      title: "ToothPrint: A Certified, Partial-Overlap-Robust System for Dental Biometric Identification",
      venue: "K. Attri · engrXiv preprint · companion software: ToothPrint",
      date: "2026",
      href: "https://doi.org/10.31224/7403",
      status: "DOI 10.31224/7403",
      page: "https://engrxiv.org/preprint/view/7403",
      pageLabel: "engrXiv page",
    },
    {
      title: "PoP-SLAM: Point Cloud Projection for SLAM",
      venue: "S. Jung, K. Attri, J. Marchand, M. L. Paolicchi · course project, SNU",
      date: "2024",
      href: "assets/docs/PoP_SLAM_Paper.pdf",
      status: "PDF",
    },
  ],

  /* ──────── E1 / PERSONAL PROJECTS — released research software ──────── */
  software: [
    {
      id: "splatreg",
      name: "splatreg",
      install: "pip install splatreg",
      spec: "v1.4.0 · BSD-3-Clause · pure PyTorch · CLI + API",
      oneliner: "Register Gaussian splats.",
      summary:
        "Aligning independently captured 3D Gaussian-Splatting scans usually means falling back to point-cloud registration that throws away the splat structure. splatreg registers natively on the Gaussian representation (a Gaussian-SDF residual with a closed-form Jacobian over SE(3)/Sim(3)), then merges, or aligns without merging: the CLI bakes the recovered pose into the source so both scans stay separate PLYs in one frame. Baked-in transforms rotate the higher-order spherical-harmonic colour with the splat (real-basis Wigner-D); photometric refinement with exposure compensation handles the poses geometry cannot see; every builtin solve reports pose covariance for pose-graph weighting, never faked. Recall matches the GeoTransformer point-cloud baseline on official 3DMatch (91.5% mean / 93.5% pooled) and 3DLoMatch (72.5% / 74.4%) while adding the Sim(3) scale DoF the baseline lacks, and rotation lands 2.9× tighter than existing splat tools (5.2° vs 15.3°). The MAC maximal-clique seed handles contaminated correspondence sets, with the honest measured verdict kept: a wash on the official 3DMatch split, a decisive win on structured decoys.",
      stats: [
        { value: "91.5%", label: "official 3DMatch registration recall, 1279 pairs" },
        { value: "2.4e-15", label: "SH Wigner-rotation error vs an independent evaluator" },
        { value: "10.3 → 2.0 mm", label: "splat-merge Chamfer vs naïve concat" },
        { value: "5° → 0.36°", label: "photometric refine where geometry under-constrains" },
      ],
      links: [
        { label: "Docs & guide", href: "https://archerkattri.github.io/splatreg/" },
        { label: "PyPI", href: "https://pypi.org/project/splatreg/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/splatreg" },
        { label: "Preprint (engrXiv)", href: "https://doi.org/10.31224/7313" },
        { label: "DOI 10.5281/zenodo.20618389", href: "https://doi.org/10.5281/zenodo.20618389" },
      ],
    },
    {
      id: "mathlas",
      name: "mathlas",
      install: "pip install mathlas-mcp",
      spec: "v1.5.0 · Apache-2.0 · 12 MCP tools · no LLM inside, no API key · official MCP registry · Glama grade A",
      oneliner: "Airtight math tools an AI uses.",
      summary:
        "Language models hallucinate theorems, and prose is not verification. mathlas is an MCP server of 12 deterministic, data-returning tools an AI agent drives: search over a 3.68M-document index (dense + BM25 + rank fusion), PSLQ constant identification, OEIS sequence lookup, and real Lean-kernel checks that now verify full proofs, returning the kernel's error verbatim so the agent can repair and re-call. A quantized laptop tier serves the same index from 1.9 GB at 2.4 s/query on 4 CPU threads, measured recall-lossless. The discipline is airtight-or-nothing: every verification tier returns an independently checkable fact or an honest nothing, with zero false positives measured across all tiers.",
      stats: [
        { value: "18/18 vs 15/18", label: "the same agent on 18 math tasks, with vs without mathlas" },
        { value: "59.1 vs 45.0", label: "Hit@20 vs TheoremSearch, on its own 110 human queries" },
        { value: "3.68M", label: "documents indexed; dual-channel R@10 0.999; 1.9 GB quantized tier" },
      ],
      links: [
        { label: "PyPI", href: "https://pypi.org/project/mathlas-mcp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/mathlas" },
        { label: "Glama (MCP)", href: "https://glama.ai/mcp/servers/Archerkattri/mathlas" },
        { label: "DOI 10.5281/zenodo.20618603", href: "https://doi.org/10.5281/zenodo.20618603" },
      ],
    },
    {
      id: "cert-flow",
      name: "CERT-FLOW",
      install: "pip install certflow",
      spec: "v1.1.0 · MIT · 227 tests · 16 reproduction pipelines · engrXiv preprint",
      oneliner: "Certified route planning under drifting costs.",
      summary:
        "A robot replanning through a world whose costs drift never knows how good its current route is once the map goes stale; classical planners silently trust the stale map. CERT-FLOW answers with a proof every round: a high-probability certificate LB ≤ OPT ≤ UB on the optimal route cost, built from age-weighted non-exchangeable conformal prediction over drift-adjusted residuals, and it spends paid sensing exactly where the certificate says the gap shrinks fastest. When the certificate proves the map tight, that proof licenses ns-to-µs preprocessed queries that self-expire the instant drift exceeds tolerance. Seven theorems (coverage through an impossibility result on lower bounds), validated on 17 synthetic regimes, game maps, and real traffic (METR-LA, PEMS-BAY); the failed hypotheses stay documented in the record.",
      stats: [
        { value: "0.95 – 1.00", label: "coverage on every condition ever run; classical replanning 0.02 – 0.59" },
        { value: "269 ns", label: "certificate-gated static cost query; 3.7 ms p50 full certified round, one CPU core" },
        { value: "2 – 3×", label: "lower sensing regret than freshness, uncertainty, or random at equal budget" },
      ],
      links: [
        { label: "Docs & guide", href: "https://archerkattri.github.io/CERT-FLOW/" },
        { label: "PyPI", href: "https://pypi.org/project/certflow/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/CERT-FLOW" },
        { label: "Preprint (engrXiv)", href: "https://doi.org/10.31224/7306" },
        { label: "Results, per experiment", href: "https://github.com/Archerkattri/CERT-FLOW/tree/main/docs/results" },
        { label: "DOI 10.5281/zenodo.20631476", href: "https://doi.org/10.5281/zenodo.20631476" },
      ],
    },
    {
      id: "toothprint",
      name: "ToothPrint",
      install: "git clone https://github.com/Archerkattri/toothprint",
      spec: "v1.1.0 · PolyForm Noncommercial · certification core: numpy/scipy, no GPU · engrXiv preprint",
      oneliner: "Certified dental identity, change, and surface.",
      summary:
        "Three reads of one durable signal, each returning a certificate instead of a guess: identity (person ID from a 3D intraoral scan or a 2D radiograph), change (certified longitudinal bone-level change), and surface (certified 3D surface change, ~0.264 mm median, 38.9% better than 3DGS). Every verdict is conformal: it fires only when the interval around the measurement lies entirely past the threshold, so the false-match rate is bounded by the chosen error rate α in finite samples, and it abstains when the query falls outside the validated regime. It is the only dental-ID system pairing a distribution-free finite-sample FMR bound with open-set abstention and partial-overlap robustness, lifting 50%-tooth-loss identification from 0.23 (rigid GICP) to 0.87. Honest ceiling: every headline number is measured on synthetic re-scans and crops of single-timepoint public data (Teeth3DS+, Poseidon3D), so they read as in-simulation ceilings until a clinical or forensic partner supplies real cross-session longitudinal data, the one gate still open. Priority staked by the engrXiv preprint.",
      stats: [
        { value: "0.995 / 0.5%", label: "Rank-1 / EER · identity at full coverage, N=200 · synthetic" },
        { value: "0.23 → 0.87", label: "50%-tooth-loss identification, learned matcher vs rigid GICP" },
        { value: "0.264 mm", label: "median surface-change error, 38.9% better than 3DGS" },
      ],
      links: [
        { label: "Docs & guide", href: "https://archerkattri.github.io/toothprint/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/toothprint" },
        { label: "Preprint (engrXiv)", href: "https://doi.org/10.31224/7403" },
      ],
    },
    {
      id: "aura",
      name: "AURA",
      install: "git clone https://github.com/Archerkattri/aura",
      spec: "v0.1.0 · research preview · MIT · KHR + OpenUSD 26.03 export",
      oneliner: "The radiance-asset layer after 3DGS.",
      summary:
        "AURA (Adaptive Unified Radiance Asset) turns posed captures into a typed, queryable, engine-ready radiance asset, keeping the fast Gaussian and DBS-Beta renderers where they are strong and adding the asset layer they do not provide. Its distinguishing property is a calibrated, certified per-carrier confidence channel exported inside the splat file itself, in KHR_gaussian_splatting GLB and the official OpenUSD 26.03 schema, a reliability signal no bare splat ships. Across four scenes (Truck, Garden, Kitchen, Room) an export-time color-agreement feature predicts held-out per-carrier reliability at r = 0.91–0.98, isotonic calibration cuts expected calibration error by ~300–900×, and calibrated selection lands within 1–4% of the oracle at budgets where opacity pruning is at or below random. Honest caveats: this is a research preview; the matched-budget quality control is a frozen-β DBS ablation rather than full gsplat 3DGS, and the accompanying +dB figure reproduces a published DBS result rather than a new one; the documented negatives (adaptive per-carrier β does not beat a good global β) stay in the record, not hidden.",
      stats: [
        { value: "r = 0.91–0.98", label: "export-time feature predicts held-out reliability · 4 scenes" },
        { value: "~300–900×", label: "calibration error (ECE) reduction after isotonic calibration" },
        { value: "1M → 52 MB", label: "confidence-annotated KHR GLB, plus OpenUSD 26.03 export" },
      ],
      links: [
        { label: "GitHub", href: "https://github.com/Archerkattri/aura" },
      ],
    },
    {
      id: "hicache-pp",
      name: "HiCache++",
      install: "pip install hicache-pp",
      spec: "v1.2.1 · MIT · training-free · DMD calibrator merged into cache-dit · 16-repo accelerator family",
      oneliner: "Diffusion acceleration by feature forecasting, honestly selected.",
      summary:
        "Feature caches skip the network on most denoising steps and forecast the cached features instead. HiCache++ ships the exponential (Dynamic Mode Decomposition / Prony) basis, exact on the local feature-ODE class where polynomial bases (TaylorSeer, Hermite) diverge, and the honest finding the benchmarks forced: no single forecast basis wins across diffusion families. The exponential basis wins on flow-matching 3D generators; polynomials hold DiT-class denoising. So the product is the selector: backend auto backcasts a held-out snapshot with both bases at every compute step and serves whichever demonstrably wins, at zero extra model calls. The same study surfaced a benchmark-integrity find: a one-character sign error that left a published baseline anti-extrapolative yet invisible to every end-to-end metric, answered with directional closed-form regression tests. The exponential-basis DMD calibrator is now upstream: it was merged into vipshop/cache-dit (PR #1053, 2026-06-14) and ships in cache-dit v1.5.0, behind SGLang-Diffusion, vLLM-Omni, and ComfyUI. Also deployed through per-model adapters across TRELLIS, Hunyuan3D, and SAM 3D, plus three GPU-validated ComfyUI nodes (Hunyuan3D, TRELLIS, TRELLIS.2).",
      stats: [
        { value: "0.860 vs 0.735", label: "F-score at skip-interval 5, exponential vs polynomial arm, Hunyuan3D-2.1" },
        { value: "1.56×", label: "geometry-lossless (F1 = 1.000) through interval 6, SAM 3D Objects" },
        { value: "120/120", label: "holdout auto detects basis misfit and serves the winning arm" },
      ],
      links: [
        { label: "PyPI", href: "https://pypi.org/project/hicache-pp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/hicache-plus-plus" },
        { label: "Merged into cache-dit (PR #1053)", href: "https://github.com/vipshop/cache-dit/pull/1053" },
        { label: "Preprint (engrXiv)", href: "https://doi.org/10.31224/7309" },
        { label: "DOI 10.5281/zenodo.20618824", href: "https://doi.org/10.5281/zenodo.20618824" },
      ],
      adaptersNote: "Per-model adapter cluster",
    },
  ],

  // HiCache accelerator family — the constellation closing the
  // PERSONAL PROJECTS room (expandable cluster under HiCache++ in doc view).
  // 13 accelerator repos (12 adapters + the TaylorSeer baseline) + 3 ComfyUI nodes.
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
    { name: "ComfyUI-HiCache", url: "https://github.com/Archerkattri/ComfyUI-HiCache", desc: "ComfyUI node · Hunyuan3D via hicache-pp · beta, 35 tests" },
    { name: "ComfyUI-TRELLIS-HiCache", url: "https://github.com/Archerkattri/ComfyUI-TRELLIS-HiCache", desc: "ComfyUI node · TRELLIS via HiCache · ~2×, near-lossless" },
    { name: "ComfyUI-TRELLIS2-HiCache", url: "https://github.com/Archerkattri/ComfyUI-TRELLIS2-HiCache", desc: "ComfyUI node · TRELLIS.2 via HiCache · ~2×, near-lossless" },
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
        "Built GaussianFeels: online visuo-tactile reconstruction and pose tracking on an object-centric 3DGS map. Pose ADD-S 1.13 mm sim (50 FPS) / 2.42 mm real (37 FPS), beating NeuralFeels on every sim aggregate at 7.0–12.4× the frame rate, with no CAD model.",
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
