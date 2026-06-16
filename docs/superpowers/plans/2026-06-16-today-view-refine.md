# Today View — Refine & Elevate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the `/today/` tab to a calm, phone-first "wow" — a compressed hero, a signature "Now" focal card with a gated progress bar, a decluttered meta row, refined timeline/tickets/wallet, and subtle per-city washes — within the existing journal aesthetic, at zero added performance cost.

**Architecture:** Almost entirely `today/styles.css` + targeted markup tweaks in `today/app.js`'s `render*` functions. The one logic change is extending the pure `getNowLine` in `today/schedule-logic.js` with a `hasSegment`/`nextIndex` signal (TDD) so the hero progress bar only renders for a real current→next segment. No new dependencies, no new network assets, no `backdrop-filter`; motion via `transform`/`opacity` only, gated by `prefers-reduced-motion`.

**Tech Stack:** Vanilla ES, no build step, GitHub Pages static under `/europe-extravaganza/`. System fonts only (Inter / Georgia / SF Mono). Tests via `node --test` (`.mjs`).

---

## Context for the implementer (read first)

- **Design spec:** `docs/superpowers/specs/2026-06-16-today-view-refine-design.md` is the source of truth for intent. This plan implements it.
- **Repo:** static site, no build. Local path `/Users/loganpratt/Downloads/london_love_letter_interactive_site`. Deploys to `https://logan-pratt.github.io/europe-extravaganza/` under the `/europe-extravaganza/` sub-path — use **relative** URLs everywhere.
- **You are the sole owner of `today/`.** This plan only touches `today/` (+ a `CACHE` bump in root `sw.js` at the end). **Do not modify** `lisbon/`, `galway/`, `dublin/`, `london/`, or the hub.
- **Existing structure (already built):** `today/index.html` sections in order: `.hero#top`, `.day-rail > #dayChips`, `.status-strip#statusStrip`, `.today-grid > #nowPanel + #utilityPanel`, `.section > #todayTitle + #anchorList`, `.planner-context#plannerContext`, `.options-section#optionsSection`, `.deck-section > #deckGrid`.
- **Existing CSS already present** (from prior work — this plan *modifies* these): `.timeline`, `.tl-row`, `.tl-card`, `.now-line`, `.live-badge`, `.count-badge`, `.now-times`, `.ticket`/`.ticket-stub`, `.tl-card.timing-{past,current,next}`, the `@keyframes now-pulse`, and the `@media (prefers-reduced-motion: reduce)` block. The per-city `[data-city]{--accent}` palette and `[data-tod]` hero washes also already exist.
- **Existing tokens** (`today/styles.css :root`): `--ink #211a16`, `--muted #6d6259`, `--paper #f7f2e9`, `--panel rgba(255,251,244,.88)`, `--line rgba(45,34,24,.15)`, `--olive #3d6049`, `--blue #235b73`, `--gold #b97925`, `--red #9c3f31`, `--shadow`. Per-city `--accent`: lisbon `#b97925`, galway `#2f6f6f`, kilkea `#6d6259`, dublin `#3d6049`, london `#9c3f31`.
- **Existing JS helpers** in `today/app.js`: `$`, `escapeHtml`, `formatDate`, `formatLongDate`, `cityLabel`, `anchorLinks(anchor)`, `getEntry`, `getEntryIndex`, `getDayData`, `selectDate`. `LOGIC` = `window.TODAY_LOGIC`. Travel types set: `const TRAVEL_TYPES = new Set(['flight','train','transfer'])`.
- **Test harness** (`today/schedule-logic.test.mjs`): `globalThis.window = {}; await import('./schedule-logic.js'); const {...} = globalThis.window.TODAY_LOGIC;`. `sampleSchedule[1]` (`2026-06-28`, Sintra) has anchors at `10:00`, `12:30`, `20:00`.
- **Verification after EVERY code change:**
  ```bash
  node --check today/app.js
  node --check today/schedule-logic.js
  node --test today/schedule-logic.test.mjs
  ```
  HTML/CSS changes also need a browser smoke test: `python3 -m http.server 4174` → `http://127.0.0.1:4174/today/`. Check the console for errors. Toggle OS reduce-motion to confirm animations stop. **Note:** during a session, the service worker caches assets cache-first under canonical keys; to see CSS/JS edits in the browser either bump the cache-bust string (Task 10) or, for quick local iteration, DevTools → Application → unregister SW + clear `ee-today-*` caches and hard-reload.
- **Cache-busting:** `today/index.html` currently loads `styles.css`, `schedule-logic.js`, `app.js` at `?v=20260616-living`. Task 10 bumps these to `?v=20260616-refine` and bumps `CACHE` in `sw.js` to `ee-today-v3`.

## File map

