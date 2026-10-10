---
paths:
  - "frontend/**"
---

# Frontend

## Components

- Function components only. One component per file, named export, file name matches the component.
- Props are a named `type` declared above the component.
- Keep components under roughly 150 lines. Extract when a component grows a second responsibility.
- Derive values during render. Use `useEffect` only to synchronise with something outside React.
- Lists use stable ids as keys, never the array index.

## Data

- Server data is loaded through a feature gateway and exposed by a hook that returns `{ status, data, error }`.
- Every data view handles four states: loading, empty, error, and loaded.
- Forms validate on blur and on submit, show the message beside the field, and keep what the person typed after an error.

## Styling

- Plain CSS with custom properties. Tokens live in `shared/styles/tokens.css`; component styles sit beside the component as `Name.css`.
- Components use tokens. No raw hex colours, font names, or pixel spacing values outside the tokens file.
- Class names are scoped by component: `.yatra-card`, `.yatra-card__title`.
- Layout is mobile-first. Breakpoints are defined once in tokens.
- No UI kit and no CSS framework without discussion.

## Accessibility

- Semantic elements first: `button` for actions, `a` for navigation, one `h1` per page, headings in order.
- Every interactive element is reachable by keyboard and has a visible focus style.
- Images have meaningful `alt`, or `alt=""` when decorative.
- Form controls have a real `label`. Errors are linked with `aria-describedby`.
- Text contrast meets WCAG AA. Motion respects `prefers-reduced-motion`.

## Dependencies

- Prefer the platform: `fetch`, `Intl`, `<dialog>`, `<details>`, native date inputs.
- Adding a runtime dependency needs a reason that the platform cannot meet.
- Approved for motion: `gsap` with `@gsap/react`, and `lenis` for smooth scrolling.

## Motion

- Import GSAP only from `shared/motion/gsap.ts`, which registers the plugins once.
- Build animations inside `useGSAP` with a `scope` ref, wrapped in `withMotion`, so they are reverted on unmount and never run for people who ask for reduced motion.
- Write the final state in CSS and animate *from* an offset. A page must be complete and readable if no animation ever runs.
- Scroll effects use `ScrollTrigger`; do not add scroll listeners. Programmatic scrolling goes through `shared/motion/smoothScroll.ts`.
- Animate `transform` and `opacity`. Do not animate layout properties.
