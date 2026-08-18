# CircuitSight AI — Design Direction

## Three stylistic approaches

### Theme Name: Kinetic Circuit Brutalism
Very large editorial typography, acid-yellow signal color, hard borders, PCB traces, and fast instrument-like motion. It treats debugging as a visible, physical act rather than a passive dashboard experience.

**Probability:** 0.03

### Theme Name: Quiet Lab Editorial
A pale paper-like interface with graphite annotations, restrained cyan indicators, and museum-catalog spacing. The mood is precise, calm, and instructional.

**Probability:** 0.07

### Theme Name: Signal Noir
A dark technical console with sharp lime highlights, phosphor-like status lights, and a cinematic scanning atmosphere. The mood is focused and high-contrast without becoming decorative cyberpunk.

**Probability:** 0.02

## Selected approach: Kinetic Circuit Brutalism

### Design Movement
Swiss International Typographic Style crossed with brutalist product design and contemporary electronics-lab interfaces.

### Core Principles
1. Make the act of understanding visible through oversized words, readouts, traces, and progress states.
2. Prefer hard geometry, 2px rules, clipped blocks, and color inversion over rounded cards or soft shadows.
3. Use acid yellow as a deliberate signal color for action, focus, uncertainty, and active analysis.
4. Communicate confidence and uncertainty directly; the interface should never imply an electrical fact is certain when the image is ambiguous.

### Color Philosophy
The near-black ground (#09090B) is the workbench. White type is the annotation layer. Acid yellow (#DFE104) is an ownable signal color that marks action, attention, and the moment the system knows something useful. Green, amber, and red appear only as semantic analysis states so they remain meaningful.

### Layout Paradigm
Use asymmetric editorial compositions: a wide hero field offset by a technical side rail, split scanner panels, diagonal trace paths, sticky process markers, and full-bleed marquees. The layout should feel assembled from an instrument panel and a poster wall rather than a centered SaaS template.

### Signature Elements
- Massive kinetic words: SCAN, TRACE, DEBUG, FIX, LEARN.
- Acid-yellow marquees with black uppercase type.
- Low-opacity PCB traces and node clusters behind content.

### Interaction Philosophy
Every interaction should feel like a physical switch or instrument: fast, high-contrast, and legible. Primary actions invert black and yellow. Hover states reveal more of the system. Scanner results expose confidence rather than hiding it.

### Animation
Use 180–300ms transitions for controls, 500–800ms entrances for sections, and continuous linear marquee motion. Scanner overlays pulse along trace paths and analysis rows reveal in staggered steps. Respect prefers-reduced-motion by replacing movement with static signal states.

### Typography System
Display: Space Grotesk, 700–800 weight, uppercase, tight leading, with hero type scaling from roughly 4rem to 12rem. Technical readouts: Monaspace, uppercase, tabular-feeling labels for values such as 98%, 5V, 220Ω, GPIO13, and GND. Body: Space Grotesk 400–500, normal case, generous line length.

### Brand Essence
CircuitSight AI is the visual debugging lab for students and makers who want to see where a real-world circuit fails, why it fails, and how to correct it.

**Personality:** precise, candid, kinetic.

### Brand Voice
Headlines are short, declarative, and slightly provocative. CTAs are direct commands. Microcopy sounds like a lab instrument explaining its limits, never like a generic assistant.

Example lines:
- “YOUR CIRCUIT IS TALKING.”
- “TRACE THE MISTAKE. KEEP THE LESSON.”

### Wordmark & Logo
The mark is a compact “C” formed from a PCB trace that turns into a sightline crosshair, with one acid-yellow node at the point of focus. The wordmark uses a custom spaced uppercase treatment rather than a default logo font.

### Signature Brand Color
Acid Signal — `#DFE104`.

## Implementation reminders

- Dark-first theme with `#09090B` background and `#FAFAFA` foreground.
- Avoid rounded cards, gradients, glassmorphism, and traditional drop shadows.
- Use real generated visuals only for the hero/lab scanner scene and brand mark; the rest of the interface is deterministic UI and CSS linework.
- Every component and page file should begin with a short comment naming the Kinetic Circuit Brutalism rules relevant to that file.
