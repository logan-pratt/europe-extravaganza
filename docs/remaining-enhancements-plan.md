# Remaining Website Enhancements Plan

Goal: implement the review items not included in this pass while keeping the site static, GitHub Pages-compatible, and easy to maintain.

## 1. Sticky Trip Command Bar

Files:
- `dublin/index.html`, `dublin/styles.css`, `dublin/app.js`
- `lisbon/index.html`, `lisbon/styles.css`, `lisbon/app.js`
- `london/index.html`, `london/enhancements.css`, `london/app.js`

Plan:
- Add a compact sticky bar below the top nav or at the bottom edge on mobile.
- Show current trip, current section, saved notes count, unresolved decision count, and quick links to `#final-cut`, `#notes`, and share/export.
- Compute counts from existing `noteState` and existing final-cut helpers.
- Keep it hidden in print and presentation mode.

Verification:
- Toggle reactions and confirm counts update.
- Check mobile width for no overlap.

## 2. Visible Reaction Summaries On Cards

Files:
- `dublin/app.js`, `dublin/styles.css`
- `lisbon/app.js`, `lisbon/styles.css`
- `london/app.js`, `london/enhancements.css`

Plan:
- Extend `feedbackPanel()` callers with a small summary row beside the notes summary.
- Show initials by reaction group, for example `Love: L E`, `Concern: M`.
- Use existing `noteState`; do not change packet format.
- Hide the summary row when no one has reacted.

Verification:
- Add reactions for multiple people.
- Confirm summaries render on the card, notes review, and final-cut still agree.

## 3. Per-Day Today Card

Files:
- `dublin/data.js`, `dublin/app.js`, `dublin/styles.css`
- `lisbon/data.js`, `lisbon/app.js`, `lisbon/styles.css`
- `london/data.js`, `london/app.js`, `london/enhancements.css`

Plan:
- Add a focused day card near the top of each planner.
- Show wake-up / first move, main booking, must-do, backup, and map links.
- Use existing day data where possible; add a `todayCard` object only when current data is not enough.
- Add simple previous/next day controls that reuse the existing selected-day state.

Verification:
- Change selected day and confirm the card updates.
- Confirm copy summary remains unchanged.

## 4. Localize Remote Images

Files:
- `assets/`
- `styles.css`
- `dublin/styles.css`
- `london/styles.css`
- `london/index.html`

Plan:
- Download or replace remote background images with stable local assets.
- Keep credits in visible image-credit text where required.
- Replace Wikimedia and Unsplash CSS URLs with `assets/...` paths.
- Keep user-provided Lisbon and Dublin photos unchanged.

Verification:
- Run local server and block network in browser dev tools if practical.
- Confirm hub, Dublin, Lisbon, and London still render their primary images.

## 5. What Needs Deciding Sections

Files:
- `dublin/index.html`, `dublin/app.js`, `dublin/styles.css`
- `lisbon/index.html`, `lisbon/app.js`, `lisbon/styles.css`
- `london/index.html`, `london/app.js`, `london/enhancements.css`

Plan:
- Add an early `#decisions` section after the verdict/quick facts.
- Pull a short curated list from each planner:
  - Lisbon: Sintra/Cascais energy, final dinner, fado/bar night, Monday discipline.
  - Dublin: Friday music plan, Saturday cultural anchor, dinner default, Sunday airport buffer.
  - London: Wednesday path, friend dinner, Wimbledon arrival, show/dinner pairing.
- Each item links to the relevant section and uses existing note controls.

Verification:
- Confirm all links scroll to the expected section.
- Confirm notes attached to decision items appear in the notes review.
