# Group Awareness & Navigation Design

**Date:** 2026-05-21  
**Scope:** Approaches A (group awareness) and B (navigation & structure)  
**Context:** Static multi-city Europe trip planner for Logan, Emily, Ashley, and Max. Supabase handles real-time reactions and notes. The legacy "copy share packet" export UI predates the DB and is now redundant clutter.

---

## Goals

1. Make group members feel the site is *alive* — their friends' reactions are visible, open decisions surface naturally, and the collaboration feels real-time, not manual.
2. Fix navigation dead ends — the site currently requires going back to the hub between every city, the route map looks interactive but isn't, and Kilkea reads as broken.

---

## Section A: Group Awareness

### A1. Card reaction summaries with initials

**Where:** Every activity, restaurant, experience, and day card across all city pages (London, Lisbon, Dublin, Galway).

**What:** Below each card's existing feedback panel, render a compact summary row showing the group's aggregate reactions. Format: `❤️ 2 · 👍 1 · 😬 1` with initials visible on tap/hover per reaction type (e.g., "L, E" under ❤️).

**Data source:** Live Supabase state, not localStorage. The summary re-renders whenever the Supabase subscription fires.

**Behavior:** Hidden entirely when no reactions exist on a card. No empty state needed.

**Files:** Each city's `app.js` (extend `feedbackPanel()` callers), each city's `styles.css` (new `.reaction-summary` styles).

---

### A2. Hub city card live indicators

**Where:** Each city card on `index.html` (Lisbon, Galway, Dublin, London).

**What:** A status line beneath each card's description: `14 reactions · 2 open decisions`. Pulled from Supabase at page load. Kilkea omitted (no data).

**Behavior:** Shows "— reactions" as a loading placeholder, updates once Supabase responds. Zero state: omit entirely or show "No reactions yet."

**Files:** `index.html` (add indicator element to each `.city-card`), `styles.css` (`.city-card-status` styles), new lightweight fetch in a `<script>` at the bottom of `index.html` using the existing `shared/supabase-config.js`.

---

### A3. Demote the export UI

**Where:** Hero "Copy summary" button and full share panel (`#share` section) on each city page.

**What:** The share panel (`#share`) moves to a collapsed `<details>` disclosure labeled "Export & legacy sharing" at the very bottom of the page, after all content. The "Copy summary" hero button is removed from the primary hero actions row. If a compact export link is still wanted, it lives inside the disclosure only.

**Rationale:** With Supabase live, the share packet is a fallback, not a primary action. It shouldn't compete with "Explore the plan" and "Pick Wednesday" as a hero CTA.

**Files:** Each city's `index.html` (restructure share section, remove hero button), each city's `styles.css` (details/summary styling).

---

### A4. Open decisions count & banner

**Where:** Each city page, near the top (after the verdict/quick-facts section).

**What:** A slim banner: `3 things still need a decision →` that links to the `#decisions` section (to be built per the existing remaining-enhancements plan item 5). On the hub, this rolls into the city card indicator (A2) as the "open decisions" count.

**Behavior:** Hidden when zero open decisions. "Open decision" = a card tagged as a decision point that has fewer than 2 reactions or has a Concern reaction with no resolution.

**Files:** Each city's `index.html` (banner element after verdict), each city's `app.js` (compute open decision count from Supabase state), each city's `styles.css` (`.decisions-banner` styles).

---

## Section B: Navigation & Structure

### B1. Interactive route map nodes

**Where:** Hub page (`index.html`), the `.route-map` section.

**What:** Wrap each `.route-node` with an `<a href="[city]/">` anchor. Add hover state: `translateY(-3px)` lift + subtle gold box-shadow glow. Kilkea node: no link, cursor `default`, slightly dimmed opacity (0.55), `aria-disabled="true"`.

**Files:** `index.html` (wrap nodes in `<a>`), `styles.css` (`.route-node a` hover, `.route-node.disabled` state).

---

### B2. City switcher in trip page navbars

**Where:** Each city page's `.navlinks` container.

**What:** Add a compact group of city-initial pills at the left end of the navlinks bar, separated from section links by a thin divider: `Hub · L · G · D · Lon`. The active city pill is highlighted (gold background, dark text). Each pill is an `<a>` to the relevant city root.

**Constraints:** Use short labels (single letters or 3-char abbreviations). On screens ≤ 640px where all links don't fit, hide the section links (Plan, Food, etc.) and show only the city pills — section links are already accessible by scrolling, but city navigation is not available anywhere else on mobile.

**Files:** Each city's `index.html` (add city pills to `.navlinks`), each city's `styles.css` (`.city-pill`, `.city-pill.active` styles, divider).

---

### B3. Kilkea "coming soon" treatment

**Where:** Hub page, `.city-card.kilkea`.

**What:** Replace the `<span class="btn disabled">TBD</span>` with a styled "coming soon" state: lock icon (🔒 or SVG) + "Planner coming soon · June 30" text, rendered as a muted pill. Replace the generic TBD bullet points with 2–3 concrete bullets about the wedding (castle, date, attendees). The card should feel deliberate, not placeholder-y.

**Files:** `index.html` (rewrite Kilkea card content), `styles.css` (`.btn.coming-soon` variant).

---

### B4. Prev/next city navigation at page bottom

**Where:** Bottom of each city page, above the footer/share section.

**What:** A simple two-column footer row: `← Hub` on the left, `Next: [City] →` on the right. Trip order: Lisbon → Galway → Dublin → London. Kilkea is skipped. London's "next" is omitted (it's the final city). Lisbon's "prev" is just "← Hub".

**Styling:** Minimal — same `.btn` class, no extra component. Fits in a `<div class="city-nav-footer">` flex row.

**Files:** Each city's `index.html` (add footer nav), each city's `styles.css` (`.city-nav-footer` layout).

---

## What This Does Not Include

- Kilkea planner (TBD, out of scope)
- Offline / service worker support
- Cross-city reactions dashboard (a future enhancement)
- Design system unification (border-radius, dark mode parity — separate polish pass)
- Any changes to the Supabase schema or submissions-api.js (assumes current schema supports reaction reads by city/card)

---

## Open Questions

1. **Supabase read permissions:** Does the current `submissions-api.js` expose a read endpoint for aggregate reactions by city, or only writes? If reads aren't implemented, A2 and A4 need a read path added first.
2. **Reaction initials:** Are user identifiers (L/E/A/M) stored in Supabase alongside reactions, or is it anonymous? Initials on A1 depend on this.
3. **"Open decision" definition:** The definition above is a heuristic. Logan should confirm whether a formal "decision" tag exists in the data model or if this needs to be inferred.
