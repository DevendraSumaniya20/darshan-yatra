---
name: Darshan Yatra
description: Group pilgrimage tours on fixed dates, presented as a bazaar trade calendar with a live date pad.
colors:
  chrome-yellow: "#f7c81e"
  pale-yellow: "#fff3bf"
  ultramarine: "#1b2f8f"
  ultramarine-deep: "#13216b"
  vermilion: "#d8281b"
  vermilion-deep: "#ab1d12"
  bottle-green: "#0e6b3b"
  ink: "#000000"
  ink-soft: "#2b3350"
  paper: "#ffffff"
  paper-edge: "#c9cbd6"
typography:
  display:
    fontFamily: "'Yatra One', 'Anek Latin Variable', sans-serif"
    fontSize: "clamp(2.5rem, 1.25rem + 6.2vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1.04
  headline:
    fontFamily: "'Anek Latin Variable', system-ui, sans-serif"
    fontSize: "2.0625rem"
    fontWeight: 750
    lineHeight: 1.08
    fontVariation: "'wdth' 85"
  title:
    fontFamily: "'Anek Latin Variable', system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Anek Latin Variable', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Anek Latin Variable', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.55
  numeral:
    fontFamily: "'Anek Latin Variable', system-ui, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 800
    lineHeight: 0.95
    fontVariation: "'wdth' 75"
rounded:
  corner: "2px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
  "9": "6.5rem"
components:
  button-primary:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.paper}"
    rounded: "{rounded.corner}"
    padding: "0.5rem 1.5rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.vermilion-deep}"
  button-plain:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ultramarine}"
    rounded: "{rounded.corner}"
    padding: "0.5rem 1.5rem"
    height: "2.75rem"
  button-plain-hover:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.paper}"
  field-control:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.corner}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
  date-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.corner}"
  date-sheet-month:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.paper}"
---

# Design System: Darshan Yatra

## Overview

**Creative North Star: "The trade calendar with a live date pad"**

The site borrows the printed wall calendar that Indian shops give their customers: a bright picture plate inside a printed frame, the shop's name in a band, and a pad of tear-off date sheets. Here the pad is real. Each departure is a sheet, and the date is the largest thing on any page.

Colour is flat print ink at page scale: a chrome-yellow plate, ultramarine bands, vermilion numerals and rules, white pad paper, black text. Nothing is tinted, blurred or graded. Names are set in block-shaded sign lettering; everything a traveller has to read or compare is set in a plain, sturdy text face.

The audience is often booking for older relatives on a phone, so text is large, contrast is high, and every state is told in words as well as colour.

**Key Characteristics:**
- The date sheet is the signature object. Departures are never shown as plain rows of text when a sheet fits.
- Flat inks, square corners, ruled lines. No gradients, glass, or soft cards.
- Sign lettering for names only; text face for everything functional.
- One column grid shared by every page.
- Sample catalogue data is labelled as such in the footer.

## Colors

Four print inks on white paper, used in large flat fields.

