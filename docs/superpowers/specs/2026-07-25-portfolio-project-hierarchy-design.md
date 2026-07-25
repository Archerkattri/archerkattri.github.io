# Portfolio Project Hierarchy Design

## Objective

Make the portfolio communicate a deliberate hierarchy instead of treating every repository as a flagship.
Personal work has exactly five expanded case studies: splatreg, CERT-FLOW, HiCache++, ActionABI +
ActionShift, and mathlas. All other public personal work is placed in a compact collapsed archive. Forge
is private and does not appear anywhere in the rendered portfolio.

## Personal projects

The five expanded cards appear in this order:

1. splatreg
2. CERT-FLOW
3. HiCache++
4. ActionABI + ActionShift
5. mathlas

Clyde, stepback, ToothPrint, and AURA retain concise descriptions and links inside a native collapsed
`details` archive. The HiCache adapter constellation remains a separate compact collapsed section because
it documents one flagship's integrations rather than sixteenth additional flagships. The deprecated
computer-vision object-detection web app appears last in the personal archive and is explicitly described
as an early React/Flask practice project used while learning open-source development.

## School projects

The school room opens with two expanded undergraduate flagships:

- The FMC-sponsored plant-lifting capstone.
- The EOD / GNSS-denied robot platform, presented as B.S. laboratory research under the
  “Robotics & Mechatronics Researcher” role. Its copy covers the quad-wheel platform, ROS navigation,
  LiDAR-camera fusion, visual odometry, obstacle avoidance, and embedded Arduino/Raspberry Pi control.

GaussianFeels appears above the undergraduate archive as a compact SNU M.S. thesis cross-reference.
It links to `#gaussianfeels`, where the complete research case study and verified results already live.
The CV object-detection app is removed from school projects.

## Rendering and accessibility

Both the interactive grid room and the prerendered document fallback use the same data and shared compact
project component. Native `details`/`summary` controls preserve keyboard access and no-JavaScript behavior.
Existing typography, spacing, paper-sheet motifs, and reduced-motion behavior remain unchanged.

## Verification

- Assert the rendered personal section contains exactly five expanded `.sw` cards in the required order.
- Assert Forge is absent from rendered HTML and source navigation aliases.
- Assert the compact personal archive is collapsed by default and ends with the CV practice app.
- Assert GaussianFeels appears in school projects and links to `#gaussianfeels`.
- Assert EOD is an expanded school-project sheet using CV-grounded research copy.
- Run the production build, prerender checks, dependency audit, and existing test command.