- **Modify** `today/schedule-logic.js` — extend `getNowLine` return with `nextIndex` + `hasSegment`.
- **Modify** `today/schedule-logic.test.mjs` — assert the new fields.
- **Modify** `today/app.js` — markup tweaks in `renderDayChips`, hero/`renderStatus`, `renderNowPanel`, `anchorBadges`/`standardHtml`/`ticketHtml`/`renderAnchors`, `renderUtilityPanel`, `renderDayContext`, `renderOptions`, `renderDeck`.
- **Modify** `today/styles.css` — the bulk of the refine (tokens helpers, hero, chips, now-panel, timeline, tickets, wallet, planner/options/deck, washes, motion).
- **Modify** `today/index.html` — cache-bust bump (Task 10).
- **Modify** `sw.js` — `CACHE` bump (Task 10).

---

## Task 1: `getNowLine` segment signal (TDD)

**Files:**
- Modify: `today/schedule-logic.js`
- Test: `today/schedule-logic.test.mjs`

- [ ] **Step 1: Write the failing test**

In `today/schedule-logic.test.mjs`, append:

```js
test('getNowLine reports whether a real current-to-next segment exists', () => {
  // 10:00 / 12:30 / 20:00 anchors
  const before = getNowLine(sampleSchedule[1], new Date('2026-06-28T08:00:00'));
  assert.equal(before.index, -1);
  assert.equal(before.nextIndex, 0);
  assert.equal(before.hasSegment, false); // no current yet

  const between = getNowLine(sampleSchedule[1], new Date('2026-06-28T11:15:00'));
  assert.equal(between.index, 0);
  assert.equal(between.nextIndex, 1);
  assert.equal(between.hasSegment, true);

  const after = getNowLine(sampleSchedule[1], new Date('2026-06-28T21:00:00'));
  assert.equal(after.index, 2);
  assert.equal(after.nextIndex, -1);
  assert.equal(after.hasSegment, false); // no next
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test today/schedule-logic.test.mjs`
Expected: FAIL — `nextIndex`/`hasSegment` are `undefined`.

- [ ] **Step 3: Extend `getNowLine`**

In `today/schedule-logic.js`, change the `return` at the end of `getNowLine` from:

```js
  return { index, fraction: Math.max(0, Math.min(1, fraction)) };
```

to:

```js
  return {
    index,
    nextIndex,
    hasSegment: index >= 0 && nextIndex >= 0,
    fraction: Math.max(0, Math.min(1, fraction))
  };
```

(`nextIndex` is already computed earlier in the function; this only widens the returned object — `index` and `fraction` are unchanged.)

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test today/schedule-logic.test.mjs`
Expected: PASS — all tests green (including the existing now-line test, which only asserts `index`/`fraction`).

- [ ] **Step 5: Commit**

```bash
git add today/schedule-logic.js today/schedule-logic.test.mjs
git commit -m "feat(today): getNowLine reports current-to-next segment presence"
```

---

## Task 2: Shared refinements — meta row, per-city wash, motion

**Files:**
- Modify: `today/styles.css`

These are the shared primitives later tasks consume. They are additive (new classes) plus a per-city wash; nothing breaks visually yet.

- [ ] **Step 1: Append the shared layer to `today/styles.css`**

```css
/* ===== Refine & Elevate: shared layer ===== */

/* Per-city ambient wash — derived from --accent, held BELOW highlight intensity.
   Reads as paper tint, never as a highlight, so it never competes with
   accent-as-live-signal. */
.today-shell {
  background:
    radial-gradient(1100px 380px at 50% -160px,
      color-mix(in srgb, var(--accent, var(--blue)) 12%, transparent), transparent 60%);
  background-attachment: fixed;
}

/* Quiet meta row that replaces pill-soup everywhere. */
.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: .78rem;
  color: var(--muted);
  margin-bottom: 7px;
}
.meta .meta-time {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 700;
  color: var(--ink);
}
.meta .meta-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.meta .meta-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--olive);
}
.meta .meta-status.tentative::before { background: var(--gold); }
.meta .meta-status.tbd::before { background: var(--muted); }

/* Contextual Now/Next badge (replaces .live-badge). */
.badge {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: .6rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.badge.now {
  color: #fffaf0;
  background: var(--accent, var(--olive));
  animation: now-pulse 2.2s ease-in-out infinite;
}
.badge.next {
  color: var(--ink);
  border: 1px solid var(--line);
}

/* Emphasized chips for operationally-critical signals (travel anchors). */
.chip-flag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .04em;
}
.chip-flag.leaveby {
  color: var(--accent, var(--red));
  background: color-mix(in srgb, var(--accent, var(--red)) 14%, transparent);
}
.chip-flag.critical {
  color: var(--red);
  background: color-mix(in srgb, var(--red) 14%, transparent);
}

/* Ghost button used in the Now foot row. */
.btn.ghost {
  border: 1px solid var(--line);
  background: transparent;
  border-radius: 999px;
  padding: 7px 14px;
  font-weight: 700;
  font-size: .8rem;
  color: var(--ink);
  cursor: pointer;
  text-decoration: none;
}

