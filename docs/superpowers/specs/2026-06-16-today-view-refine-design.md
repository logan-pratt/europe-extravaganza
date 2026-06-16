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
- **Per-city ambient wash (derived, optional polish):** a faint section/background tint derived from `--accent` at low alpha (e.g. `color-mix`/rgba ~6–10%) to give each city a quiet mood. **Discipline:** the wash must stay *below highlight intensity* — it reads as paper texture, not as a highlight — so it never competes with accent-as-live-signal (the Now/current elements). Legibility (text contrast on the wash) is checked. Derived from existing tokens only → no new colors, no perf cost.

---

## Per-section spec

### 1. Hero + status strip — **compress so Now sits higher (amended)**
- **Compress the hero aggressively on mobile** so the Now panel claims the top of the fold. The current hero (eyebrow `Sidewalk mode` + `h1 Today` + lede paragraph + two buttons) is too much chrome before the focal moment on a phone.
  - Collapse to a slim header line: small "Today" identity + the live status text + a compact Jump-to-today / Back-to-hub affordance (icon buttons or a single line). Hide/shrink the lede on small viewports (can keep it at desktop width).
  - Keep the existing `[data-tod]` time-of-day wash, scaled to the slimmer header.
- **Status strip** (`#statusStrip`): the contextual line (`Trip starts in N days`, `Between pinned days · Next up: …`, `That's a wrap`, or `Today · <label>`) folds into this slim header as a quiet muted line rather than a separate stacked section.
- Target: on a typical phone, the Now card's title + countdown is visible with little or no scroll.

### 2. Day chips (`#dayChips`)
- Each chip: small uppercase weekday (`SAT`) + large Georgia numeral (`27`). Horizontal scroll with scroll-snap; hidden scrollbar.
- **Active** (selected) chip: filled `--ink`, paper text.
- **Today** (real today, may differ from selected): small `--accent` dot in the corner.
- Keep `data-date` for click handling; markup change only in `renderDayChips`.
- **Optional polish (low priority):** a faint connecting "route" line threaded through the chips to suggest a journey across the trip. Nice-to-have; only if it doesn't complicate the scroll/snap or balloon scope.

### 3. Now panel (`#nowPanel`) — the signature focal card
- Rounded 22px card, `--panel` + a soft `linear-gradient` accent warmth wash, `--shadow`.
- **Eyebrow** with a pulsing `--accent` dot: `Next move` / `Current anchor` / `First anchor` (existing label logic).
- **Title:** Georgia, large (~1.7rem), the focus anchor's title; a muted "where" sub-line (city · type/context).
- **Countdown:** blown-up `in 1h 15m` (existing `getNextCountdown().label`) with mono `· 12:30` beside it. Only when viewing the real today (existing `showCountdown` gate).
- **Progress bar (gated precisely — amended):** thin rounded bar showing elapsed fraction of the current→next gap, fed by `getNowLine().fraction`. **Render it ONLY when a real current→next segment exists** (a current anchor *and* a next anchor). Otherwise it's misleading: before the first anchor `getNowLine` returns `{index:-1, fraction:0}` (empty bar implies "0% of something") and after the last `{index:last, fraction:1}` (full bar implies a segment that's over). `getNowLine` currently returns only `{index, fraction}`, so extend it to also surface `nextIndex` (and a derived `hasSegment = index >= 0 && nextIndex >= 0`); gate the bar on `hasSegment`. **This small logic change gets unit tests (TDD).**
- **Foot row:** status (dot + word), Critical chip if applicable, Leave-by chip if applicable, and a ghost "Open map →" button (existing `anchorLinks` map URL).
- Empty state (no anchors) keeps the current graceful message.

#### First-anchor duplication (amended)
The Now panel and the timeline both render the focus anchor. Mid-day this is *reinforcement*, not duplication — the timeline card sits below past anchors and the now-line, giving it position/context. The problem is the **first-anchor / pre-trip case**: when the focus anchor is the topmost timeline row with nothing above it, the hero card and the first timeline card appear back-to-back and identical. **Treatment (targeted, not a timeline rewrite):** when the focus anchor is the first/topmost timeline row, de-emphasize that card — drop its redundant body/links and render it as a slim "you are here" marker (or visually merge it into the now-line) — so the hero owns the detail and the timeline shows position. Normal mid-day rendering is unchanged.

### 4. Utility panel (`#utilityPanel`) — **bolder wallet (amended)**
- Three refined blocks within the existing `today-grid` (2-col desktop, stacked mobile):
  - **Base/Lodging:** name, area, "Map base" link.
  - **Booking wallet → "confirmations strip":** make it bolder by *density*, not a second ticket metaphor. A compact, scannable strip of the day's confirmed/critical items — `mono time` · title · tap-to-map, with leave-by surfaced where present. **Deliberately not a "mini boarding-pass stack"** — the timeline already owns the boarding-pass visual; a rival ticket stack here would compete for attention and duplicate it. Keep it quiet (no accent — accent stays reserved for *now*).
  - **Prep:** checklist-styled `mini-list`.
- Same tokens, calmer borders/spacing.

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
- **`today/app.js`** — markup tweaks in `renderDayChips`, the compressed hero/`renderStatus`, `renderNowPanel` (gated progress bar + foot row), `renderAnchors`/ticket (meta row, critical/leave-by emphasis, first-anchor de-emphasis), `renderUtilityPanel` (confirmations strip), and minor touch-ups in `renderDayContext`, `renderOptions`, `renderDeck`.
- **`today/schedule-logic.js`** — **extend `getNowLine` to also return `nextIndex` / `hasSegment`** so the hero progress bar only renders for a real current→next segment. New field is covered by unit tests (TDD); the fraction math itself is unchanged.
- **`today/index.html`** — bump cache-bust strings for changed assets.
- **`sw.js`** — bump `CACHE` (e.g. `ee-today-v3`) on deploy so the activate handler clears the old cache.

## Out of scope (deferred)
- Hero/city imagery and glassy layering (decided against for perf/offline).
- Group presence, live decisions/wallet actions, weather (separate future plans).
- Removing the dead `optionLabelMap` in `app.js` (unrelated cleanup; track separately).

## Review amendments (post-Codex-review)
Folded in from external review:
1. **Compressed hero** so the Now card sits higher on mobile (§1).
2. **First-anchor duplication** addressed with a targeted de-emphasis of the topmost timeline card (§3).
3. **Progress bar gated** to a real current→next segment via a `getNowLine` `hasSegment`/`nextIndex` addition, with TDD (§3, Implementation surface).
4. **Booking wallet → confirmations strip** (denser, not a rival boarding-pass stack) (§4).
5. **Per-city ambient washes** allowed, derived from `--accent` at sub-highlight intensity (Design system).
6. **Route-like day rail** captured as optional low-priority polish (§2).

## Self-review
- **No placeholders.** Every section names concrete treatments and the existing tokens/logic they build on.
- **Consistency.** The meta-row, accent rules, and type scale are defined once and applied to every section; accent is reserved for "live/now" meaning, active-chip uses ink, and per-city washes are explicitly held below highlight intensity — no conflict.
- **Scope.** Whole-page but bounded to `today/` styling + small markup tweaks; the only logic change is the tested `getNowLine` segment field. Single implementation plan is appropriate.
- **Signals preserved.** Critical/Leave-by explicitly re-surfaced on travel anchors (accent edge + emphasized chip); the bolder wallet stays quiet so it doesn't steal accent focus.
- **Perf.** Explicit guardrails: no blur, no new assets, compositor-only motion, reduced-motion honored.
