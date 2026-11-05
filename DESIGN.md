---
name: Pikku
description: The TypeScript framework's site, drawn as an engineer's annotated notebook.
colors:
  clay: "#c2410c"
  clay-deep: "#9a3412"
  ember: "#e0a06a"
  cloudwash: "#f1d9c4"
  moss: "#55703c"
  ochre: "#b97d12"
  slate: "#3d6373"
  rose: "#a8485f"
  plum: "#6b4e8a"
  teal: "#1f7a6d"
  indigo: "#4a5aa8"
  paper: "#f4ecdd"
  paper-shade: "#ebdfc8"
  card: "#fbf6ec"
  ink: "#2b2219"
  soft-ink: "#5f5143"
  faint-ink: "#6f6555"
  night: "#15110d"
  night-raised: "#1b1814"
  night-bar: "#1d1812"
  cream: "#ece3d0"
  mute: "#b3a690"
typography:
  display:
    fontFamily: "Fraunces, Fraunces Fallback, Georgia, serif"
    fontSize: "4.3rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "'SOFT' 100, 'opsz' 120"
  headline:
    fontFamily: "Fraunces, Fraunces Fallback, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontVariation: "'SOFT' 100, 'opsz' 120"
  title:
    fontFamily: "Fraunces, Fraunces Fallback, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Work Sans, Work Sans Fallback, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Work Sans, Work Sans Fallback, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
  note:
    fontFamily: "Caveat, cursive"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  hand-a: "14px 18px 13px 17px / 17px 13px 18px 14px"
  hand-b: "16px 12px 17px 13px / 13px 17px 12px 16px"
  organic: "52% 48% 50% 50% / 48% 52% 48% 52%"
  control: "10px"
  pill: "999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  section-sm: "64px"
  section-md: "96px"
  container: "72rem"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.hand-a}"
    padding: "0.95rem 1.4rem"
    height: "44px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.hand-b}"
    padding: "0.95rem 1.2rem"
    height: "44px"
  button-line-hover:
    backgroundColor: "{colors.paper-shade}"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hand-a}"
    padding: "0.8rem 1rem"
  chip-soon:
    backgroundColor: "{colors.cloudwash}"
    textColor: "{colors.clay-deep}"
    typography: "{typography.note}"
    padding: "0.2rem 0.6rem 0.25rem"
  card-torn:
    backgroundColor: "{colors.card}"
    padding: "3rem"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
---

# Design System: Pikku

## Overview

**Creative North Star: "The Annotated Notebook"**

The site is an engineer's notebook left open on the desk. Headlines are set like a printed title page, the working is sketched in ink beside them, and the real explanations sit in the margins in handwriting. Everything feels drawn by one person who knows the subject and is pleased to show you.

The system earns its warmth through material, not decoration. Paper has grain, corners wobble, lines shake slightly, and shadows are stamped offsets rather than soft light. A technical reader should feel looked after, never sold to. The handwriting explains and the diagrams carry the argument, so the serif headlines can stay short and plain.

Density follows the page. Marketing pages breathe, with wide sections and one idea per band. Docs and blog posts settle into a calm reading column where the notebook recedes and the words lead.

**Key Characteristics:**
- Warm cream paper with visible grain, in a matching near-black night theme
- One clay accent, used for action, emphasis and the chameleon
- Fraunces headlines, Work Sans body, Caveat for margin notes
- Hand-drawn diagrams, wobbly corners and hard offset shadows
- The chameleon is the only logo and the only mascot

## Colors

An ink-and-paper neutral base with a single clay voice, and a muted set of pigments kept for labelling things.

### Primary
- **Fired Clay**: The accent. Fills, strokes, large text, the chameleon, the button shadow and the scribble underline.
- **Deep Clay**: Clay's small-text form. Links, active nav items and any accent text below large size.
- **Ember**: Clay's replacement on dark surfaces, for focus rings and accents on the night band. In the dark theme both clays resolve to it.
- **Cloudwash**: The pale clay wash behind hovered menu items and soft callouts.