@media (prefers-reduced-motion: reduce) {
  .badge.now { animation: none; }
}
```

- [ ] **Step 2: Smoke test**

Run `python3 -m http.server 4174`, open `http://127.0.0.1:4174/today/`. Click through day chips for different cities. Confirm: a faint accent-tinted glow at the top of the page changes hue per city (gold Lisbon, green Dublin, red London) and stays subtle (text remains fully legible). No console errors. (New `.meta`/`.badge`/`.chip-flag` classes aren't used yet — that's expected.)

- [ ] **Step 3: Commit**

```bash
git add today/styles.css
git commit -m "feat(today): shared refine layer — meta row, per-city wash, motion"
```

---

## Task 3: Compress the hero + status strip

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

Goal: slim the top so the Now card claims the top of the mobile fold.

- [ ] **Step 1: Slim the hero markup**

In `today/index.html` the hero is static. Leave the markup but restyle (Step 3). First, fold the status text tighter in JS: in `today/app.js`, the `renderStatus` function already sets `$('#statusStrip').textContent`. No JS change needed for content. (Keep as-is.)

- [ ] **Step 2: Verify syntax**

Run: `node --check today/app.js`
Expected: no output.

- [ ] **Step 3: Restyle hero + status strip in `today/styles.css`**

Replace the existing `.hero` rule (and its `h1`/`.lede`/`.eyebrow` children, and `.status-strip`) with the compressed treatment. Append (these later rules win the cascade; if exact duplicate selectors exist above, update them in place instead):

```css
/* Compressed hero — keep identity, surrender the fold to the Now card. */
.hero {
  position: relative;
  padding: 14px 0 8px;
}
.hero .eyebrow { margin: 0 0 2px; }
.hero h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
  margin: 0;
  letter-spacing: -.01em;
}
.hero .lede { display: none; } /* hidden on phone; shown at desktop below */
.hero-actions { margin-top: 10px; gap: 8px; }

.status-strip {
  margin: 2px 0 6px;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .02em;
  color: var(--muted);
}

@media (min-width: 760px) {
  .hero { padding: 22px 0 12px; }
  .hero h1 { font-size: 2rem; }
  .hero .lede { display: block; }
}
```

- [ ] **Step 4: Smoke test**

Reload `http://127.0.0.1:4174/today/`. Confirm on a narrow window: the hero is compact (no lede), the status line is a quiet muted line, and the day chips + Now card are visible with minimal scroll. At wide width the lede reappears. No console errors.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css today/index.html
git commit -m "feat(today): compress hero so the Now card leads on mobile"
```

---

## Task 4: Day chips refine

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

- [ ] **Step 1: Restructure the chip markup**

In `today/app.js`, replace the `$('#dayChips').innerHTML = ...` template inside `renderDayChips` with:

```js
  $('#dayChips').innerHTML = SCHEDULE.map((entry) => `
    <button class="day-chip ${entry.date === selectedDate ? 'active' : ''} ${entry.date === actualToday ? 'is-today' : ''}" type="button" data-date="${entry.date}" aria-label="${escapeHtml(formatLongDate(entry.date))} ${escapeHtml(cityLabel(entry.city))}">
      <span class="dc-dow">${new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>
      <span class="dc-num">${new Date(entry.date + 'T00:00:00').getDate()}</span>
      <span class="dc-city">${escapeHtml(cityLabel(entry.city))}</span>
    </button>
  `).join('');
```

(The click handler `querySelectorAll('.day-chip')…` below it is unchanged.)

- [ ] **Step 2: Verify syntax**

Run: `node --check today/app.js`
Expected: no output.

- [ ] **Step 3: Restyle chips in `today/styles.css`**

Replace the existing `.day-chip` rules with:

```css
.day-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scroll-snap-type: x proximity;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.day-chips::-webkit-scrollbar { display: none; }

.day-chip {
  position: relative;
  flex: 0 0 auto;
  min-width: 64px;
  scroll-snap-align: start;
  display: grid;
  gap: 1px;
  padding: 9px 12px;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid var(--line);
  text-align: left;
  line-height: 1.05;
  cursor: pointer;
  color: var(--ink);
}
.day-chip .dc-dow {
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--muted);
}
.day-chip .dc-num {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.15rem;
  font-weight: 700;
}
.day-chip .dc-city {
  font-size: .58rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
}
.day-chip.is-today::after {
  content: "";
  position: absolute;
  top: 8px;
  right: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent, var(--blue));
}
.day-chip.active {
  background: var(--ink);
  border-color: var(--ink);
  color: #f7f2e9;
}
.day-chip.active .dc-dow,
.day-chip.active .dc-city { color: rgba(247, 242, 233, .72); }
```

- [ ] **Step 4: Smoke test**

Reload. Confirm chips show weekday + big serif numeral + city, the selected chip is filled ink, the *real today* chip (if within the trip window) shows an accent dot, and the rail scrolls/snaps horizontally. No console errors.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css
git commit -m "feat(today): refine day chips (weekday + serif numeral, snap rail)"
```

