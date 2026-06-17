# Today View Enhancements — Design

**Date:** 2026-06-17
**Scope:** `today/` view only. No changes to city planners (`lisbon/`, `galway/`, `dublin/`, `london/`) beyond optional data-shape additions to their existing arrays.
**Goal:** Make the Today view more useful on-foot in Europe by adding walking-time context between anchors, one-tap address handoffs, a quick wallet, a day-aware suggestions section, and a walking-mode toggle.

**Priorities (from brainstorm):** logistics (#1), decision support (#2), density (#3). Group coordination is explicitly out of scope.

---

## Piece 1 — Walking-time deltas in the timeline

**What:** A thin "transit row" rendered between consecutive anchor cards showing walking time + distance, e.g. `↘ 8 min walk · 600 m`. Travel-mode anchors (flight/train/transfer) render a heavier transit row that names the mode.

**Data shape (additive):**
- Anchor gains optional `walkMinutes: number` — minutes from the previous anchor in the day's sorted order.
- Anchor gains optional `walkMeters: number` — distance from the previous anchor.
- Anchor gains optional `coords: [lat, lng]` — reserved for future live routing; not consumed in this iteration.

**Why static, not live:** A hand-set integer per anchor pair is enough offline, never throttled by an API, and only needs to be order-of-magnitude correct ("5 vs 25 min").

**Hide rules:**
- If the previous anchor is `type: 'meal'` or `type: 'lodging'` (open-ended duration), the transit row hides — walking time without a known departure is noise.
- If `walkMinutes` is absent on the later anchor, no row renders.
- Travel-type anchors render their own boarding-pass card and suppress the transit row above them.

**Visual:** Muted text row slotted between `.tl-row` elements, aligned with the timeline spine. No card chrome.

---

## Piece 2 — One-tap address actions

**What:** Every anchor card, lodging block, and confirmation row in the Utility panel gets a compact 3-button action cluster:

- **Map** — opens `mapUrl` in a new tab (existing field).
- **Copy** — copies plain `address` string to clipboard via `navigator.clipboard.writeText`, flashes a "Copied" toast (existing `#toast`).
- **Bolt / Uber** — deep links with web fallback:
  - Bolt: `bolt://` deep link, fallback to `https://bolt.eu/...` web URL.
  - Uber: `uber://?action=setPickup&dropoff[formatted_address]=…`, fallback to `https://m.uber.com/ul/...`.

**Data shape (additive):**
- Anchor and lodging gain optional `address: string` — the plain text address used by Copy and the ride-hail dropoff URLs.

**Degradation:** Missing `address` hides Copy + Bolt + Uber buttons; Map still renders if `mapUrl` exists.

**Visual:**
- Standard anchor cards: 3 small ghost buttons at the bottom of the card.
- Now panel: same buttons rendered larger (this is the most-tapped surface).
- Confirmation rows: same buttons inline.

**Out of scope:** calendar add, share sheet, email. YAGNI.

---

## Piece 3 — Quick wallet

**What:** A new collapsible block in the Utility panel titled **Wallet**, sitting between "Confirmations" and "Prep". One row per bookable anchor across **today + tomorrow only**.

**Each row shows:**
- Venue name + time.
- Confirmation number — mono font, tap-to-copy.
- Reservation name — the name the booking is held under.
- Phone — `tel:` link, tap-to-call.

**Data shape (additive):**
- Anchor gains optional `booking: { confirmation, reservedAs, phone }`. Only anchors with a non-empty `booking` render a wallet row.

**Relationship to existing `status: 'confirmed'`:** unchanged — `status` remains the truth for "this is locked in." `booking` is the *details* layer used when standing at the door.

**Why today + tomorrow only:** the wallet exists to support imminent arrival or next-day prep. The full trip view lives in the city pages.

**Walking-mode interaction:** Block is hidden in walking mode (Piece 5). Instead, a single **Wallet** button in the enlarged Now panel reveals only the booking row for the current/next anchor on tap.

---

## Piece 4 — Suggestions section (hybrid auto-match + manual override)

**Replaces:** the current static `#optionsSection` "Useful options" rendering.

**Location:** new `<section class="section suggest-section">` between `#plannerContext` and `.deck-section`.

### Open-slot derivation

The day's anchors are scanned to identify which canonical slots are unfilled. Canonical slots and their time windows:

| Slot | Window |
|---|---|
| breakfast | 06:00 – 10:30 |
| lunch | 11:30 – 14:30 |
| afternoon | 14:30 – 17:30 |
| drink | 17:00 – 19:30 |
| dinner | 19:00 – 22:00 |
| late | 22:00 – 01:00 |

A slot is **open** if:
- No anchor's sort-time falls in its window, AND
- No anchor's `type` matches the slot type (`meal`, `booking`, `drink`, etc. resolved by an explicit map).

If an anchor has `slot: 'dinner'` set explicitly in data, that always fills the slot regardless of time/type.

### Candidate pool (hybrid)

For each open slot, candidates are built in this order:

1. **Manual override** — if the day declares `suggest: { dinner: ['oficio', 'prado'] }` in `shared/schedule.js`, that exact ID list is the pool. Auto-match is skipped.
2. **Auto-match by tag** — otherwise, the day's city data (`restaurants`, `bars`, `activities`) is scanned. An item qualifies if its `tags` string includes the slot tag (`lunch`, `dinner`, `drink`, etc.) AND, where applicable, a day-context tag (e.g. `belem` for the Belém day, `cascais` for the Cascais Sunday). Items carrying closure conflicts (`sunday-closed`, `monday-closed`) for the day-of-week are excluded.
3. **Reaction rank within the pool** — sorted by existing `rankReactionOptions` score. Ties broken by the source data's `rank` field.
4. **Cap at 3** rendered as cards. A "+ N more" reveal exposes the next two.

### Card markup

Each suggestion card shows:
- Reaction summary chip (`❤︎ 4 · maybe 1`)
- Matched tags (`#lunch #group`)
- Venue / activity name
- One-line `role` or `why` from source data
- Action cluster: Map, Copy, Bolt (Piece 2)
- **Lock it in** button — copies `{venue} · {suggested time}` to clipboard and shows a toast. Does not write to `schedule.js`; the source of truth remains a deliberate edit.

### Why this works where the old version failed

The old design ranked by reaction only. The missing piece was the day's open-slot context. By deriving open slots and filtering candidates by slot + day-context tags before ranking, suggestions are anchored to a specific time-of-day on a specific day instead of floating loose.

### Data shape (additive)

- Schedule entry in `shared/schedule.js` gains optional `suggest: { [slot]: string[] }` — explicit ID overrides per slot.
- City data items already carry `tags` (restaurants, bars) and verdict (activities); no schema change needed for auto-match.

**Walking-mode interaction:** section hidden entirely. Suggestions are an at-rest feature.

---

## Piece 5 — Walking mode toggle

**What:** A toggle in the hero actions row labeled **🚶 Walking** / **🛋 Full**. State persisted in `localStorage` under key `today.walking`.

### Visible in walking mode

- Day chips row
- Status strip (single line)
- **Now panel, enlarged** — current/next anchor headline + countdown + Map/Copy/Bolt action cluster, larger tap targets
- **Next anchor preview** — single compact row directly below the Now panel: time + title + walking delta from current anchor (reusing Piece 1's `walkMinutes`)
- **Wallet reveal button** — single tap surfaces the booking row (Piece 3) for the current/next anchor only

### Hidden in walking mode

- Anchor timeline (full vertical list)
- Planner context cards
- Suggestions section
- "On deck" section (tonight + tomorrow)
- Utility panel base + prep blocks

### Implementation

- Toggle sets `data-mode="walking"` on `<main class="today-shell">`.
- All hiding is driven by CSS selectors like `[data-mode="walking"] .deck-section { display: none; }`.
- No render-time JS branching — render functions continue to emit their full HTML; walking mode simply hides it. Means walking mode is reversible, low-risk, and cannot break the timeline rendering.

### Sizing in walking mode

- Now-panel headline ≥ 32px
- All tap targets ≥ 48×48 (Apple HIG floor)
- Body text ≥ 18px

### Why manual toggle, not auto-detect

Motion- or time-based auto-detect is wrong roughly half the time (sitting on a tram, eating lunch, idling at the apartment). One-tap manual control is honest about user state.

---

## Out of scope (deferred)

- **Group presence / running-late signals** — explicitly skipped per user (always traveling together).
- **Live walking-route lookup** — `coords` field is reserved; routing API is deferred.
- **Offline static maps per anchor** — follow-up after Piece 1 lands.
- **Editing the schedule from the device** — Lock-it copies to clipboard only; source of truth stays the file.
- **"Am I going to be late?" warnings** — deprioritized.

---

## File map (high level — implementation plan will refine)

- **Modify** `shared/schedule.js` — add optional `walkMinutes`, `walkMeters`, `address`, `booking`, `suggest` on entries/anchors where useful. Backwards compatible.
- **Modify** `today/schedule-logic.js` — add `getOpenSlots(entry)`, `getSuggestionPool(entry, cityData)`, `getWalletItems(entry, tomorrowEntry)`. Pure, Node-testable.
- **Modify** `today/schedule-logic.test.mjs` — tests for the three new functions.
- **Modify** `today/app.js` — render transit rows in `renderAnchors`, action clusters in cards, wallet block, suggestion section, walking-mode toggle and `data-mode` attribute.
- **Modify** `today/styles.css` — transit row styling, action cluster, wallet, suggestion cards, walking-mode hide/grow rules.
- **Modify** `today/index.html` — bump cache-bust string; add walking-mode toggle button to hero actions.
- **Modify** `sw.js` — bump `CACHE` name so the SW serves the new bundle.

---

## Open questions resolved

- Suggestion placement: dedicated section between planner context and on deck.
- Suggestion strategy: hybrid (manual overrides → auto-match by tags → reaction-rank within pool).
- Density mode: manual toggle (not auto).
- Walking-time source: static hand-set integers per anchor pair.
- Wallet scope: today + tomorrow only.
- Lock-it action: clipboard + toast only (no writes from the device).
