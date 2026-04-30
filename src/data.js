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
      subtitle: "Real-Time Multimodal 3D Reconstruction with Tactile-Enhanced Gaussian Splatting",
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
        "Built the pose tracker as a Theseus-based SE(3) optimiser combining tactile-aware frame-0 seeding, image-space depth sampling, a frozen-map SDF residual, and an ICP prior between consecutive depth observations.",
        "Integrated a frame-0 shape-completion bootstrap with Hunyuan3D-2-mini: an orientation-variant 3D prior is aligned to frame-0 observations, then progressively replaced by measured geometry."
      ],
      tools: ["3D Gaussian Splatting", "PyTorch", "CUDA", "Theseus", "NVIDIA Omniverse", "UR5e", "Allegro Hand", "DIGIT Tactile", "ROS", "Open3D"],
      programme: {
        title: "Humanoid Robot Programme",
        subtitle: "Visuo-Tactile SLAM & In-Hand Manipulation Integration",
        org: "Soft Robotics & Bionics Lab, Seoul National University",
        date: "Sept 2024 — July 2026",
        tag: "Government-funded",
        description: "GaussianFeels is developed as an integral module within a multi-year government-funded humanoid robot programme at SRBL. Phase 1 concluded in 2024; Phase 2 — full-scale humanoid prototype — is ongoing. My role is to bring GaussianFeels from research prototype to deployable on-robot perception system, bridging visuo-tactile SLAM and dexterous in-hand manipulation for the Phase 2 humanoid.",
        tools: ["UR5e", "Allegro Hand", "DIGIT Tactile Sensor", "NVIDIA Omniverse", "ROS", "CUDA"]
      },
      outcomes: [
        "Evaluated on the FeelSight benchmark family — simulation, real-world robot rollouts, and occlusion-focused episodes.",
        "Metrics span reconstruction quality, pose-tracking accuracy, and occlusion robustness.",
        "Deployed as part of the lab's Phase 2 full-scale humanoid prototype."
      ],
      gallery: [],
      links: []
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
      title: "Humanoid Robot Programme",
      subtitle: "Visuo-Tactile SLAM & In-Hand Manipulation Integration",
      role: "Graduate Research Student",
      org: "Soft Robotics & Bionics Lab, Seoul National University",
      date: "Sept 2024 — July 2026",
      tag: "Government-funded",
      summary: "Integrating visuo-tactile SLAM and dexterous manipulation modules into a multi-year government-funded humanoid robot programme.",
      overview: [
        "A multi-year, government-funded humanoid robot programme at the Soft Robotics & Bionics Lab. Phase 1 concluded in 2024; Phase 2 — the full-scale humanoid prototype — is ongoing.",
        "My role is to bring perception systems from research prototypes into deployable modules on the Phase 2 robot."
      ],
      contributions: [
        "Integrate visuo-tactile SLAM and dexterous in-hand manipulation into the Phase 2 full-scale humanoid prototype.",
        "Coordinate with cross-disciplinary engineering teams across hardware, software, and control to meet integration milestones.",
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
        "Developed a full ROS-based navigation stack: path planning and obstacle-avoidance algorithms.",
        "Applied CNN-based feature extraction and point cloud generation from fused LiDAR–camera data.",
        "Integrated and configured Arduino and Raspberry Pi microcontrollers for robust ROS communication and real-time control.",
        "Implemented computer vision techniques (edge detection, landmark identification) to build real-time 3D environment maps.",
        "Implemented a 2D histogram localisation filter and a 1D Kalman filter tracker using probabilistic motion models."
      ],
      tools: ["ROS", "Python", "C++", "OpenCV", "LiDAR", "Velodyne", "Arduino", "Raspberry Pi", "CNN"],
      outcomes: [
        "Real-time 3D environment mapping from fused LiDAR-camera data.",
        "Improved tracking accuracy via probabilistic localisation filters."
      ],
      gallery: [{ src: "assets/images/robotics-mechatronics.png", caption: "Quad-wheel robot platform with Velodyne LiDAR" }],
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
        "Sponsored by a major agrochemical company. The brief: build a device that can lift growing plants reliably and repeatably into a 3D imaging rig, under strict size constraints, without damaging the plant.",
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
      gallery: [{ src: "assets/images/robotics-mechatronics.png", caption: "Quad-wheel robot platform used in related GNSS-denied work" }],
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

  experience: [
    {
      id: "snu-grad",
      title: "Graduate Research Student",
      org: "Soft Robotics & Bionics Laboratory, Seoul National University",
      location: "Seoul, South Korea",
      date: "Sept 2024 — July 2026",
      summary: "GSFS Scholar. Leading GaussianFeels thesis work; co-developed PoP-SLAM; integrating perception into the lab's Phase 2 humanoid.",
      bullets: [
        "Developed GaussianFeels: online visuo-tactile reconstruction and pose-tracking system built around an explicit object-centric 3D Gaussian Splatting map.",
        "Co-developed PoP-SLAM: projection-first dense visual SLAM achieving 0.75 cm ATE RMSE on TUM-RGBD at ~4 FPS.",
        "Integrating visuo-tactile SLAM and dexterous in-hand manipulation modules into the Phase 2 full-scale humanoid prototype.",
        "Coordinating cross-disciplinary engineering teams to meet hardware-software integration milestones."
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
      summary: "Awarded the ORCGS Doctoral Fellowship in support of Ph.D. studies at UCF's Rehabilitation Engineering & Assistive Device Lab.",
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
      date: "2024",
      summary: "GRE General Test official score report. Verified credential via ETS blockchain authentication.",
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
      note: "ORCGS Doctoral Fellow · Rehabilitation Engineering & Assistive Device Lab",
      status: "incoming"
    },
    {
      id: "snu",
      degree: "M.S., Mechanical Engineering",
      school: "Seoul National University",
      location: "Seoul, South Korea",
      date: "Sept 2024 — July 2026 (Expected)",
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
    "SLAM & 3D Reconstruction": ["3D Gaussian Splatting", "Visuo-Tactile SLAM", "Neural Point Cloud SLAM", "Object-Centric Gaussian Mapping", "RGB-D Reconstruction", "SfM", "Theseus SE(3) optimisation", "TUM-RGBD & Replica benchmarking"],
    "Deep Learning & AI": ["PyTorch", "CUDA (custom kernels)", "TensorFlow", "Multimodal Learning", "Differentiable Rendering", "CNN / RNN / CNN-GRU / ViT", "Ollama", "Genesis"],
    "Robotics & Middleware": ["ROS", "OpenCV", "Open3D", "Sensor Fusion", "Real-time Inference", "Path Planning", "NVIDIA Omniverse → UR5e + Allegro Hand"],
    "Hardware & Sensors": ["DIGIT Tactile", "RGB/RGB-D Cameras", "LiDAR + Camera Fusion", "VectorNav IMU", "Emlid RTK GPS", "UR5e", "Allegro Hand", "Raspberry Pi / Teensy / Arduino", "Vicon / OptiTrack", "3D Modelling & Printing", "Machine Shop"],
    "Programming": ["Python", "C / C++", "CUDA", "MATLAB", "Arduino", "LaTeX", "HTML", "Django", "MySQL", "VHDL"],
    "Software & Tools": ["NVIDIA Omniverse", "SOLIDWORKS", "Blender", "KiCAD", "Linux (Ubuntu)", "Git/GitHub", "Jupyter", "Anaconda", "React.js", "Flask"]
  },

  gallery: [
    { src: "assets/images/robotics-mechatronics.png", caption: "Quad-wheel research robot · LiDAR + vision SLAM · Villanova, 2023-24", tag: "research" },
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