---

## Task 5: Now panel — signature focal card

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

- [ ] **Step 1: Rewrite `renderNowPanel`**

In `today/app.js`, replace the entire `renderNowPanel` function with:

```js
function renderNowPanel(entry) {
  const actualTodayKey = LOGIC.dateKey(new Date());
  const selectedIsToday = entry.date === actualTodayKey;
  const anchors = LOGIC.sortAnchors(entry.anchors || []);
  const live = selectedIsToday ? LOGIC.getCurrentAndNextAnchors(entry, new Date()) : { current: null, next: anchors[0] };
  const focus = live.next || live.current || anchors[0];
  const label = selectedIsToday ? (live.next ? 'Next move' : 'Current anchor') : 'First anchor';
  const countdown = selectedIsToday ? LOGIC.getNextCountdown(entry, new Date()) : null;
  const showCountdown = countdown && focus && countdown.anchor === focus;
  const nowLine = selectedIsToday ? LOGIC.getNowLine(entry, new Date()) : null;
  const showBar = !!(nowLine && nowLine.hasSegment);
  const barPct = showBar ? Math.round(nowLine.fraction * 100) : 0;

  if (!focus) {
    $('#nowPanel').innerHTML = `
      <div class="now-title"><div><p class="eyebrow">${label}</p><h2>${escapeHtml(entry.label)}</h2></div></div>
      <p class="empty">No fixed anchors yet. Use the planner context below.</p>
    `;
    return;
  }

  $('#nowPanel').innerHTML = `
    <p class="now-eyebrow"><span class="now-pulse"></span>${label}</p>
    <h2 class="now-headline">${escapeHtml(focus.title)}</h2>
    <p class="now-where">${escapeHtml(entry.label)}${focus.type ? ` · ${escapeHtml(focus.type)}` : ''}</p>
    ${showCountdown ? `
      <div class="now-count">
        <span class="now-count-big">${escapeHtml(countdown.label)}</span>
        <span class="now-count-at">· ${escapeHtml(focus.time)}</span>
      </div>` : `<div class="now-count"><span class="now-count-at">${escapeHtml(focus.time)}</span></div>`}
    ${showBar ? `<div class="now-bar"><i style="width:${barPct}%"></i></div>` : ''}
    <div class="now-foot">
      <span class="meta-status ${escapeHtml(focus.status || 'planned')}">${escapeHtml(focus.status || 'planned')}</span>
      ${focus.critical ? '<span class="chip-flag critical">Critical</span>' : ''}
      ${focus.leaveBy ? `<span class="chip-flag leaveby">Leave by ${escapeHtml(focus.leaveBy)}</span>` : ''}
      ${focus.mapUrl ? `<a class="btn ghost" href="${escapeHtml(focus.mapUrl)}" target="_blank" rel="noopener">Open map →</a>` : ''}
    </div>
  `;
}
```

- [ ] **Step 2: Verify syntax + tests**

Run: `node --check today/app.js && node --test today/schedule-logic.test.mjs`
Expected: no syntax errors; tests still pass.

- [ ] **Step 3: Style the Now card in `today/styles.css`**

Replace the existing `.now-panel`/`.now-title`/`.now-times`/`.count-badge` rules with:

```css
.now-panel {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid var(--line);
  background:
    linear-gradient(165deg, color-mix(in srgb, var(--accent, var(--blue)) 16%, transparent), transparent 55%),
    var(--panel);
  box-shadow: var(--shadow);
  padding: 20px 20px 18px;
}
.now-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--accent, var(--blue));
}
.now-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent, var(--blue));
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent, var(--blue)) 55%, transparent);
  animation: now-ping 2.4s ease-out infinite;
}
@keyframes now-ping {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent, var(--blue)) 55%, transparent); }
  70% { box-shadow: 0 0 0 9px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.now-headline {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  font-size: 1.7rem;
  line-height: 1.12;
  letter-spacing: -.01em;
  margin: 10px 0 4px;
}
.now-where { color: var(--muted); font-size: .9rem; margin: 0 0 16px; }
.now-count { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
.now-count-big { font-size: 2rem; font-weight: 800; letter-spacing: -.02em; color: var(--ink); }
.now-count-at {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 600;
  font-size: .95rem;
  color: var(--muted);
}
.now-bar { height: 6px; border-radius: 999px; background: rgba(45, 34, 24, .10); overflow: hidden; }
.now-bar > i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent, var(--blue)), color-mix(in srgb, var(--accent, var(--blue)) 55%, #ffffff));
  transition: width .6s ease;
}
.now-foot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 14px; font-size: .82rem; color: var(--muted); }
.now-foot .btn.ghost { margin-left: auto; }

@media (prefers-reduced-motion: reduce) {
  .now-pulse { animation: none; }
  .now-bar > i { transition: none; }
}
```

