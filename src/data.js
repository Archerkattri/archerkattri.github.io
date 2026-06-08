// Portfolio data — edit this file to update content
export const PORTFOLIO_DATA = {
  profile: {
    name: "Krishi Attri",
    tagline: "Robotics Researcher · 3D Reconstruction · Visuo-Tactile SLAM",
    short: "M.S. Mechanical Engineering, Seoul National University (GSFS Scholar). Incoming Ph.D., University of Central Florida (ORCGS Doctoral Fellow).",
    about: [
      "I build perception systems for robots that have to see, feel, and reconstruct the world in real time — often with most of the object hidden.",
      "My current work at Seoul National University's Soft Robotics & Bionics Laboratory focuses on online 3D reconstruction and pose tracking for in-hand manipulation. I develop visuo-tactile SLAM systems built around explicit 3D Gaussian Splatting maps, fusing RGB-D vision, DIGIT tactile sensing, and hand proprioception into a shared object-centric representation.",
      "This runs on real hardware: UR5e arms, Allegro Hands, NVIDIA Omniverse simulation pipelines, and GPU-accelerated CUDA kernels. I care about the full stack — from the sensor bring-up through to the algorithm that closes the loop.",
      "Alongside the perception stack, I build and release open-source research tools: HiCache++, a training-free DMD velocity-cache that accelerates the diffusion- and flow-based image-to-3D models my reconstruction pipeline depends on; splatreg, a 3D Gaussian-Splatting registration library; and mathlas, a formal-math MCP toolkit for AI agents.",
      "Before graduate research, I spent four years at Villanova University studying mechanical engineering with a minor in mechatronics, with an exchange year at Yonsei University. Along the way I've built drones, combat robots, agricultural automation rigs, and a 1st-place capstone prototype."
    ],
    headshot: "assets/images/headshot-sm.png",
    contact: {
      email: "krishiattriwork@gmail.com",
      linkedin: "https://linkedin.com/in/krishi-attri15",
      github: "https://github.com/Archerkattri",
      location: "Seoul, South Korea → Orlando, FL (Aug 2026)"
    },
    languages: "English (Fluent), Hindi (Fluent), Korean (Beginner)"
  },

  research: [
    {
      id: "gaussianfeels",
      title: "GaussianFeels",
      subtitle: "Object-Centric Gaussian SLAM for Visuo-Tactile In-Hand Manipulation",
      role: "M.S. Thesis · Advisor: Prof. Yong-Lae Park",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      date: "Dec 2024 — Present",
      tag: "Active",
      summary: "An online visuo-tactile SLAM system built around an explicit object-centric 3D Gaussian Splatting map that reconstructs and tracks objects during in-hand manipulation — even under heavy occlusion.",
      overview: [
        "GaussianFeels attacks the core problem of in-hand manipulation: when a robot hand grasps an object, it systematically occludes exactly the region it most needs to perceive. Vision alone fails; tactile alone is too sparse; neither, individually, supports real-time pose tracking or geometry refinement.",
        "The system fuses RGB-D frames, segmentation masks, DIGIT tactile contact geometry, and hand proprioception into a shared object-centric Gaussian representation that is maintained online and synchronised to the world frame only when supervision or rendering requires it."
      ],
      contributions: [
        "Designed the system around four integrated components: multimodal sensor ingestion, an object-centric Gaussian map with contact-aware management, a pose tracker embedded in the SLAM loop (GT, GT-init, full SLAM modes), and a parallel manipulation branch for frame-0 shape completion.",
        "Implemented contact-aware Gaussian population management: multimodal spawning, direct contact-point insertion, tactile-region density boosting, and selective freezing to preserve contact-critical geometry.",
        "Designed an occlusion-aware training objective that dynamically reweights RGB, depth, and tactile supervision based on hand-induced occlusion.",
        "Built the pose tracker as a multi-residual Levenberg–Marquardt SE(3) optimiser over a frozen Gaussian-density SDF — photometric, depth-SDF, tactile-SDF, tactile-normal, and one-sided non-penetration residuals with an analytic Jacobian read through gsplat, plus tactile-aware frame-0 seeding and an ICP prior between consecutive depth observations.",
        "Integrated a frame-0 shape-completion bootstrap with Hunyuan3D-2-mini: an orientation-variant 3D prior is aligned to frame-0 observations, then progressively replaced by measured geometry."
      ],
      tools: ["3D Gaussian Splatting", "PyTorch", "CUDA", "gsplat", "Levenberg–Marquardt SE(3)", "Hunyuan3D", "NVIDIA Omniverse", "UR5e", "Allegro Hand", "DIGIT Tactile", "ROS", "Open3D"],
      programme: {
        title: "“Alchemist” Humanoid Robot Project",
        subtitle: "Visuo-Tactile SLAM & In-Hand Manipulation Integration",
        org: "Soft Robotics & Bionics Lab, Seoul National University",
        date: "Sept 2024 — Aug 2026",
        tag: "Government-funded (MOTIE)",
        description: "GaussianFeels is developed as an integral module within the “Alchemist” Project — Korea's national high-risk, high-reward R&D programme (MOTIE). Phase 1 concluded in 2024; Phase 2 — the full-scale humanoid prototype (2024–2026) — is ongoing. My role is to bring GaussianFeels from research prototype to deployable on-robot perception system, bridging visuo-tactile SLAM and dexterous in-hand manipulation for the Phase 2 humanoid.",
        tools: ["UR5e", "Allegro Hand", "DIGIT Tactile Sensor", "NVIDIA Omniverse", "ROS", "CUDA"]
      },
      outcomes: [
        "Median ADD-S of 0.84 mm (simulation) and 3.4 mm (real) at ≈28 / ≈23.5 FPS on a single RTX 5090.",
        "Retains 94% of simulation reconstruction F-score@5 mm on real hardware (0.95 → 0.89) versus 80% for NeuralFeels.",
        "Matches or exceeds the model-free NeuralFeels baseline at ≈7.6× the frame rate with no supplied CAD model.",
        "Evaluated on the FeelSight benchmark family (14-object sweep) — simulation, real-world rollouts, and occlusion-focused episodes — benchmarked against NeuralFeels and V-HOP.",
        "Developed as part of the lab's Phase 2 “Alchemist” full-scale humanoid prototype."
      ],
      gallery: [],
      links: [{ label: "Companion site", href: "https://krishiattrisnu.github.io" }]
    },
    {
      id: "popslam",
      title: "PoP-SLAM",
      subtitle: "Point Cloud Projection for SLAM",
      role: "Co-author · with Seongmin Jung, Josselin Marchand, Michele Lorenzo Paolicchi",
      org: "Seoul National University",
      date: "Sept 2024 — Dec 2024",
      tag: "Published work",
      summary: "A dense visual SLAM system that replaces expensive nearest-neighbor search with a projection-first rendering pipeline, enabling real-time neural point cloud SLAM on consumer GPUs.",
      overview: [
        "Neural point cloud SLAM has historically been bottlenecked by per-pixel nearest-neighbor queries and volumetric rendering. PoP-SLAM proposes a direct alternative: project the neural point cloud onto the image plane using vectorised GPU matrix multiplication, mask by depth consistency across nearby keyframes, and render.",
        "The result is a tracking loop that runs at ~4 FPS on a single RTX 4070 while matching or beating the accuracy of much heavier baselines."
      ],
      contributions: [
        "Co-designed the projection-first rendering strategy, eliminating nearest-neighbor searches inherent to neural point cloud SLAM.",
        "Built the GPU-vectorised projection: ~15,000 neural points/frame transformed into image space via vectorised matrix multiplication.",
        "Introduced direct occlusion detection via multi-keyframe depth masking — retain only points consistent with measured depth across nearby keyframes, avoiding volume rendering entirely."
      ],
      tools: ["PyTorch", "CUDA", "Python", "NVIDIA RTX 4070", "Open3D", "TUM-RGBD", "Replica"],
      links: [{ label: "Full paper (PDF)", href: "assets/docs/PoP_SLAM_Paper.pdf" }],
      outcomes: [
        "Best ATE RMSE of 0.75 cm on TUM-RGBD — outperforming Point-SLAM, NICE-SLAM, ESLAM, and SplaTAM.",
        "0.38 cm average ATE RMSE on Replica dataset.",
        "~4 FPS on NVIDIA RTX 4070 (3× faster than Point-SLAM baseline).",
        "<3.3% overhead from point pruning."
      ],
      gallery: [],
    },
    {
      id: "humanoid",
      hidden: true,
      title: "“Alchemist” Humanoid Robot Project",
      subtitle: "Visuo-Tactile SLAM & In-Hand Manipulation Integration",
      role: "Graduate Research Student",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      date: "Sept 2024 — Aug 2026",
      tag: "Government-funded (MOTIE)",
      summary: "Integrating visuo-tactile SLAM and dexterous manipulation modules into the “Alchemist” Project — Korea's national high-risk, high-reward humanoid-robot R&D programme (MOTIE).",
      overview: [
        "The “Alchemist” Project is Korea's national high-risk, high-reward R&D programme (MOTIE), hosted at the Soft Robotics & Bionics Lab. Phase 1 concluded in 2024; Phase 2 — the full-scale humanoid prototype (2024–2026) — is ongoing.",
        "My role is to bring perception systems from research prototypes into deployable modules on the Phase 2 robot."
      ],
      contributions: [
        "Leading integration of visuo-tactile SLAM and dexterous in-hand manipulation into the Phase 2 full-scale humanoid prototype.",
        "Coordinating cross-disciplinary engineering teams across hardware, software, and control to hit quarterly integration milestones.",
        "Bridge research code (GaussianFeels, PoP-SLAM) to on-robot deployment."
      ],
      tools: ["UR5e", "Allegro Hand", "DIGIT Tactile Sensor", "NVIDIA Omniverse", "ROS", "CUDA"],
      outcomes: [
        "Phase 1 completed 2024.",
        "Phase 2 integration ongoing."
      ],
      gallery: [],
      links: []
    },
    {
      id: "gnss-denied",
      title: "Autonomous Localisation in GNSS-Denied Environments",
      subtitle: "SLAM via LiDAR–Camera Fusion for a Quad-Wheel Robot",
      role: "Undergraduate Research · Robotics & Mechatronics Researcher",
      org: "Villanova University",
      date: "Aug 2023 — May 2024",
      tag: "Undergraduate research",
      summary: "Collaborated with a Ph.D. candidate on a dissertation advancing SLAM via LiDAR–camera fusion and visual odometry for autonomous navigation without GPS.",
      overview: [
        "The project targets scenarios where GNSS is unavailable — indoors, underground, urban canyons. The platform is a quad-wheel outdoor robot equipped with a Velodyne LiDAR, cameras, IMU, and an onboard compute stack.",
        "My contribution spanned the full navigation stack: sensor fusion, localisation filters, feature extraction, and the ROS plumbing that ties it all together."
      ],
      contributions: [
        "Developed a full ROS-based navigation stack: path planning and obstacle-avoidance algorithms for a quad-wheel robot in GPS-denied environments.",
        "Applied CNN-based feature extraction and point cloud generation from fused VLP-16 LiDAR–Raspberry Pi camera data.",
        "Integrated VectorNav IMU, Emlid RTK GPS (for ground truth), and Vicon/OptiTrack motion capture for localisation evaluation.",
        "Configured Arduino Mega and Raspberry Pi for robust ROS communication and real-time motor control.",
        "Implemented a 2D histogram localisation filter and a 1D Kalman filter tracker using probabilistic motion models.",
        "Applied computer vision techniques (edge detection, landmark identification) for real-time 3D environment mapping."
      ],
      tools: ["ROS", "Python", "C++", "OpenCV", "VLP-16 LiDAR", "VectorNav IMU", "Emlid RTK GPS", "Vicon/OptiTrack", "Arduino", "Raspberry Pi", "CNN"],
      outcomes: [
        "Real-time 3D environment mapping from fused VLP-16 LiDAR–camera data.",
        "Improved tracking accuracy via 2D histogram localisation filter and 1D Kalman tracker."
      ],
      gallery: [{ src: "assets/images/robotics-mechatronics.jpg", caption: "Quad-wheel robot platform with VLP-16 LiDAR" }],
      video: "assets/videos/eod-robot.mp4",
      links: []
    },
    {
      id: "semg",
      title: "Stretchable sEMG Sensor",
      subtitle: "Flexible Electromyography with Deep-Learned Gesture Recognition",
      role: "Undergraduate Research Intern",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      date: "January 2024 (6 weeks)",
      tag: "Short-term research",
      summary: "Team project on surface electromyography sensors with flexible elements for wearability, paired with deep learning for gesture classification.",
      overview: [
        "A six-week intensive research placement hosted by Prof. Yong-Lae Park. The team developed a stretchable sEMG sensor using PDMS and vapour-deposited silver nanoparticles, then applied deep-learning classifiers to the raw signal.",
        "Placement letter from Prof. Yong-Lae Park dated December 9, 2023."
      ],
      contributions: [
        "Contributed to sensor stretchability research using PDMS (polydimethylsiloxane) and vapour-deposited silver nanoparticles.",
        "Assisted in applying CNN-GRU, CNN-RNN, and Vision Transformer (ViT) models to sEMG signal processing.",
        "Worked to reduce classification error and improve gesture-recognition accuracy."
      ],
      tools: ["PDMS", "Silver Nanoparticles", "CNN-GRU", "CNN-RNN", "ViT", "PyTorch"],
      outcomes: ["Gained proficiency in ML-based signal processing.", "Formed the basis for continued graduate research at the lab."],
      gallery: [],
      links: [{ label: "Host invitation letter (PDF)", href: "assets/docs/SNU_Host_Letter.pdf" }]
    }
  ],

  projects: [
    {
      id: "hicache",
      title: "HiCache++",
      subtitle: "Training-Free DMD Velocity-Cache for Diffusion & Flow-Based 3D Generation",
      role: "Author · Open-source research",
      org: "Independent",
      date: "2026",
      tag: "Open source",
      category: "software",
      summary: "A model-agnostic, training-free DMD / exponential velocity-cache that skips redundant denoising compute in diffusion and flow samplers while preserving output fidelity — directly accelerating the image-to-3D priors that seed the GaussianFeels reconstruction branch.",
      overview: [
        "Diffusion- and flow-based image-to-3D models spend most of their compute re-deriving smoothly-varying intermediate features. HiCache++ predicts those features from a short history using a Dynamic Mode Decomposition (exponential) basis, skipping redundant denoising steps without retraining or fidelity loss.",
        "It extends the lossless skip range of the prior HiCache (Hermite) and TaylorSeer feature-caching lines, and is released as a family of open-source repositories."
      ],
      contributions: [
        "Designed a model-agnostic, training-free DMD / exponential velocity-cache that holds reconstruction F-score where the polynomial basis collapses (0.86 vs 0.74 at skip-interval 5 on Hunyuan3D-2.1).",
        "Built and benchmarked acceleration across six-plus image-to-3D and generative backbones — Hunyuan3D-2 mini, Hunyuan3D-2.1, TRELLIS v1 and TRELLIS.2-4B, Meta SAM 3D Objects, Fast-SAM3D, and DiT-XL/2 — against the HiCache and TaylorSeer baselines.",
        "Released as open-source repositories (Python; MIT / BSD); directly accelerates the Hunyuan3D image-to-3D prior used by the GaussianFeels frame-0 reconstruction branch."
      ],
      tools: ["Python", "PyTorch", "CUDA", "Diffusion Models", "Flow Matching", "Hunyuan3D", "TRELLIS", "DMD"],
      outcomes: [
        "Holds F-score 0.86 vs 0.74 (polynomial basis) at skip-interval 5 on Hunyuan3D-2.1.",
        "Extends the lossless skip range of the HiCache (Hermite) and TaylorSeer lines.",
        "Open-source; accelerates the image-to-3D prior in GaussianFeels."
      ],
      gallery: [],
      links: [
        { label: "PyPI (hicache-pp)", href: "https://pypi.org/project/hicache-pp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/hicache-plus-plus" }
      ]
    },
    {
      id: "splatreg",
      title: "splatreg",
      subtitle: "SE(3)/Sim(3) Registration & Merging for 3D Gaussian Splatting",
      role: "Author · Open-source research",
      org: "Independent",
      date: "2026",
      tag: "Open source",
      category: "software",
      summary: "A pure-PyTorch library that registers and merges native 3D Gaussian-Splatting scans into one SE(3)/Sim(3) frame via a closed-form-Jacobian Gaussian-SDF residual.",
      overview: [
        "Aligning independently captured 3D Gaussian-Splatting scans usually means falling back to point-cloud registration that discards the splat structure. splatreg registers natively on the Gaussian representation using a Gaussian-SDF residual with a closed-form Jacobian, and adds the Sim(3) scale degree of freedom that rigid baselines lack."
      ],
      contributions: [
        "Implemented closed-form-Jacobian Gaussian-SDF registration over SE(3) and Sim(3) directly on native 3DGS scans.",
        "Matched GeoTransformer on official 3DMatch (91.5% recall) while adding the Sim(3) scale DoF it lacks.",
        "Reached ADD-S AUC 0.995 on YCB object pose at ≈17 ms per registration."
      ],
      tools: ["Python", "PyTorch", "3D Gaussian Splatting", "SE(3)/Sim(3)", "ICP", "GeoTransformer", "3DMatch", "YCB"],
      outcomes: [
        "91.5% recall on official 3DMatch — matching GeoTransformer, plus a Sim(3) scale DoF.",
        "ADD-S AUC 0.995 on YCB object pose at ≈17 ms.",
        "Released open-source (pure PyTorch)."
      ],
      gallery: [],
      links: [
        { label: "PyPI (splatreg)", href: "https://pypi.org/project/splatreg/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/splatreg" }
      ]
    },
    {
      id: "mathlas",
      title: "mathlas",
      subtitle: "Airtight-Math MCP Toolkit for AI Agents",
      role: "Author · Open-source research",
      org: "Independent",
      date: "2026",
      tag: "Open source",
      category: "software",
      summary: "An “airtight-math” MCP toolkit of 13 LLM-free, data-returning tools that give AI agents large-scale theorem search, constant & sequence identification, and Lean-kernel formal verification.",
      overview: [
        "Language models are unreliable at exact mathematics. mathlas exposes 13 deterministic, LLM-free tools over the Model Context Protocol so agents can search theorems, identify constants and integer sequences, and formally verify results — returning data, never prose.",
        "A self-augmenting retrieval loop lets the toolkit improve its own recall over time."
      ],
      contributions: [
        "Built a 1.6M-document theorem search (R@10 0.998) plus PSLQ/OEIS constant & sequence identification and Lean-kernel formal verification at a 0% false-positive rate.",
        "Designed a self-augmenting retrieval loop that surpasses TheoremSearch (59% vs 45% Hit@20).",
        "Packaged the toolkit as an MCP server (13 LLM-free, data-returning tools) for drop-in use by AI agents."
      ],
      tools: ["Python", "MCP", "Lean 4", "PSLQ", "OEIS", "mpmath", "Qwen3 embeddings", "BM25"],
      outcomes: [
        "Theorem search R@10 0.998 over 1.6M documents.",
        "Self-augmenting retrieval beats TheoremSearch (59% vs 45% Hit@20).",
        "Lean-kernel verification at a 0% false-positive rate."
      ],
      gallery: [],
      links: [
        { label: "PyPI (mathlas-mcp)", href: "https://pypi.org/project/mathlas-mcp/" },
        { label: "GitHub", href: "https://github.com/Archerkattri/mathlas" }
      ]
    },
    {
      id: "cv-app",
      title: "Computer Vision Object Detection Web App",
      subtitle: "Full-stack benchmarking of 5 detection models",
      date: "Summer 2024",
      category: "software",
      summary: "A React + Flask web application for real-time image and video object detection, benchmarking Faster R-CNN, Mask R-CNN, RetinaNet, Keypoint R-CNN, and SSDlite on COCO.",
      overview: [
        "Built from scratch as a full-stack web application: React frontend, Flask backend, Python inference pipeline.",
        "Evolved through 8 development versions — from single-model photo processing, through modularisation, to multi-model video comparison, with an in-development custom \"Focus Auto-Population Scan\" model."
      ],
      contributions: [
        "Implemented and benchmarked five detection models: Faster R-CNN, Mask R-CNN, RetinaNet, Keypoint R-CNN, SSDlite.",
        "Used PyTorch and TensorFlow with COCO dataset evaluation.",
        "Full-stack architecture: Python (62%), JavaScript (23%), CSS (13%), HTML (1%)."
      ],
      tools: ["Python", "PyTorch", "TensorFlow", "React", "Flask", "COCO API", "OpenCV"],
      outcomes: [
        "Mask R-CNN achieved highest annotation confidence (>0.8 scores).",
        "SSDlite achieved fastest throughput.",
        "Faster R-CNN balanced accuracy and speed."
      ],
      gallery: [],
      links: [{ label: "GitHub Repository", href: "https://github.com/Archerkattri/computervisionproj" }]
    },
    {
      id: "capstone",
      title: "Plant Lifting Device for 3D Imaging",
      subtitle: "Capstone — 1st Place, Most Innovative Solution",
      date: "Aug 2023 — May 2024",
      category: "hardware",
      summary: "Industry-sponsored senior capstone. Led a multidisciplinary team through the full design-to-prototype lifecycle of a plant-lifting mechanism for automated 3D imaging.",
      overview: [
        "Sponsored by FMC Corporation. The brief: build a device that can lift growing plants reliably and repeatably into a 3D imaging rig, under strict size constraints, without damaging the plant.",
        "I led a multidisciplinary team through actuator selection, motion-system design, wiring, waterproofing, and the plant-contact platform."
      ],
      contributions: [
        "Led the team through the full design-to-prototype lifecycle.",
        "Actuator selection and motion system (belts, pulleys, drive gears).",
        "Wiring, waterproofing, and plant platform engineering.",
        "Addressed sponsor size-limit constraints, plant stability risks, and motor-damage risks by developing a stabilising platform and controlled-speed mechanism.",
        "Applied project management across all design phases."
      ],
      tools: ["SOLIDWORKS", "Actuator design", "Motion systems", "Project management"],
      outcomes: [
        "1st Place, Most Innovative Solution — Villanova University Capstone Showcase (industry-sponsored, May 2024)."
      ],
      gallery: [],
      videoEmbed: "https://drive.google.com/file/d/1zEG6LDlZCQA53AZkhExszn-gvobSY_eJ/preview",
      links: [
        { label: "Capstone award certificate (PDF)", href: "assets/docs/Capstone.pdf" },
        { label: "Open demo on Google Drive", href: "https://drive.google.com/file/d/1zEG6LDlZCQA53AZkhExszn-gvobSY_eJ/view" }
      ]
    },
    {
      id: "eod",
      title: "EOD Robot",
      subtitle: "Explosive Ordnance Disposal Robot — Undergraduate Research",
      date: "Undergraduate",
      category: "hardware",
      summary: "Undergraduate research contribution to an EOD robotics platform. Video demonstration of the platform.",
      overview: [
        "Short undergraduate research involvement around explosive ordnance disposal robotics — a hardware-intensive platform with teleoperation and manipulation requirements."
      ],
      contributions: [
        "Contributed to platform development and demonstration."
      ],
      tools: ["Robotics hardware", "Teleoperation"],
      outcomes: [],
      video: "assets/videos/eod-robot.mp4",
      gallery: [{ src: "assets/images/robotics-mechatronics.jpg", caption: "Quad-wheel robot platform used in related GNSS-denied work" }],
      links: []
    },
    {
      id: "silo",
      title: "SILO — Indoor Farm Automation",
      subtitle: "Internship at Area2Farms, Arlington VA",
      date: "June 2023 — Aug 2023",
      category: "hardware",
      summary: "Summer internship contributing to the \"Silo\" automation tool for the local food system supply chain. Vertical farming, pneumatics, custom control circuits.",
      overview: [
        "Contributed to the Silo automation tool — a system for indoor vertical farming serving the local food system supply chain.",
        "Worked alongside a cross-functional team in Arlington, VA, prototyping automation for precision indoor agriculture."
      ],
      contributions: [
        "Engineered agricultural automation tooling with extruded aluminium and pneumatics.",
        "Programmed Arduino and Raspberry Pi systems for precision indoor farm robotics.",
        "Gained hands-on experience in industrial robotics, pneumatics, agricultural irrigation, and control circuit construction."
      ],
      tools: ["Arduino", "Raspberry Pi", "Pneumatics", "Extruded aluminium", "Industrial robotics", "Irrigation systems"],
      outcomes: [],
      video: "assets/videos/silo-internship.mp4",
      gallery: [
        { src: "assets/images/silo.jpg", caption: "Vertical farming rack at Area2Farms" },
        { src: "assets/images/silo-circuit.jpg", caption: "Custom control circuit — labeled relays for drop/lift/grip actuation" }
      ],
      links: []
    },
    {
      id: "aerial",
      title: "Aerial Robot (Drone)",
      subtitle: "Undergraduate Research — Carbon-fibre custom platform",
      date: "Undergraduate",
      category: "hardware",
      summary: "Undergraduate research on a custom aerial robot — carbon-fibre frame, GPS, IMU, onboard compute.",
      overview: [
        "Custom-built aerial platform with a carbon-fibre frame, RTK GPS, VectorNav IMU, and onboard compute. Used for outdoor robotics experiments."
      ],
      contributions: ["Contributed to hardware integration and flight-stack bring-up."],
      tools: ["Emlid RTK GPS", "VectorNav IMU", "Carbon-fibre frame"],
      outcomes: [],
      gallery: [{ src: "assets/images/aerial-robot.jpg", caption: "Custom aerial robot on the bench" }],
      links: []
    },
    {
      id: "arduino-mechatronics",
      title: "Arduino Mechatronics Builds",
      subtitle: "Three sensor-actuator integrations",
      date: "Jan 2022 — May 2022",
      category: "hardware",
      summary: "Three Arduino-based mechatronics projects integrating pressure, photo, and sound sensors with actuators, motors, and LCDs.",
      overview: [
        "Coursework-embedded mechatronics projects. The notable one: a puzzle box that randomised its solution steps via an algorithm and deployed a glitter-spray penalty when the sequence was entered incorrectly."
      ],
      contributions: [
        "Designed and built three Arduino-based projects.",
        "Integrated pressure, photo, and sound sensors with actuators, motors, and LCD displays.",
        "Built the glitter-spray puzzle box with algorithmic step randomisation."
      ],
      tools: ["Arduino", "Sensors", "Motors", "LCD displays"],
      outcomes: [],
      gallery: [],
      links: []
    },
    {
      id: "beetlebot",
      title: "Beetle-Bot — Miniature Combat Robot",
      subtitle: "Sophomore year team build · 3rd place",
      date: "Aug 2021 — Dec 2021",
      category: "hardware",
      summary: "Four-member team build of a miniature combat robot from scratch. 3rd place among sophomore Mechanical Engineering students.",
      overview: [
        "A sophomore-year team project to build a miniature combat robot from scratch. Everything: chassis, drivetrain, weapons system, wiring, control code."
      ],
      contributions: ["Team of four; end-to-end build."],
      tools: ["Mechatronics", "Hardware fabrication"],
      outcomes: ["3rd place, Villanova University Mechatronics Course (Dec 2021)."],
      gallery: [{ src: "assets/images/beetlebot.jpg", caption: "Beetle-Bot chassis" }],
      links: []
    },
    {
      id: "lego-car",
      title: "Lego Programmable Car",
      subtitle: "Early mechatronics build",
      date: "Early undergraduate",
      category: "hardware",
      summary: "Early programmable LEGO robotics build — drivetrain, gear train, and controller integration.",
      overview: ["An early programmable robotics exercise that got me hooked on the hardware side."],
      contributions: [],
      tools: ["LEGO Mindstorms", "Gear trains"],
      outcomes: [],
      gallery: [{ src: "assets/images/lego-car.jpg", caption: "Programmable LEGO car" }],
      links: []
    },
    {
      id: "wifi-drone",
      title: "Wi-Fi Controlled Drone",
      subtitle: "Personal project — custom stability logic",
      date: "Summer 2021",
      category: "hardware",
      summary: "Designed and programmed a Wi-Fi-controlled drone with custom stability logic.",
      overview: ["Personal summer project: a small Wi-Fi-controlled quadcopter with hand-written stability control."],
      contributions: ["End-to-end: frame, electronics, firmware."],
      tools: ["Microcontrollers", "Wi-Fi", "Flight control"],
      outcomes: [],
      gallery: [{ src: "assets/images/personal-drone.jpg", caption: "Personal drone build" }],
      links: []
    },
    {
      id: "swarm",
      title: "Swarm Drone Coordination",
      subtitle: "Personal project — multi-drone sync",
      date: "Summer 2021",
      category: "software",
      summary: "Multi-drone coordination algorithms for communication and synchronisation between small aerial platforms.",
      overview: ["Explored swarm-style coordination between multiple drones — message passing, synchronised manoeuvres."],
      contributions: [],
      tools: ["Multi-agent coordination", "Communication protocols"],
      outcomes: [],
      gallery: [],
      links: []
    },
    {
      id: "robotic-arm",
      title: "Servo Robotic Arm",
      subtitle: "Pick-and-place demonstrator",
      date: "Summer 2021",
      category: "hardware",
      summary: "Servo-actuated robotic arm programmed for pick-and-place operations.",
      overview: ["Personal build — 4-DOF servo arm with pick-and-place routines."],
      contributions: [],
      tools: ["Servos", "Arduino"],
      outcomes: [],
      gallery: [],
      links: []
    },
    {
      id: "3d-printer",
      title: "Self-Assembled 3D Printer",
      subtitle: "Hardware build + slicer configuration",
      date: "Summer 2021",
      category: "hardware",
      summary: "Assembled a 3D printer from scratch — hardware build, calibration, and slicing software configuration.",
      overview: ["Full bring-up: frame assembly, wiring, firmware configuration, slicer tuning."],
      contributions: [],
      tools: ["3D printer firmware", "Slicer configuration"],
      outcomes: [],
      gallery: [],
      links: []
    },
    {
      id: "basketball-ai",
      title: "Basketball Outcome Prediction",
      subtitle: "AI mini-project — three-person team",
      date: "Aug 2020 — Dec 2020",
      category: "software",
      summary: "Explored ML fundamentals in Python — a predictive model for basketball game outcomes.",
      overview: ["Early ML coursework project; built a simple predictive model in a three-member team."],
      contributions: [],
      tools: ["Python", "Scikit-learn"],
      outcomes: [],
      gallery: [],
      links: []
    },
    {
      id: "ice",
      title: "Assistive Device for the Visually Impaired",
      subtitle: "ICE Competition — 3rd Place, College of Engineering",
      date: "Aug 2020 — Dec 2020",
      category: "hardware",
      summary: "Led ideation and business model development for a wearable assistive device for visually impaired individuals. 3rd place in the Villanova ICE Competition.",
      overview: ["Four-member team. Innovation, Creativity & Entrepreneurship Idea Challenge — College of Engineering."],
      contributions: ["Led ideation and business model development."],
      tools: ["Product design", "Concept development"],
      outcomes: ["3rd place, College of Engineering."],
      gallery: [],
      links: []
    }
  ],

  // Additional public repositories (HiCache/HiCache++ acceleration family + misc),
  // surfaced compactly under Personal Projects → "All repositories".
  githubRepos: [
    { name: "hunyuan2.1-plus-plus", lang: "Python", url: "https://github.com/Archerkattri/hunyuan2.1-plus-plus", desc: "HiCache++ (DMD) acceleration for Hunyuan3D-2.1 — lossless at larger intervals." },
    { name: "hunyuan2.1-plus", lang: "Python", url: "https://github.com/Archerkattri/hunyuan2.1-plus", desc: "HiCache (Hermite) acceleration for Hunyuan3D-2.1 image-to-3D." },
    { name: "hunyuan2-plus-plus", lang: "Python", url: "https://github.com/Archerkattri/hunyuan2-plus-plus", desc: "HiCache++ (DMD) acceleration for Hunyuan3D-2 mini — exactly lossless at i5." },
    { name: "hunyuan2-plus", lang: "Python", url: "https://github.com/Archerkattri/hunyuan2-plus", desc: "HiCache (Hermite) acceleration for Hunyuan3D-2 mini." },
    { name: "hermit-trellis2-plus-plus", lang: "Python", url: "https://github.com/Archerkattri/hermit-trellis2-plus-plus", desc: "HiCache++ (DMD) carved-hybrid acceleration for TRELLIS.2-4B." },
    { name: "hermit-trellis2", lang: "Python", url: "https://github.com/Archerkattri/hermit-trellis2", desc: "HiCache (Hermite) carved-hybrid acceleration for TRELLIS.2-4B." },
    { name: "faster-trellis-plus-plus", lang: "Jupyter Notebook", url: "https://github.com/Archerkattri/faster-trellis-plus-plus", desc: "HiCache++ (DMD) carved-hybrid acceleration for TRELLIS v1." },
    { name: "faster-trellis", lang: "Python", url: "https://github.com/Archerkattri/faster-trellis", desc: "HiCache (Hermite) carved-hybrid acceleration for TRELLIS v1." },
    { name: "fast-trellis2", lang: "Python", url: "https://github.com/Archerkattri/fast-trellis2", desc: "TaylorSeer (Fast) baseline acceleration for TRELLIS.2-4B." },
    { name: "sam3d-plus-plus", lang: "Python", url: "https://github.com/Archerkattri/sam3d-plus-plus", desc: "HiCache++ (DMD) acceleration for SAM 3D Objects — lossless to i6." },
    { name: "sam3d-plus", lang: "Python", url: "https://github.com/Archerkattri/sam3d-plus", desc: "HiCache (Hermite) acceleration for Meta SAM 3D Objects." },
    { name: "fastsam3d-plus-plus", lang: "Python", url: "https://github.com/Archerkattri/fastsam3d-plus-plus", desc: "HiCache++ (DMD) acceleration for Fast-SAM3D." },
    { name: "fastsam3d-plus", lang: "Python", url: "https://github.com/Archerkattri/fastsam3d-plus", desc: "HiCache (Hermite) acceleration for Fast-SAM3D." },
    { name: "benbi", lang: "", url: "https://github.com/Archerkattri/benbi", desc: "Experimental repository." }
  ],

  experience: [
    {
      id: "snu-grad",
      title: "Graduate Research Student",
      org: "Soft Robotics & Bionics Laboratory, Seoul National University",
      location: "Seoul, South Korea",
      date: "Sept 2024 — Aug 2026",
      summary: "GSFS Scholar. Leading GaussianFeels thesis work; co-developed PoP-SLAM; integrating perception into the lab's Phase 2 “Alchemist” humanoid.",
      bullets: [
        "Developed GaussianFeels: online visuo-tactile reconstruction and pose-tracking system on an object-centric 3D Gaussian Splatting map — median ADD-S 0.84 mm sim / 3.4 mm real at ≈28 / ≈23.5 FPS, matching or beating model-free NeuralFeels at ≈7.6× the frame rate with no supplied CAD model.",
        "Co-developed PoP-SLAM: projection-first dense visual SLAM achieving 0.75 cm ATE RMSE on TUM-RGBD at ~4 FPS.",
        "Leading integration of visuo-tactile SLAM and dexterous in-hand manipulation into the Phase 2 full-scale humanoid prototype of the “Alchemist” Project (MOTIE, Korea).",
        "Coordinating cross-disciplinary engineering teams to meet quarterly hardware-software integration milestones."
      ]
    },
    {
      id: "villanova-research",
      title: "Robotics & Mechatronics Researcher",
      org: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Aug 2023 — May 2024",
      summary: "Collaborated with a Ph.D. candidate on SLAM for GNSS-denied navigation using a quad-wheel robot.",
      bullets: [
        "LiDAR–camera fusion, visual odometry, CNN-based feature extraction.",
        "Full ROS-based navigation stack: path planning and obstacle avoidance.",
        "Arduino / Raspberry Pi integration for real-time control.",
        "2D histogram filter + 1D Kalman filter for probabilistic localisation."
      ]
    },
    {
      id: "snu-intern",
      title: "Undergraduate Research Intern",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      location: "Seoul, South Korea",
      date: "January 2024",
      summary: "Six-week research placement developing a stretchable sEMG sensor with deep-learned gesture recognition.",
      bullets: [
        "Contributed to stretchability research with PDMS and vapour-deposited silver nanoparticles.",
        "Applied CNN-GRU, CNN-RNN, and ViT to sEMG signal processing."
      ]
    },
    {
      id: "area2farms",
      title: "Indoor Farm Robotics Intern",
      org: "Area2Farms",
      location: "Arlington, VA, USA",
      date: "June 2023 — Aug 2023",
      summary: "Contributed to the Silo automation tool for the local food system supply chain.",
      bullets: [
        "Extruded aluminium construction, pneumatics, industrial robotics.",
        "Arduino / Raspberry Pi programming.",
        "Agricultural irrigation systems."
      ]
    },
    {
      id: "ampere",
      title: "Product Design Intern",
      org: "Ampere LLC (Remote)",
      location: "Virtual, USA",
      date: "June 2022 — Aug 2022",
      summary: "3D product modelling for consumer technology designs; structural integrity and physics analysis.",
      bullets: [
        "3D product modelling for upcoming consumer technology.",
        "Analysed structural integrity and physics constraints for performance and durability."
      ]
    },
    {
      id: "villanova-de",
      title: "Distance Education Operator",
      org: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Sept 2021 — Dec 2021 & Aug 2023 — May 2024",
      summary: "Technical support for A/V systems used in online course production.",
      bullets: [
        "Managed live-stream recording and archiving of Distance Education materials."
      ]
    },
    {
      id: "villanova-stewardship",
      title: "Collections & Stewardship Technician",
      org: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Jan 2022 — May 2022",
      summary: "Digital content production for the university Digital Library.",
      bullets: [
        "Scanners, digital cameras, archiving software.",
        "Cataloguing and acquisitions records; supported preservation of rare and special collections materials."
      ]
    }
  ],

  awards: [
    {
      id: "orcgs",
      title: "ORCGS Doctoral Fellowship",
      org: "University of Central Florida",
      date: "Incoming, Aug 2026",
      summary: "Awarded the ORCGS Doctoral Fellowship in support of Ph.D. studies at UCF's Rehabilitation Engineering & Assistive Device Lab (REAL) under Prof. Hwan Choi.",
      kind: "Fellowship"
    },
    {
      id: "villanova-diploma",
      title: "B.S. Mechanical Engineering — Diploma",
      org: "Villanova University, College of Engineering",
      date: "May 2024",
      summary: "Bachelor of Science in Mechanical Engineering, Minor in Mechatronics.",
      kind: "Credential"
    },
    {
      id: "gsfs",
      title: "GSFS — Government Science Fellowship",
      org: "Seoul National University",
      date: "2024 — 2026",
      summary: "Government Science Fellowship supporting M.S. studies at Seoul National University.",
      kind: "Fellowship"
    },
    {
      id: "capstone-award",
      title: "Capstone — 1st Place, Most Innovative Solution",
      org: "Villanova University Capstone Showcase (Industry-Sponsored)",
      date: "May 2024",
      summary: "Awarded for the Plant Lifting Device for 3D Imaging.",
      kind: "Award",
      pdf: "assets/docs/Capstone.pdf"
    },
    {
      id: "nvidia-cv",
      title: "NVIDIA Computer Vision Nanodegree",
      org: "Udacity in partnership with NVIDIA",
      date: "Winter 2024",
      summary: "Modules: Introduction to Computer Vision, Advanced CV & Deep Learning, Object Tracking & Localisation, Cloud Computing, Neural Network Training, C++ Programming, Applied Deep Learning Projects.",
      kind: "Certification"
    },
    {
      id: "ciee",
      title: "CIEE Internship Certificate",
      org: "Council on International Educational Exchange",
      date: "2022",
      summary: "Internship certification from CIEE for the Yonsei University exchange program.",
      kind: "Certification",
      pdf: "assets/docs/CIEE_Internship_Certificate.pdf"
    },
    {
      id: "kmooc",
      title: "Innovative Robot Technologies and their Applications",
      org: "K-MOOC × Seoul National University",
      date: "Aug 2024",
      summary: "Credential ID: c65ee02c32ee88873985a799fab29ef8. 7-week online course; 8h 13min accredited learning time.",
      kind: "Certification",
      pdf: "assets/docs/KMOOC_Robotics_Certificate.pdf"
    },
    {
      id: "upenn-robotics",
      title: "Robotics Specialisation",
      org: "Coursera × University of Pennsylvania",
      date: "Summer 2021",
      summary: "Aerial Robotics · Computational Motion Planning · Mobility · Perception · Estimation and Learning · Capstone.",
      kind: "Certification"
    },
    {
      id: "gre",
      title: "GRE General Test",
      org: "Educational Testing Service (ETS)",
      date: "Sept 2023",
      summary: "Verbal 153 (56th pctile) · Quantitative 166 (80th pctile) · Analytical Writing 4.0 (56th pctile). Verified credential via ETS blockchain authentication.",
      kind: "Test Score",
      pdf: "assets/docs/GRE_Report.pdf",
      links: [{ label: "Verify credential (ETS blockchain)", href: "https://achievements.gre.org/77c3e028-a305-4538-bf7e-9a1081c40c83#gs.d2gjah" }]
    },
    {
      id: "beetlebot-award",
      title: "Beetle-Bot Competition — 3rd Place",
      org: "Villanova University Mechatronics Course",
      date: "Dec 2021",
      summary: "Miniature combat robot competition, sophomore Mechanical Engineering.",
      kind: "Award"
    },
    {
      id: "ice-award",
      title: "ICE Competition — 3rd Place",
      org: "Villanova College of Engineering",
      date: "Dec 2020",
      summary: "Innovation, Creativity & Entrepreneurship Idea Challenge — assistive device for the visually impaired.",
      kind: "Award"
    },
    {
      id: "deans-list",
      title: "Dean's List",
      org: "Villanova University",
      date: "Fall 2020, Spring 2021",
      summary: "Academic recognition for GPA in the top tier of the College of Engineering.",
      kind: "Award",
      images: [
        { src: "assets/images/deans-list-fall-2020.jpg", caption: "Dean's List — Fall 2020" },
        { src: "assets/images/deans-list-spring-2021.jpg", caption: "Dean's List — Spring 2021" }
      ]
    },
    {
      id: "viso",
      title: "Certificate of Appreciation",
      org: "Villanova International Students' Organisation (VISO)",
      date: "2024",
      summary: "Recognition for being an outstanding student throughout four years at Villanova University.",
      kind: "Recognition",
      image: "assets/images/viso-certificate.jpg"
    }
  ],

  education: [
    {
      id: "ucf",
      degree: "Ph.D., Mechanical Engineering — Post-Master's Track",
      school: "University of Central Florida",
      location: "Orlando, FL, USA",
      date: "Aug 2026 (Expected Start)",
      note: "ORCGS Doctoral Fellow · Rehabilitation Engineering & Assistive Device Lab (REAL) · Advisor: Prof. Hwan Choi",
      status: "incoming"
    },
    {
      id: "snu",
      degree: "M.S., Mechanical Engineering",
      school: "Seoul National University",
      location: "Seoul, South Korea",
      date: "Sept 2024 — June 2026 (Expected)",
      note: "GSFS Scholar · Soft Robotics & Bionics Laboratory · Advisor: Prof. Yong-Lae Park",
      status: "current"
    },
    {
      id: "villanova",
      degree: "B.S., Mechanical Engineering",
      school: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Aug 2020 — May 2024",
      note: "Minor in Mechatronics · Concentration: Control & Dynamics",
      status: "complete"
    },
    {
      id: "yonsei",
      degree: "Exchange — B.S. Mechanical Engineering",
      school: "Yonsei University",
      location: "Seoul, South Korea",
      date: "Aug 2022 — June 2023",
      note: "Heat Transfer · Fluid Mechanics · Mechanical Vibrations · Mechanical Systems Control · Basic Circuit Theory · Probability and Random Variables",
      status: "complete"
    }
  ],

  skills: {
    "SLAM & 3D Reconstruction": ["3D Gaussian Splatting", "Visuo-Tactile SLAM", "Neural Point Cloud SLAM", "Object-Centric Gaussian Mapping", "RGB-D Reconstruction", "SfM", "Levenberg–Marquardt SE(3)", "gsplat", "Point / Gaussian-splat registration (SE(3)/Sim(3))", "GeoTransformer · FPFH+RANSAC · ICP", "TUM-RGBD & Replica benchmarking"],
    "Deep Learning & AI": ["PyTorch", "CUDA (custom kernels)", "TensorFlow", "Multimodal Learning", "Differentiable Rendering", "CNN / RNN / CNN-GRU / ViT", "Reproducible ML pipelines", "Ollama", "Genesis"],
    "Generative 3D & Diffusion Acceleration": ["HiCache++ (DMD velocity-cache)", "HiCache (Hermite)", "TaylorSeer", "Hunyuan3D-2 / 2.1", "TRELLIS v1 / v2", "Meta SAM 3D", "Fast-SAM3D", "DiT", "Image-to-3D", "DMD / Prony / Matrix-Pencil"],
    "AI Agents, Retrieval & Formal Methods": ["MCP tool & server dev (mathlas)", "Dense & hybrid retrieval (Qwen3 · BM25 · RRF)", "Lean 4 kernel", "PSLQ", "OEIS", "mpmath (high-precision)", "FunSearch / program synthesis"],
    "Robotics & Middleware": ["ROS", "OpenCV", "Open3D", "COCO API", "Sensor Fusion", "Real-time Inference", "Path Planning", "NVIDIA Omniverse → UR5e + Allegro Hand"],
    "Hardware & Sensors": ["DIGIT Tactile", "RGB/RGB-D Cameras", "LiDAR + Camera Fusion", "VectorNav IMU", "Emlid RTK GPS", "UR5e", "Allegro Hand", "Raspberry Pi / Teensy / Arduino", "Vicon / OptiTrack", "3D Modelling & Printing", "Machine Shop"],
    "Programming": ["Python", "C / C++", "CUDA", "MATLAB", "Maple", "Arduino", "LaTeX", "HTML", "Django", "MySQL", "VHDL"],
    "Software & Tools": ["NVIDIA Omniverse", "SOLIDWORKS", "Blender", "KiCAD", "Linux (Ubuntu)", "Git/GitHub", "Jupyter", "Anaconda", "React.js", "Flask", "Matplotlib", "Scikit-learn", "PowerShell"]
  },

  coursework: {
    'Robotics & Control': [
      'Topics in Control and Automation (SNU)', 'Mechatronics & Microcontrollers (Villanova)',
      'Dynamic Systems I (Villanova)', 'Mechanical Systems Control (Yonsei)',
      'Mechanical Vibrations (Yonsei)', 'UPenn Robotics Specialisation (Coursera)',
    ],
    'AI & Vision': [
      'Deep Learning (SNU)', 'Precision Metrology & Vision Inspection (SNU)',
      'NVIDIA Computer Vision Nanodegree', 'Computer Programming for ME (Villanova)',
    ],
    'Mechanical & Design': [
      'Smart Materials & Design (SNU)', 'Capstone Design I & II (Villanova)',
      'Manufacturing Engineering (Villanova)', 'Mechanics of Materials (Villanova)',
      'Intro to CAD — SOLIDWORKS (Villanova)', 'Heat Transfer (Yonsei)', 'Fluid Mechanics (Yonsei)',
    ],
  },

  leadership: [
    { role: 'Secretary', org: 'Villanova CubeSat Club', date: 'May 2021 — May 2023', note: 'Community engagement in space science and CubeSat technology.' },
    { role: 'Representative & Head of Special Events', org: "Villanova International Students' Organisation (VISO)", date: 'Aug 2020 — Aug 2022', note: 'Connected international and domestic students; organised welcome events and social programmes.' },
    { role: 'Member', org: 'Society of Asian Scientists & Engineers (SASE)', date: 'May 2021 — Aug 2022', note: '' },
    { role: 'Member', org: 'American Society of Mechanical Engineers (ASME)', date: 'May 2021 — Aug 2022', note: '' },
  ],

  archive: [
    { title: 'Arduino Puzzle Box', date: '2022', note: 'Randomised solution algorithm, glitter-spray penalty for wrong inputs. Mechatronics coursework.' },
    { title: 'Beetle-Bot — Combat Robot', date: '2021', note: '3rd place, Villanova Mechatronics. Four-member team build from scratch.' },
    { title: 'Wi-Fi Drone', date: '2021', note: 'Custom stability control firmware; end-to-end build.' },
    { title: 'Swarm Drone Coordination', date: '2021', note: 'Multi-drone communication and synchronisation algorithms.' },
    { title: 'Servo Robotic Arm', date: '2021', note: 'Pick-and-place operations; 4-DOF servo arm.' },
    { title: '3D Printer Build', date: '2021', note: 'Full hardware assembly, firmware configuration, slicer setup from scratch.' },
    { title: 'Basketball Outcome Prediction', date: '2020', note: 'ML fundamentals; Python; 3-person team.' },
    { title: 'ICE Assistive Device', date: '2020', note: '3rd place, College of Engineering ICE Competition. Wearable for visually impaired users.' },
  ],

  gallery: [
    { src: "assets/images/robotics-mechatronics.jpg", caption: "Quad-wheel research robot · LiDAR + vision SLAM · Villanova, 2023-24", tag: "research" },
    { src: "assets/images/silo.jpg", caption: "Vertical farming rack · Area2Farms · Summer 2023", tag: "internship" },
    { src: "assets/images/silo-circuit.jpg", caption: "Custom control circuit · Silo automation · Summer 2023", tag: "internship" },
    { src: "assets/images/aerial-robot.jpg", caption: "Custom carbon-fibre aerial platform", tag: "research" },
    { src: "assets/images/beetlebot.jpg", caption: "Beetle-Bot · Villanova Mechatronics · 2021", tag: "build" },
    { src: "assets/images/personal-drone.jpg", caption: "Wi-Fi controlled drone · personal project · 2021", tag: "build" },
    { src: "assets/images/lego-car.jpg", caption: "Programmable LEGO car · early build", tag: "build" },
    { src: "assets/images/viso-certificate.jpg", caption: "VISO Certificate of Appreciation · Villanova", tag: "recognition" },
    { src: "assets/images/deans-list-fall-2020.jpg", caption: "Dean's List — Fall 2020 · Villanova University", tag: "recognition" },
    { src: "assets/images/deans-list-spring-2021.jpg", caption: "Dean's List — Spring 2021 · Villanova University", tag: "recognition" }
  ]
};
