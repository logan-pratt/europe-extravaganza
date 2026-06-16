# Today View — "Refine & Elevate" Design Pass

**Goal:** Make the `/today/` tab look polished and have a quiet "wow" on a phone, without changing what it does or hurting performance. A confident **"Now" focal moment**, a calmer information hierarchy, and consistent type/spacing/motion across the whole page — all within the existing editorial "travel-journal" aesthetic the city pages share.

**Decided framing (brainstorm):**
- **Usage:** phone, calm moments (mobile-first, room to breathe — not just at-a-glance).
- **Boldness:** *Refine & elevate* — keep the journal DNA and palette; add polish, hierarchy, and tasteful motion. No reinvention.
- **Performance:** zero added cost. **No `backdrop-filter` blur**, **no new image/font/network assets**, motion via `transform`/`opacity` only. Stays offline-first.
- **Scope:** the **whole page** — every section gets the refined language.
- **Signals:** the de-cluttered meta row must still surface **Critical** and **Leave-by** prominently on travel anchors.

**Stack constraints:** vanilla ES, no build step, GitHub Pages static under `/europe-extravaganza/`, system fonts only (Inter / Georgia / SF Mono — already in use). Sole owner of `today/`; only touches `today/` + cache-bust strings (+ `CACHE` bump in `sw.js` on deploy). No changes to `lisbon/`, `galway/`, `dublin/`, `london/`, or the hub.

---

## Design system (refined)

Reuse the existing tokens in `today/styles.css :root` (`--ink #211a16`, `--muted #6d6259`, `--paper #f7f2e9`, `--panel`, `--line`, `--olive`, `--blue`, `--gold`, `--red`, `--shadow`) and the existing per-city `--accent` (lisbon gold, galway teal, kilkea taupe, dublin green, london red) and `[data-tod]` time-of-day buckets. No new colors required.

- **Type:**
  - Display: `Georgia, "Times New Roman", serif` for the Now-hero title and section `h2`s (already used for `h2`).
  - Body/UI: `Inter` (existing).
  - Times: `SF Mono` stack (existing) — used consistently for every clock time (chips, meta rows, wallet, planner timeline, ticket stub).
- **Accent usage:** `--accent` drives now-dot, current-card ring + dot halo, now-line pill, hero progress bar, ticket mode label, and the "today" marker on day chips. The **active** day chip stays filled `--ink` (max contrast); accent is reserved for *live/now* meaning so it stays meaningful.
- **Radii:** cards 16px, hero 22px, chips 14px, pills 999px.
- **Elevation tiers:** flat cards (1px `--line` border) → current/hero card (`--shadow` + accent ring + ~1px lift).
- **Meta row (replaces pill-soup):** a single quiet row — `mono time` · `status dot + word` · optional contextual `Now`/`Next` badge. This replaces the current stack of separate status / type / critical / leave-by pills.

---

## Per-section spec

### 1. Hero + status strip
- Keep the "Today" hero (eyebrow `Sidewalk mode`, `h1 Today`, lede, Jump-to-today + Back-to-hub buttons). Tighten spacing and button styling (`.btn.primary` / `.btn.glass`).
- Keep the existing `[data-tod]` time-of-day wash on `.hero::after`.
- **Status strip** (`#statusStrip`): style the contextual line (`Trip starts in N days`, `Between pinned days · Next up: …`, `That's a wrap`, or `Today · <label>`) as a quiet eyebrow-weight line under the hero — small, muted, uppercase-ish. No box; just a refined line.

### 2. Day chips (`#dayChips`)
- Each chip: small uppercase weekday (`SAT`) + large Georgia numeral (`27`). Horizontal scroll with scroll-snap; hidden scrollbar.
- **Active** (selected) chip: filled `--ink`, paper text.
- **Today** (real today, may differ from selected): small `--accent` dot in the corner.
- Keep `data-date` for click handling; markup change only in `renderDayChips`.

### 3. Now panel (`#nowPanel`) — the signature focal card
- Rounded 22px card, `--panel` + a soft `linear-gradient` accent warmth wash, `--shadow`.
- **Eyebrow** with a pulsing `--accent` dot: `Next move` / `Current anchor` / `First anchor` (existing label logic).
- **Title:** Georgia, large (~1.7rem), the focus anchor's title; a muted "where" sub-line (city · type/context).
- **Countdown:** blown-up `in 1h 15m` (existing `getNextCountdown().label`) with mono `· 12:30` beside it. Only when viewing the real today (existing `showCountdown` gate).
- **Progress bar:** thin rounded bar showing elapsed fraction of the current→next gap. **Reuses `getNowLine(entry, now).fraction`** — already-tested pure logic, no new math. Hidden when not viewing today or when there's no current→next segment (fraction falls back cleanly).
- **Foot row:** status (dot + word), Critical chip if applicable, Leave-by chip if applicable, and a ghost "Open map →" button (existing `anchorLinks` map URL).
- Empty state (no anchors) keeps the current graceful message.