- [ ] **Step 4: Smoke test**

Reload. The Now card should read as the clear focal moment: pulsing accent dot, serif title, big countdown (only when viewing the real today), accent progress bar (only mid-segment), and a foot row with status + Critical/Leave-by chips (on travel anchors) + an "Open map →" ghost button. Because the trip is in the future relative to "now", confirm the no-countdown path renders cleanly (just the time, no bar). No console errors.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css
git commit -m "feat(today): signature Now focal card with gated progress bar"
```

---

## Task 6: Timeline refine + first-anchor de-emphasis

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

- [ ] **Step 1: Rewrite the timeline helpers + `renderAnchors`**

In `today/app.js`, replace `anchorBadges`, `standardHtml`, `anchorCardHtml`, and `renderAnchors` (keep `TRAVEL_TYPES`; `ticketHtml` is refined in Task 7) with:

```js
function anchorMeta(anchor, timing) {
  const status = anchor.status || 'planned';
  return `
    <div class="meta">
      <span class="meta-time">${escapeHtml(anchor.time)}</span>
      <span class="meta-status ${escapeHtml(status)}">${escapeHtml(status)}</span>
      ${timing === 'current' ? '<span class="badge now">Now</span>' : ''}
      ${timing === 'next' ? '<span class="badge next">Next</span>' : ''}
    </div>`;
}

function standardHtml(anchor, timing) {
  return `
    <article class="tl-card anchor-card ${anchor.critical ? 'critical' : ''} ${timing ? `timing-${timing}` : ''}">
      ${anchorMeta(anchor, timing)}
      <h3>${escapeHtml(anchor.title)}</h3>
      ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
      ${anchorLinks(anchor)}
    </article>`;
}

function anchorCardHtml(anchor, timing) {
  return TRAVEL_TYPES.has(anchor.type) ? ticketHtml(anchor, timing) : standardHtml(anchor, timing);
}

function renderAnchors(entry) {
  $('#todayTitle').textContent = `${formatLongDate(entry.date)} · ${entry.label}`;
  const actualTodayKey = LOGIC.dateKey(new Date());
  const selectedIsToday = entry.date === actualTodayKey;
  const annotated = selectedIsToday
    ? LOGIC.annotateAnchors(entry, new Date())
    : LOGIC.sortAnchors(entry.anchors || []).map((anchor) => ({ anchor, timing: '' }));

  if (!annotated.length) {
    $('#anchorList').innerHTML = '<p class="empty">No anchors for this day yet.</p>';
    return;
  }

  // The Now card already owns the focus anchor's detail. When the focus anchor
  // is the topmost timeline row (first/pre-trip case), de-emphasize it to a slim
  // marker so the hero and timeline don't show identical cards back-to-back.
  const focusTitle = annotated.find(({ timing }) => timing === 'next')?.anchor.title
    || annotated.find(({ timing }) => timing === 'current')?.anchor.title
    || annotated[0].anchor.title;
  const topIsFocus = annotated[0].anchor.title === focusTitle;

  const nowLine = selectedIsToday ? LOGIC.getNowLine(entry, new Date()) : null;
  const lineHtml = (frac) => `<div class="now-line" style="--frac:${frac}"><span>now</span></div>`;

  const body = annotated.map(({ anchor, timing }, i) => {
    let cardInner;
    if (i === 0 && topIsFocus && !TRAVEL_TYPES.has(anchor.type)) {
      cardInner = `<div class="tl-card is-echo"><span class="meta-time">${escapeHtml(anchor.time)}</span><span>${escapeHtml(anchor.title)} — shown above</span></div>`;
    } else {
      cardInner = anchorCardHtml(anchor, timing);
    }
    const card = `<div class="tl-row ${timing ? `timing-${timing}` : ''}">${cardInner}</div>`;
    const line = nowLine && nowLine.index === i ? lineHtml(nowLine.fraction) : '';
    return card + line;
  }).join('');

  const topLine = nowLine && nowLine.index === -1 ? lineHtml(0) : '';
  $('#anchorList').innerHTML = `<div class="timeline">${topLine}${body}</div>`;
}
```

Note: `.timing-*` now also goes on `.tl-row` (for dot styling); the inner `.tl-card` keeps its own `.timing-*` for card styling.

- [ ] **Step 2: Verify syntax + tests**

Run: `node --check today/app.js && node --test today/schedule-logic.test.mjs`
Expected: no syntax errors; tests pass.

- [ ] **Step 3: Refine timeline CSS**

Replace the existing `.timeline`, `.tl-row`, `.tl-row::before`, `.tl-card.timing-*`, `.now-line*`, `.live-badge*` rules with:

```css
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-left: 26px;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: var(--line);
}
.tl-row { position: relative; }
.tl-row::before {
  content: "";
  position: absolute;
  left: -22px;
  top: 18px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--paper);
  border: 2px solid var(--line);
}
.tl-row.timing-past::before { background: var(--line); border-color: var(--line); }
.tl-row.timing-current::before {
  background: var(--accent, var(--olive));
  border-color: var(--accent, var(--olive));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent, var(--olive)) 18%, transparent);
}