### Primary
- **Chrome Yellow** (#f7c81e): the picture plate. Home hero, yatra page head, filter bar, booking reference. Black text only on it; ultramarine for sign lettering.
- **Vermilion** (#d8281b): date numerals, month bands, rules between list rows, the itinerary thread, the primary button. Deep Vermilion (#ab1d12) is its hover and its error text.

### Secondary
- **Ultramarine** (#1b2f8f): header and footer bands, sign lettering, links, the chosen-date frame, focus rings.

### Tertiary
- **Bottle Green** (#0e6b3b): the frame of a sent booking receipt, and nothing else.

### Neutral
- **Ink** (#000000): all body text and control borders.
- **Soft Ink** (#2b3350): secondary text on white, tinted toward ultramarine.
- **Paper** (#ffffff): page ground and pad sheets.
- **Pale Yellow** (#fff3bf): quiet bands, notices, invalid field fill.
- **Paper Edge** (#c9cbd6): hairlines and the lower edges of stacked sheets.

### Named Rules
**The Plate Rule.** Yellow owns whole regions or none. It is never used as a small highlight on white, except for the booking reference.

**The Words-Too Rule.** No state is carried by colour alone. A chosen date says "Chosen", a full date says "Full", an invalid field has a message.

## Typography

**Display Font:** Yatra One (with Anek Latin Variable, sans-serif)
**Body Font:** Anek Latin Variable (with system-ui, sans-serif)

**Character:** Yatra One is hand-painted signboard lettering; it carries the names. Anek Latin does the work, and its width axis gives the condensed heavy numerals of a date pad without a third family. Both are self-hosted.

### Hierarchy
- **Display** (400, clamp(2.5rem, 1.25rem + 6.2vw, 5.25rem), 1.04): page titles and yatra names in sign lettering, ultramarine with a three-step vermilion block shade.
- **Headline** (750, width 85, 2.0625rem, 1.08): section headings.
- **Title** (700, 1.3125rem, 1.3): sub-headings, itinerary day titles, key figures.
- **Body** (400, 1.0625rem, 1.55): running text, capped at 66ch.
- **Label** (650, 0.9375rem): field labels, hints, fact names. Sentence case.
- **Numeral** (800, width 75, 5.5rem, 0.95): the day on a date sheet; 3.5rem on small sheets, 4.5rem for step numbers.

### Named Rules
**The Signboard Rule.** Sign lettering is for names: the site, a page, a yatra, a circuit. It never sets a sentence, a label, or a number.

**The Sentence Case Rule.** No all-caps anywhere, including buttons and labels.

## Layout

A 74rem page with a fluid gutter of clamp(1rem, 4vw, 2rem). Every page uses the same grid: four columns on phones, twelve from 48rem. Header, content and footer share its edges.

Breakpoints are 48rem (medium) and 64rem (wide). Phones stack; from 48rem list rows split into date, description and price; from 64rem the yatra page puts the plan in seven columns and departures with the booking form in four.

Sections are separated by 4.5rem. Lists are divided by 2px vermilion rules rather than boxed. On phones the departure dates and booking form come before the day-by-day plan.

## Elevation & Depth

The system is flat. The single depth device is the pad stack: a date sheet shows the lower edges of the sheets beneath it and a short cast shadow, so it reads as paper hanging on a pad.

### Shadow Vocabulary
- **Pad stack** (`0 3px 0 -1px #fff, 0 3px 0 0 #c9cbd6, 0 6px 0 -1px #fff, 0 6px 0 0 #c9cbd6, 0 14px 18px -8px rgb(19 33 107 / 0.45)`): date sheets only.

### Named Rules
**The Paper-Only Rule.** Only date sheets cast a shadow. Panels, forms, notices and buttons are flat with a ruled border.

## Shapes

Corners are 2px everywhere, the slight softness of cut paper. Borders are 2px rules in ink, vermilion or ultramarine; the printed frame around the hero and the top of the footer use 6px. The only circles are itinerary day markers. Two cut-paper details recur: a row of perforations along the top of each date sheet, and a toran of small triangles along the lower edge of the header band.

## Components

### Buttons
- **Shape:** rectangular, 2px corners, 2px border, at least 2.75rem tall.
- **Primary:** vermilion fill, white bold text; deep vermilion on hover; moves 1px down when pressed.
- **Plain:** white fill, ultramarine text and border; inverts on hover.
- **Wording:** names the action ("See all dates", "Send booking request"). No arrows.

### Date sheet
- **Anatomy:** perforated ultramarine strip, vermilion month band with white text, large vermilion day numeral, weekday, then a dashed tear line and the facts for that departure.
- **Uses:** next departures on the home page (regular size, each a link), next departure in list rows and the departure picker (small).
- **Chosen state:** 3px ultramarine frame and a "Chosen" bar.
- **Full state:** the sheet is torn off; a dashed stub with the date and "Full" remains.

### Fields
- **Shape:** white, 2px ink border, 2px corners, 2.75rem tall. Label above, hint under the label, error under the control.
- **Invalid:** vermilion border, pale-yellow fill, a message that says what to enter.
- **Focus:** 3px ultramarine outline, 3px offset.

### Notices
- Pale-yellow panel with a 2px ink border for information; vermilion border for a problem. Always a heading, a sentence, and an action.

### Itinerary
- An ordered list on one unbroken 3px vermilion thread, with a ringed day number at each stop and the overnight town under each day.

### Header and footer bands
- Ultramarine with the name in yellow sign lettering and white links. The footer opens with a 6px vermilion rule and states that the catalogue is sample data.

## Do's and Don'ts

**Do**
- Show a departure as a date sheet whenever there is room for one.
- Put the date, seats left and price per person before any description.
- Use rules to divide lists; keep panels for forms and notices.
- State effort in numbers: kilometres on foot, metres of altitude.
- Use tokens from `frontend/src/shared/styles/tokens.css`; add a token before adding a raw value.

**Don't**
- Don't add gradients, blur, glow, or rounded soft-shadow cards.
- Don't put a shadow on anything that is not a date sheet.
- Don't set sentences, labels or numbers in sign lettering.
- Don't use all-caps, eyebrow labels above headings, or arrows after link text.
- Don't number things that are not a sequence.
- Don't invent photographs, testimonials, ratings or customer counts.
- Don't depict deities or use sacred symbols as decoration.