### 4. Utility panel (`#utilityPanel`)
- Three refined blocks within the existing `today-grid` (2-col desktop, stacked mobile):
  - **Base/Lodging:** name, area, "Map base" link.
  - **Booking wallet:** tidy list, mono times, title — confirmed/critical anchors.
  - **Prep:** checklist-styled `mini-list`.
- Same tokens, calmer borders/spacing. Markup largely unchanged; styling refine.

### 5. Timeline (`#anchorList`)
- Refined spine, dots (current = filled accent + halo, past = muted/hollow, future = hollow), and the **now-line** rendered as an accent pill (`NOW 11:15`) instead of a bare line.
- Card states: `timing-past` (dimmed but legible), `timing-current` (accent ring + lift), `timing-next` (subtle accent hint + `Next` badge).
- Meta row per card replaces pill-soup (mono time · status dot+word · Now/Next badge).
- **Travel anchors (`flight`/`train`/`transfer`) → boarding-pass tickets**, refined: perforated mono-time stub + accent mode label. **Critical** and **Leave-by** stay prominent here via an **accent left-edge** on the card and a single emphasized `Leave by 3:30am` chip (not buried in body text).

### 6. Planner context (`#plannerContext`)
- "From the city pages." — refine `context-card` and `timeline-list` (mono `<time>`, better type rhythm, calmer rules between rows).

### 7. Options (`#optionsSection`)
- "Useful options." — refine `option-card`; the `TBD` badge becomes a quiet muted chip rather than a loud status pill.

### 8. Deck (`#deckGrid`)
- "Tonight and tomorrow." — refine the Tonight (prep checklist) + Tomorrow (date · label · first anchor · "Open tomorrow" button) card pair with the shared tokens.

### 9. Toast (`#toast`)
- Minor styling alignment with the refined tokens.

---

## Motion & accessibility
- Accent **pulse** on the Now eyebrow dot and the live "Now" badge; current-card **lift**; now-line **glow**. All via `transform`/`opacity`/`box-shadow` (compositor-friendly).
- All non-essential motion wrapped in `@media (prefers-reduced-motion: reduce)` → animations off (extend the existing rule).
- Maintain tap targets ≥ ~26–44px; preserve `aria-live` on the status strip; keep semantic headings.

## Performance guardrails (acceptance)
- **No `backdrop-filter`** anywhere.
- **No new network assets** (no web fonts, no images) — preserves offline-first and SW cache size.
- The 45s re-render tick already re-renders these sections; refined markup must not materially increase DOM size.

## Implementation surface
- **`today/styles.css`** — the bulk of the work (tokens, sections above).
- **`today/app.js`** — targeted markup tweaks in `renderDayChips`, `renderNowPanel` (add progress bar + foot row), `renderAnchors`/ticket (meta row, critical/leave-by emphasis), and minor touch-ups in `renderStatus`, `renderUtilityPanel`, `renderDayContext`, `renderOptions`, `renderDeck`.
- **`today/schedule-logic.js`** — no new logic expected; the hero progress bar reuses `getNowLine().fraction`. If a tiny formatting helper is added, it gets a unit test (TDD).
- **`today/index.html`** — bump cache-bust strings for changed assets.
- **`sw.js`** — bump `CACHE` (e.g. `ee-today-v3`) on deploy so the activate handler clears the old cache.

## Out of scope (deferred)
- Hero/city imagery and glassy layering (decided against for perf/offline).
- Group presence, live decisions/wallet actions, weather (separate future plans).
- Removing the dead `optionLabelMap` in `app.js` (unrelated cleanup; track separately).

## Self-review
- **No placeholders.** Every section names concrete treatments and the existing tokens/logic they build on.
- **Consistency.** The meta-row, accent rules, and type scale are defined once and applied to every section; accent is reserved for "live/now" meaning, active-chip uses ink — no conflict.
- **Scope.** Whole-page but bounded to `today/` styling + small markup tweaks; no logic redesign. Single implementation plan is appropriate.
- **Signals preserved.** Critical/Leave-by explicitly re-surfaced on travel anchors (accent edge + emphasized chip) per the brainstorm decision.
- **Perf.** Explicit guardrails: no blur, no new assets, compositor-only motion, reduced-motion honored.