.tl-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px 15px;
}
.tl-card h3 { margin: 0; font-size: 1.04rem; font-weight: 700; letter-spacing: -.01em; }
.tl-card p { margin: 6px 0 0; color: var(--muted); font-size: .86rem; line-height: 1.4; }
.tl-card.timing-past { opacity: .6; }
.tl-card.timing-current {
  border-color: transparent;
  box-shadow: 0 0 0 1.5px var(--accent, var(--olive)), 0 16px 40px rgba(44, 31, 20, .12);
  transform: translateY(-1px);
}

/* Slim echo marker for the de-emphasized first/duplicate anchor. */
.tl-card.is-echo {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: 1px dashed var(--line);
  color: var(--muted);
  font-size: .8rem;
}
.tl-card.is-echo .meta-time {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 700;
  color: var(--ink);
}

/* Now-line as an accent pill. */
.now-line { position: relative; height: 0; margin: 2px 0; }
.now-line::before {
  content: "";
  position: absolute;
  left: -22px;
  right: 6px;
  top: 0;
  height: 2px;
  background: var(--accent, var(--red));
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent, var(--red)) 55%, transparent);
}
.now-line span {
  position: absolute;
  left: -22px;
  top: -9px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #fffaf0;
  background: var(--accent, var(--red));
}
```

(Remove the now-dead `.live-badge`/`.count-badge`/`.now-times` rules if present — they're replaced by `.badge`/`.now-count`. Leaving them is harmless but cleaner to delete.)

- [ ] **Step 4: Smoke test**

Reload. Confirm a clean vertical timeline with dots, refined cards, and (when viewing today) the now-line pill at the right position with past dimmed and current lifted. Navigate to a future day (e.g. `#2026-06-28`): no now-line, no echo marker (timing is empty). Confirm the first-anchor echo only appears when the topmost anchor equals the focus anchor. No console errors. Toggle reduce-motion: the `Now` badge stops pulsing.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css
git commit -m "feat(today): refine timeline rhythm + de-emphasize duplicate first anchor"
```

---

## Task 7: Boarding-pass tickets + Critical/Leave-by emphasis

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

- [ ] **Step 1: Rewrite `ticketHtml`**

In `today/app.js`, replace `ticketHtml` with:

```js
function ticketHtml(anchor, timing) {
  return `
    <article class="tl-card ticket ${anchor.critical ? 'critical' : ''} ${timing ? `timing-${timing}` : ''}">
      <div class="ticket-main">
        ${anchorMeta(anchor, timing)}
        <h3>${escapeHtml(anchor.title)}</h3>
        ${anchor.leaveBy ? `<span class="chip-flag leaveby">Leave by ${escapeHtml(anchor.leaveBy)}</span>` : ''}
        ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
        ${anchorLinks(anchor)}
      </div>
      <div class="ticket-stub">
        <span class="ticket-mode">${escapeHtml(anchor.type || 'go')}</span>
        <span class="ticket-time">${escapeHtml(anchor.time)}</span>
      </div>
    </article>`;
}
```

- [ ] **Step 2: Verify syntax**

Run: `node --check today/app.js`
Expected: no output.

- [ ] **Step 3: Refine ticket CSS**

Replace the existing `.ticket`/`.ticket-stub`/`.ticket-mode`/`.ticket-time`/`.ticket-leave` rules with:

```css
.ticket {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 0;
  overflow: hidden;
}
.ticket-main { padding: 14px 15px; display: grid; gap: 6px; justify-items: start; }
.ticket-stub {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 3px;
  padding: 14px 18px;
  background: rgba(45, 34, 24, .045);
  border-left: 2px dashed var(--line);
}
.ticket-stub::before,
.ticket-stub::after {
  content: "";
  position: absolute;
  left: -7px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
}
.ticket-stub::before { top: -7px; }
.ticket-stub::after { bottom: -7px; }
.ticket-mode {
  font-size: .6rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent, var(--blue));
}
.ticket-time {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 800;
  font-size: 1.05rem;
}

/* Critical travel anchors: accent left-edge so the signal survives the calm meta row. */
.tl-card.critical { border-left: 3px solid var(--accent, var(--red)); }