### Secondary
- **Moss, Ochre, Slate, Rose, Plum, Teal, Indigo**: The pigment set. They tell things apart: each wiring in the fan diagram gets its own, and icon discs, chips and tile groups draw from the same set. Each pairs with a pale wash of its own hue behind it.

### Neutral
- **Paper**: The page.
- **Paper Shade**: Alternate section bands, hover fills and the footer.
- **Card**: Raised surfaces such as cards, inputs and code labels.
- **Ink**: Headlines, body text, borders and the primary button.
- **Soft Ink**: Secondary text and intro paragraphs.
- **Faint Ink**: Light-theme captions only. In the dark theme it falls below 4.5:1, so faint text uses Mute's value there.
- **Night, Night Raised, Night Bar**: The ink slab for code cards, terminals and the closing call to action, in both themes.
- **Cream, Mute**: Text on the ink slab, primary and secondary.

### Named Rules
**The Clay Is Not Text Rule.** Fired Clay is for fills, strokes and large type. Small accent text is always Deep Clay, because that is what passes contrast on Paper.

**The Pigment Means Something Rule.** A secondary pigment labels a category. If a colour isn't telling two things apart, it should be ink or clay.

**The Token Only Rule.** Colours come from the `--color-*` tokens or their `--paper-*` aliases, so both themes follow. Hard-coded white is never correct here.

## Typography

**Display Font:** Fraunces (with Georgia)
**Body Font:** Work Sans (with system-ui)
**Note Font:** Caveat (with cursive)
**Mono Font:** The platform's own `ui-monospace` stack, with no webfont

**Character:** Fraunces, with its soft axis turned fully up, gives a warm and slightly wonky title page. Work Sans stays out of the way. Caveat is the author's own hand, and its contrast with the serif is the voice of the site.

### Hierarchy
- **Display** (600, 2.6rem rising to 4.3rem, 1.02): The hero headline only, one per page.
- **Headline** (600, 2.25rem rising to 3rem, tight): Section headings, kept short enough to fall on two lines.
- **Title** (600, about 1.3rem, 1.25): Card and step titles.
- **Body** (400, 16.5px, 1.75): Prose in docs and blog posts, with marketing intros at 1.125rem to 1.25rem in Soft Ink.
- **Label** (500, 0.75rem, 0.2em, uppercase): Eyebrows on the night band and footer column titles.
- **Note** (500, from 1.15rem): Caveat kickers above headings, diagram annotations and captions.

### Named Rules
**The Margin Note Rule.** Caveat is for asides, never for content someone must read to use the page. Keep notes to a short phrase.

**The One Voice Per Line Rule.** Fraunces titles, Work Sans explains, Caveat comments. Don't mix two of them in one sentence.

## Layout

Marketing pages use a centred column of 72rem with gutters of 16px rising to 24px. Sections are full-width bands that alternate Paper and Paper Shade, separated by a dashed rule, with 64px to 96px of vertical padding. Section intros stay within a 42rem measure, with the page's real width saved for diagrams and grids.

The hero splits about evenly between copy and illustration, and stacks on small screens. Grids step down from three columns to one. Diagrams have a dedicated narrow version rather than being scaled down.

The navbar is sticky, 1440px wide at most, and collapses its text links into a sheet at 960px. Search shrinks to an icon at 1180px. The footer drops to two columns at 760px.

## Elevation & Depth

Depth is printed, not lit. Surfaces sit on the paper with tonal shifts and hard offsets, and blur appears only on floating chrome, like the sticky nav and the mega menu.

### Shadow Vocabulary
- **Ink stamp** (`box-shadow: 3px 4px 0 var(--color-clay)`): The primary button at rest. It grows to `5px 6px 0` on hover and presses to `1px 1px 0` on active.
- **Torn sheet** (`box-shadow: 0 1px 0` and `2px 3px 0`, both ink at 6 to 8 percent): Torn-edge cards.
- **Grain** (`--grain`, `--grain-dark`): A fine noise layer on the page and the ink slab, so no large area is flat.

### Named Rules
**The Hard Edge Rule.** Offset shadows have no blur. If a shadow looks soft on a resting surface, it's wrong.

## Shapes

