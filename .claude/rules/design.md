---
paths:
  - "frontend/**"
---

# Design

The site must read as the work of a design team that knows pilgrimage travel, not as a template. `DESIGN.md` at the repository root records the visual system; follow it once it exists and update it when the system changes.

## Direction comes from the subject

- Visual choices are drawn from the real world of yatra travel: routes, seasons, altitude, departure boards, tickets, temple towns. Decoration with no link to the subject is removed.
- Real content only. Real place names, real distances, realistic prices in rupees, real season windows. No lorem ipsum and no invented testimonials, ratings, or customer counts.
- One memorable element per page. Everything else stays quiet.

## Patterns that are not allowed

These mark a page as machine-made and are banned unless a brief explicitly asks for one:

- Cream background with a serif headline and terracotta accent.
- Near-black background with one neon accent.
- Purple-to-blue gradients, gradient text, glassmorphism, glowing blobs.
- Rows of identical rounded cards with the same soft shadow, each with an icon in a tinted circle.
- All-caps tracked eyebrow labels above headings.
- One word of a headline in italic or a different colour.
- `01 / 02 / 03` numbering on content that is not a sequence.
- Arrows appended to link and button text.
- Emoji as icons.
- Hero made of a big number, a small label, and stat tiles.
- The same fade-and-slide-up on every section. Motion is authored per element: sheets swing, shrines rise, the thread draws.
- Metadata strings joined with middle dots.

## Typography

- At most two families, chosen for this product and recorded in `DESIGN.md`. Not Inter, Roboto, Poppins, or system defaults for display.
- A defined modular scale. Body text at least 16px, line length under 75 characters.
- Sentence case for headings, buttons, and labels.

## Colour and space

- A named palette of four to six colours plus neutrals, defined as tokens. Every text and background pair meets WCAG AA.
- Radius, shadow, and spacing follow hierarchy. They are not one value applied everywhere.

## Copy

- Plain words from the traveller's point of view. Say what a thing is, not how good it is.
- Buttons name the action: "Check dates", "Send enquiry". The same action keeps the same name through a flow.
- Errors say what happened and what to do next. Empty states point to an action.
- Banned words: seamless, elevate, unlock, journey of a lifetime, curated, hassle-free, world-class.

## Review before calling UI done

- Checked at 375px, 768px, and 1280px.
- Keyboard pass: tab order, focus visibility, escape closes overlays.
- Loading, empty, and error states exist and were looked at.