@media (max-width: 760px) {
  .ticket { grid-template-columns: 1fr; }
  .ticket-stub {
    grid-auto-flow: column;
    justify-content: center;
    border-left: 0;
    border-top: 2px dashed var(--line);
  }
  .ticket-stub::before { top: -7px; left: 50%; }
  .ticket-stub::after { bottom: auto; top: -7px; left: auto; right: 50%; }
}
```

- [ ] **Step 4: Smoke test**

Navigate to `#2026-06-30` (Lisbon→Kilkea: transfer + flight + transfer). Confirm: travel anchors render as perforated boarding-pass tickets with a mono time stub; the `Leave by 3:30am` chip is prominent and the critical card has an accent left-edge; non-travel anchors stay standard cards. Narrow the window: the stub moves below and lays out horizontally. No console errors.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css
git commit -m "feat(today): refine boarding-pass tickets + critical/leave-by emphasis"
```

---

## Task 8: Utility panel — confirmations strip

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`

- [ ] **Step 1: Rewrite `renderUtilityPanel`**

In `today/app.js`, replace `renderUtilityPanel` with:

```js
function renderUtilityPanel(entry) {
  const lodging = entry.lodging;
  const prepItems = entry.prep || [];
  const bookingItems = (entry.anchors || []).filter((anchor) => anchor.status === 'confirmed' || anchor.critical);

  $('#utilityPanel').innerHTML = `
    <div class="utility-block">
      <p class="eyebrow">Base</p>
      ${lodging ? `
        <h3>${escapeHtml(lodging.name)}</h3>
        <p>${escapeHtml(lodging.area || '')}</p>
        <div class="link-row"><a class="btn ghost" href="${escapeHtml(lodging.mapUrl)}" target="_blank" rel="noopener">Map base →</a></div>
      ` : '<p class="empty">No lodging pinned for this day yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Confirmations</p>
      ${bookingItems.length ? `
        <ul class="wallet-strip">
          ${bookingItems.map((item) => `
            <li class="wallet-item ${item.critical ? 'critical' : ''}">
              <span class="wallet-time">${escapeHtml(item.time)}</span>
              <span class="wallet-title">${escapeHtml(item.title)}</span>
              ${item.leaveBy ? `<span class="chip-flag leaveby">Leave ${escapeHtml(item.leaveBy)}</span>` : ''}
              ${item.mapUrl ? `<a class="wallet-map" href="${escapeHtml(item.mapUrl)}" target="_blank" rel="noopener" aria-label="Map ${escapeHtml(item.title)}">↗</a>` : ''}
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty">No confirmed bookings pinned yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Prep</p>
      ${prepItems.length ? `
        <ul class="mini-list">${prepItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      ` : '<p class="empty">No prep notes yet.</p>'}
    </div>
  `;
}
```

- [ ] **Step 2: Verify syntax**

Run: `node --check today/app.js`
Expected: no output.

- [ ] **Step 3: Style the confirmations strip in `today/styles.css`**

```css
.wallet-strip { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.wallet-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(45, 34, 24, .035);
  font-size: .84rem;
}
.wallet-item.critical { box-shadow: inset 3px 0 0 var(--accent, var(--red)); }
.wallet-time {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 700;
  color: var(--ink);
  flex: 0 0 auto;
}
.wallet-title { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wallet-map { flex: 0 0 auto; text-decoration: none; font-weight: 800; color: var(--muted); }
```

- [ ] **Step 4: Smoke test**

Reload, view a day with confirmed/critical anchors. Confirm the Confirmations block reads as a dense, scannable strip (mono time · title · leave-by chip · map arrow), critical rows get an accent inset edge, and it is visually distinct from the boarding-pass tickets in the timeline (no accent fill, no perforation — it does not look like a ticket). No console errors.

- [ ] **Step 5: Commit**

```bash
git add today/app.js today/styles.css
git commit -m "feat(today): booking wallet becomes a dense confirmations strip"
```

---

## Task 9: Planner context, options, and deck refine

**Files:**
- Modify: `today/styles.css`

These sections keep their existing markup; only styling is refined for consistency.

- [ ] **Step 1: Append refined section styles to `today/styles.css`**

```css
/* Planner context */
.context-card h3 { font-family: Georgia, "Times New Roman", serif; font-weight: 700; margin: 0 0 4px; }
.context-card .timeline-list { list-style: none; margin: 10px 0 0; padding: 0; display: grid; gap: 0; }
.context-card .timeline-list li {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--line);
  font-size: .88rem;
}
.context-card .timeline-list li:first-child { border-top: 0; }
.context-card .timeline-list time {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-weight: 700;
  color: var(--muted);
}

/* Options ("Useful options") — calmer TBD treatment */
.option-card .status-badge.tbd {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
  font-weight: 800;
  letter-spacing: .08em;
}
.option-card h3 { font-size: 1rem; margin: 8px 0 0; }

/* Deck ("Tonight and tomorrow") */
.deck-card { border-radius: 16px; }
.deck-card h3 { font-family: Georgia, "Times New Roman", serif; font-weight: 700; }
.deck-card .mini-list { margin-top: 8px; }
```

- [ ] **Step 2: Smoke test**

Reload. Scroll to the planner context, options (navigate to a day with open slots, e.g. a London TBD day), and deck sections. Confirm mono times in the planner timeline, calmer TBD chips, serif deck headings, and overall consistency with the refined upper page. No console errors.

- [ ] **Step 3: Commit**

```bash
git add today/styles.css
git commit -m "feat(today): refine planner context, options, and deck sections"
```

---

## Task 10: Cache-bust + service-worker cache bump + final QA

**Files:**
- Modify: `today/index.html`
- Modify: `sw.js`

- [ ] **Step 1: Bump cache-bust strings**

In `today/index.html`, change the three refined assets from `?v=20260616-living` to `?v=20260616-refine`:
- `styles.css?v=20260616-refine`
- `schedule-logic.js?v=20260616-refine`
- `app.js?v=20260616-refine`

(The `../<city>/data.js` and `../shared/*.js` references stay unchanged.)

- [ ] **Step 2: Bump the service-worker cache name**

In `sw.js`, change:

```js
const CACHE = 'ee-today-v2';
```

to:

```js
const CACHE = 'ee-today-v3';
```

- [ ] **Step 3: Full verification**

```bash
node --check today/app.js
node --check today/schedule-logic.js
node --check sw.js
node --test today/schedule-logic.test.mjs
```
Expected: no syntax errors; all tests pass.

- [ ] **Step 4: Browser + offline QA**

1. `python3 -m http.server 4174` → `http://127.0.0.1:4174/today/`.
2. DevTools → Application → unregister any old SW and clear `ee-today-*` caches, then hard-reload so the refined assets and `ee-today-v3` install fresh.
3. Confirm the full refined page renders across several days (a normal day, a travel day, a TBD/options day) with no console errors. Toggle OS reduce-motion: the now-pulse and badge pulse stop.
4. DevTools → Network → **Offline**, reload: the Today view must still render fully (timeline, Now card, wallet) from `ee-today-v3`. Navigate day chips offline — all days render.

- [ ] **Step 5: Commit**

```bash
git add today/index.html sw.js
git commit -m "chore(today): bump cache-bust to refine + SW cache to ee-today-v3"
```

> **Deploy note:** because `CACHE` is bumped to `ee-today-v3`, the SW `activate` handler clears `ee-today-v2` on first load after deploy, re-precaching the refined assets.

---

## Out of scope (deferred)

- Hero/city imagery and glassy layering (decided against for perf/offline).
- Group presence, live decisions/wallet actions, weather.
- Removing the dead `optionLabelMap` in `today/app.js` (unrelated cleanup).
- The optional "route line" through the day chips (nice-to-have; only if trivial).

## Self-review

- **Spec coverage:** compressed hero (Task 3) ✓; day chips (Task 4) ✓; Now focal card + gated progress bar (Tasks 1, 5) ✓; meta row replacing pill-soup (Tasks 2, 5, 6) ✓; timeline refine + first-anchor de-emphasis (Task 6) ✓; tickets + critical/leave-by emphasis (Tasks 2, 7) ✓; confirmations strip (Task 8) ✓; planner/options/deck (Task 9) ✓; per-city washes (Task 2) ✓; motion + reduced-motion (Tasks 2, 5, 6) ✓; cache-bust + SW bump + offline QA (Task 10) ✓.
- **Type/name consistency:** `getNowLine` returns `{index, nextIndex, hasSegment, fraction}` (Task 1) and `renderNowPanel` consumes `hasSegment`/`fraction` (Task 5). `anchorMeta` (Task 6) is used by both `standardHtml` (Task 6) and `ticketHtml` (Task 7). Class vocabulary is shared: `.meta`/`.meta-time`/`.meta-status`/`.badge.now`/`.badge.next`/`.chip-flag.{critical,leaveby}`/`.btn.ghost` defined in Task 2, consumed in Tasks 5–8. `--accent` (existing per-city) and `color-mix` derived washes are used consistently and kept below highlight intensity.
- **No placeholders:** every step has complete, runnable code or an exact command.
- **Perf:** no `backdrop-filter`, no new network assets; all motion is `transform`/`opacity`/`box-shadow` and gated by `prefers-reduced-motion`.
- **Browser support note:** `color-mix(in srgb, …)` is used for the derived washes/tints — broadly supported since 2023 (Safari 16.2+, Chrome/Edge 111+, Firefox 113+), comfortably within the trip's 2026 target devices. On an engine without it, those *decorative* declarations are simply dropped (no wash/tint shown) — layout, legibility, and all `--accent`-driven solid colors are unaffected, since color-mix is used only for low-alpha background tints and glows, never for text or structure.
```