Nothing is quite straight. Primary controls use two asymmetric hand-cut radii (`--radius-hand-a`, `--radius-hand-b`), so that corners look cut with scissors. Discs and icon backings use the organic radius. Large panels tear rather than round, with a clipped wavy edge.

Hand-drawn strokes get the same treatment through the `#rough` SVG filter, and colour washes behind illustrations use `#wash`. Rules are dashed, and the underline beneath active items and hero words is the scribble, not a straight line.

Precise chrome is the exception. Search, icon buttons and menu items use a plain 10px radius, and the developer link is a full pill, because this is the part of the notebook that works rather than the part that was drawn.

## Components

### Buttons
Stamped, tactile and physical. They press in like a rubber stamp.
- **Shape:** Hand-cut corners (`--radius-hand-a`), at least 44px high.
- **Primary (ink):** Ink fill with Card text, weight 600, and the clay ink-stamp shadow.
- **Hover / Active:** Lifts 1px with a larger stamp, then presses 2px down and 3px right with a small one, over 0.15s.
- **Focus:** A 3px dashed clay outline, offset 4px, and ember on dark surfaces.
- **Secondary (line):** A 2px ink border with no fill, Paper Shade on hover, and no shadow.

### Chips
- **Style:** Caveat text on Cloudwash with a 2px Deep Clay border and its own slightly wobbly radius, used for "soon" states.
- **Pending:** Soft Ink dashed border for anything still to be confirmed.

### Cards / Containers
- **Torn card:** Card fill with the clipped torn edge and torn-sheet shadow, for call-outs that break a section.
- **Outline card:** A 2px ink border with hand-cut corners on a Card fill, for grids of tools.
- **Dashed card:** The same with a dashed border, for "and more" remainders.

### Inputs / Fields
- **Style:** Card fill with hand-cut corners and 0.8rem by 1rem padding on Paper.
- **Night variant:** Transparent with a single cream hairline beneath, turning ember on focus.
- **Caret and accent:** Always clay.

### Navigation
The bar is translucent Paper with a 10px blur and a hairline below. Links are Work Sans 500 at 0.94rem and turn Deep Clay on hover. The active link gets the clay scribble underline. The brand lockup is the 40px clay chameleon beside "pikku" in Fraunces 700. On mobile, links move into a right-hand sheet.

### Hand-drawn Scene
The signature component. An inline SVG diagram of rough ink lines, watercolour washes and Caveat labels, with the chameleon as the subject. Each scene has a wide and narrow version and a `<title>` describing it for screen readers.

### The Chameleon
The `Pk` component renders the `#pk` symbol from `SvgDefs`. It takes `currentColor` or a `color` prop, so it recolours with its context: clay as the logo, pigment-coloured in the wiring fan, moss on the connector card and ember on the night band.

### Code Card
An ink-slab panel in Night with a Night Bar title strip and Cream text, in both themes. It is the one place the paper gives way entirely, so code stays high-contrast and looks like a pasted-in printout.

## Do's and Don'ts

### Do:
- **Do** use the chameleon as the only logo and mascot, through `Pk`, so its colour stays theme-aware.
- **Do** use Deep Clay for small accent text and Fired Clay only for fills, strokes and large type.
- **Do** add a short Caveat note where a person would scribble one, above a heading or beside a diagram.
- **Do** explain a concept with a hand-drawn scene before reaching for another block of text.
- **Do** keep every interactive target at 44px or larger, with the dashed focus outline.
- **Do** honour `prefers-reduced-motion`, and keep motion to one orchestrated entrance rather than many small effects.
- **Do** check every new surface in the dark theme, where both clays become Ember.

### Don't:
- **Don't** add a second mascot, or any other brand's mark or character, to the site's identity.
- **Don't** use Inter, Roboto, Arial or purple gradients.
- **Don't** hard-code colours or `text-white`; wiring icons use the `.wiring-icon` class.
- **Don't** use soft, blurred shadows on resting surfaces.
- **Don't** set body copy or instructions in Caveat.
- **Don't** use a secondary pigment for decoration alone.
- **Don't** make a large surface flat when grain or a wash belongs there.
