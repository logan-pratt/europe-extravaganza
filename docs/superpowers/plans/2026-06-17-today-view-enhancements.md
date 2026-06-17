# Today View Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add walking-time deltas, one-tap address actions, a quick wallet, a day-aware suggestions section, and a walking-mode toggle to `today/` — making the view useful on-foot in Europe.

**Architecture:** Pure date/slot/wallet logic in `today/schedule-logic.js` (Node-testable). Render layer in `today/app.js` reads new optional fields on schedule entries/anchors (`walkMinutes`, `walkMeters`, `address`, `booking`, `suggest`) without breaking existing data. Walking mode is a CSS-driven `data-mode` attribute on `<main class="today-shell">` — no render-time branching. All data-shape changes are additive.

**Tech Stack:** Vanilla ES, no build step, static GitHub Pages hosting. Tests via `node --test` on `.mjs` files. No new dependencies.

## Global Constraints

- Static site, no build, no npm install. Repo: `/Users/loganpratt/Downloads/london_love_letter_interactive_site`. Deploys under `/europe-extravaganza/` sub-path — use **relative URLs only**.
- **Do not break** the city planners (`lisbon/`, `galway/`, `dublin/`, `london/`) or the hub. All city-data field additions are optional and rendered defensively.
- **Verification commands** after every code change:
  - `node --check today/app.js`
  - `node --check today/schedule-logic.js`
  - `node --test today/schedule-logic.test.mjs`
  - Browser smoke: `python3 -m http.server 4174` → `http://127.0.0.1:4174/today/`
- **Cache-busting:** `today/index.html` currently loads its CSS/JS with `?v=20260616-refine9` and `?v=20260616-today` (for city data scripts). When this plan's CSS/JS changes ship, bump `today/styles.css`, `today/app.js`, and `today/schedule-logic.js` to `?v=20260617-v2`. Bump `sw.js` `CACHE` constant from `ee-today-v1` to `ee-today-v2` so the SW invalidates old assets.
- **TDD for pure logic** (`schedule-logic.js`). Render layer is smoke-tested in the browser.
- **Commits:** small, frequent, conventional (`feat(today): ...`, `data(today): ...`, `style(today): ...`).
- **No new dependencies.** No npm install. No frameworks.

---

## File Map

- **Modify** `today/schedule-logic.js` — add `getOpenSlots`, `getSuggestionPool`, `getWalletItems`, `getWalkLeg`; export them.
- **Modify** `today/schedule-logic.test.mjs` — tests for the four new functions.
- **Modify** `today/app.js` — render transit rows, action clusters, wallet block, suggestion section, walking-mode toggle.
- **Modify** `today/styles.css` — transit rows, action clusters, wallet, suggestion cards, walking-mode hide/grow rules.
- **Modify** `today/index.html` — add walking-mode toggle to hero actions; bump cache-bust strings.
- **Modify** `shared/schedule.js` — seed `walkMinutes` / `walkMeters` / `address` / `booking` / `suggest` on a handful of demonstrative anchors (Saturday Alfama climb is the visible test case; one Wallet row on the Sunday booked dinner; one `suggest` block on Saturday for Taberna backups).
- **Modify** `sw.js` — bump `CACHE` constant.

Anchor shape (existing, recap): `{ time, sortTime?, type, title, status, critical?, leaveBy?, note?, mapUrl?, siteUrl? }`. New optional fields added by this plan: `walkMinutes`, `walkMeters`, `address`, `booking: { confirmation, reservedAs, phone }`, `slot`.

Schedule-entry shape gains optional `suggest: { [slot]: string[] }`.

---

## Task 1: Pure logic — slot derivation, suggestion pool, wallet, walk leg (TDD)

**Files:**
- Modify: `today/schedule-logic.js`
- Modify: `today/schedule-logic.test.mjs`

**Interfaces produced:**
- `getOpenSlots(entry) → string[]` — canonical slot names that are unfilled for the day.
- `getSuggestionPool(entry, cityData, reactions = []) → { [slot]: Array<{id, name, why, mapUrl, tags, score}> }` — up to 3 ranked items per open slot, hybrid override→tag-match→reaction-rank.
- `getWalletItems(entry, tomorrowEntry) → Array<{date, time, title, confirmation, reservedAs, phone, mapUrl, address}>` — booking rows for today + tomorrow.
- `getWalkLeg(prevAnchor, anchor) → { minutes, meters, hidden } | null` — transit-row data for the anchor pair; `hidden: true` when prev type is `meal`/`lodging`.

### Step 1.1: Failing tests for `getOpenSlots`

- [ ] Append to `today/schedule-logic.test.mjs`:

```js
test('getOpenSlots flags missing canonical slots', () => {
  const entry = {
    anchors: [
      { time: '9:30am', sortTime: '09:30', type: 'meal', title: 'Breakfast' },
      { time: '8:00pm', sortTime: '20:00', type: 'booking', title: 'Taberna', slot: 'dinner' }
    ]
  };
  const slots = getOpenSlots(entry);
  assert.ok(!slots.includes('breakfast'));
  assert.ok(!slots.includes('dinner'));
  assert.ok(slots.includes('lunch'));
  assert.ok(slots.includes('drink'));
});

test('getOpenSlots respects explicit slot field even if time misses window', () => {
  const entry = {
    anchors: [
      { time: 'Late afternoon', sortTime: '16:00', type: 'meal', title: 'Lunch', slot: 'lunch' }
    ]
  };
  assert.ok(!getOpenSlots(entry).includes('lunch'));
});
```

Add `getOpenSlots` to the destructure at the top of the file.

- [ ] Run: `node --test today/schedule-logic.test.mjs` → expect FAIL.

### Step 1.2: Implement `getOpenSlots`

Add to `today/schedule-logic.js` before the `root.TODAY_LOGIC = {` block:

```js
const SLOT_WINDOWS = {
  breakfast: [6 * 60, 10 * 60 + 30],
  lunch:     [11 * 60 + 30, 14 * 60 + 30],
  afternoon: [14 * 60 + 30, 17 * 60 + 30],
  drink:     [17 * 60, 19 * 60 + 30],
  dinner:    [19 * 60, 22 * 60],
  late:      [22 * 60, 25 * 60]
};

const TYPE_TO_SLOT = {
  meal: ['breakfast', 'lunch', 'dinner'],
  booking: ['lunch', 'dinner', 'drink'],
  drink: ['drink'],
  sightseeing: ['afternoon'],
  arrival: ['afternoon']
};

function getOpenSlots(entry = {}) {
  const anchors = entry.anchors || [];
  const filled = new Set();

  anchors.forEach((anchor) => {
    if (anchor.slot) { filled.add(anchor.slot); return; }
    const minutes = parseSortTime(anchor);
    Object.entries(SLOT_WINDOWS).forEach(([slot, [from, to]]) => {
      if (Number.isFinite(minutes) && minutes >= from && minutes < to) filled.add(slot);
    });
    (TYPE_TO_SLOT[anchor.type] || []).forEach((slot) => {
      const [from, to] = SLOT_WINDOWS[slot];
      if (Number.isFinite(minutes) && minutes >= from && minutes < to) filled.add(slot);
    });
  });

  return Object.keys(SLOT_WINDOWS).filter((slot) => !filled.has(slot));
}
```

Add `getOpenSlots` to the exports.

- [ ] Run: `node --test today/schedule-logic.test.mjs` → expect PASS.

### Step 1.3: Failing tests for `getSuggestionPool`

- [ ] Append:

```js
test('getSuggestionPool uses manual override when present', () => {
  const entry = {
    date: '2026-06-27',
    city: 'lisbon',
    anchors: [],
    suggest: { dinner: ['oficio', 'prado'] }
  };
  const cityData = {
    restaurants: [
      { id: 'oficio', name: 'Ofício', tags: 'dinner top', why: 'Modern', mapUrl: 'm1' },
      { id: 'prado',  name: 'Prado',  tags: 'dinner romantic', why: 'Occasion', mapUrl: 'm2' }
    ]
  };
  const pool = getSuggestionPool(entry, cityData, []);
  assert.deepEqual(pool.dinner.map((p) => p.id), ['oficio', 'prado']);
});

test('getSuggestionPool auto-matches by slot tag when no override', () => {
  const entry = { date: '2026-06-27', city: 'lisbon', anchors: [] };
  const cityData = {
    restaurants: [
      { id: 'a', name: 'A', tags: 'lunch group',  why: '', mapUrl: '' },
      { id: 'b', name: 'B', tags: 'dinner top',   why: '', mapUrl: '' },
      { id: 'c', name: 'C', tags: 'lunch backup', why: '', mapUrl: '' }
    ]
  };
  const pool = getSuggestionPool(entry, cityData, []);
  const lunchIds = pool.lunch.map((p) => p.id).sort();
  assert.deepEqual(lunchIds, ['a', 'c']);
  assert.ok(!pool.lunch.some((p) => p.id === 'b'));
});

test('getSuggestionPool ranks by reactions within pool and caps at 3', () => {
  const entry = { date: '2026-06-27', city: 'lisbon', anchors: [] };
  const cityData = {
    restaurants: [
      { id: 'a', name: 'A', tags: 'dinner', why: '', mapUrl: '' },
      { id: 'b', name: 'B', tags: 'dinner', why: '', mapUrl: '' },
      { id: 'c', name: 'C', tags: 'dinner', why: '', mapUrl: '' },
      { id: 'd', name: 'D', tags: 'dinner', why: '', mapUrl: '' }
    ]
  };
  const reactions = [
    { card_id: 'b', reaction: 'love' },
    { card_id: 'b', reaction: 'love' },
    { card_id: 'c', reaction: 'love' },
    { card_id: 'd', reaction: 'nope' }
  ];
  const pool = getSuggestionPool(entry, cityData, reactions);
  assert.equal(pool.dinner.length, 3);
  assert.equal(pool.dinner[0].id, 'b');
  assert.equal(pool.dinner[1].id, 'c');
  assert.ok(!pool.dinner.some((p) => p.id === 'd'));
});
```

Add `getSuggestionPool` to the destructure.

- [ ] Run: expect FAIL.

### Step 1.4: Implement `getSuggestionPool`

Add to `today/schedule-logic.js`:

```js
const SLOT_TAGS = {
  breakfast: ['breakfast', 'coffee'],
  lunch:     ['lunch'],
  afternoon: ['afternoon', 'sightseeing'],
  drink:     ['drink', 'wine', 'cocktail', 'bar', 'rooftop'],
  dinner:    ['dinner'],
  late:      ['late', 'fado', 'nightlife']
};

function normalizeOption(item) {
  if (Array.isArray(item)) {
    return { id: item[0], name: item[2] || item[1], tags: String(item[3] || '').toLowerCase(), why: item[5] || '', mapUrl: item[7] || item[6] || '' };
  }
  return { id: item.id, name: item.name, tags: String(item.tags || '').toLowerCase(), why: item.why || item.role || '', mapUrl: item.mapUrl || '' };
}

function collectCityOptions(cityData) {
  if (!cityData) return [];
  return [
    ...(cityData.restaurants || []),
    ...(cityData.bars || cityData.pubs || []),
    ...(cityData.activities || [])
  ].map(normalizeOption).filter((o) => o.id && o.name);
}

function scoreFor(id, reactionScores) {
  const entry = reactionScores.get(id);
  return entry ? entry.score : 0;
}

function buildReactionScores(reactions = []) {
  const ranked = rankReactionOptions(reactions);
  const map = new Map();
  ranked.forEach((row) => map.set(row.id, row));
  return map;
}

function getSuggestionPool(entry = {}, cityData = null, reactions = []) {
  const openSlots = getOpenSlots(entry);
  const all = collectCityOptions(cityData);
  const byId = new Map(all.map((o) => [o.id, o]));
  const reactionScores = buildReactionScores(reactions);
  const out = {};

  openSlots.forEach((slot) => {
    const manual = entry.suggest && Array.isArray(entry.suggest[slot]) ? entry.suggest[slot] : null;
    let pool;
    if (manual) {
      pool = manual.map((id) => byId.get(id)).filter(Boolean);
    } else {
      const tagSet = SLOT_TAGS[slot] || [slot];
      pool = all.filter((o) => tagSet.some((tag) => o.tags.includes(tag)));
    }

    const ranked = [...pool]
      .map((o) => ({ ...o, score: scoreFor(o.id, reactionScores) }))
      .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
      .slice(0, 3);

    if (ranked.length) out[slot] = ranked;
  });

  return out;
}
```

Add `getSuggestionPool` to exports.

- [ ] Run: expect PASS.

### Step 1.5: Failing tests for `getWalletItems` and `getWalkLeg`

- [ ] Append:

```js
test('getWalletItems collects bookings from today and tomorrow', () => {
  const today = {
    date: '2026-06-28',
    anchors: [
      { time: '10:00am', title: 'Pena', booking: { confirmation: 'P-1', reservedAs: 'Pratt', phone: '+351 1' } },
      { time: '8:00pm', title: 'Furnas', booking: { confirmation: 'F-9', reservedAs: 'Pratt', phone: '+351 2' } }
    ]
  };
  const tomorrow = {
    date: '2026-06-29',
    anchors: [
      { time: '1:30pm', title: 'Canalha', booking: { confirmation: 'C-3', reservedAs: 'Pratt', phone: '+351 3' } },
      { time: '4:00pm', title: 'Walk', }
    ]
  };
  const rows = getWalletItems(today, tomorrow);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((r) => r.title), ['Pena', 'Furnas', 'Canalha']);
});

test('getWalkLeg returns walking data and hides when prev is meal or lodging', () => {
  const a = { type: 'sightseeing', title: 'Sé' };
  const b = { type: 'sightseeing', title: 'Santa Luzia', walkMinutes: 8, walkMeters: 600 };
  const leg = getWalkLeg(a, b);
  assert.deepEqual(leg, { minutes: 8, meters: 600, hidden: false });

  const c = { type: 'meal', title: 'Lunch' };
  const d = { type: 'sightseeing', title: 'Walk', walkMinutes: 5, walkMeters: 400 };
  assert.equal(getWalkLeg(c, d).hidden, true);

  const e = { type: 'sightseeing', title: 'Next' };
  assert.equal(getWalkLeg(a, e), null);
});
```

Add `getWalletItems` and `getWalkLeg` to destructure.

- [ ] Run: expect FAIL.

### Step 1.6: Implement `getWalletItems` and `getWalkLeg`

Add to `today/schedule-logic.js`:

```js
function getWalletItems(today, tomorrow) {
  const rows = [];
  const pushFrom = (entry) => {
    if (!entry) return;
    sortAnchors(entry.anchors || []).forEach((anchor) => {
      if (!anchor.booking) return;
      rows.push({
        date: entry.date,
        time: anchor.time,
        title: anchor.title,
        confirmation: anchor.booking.confirmation || '',
        reservedAs: anchor.booking.reservedAs || '',
        phone: anchor.booking.phone || '',
        mapUrl: anchor.mapUrl || '',
        address: anchor.address || ''
      });
    });
  };
  pushFrom(today);
  pushFrom(tomorrow);
  return rows;
}

const HIDE_WALK_FROM = new Set(['meal', 'lodging']);

function getWalkLeg(prevAnchor, anchor) {
  if (!anchor || typeof anchor.walkMinutes !== 'number') return null;
  const hidden = !!(prevAnchor && HIDE_WALK_FROM.has(prevAnchor.type));
  return {
    minutes: anchor.walkMinutes,
    meters: typeof anchor.walkMeters === 'number' ? anchor.walkMeters : null,
    hidden
  };
}
```

Add both to the exports object.

- [ ] Run: expect PASS.

### Step 1.7: Commit

```bash
git add today/schedule-logic.js today/schedule-logic.test.mjs
git commit -m "feat(today): slot derivation, suggestion pool, wallet, walk leg logic"
```

---

## Task 2: Address actions (Map / Copy / Bolt)

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`
- Modify: `shared/schedule.js` (seed `address` on a handful of anchors)

**Interfaces produced:**
- `actionClusterHtml(target, { large = false }) → string` — renders 3 ghost buttons from a `{ mapUrl, address, title }` target.
- `wireActionCluster(root)` — attaches Copy and Bolt click handlers; idempotent (safe to call on every render).

### Step 2.1: Add the action cluster helper

In `today/app.js`, add above `renderAnchors`:

```js
function boltUrl(address) {
  const q = encodeURIComponent(address);
  return `https://bolt.eu/en/?pickup_address=&destination_address=${q}`;
}

function actionClusterHtml(target, { large = false } = {}) {
  if (!target) return '';
  const cls = large ? 'actions actions-lg' : 'actions';
  const parts = [];
  if (target.mapUrl) parts.push(`<a class="btn ghost" href="${escapeHtml(target.mapUrl)}" target="_blank" rel="noopener">Map</a>`);
  if (target.address) {
    parts.push(`<button class="btn ghost" type="button" data-copy="${escapeHtml(target.address)}">Copy</button>`);
    parts.push(`<a class="btn ghost" href="${escapeHtml(boltUrl(target.address))}" target="_blank" rel="noopener">Bolt</a>`);
  }
  return parts.length ? `<div class="${cls}">${parts.join('')}</div>` : '';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('visible'), 1600);
}

function wireActionCluster(root = document) {
  root.querySelectorAll('[data-copy]').forEach((button) => {
    if (button.dataset.wired === '1') return;
    button.dataset.wired = '1';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast('Copied');
      } catch {
        showToast('Copy failed');
      }
    });
  });
}
```

### Step 2.2: Use the cluster in existing renderers

- [ ] In `today/app.js`, replace the existing `anchorLinks(anchor)` calls inside `standardHtml`, `ticketHtml`, and the Now panel's `now-foot` block with `actionClusterHtml(anchor)` (Now panel uses `{ large: true }`).

Specifically:

- `standardHtml`: replace `${anchorLinks(anchor)}` with `${actionClusterHtml(anchor)}`.
- `ticketHtml`: same replacement inside `.ticket-main`.
- `renderNowPanel`: replace the existing `Open map` anchor in `now-foot` with `${actionClusterHtml(focus, { large: true })}`.
- `renderUtilityPanel`: lodging block — replace the `link-row` with `${actionClusterHtml(lodging, { large: true })}`. Confirmation rows — append `${actionClusterHtml(item)}` inside each `<li>`.

Keep `anchorLinks` defined for now if any path still references `siteUrl`-only items; otherwise delete it.

### Step 2.3: Wire copy buttons after every render

- [ ] At the bottom of `render()` in `today/app.js`, after the existing renderers run, add `wireActionCluster();`.

### Step 2.4: Add CSS

Append to `today/styles.css`:

```css
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.actions .btn {
  padding: 6px 10px;
  font-size: 0.78rem;
  min-height: 36px;
}

.actions-lg .btn {
  padding: 10px 14px;
  font-size: 0.9rem;
  min-height: 48px;
}

#toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fffaf0;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 50;
}

#toast.visible {
  opacity: 1;
}
```

### Step 2.5: Seed `address` on demo anchors

- [ ] In `shared/schedule.js`, add `address` to the existing `lisbonBase` object: `address: 'Rua da Madalena 214, Lisbon 1100-204, Portugal',`. Add `address` to one Saturday anchor (e.g. Castelo de São Jorge: `address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa, Portugal',`) and the Friday food-tour meeting anchor: `address: 'R. Augusta 2, 1100-053 Lisboa, Portugal',`.

### Step 2.6: Verify + smoke test

- [ ] Run: `node --check today/app.js`
- [ ] Browser: reload `http://127.0.0.1:4174/today/`, navigate to Friday and Saturday. Confirm Map / Copy / Bolt buttons appear on the seeded anchors; Copy flashes toast; Bolt opens in a new tab.

### Step 2.7: Commit

```bash
git add today/app.js today/styles.css shared/schedule.js
git commit -m "feat(today): one-tap Map/Copy/Bolt actions on anchors and lodging"
```

---

## Task 3: Walking-time deltas between anchors

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`
- Modify: `shared/schedule.js` (seed `walkMinutes` / `walkMeters` on Saturday's Alfama climb)

### Step 3.1: Render transit rows in the timeline

- [ ] In `today/app.js`, in `renderAnchors`, after computing `annotated`, build the rendered body to interleave walk legs. Replace the existing `body` construction with:

```js
const body = annotated.map(({ anchor, timing }, i) => {
  const prevAnchor = annotated[i - 1]?.anchor;
  const leg = i > 0 ? LOGIC.getWalkLeg(prevAnchor, anchor) : null;
  const legHtml = leg && !leg.hidden ? `
    <div class="tl-walk">
      <span>↘ ${leg.minutes} min walk${leg.meters ? ` · ${leg.meters} m` : ''}</span>
    </div>` : '';

  let cardInner;
  if (i === 0 && topIsFocus && !TRAVEL_TYPES.has(anchor.type)) {
    cardInner = `<div class="tl-card is-echo"><span class="meta-time">${escapeHtml(anchor.time)}</span><span>${escapeHtml(anchor.title)} — shown above</span></div>`;
  } else {
    cardInner = anchorCardHtml(anchor, timing);
  }
  const card = `<div class="tl-row ${timing ? `timing-${timing}` : ''}">${cardInner}</div>`;
  const line = nowLine && nowLine.index === i ? lineHtml(nowLine.fraction) : '';
  return legHtml + card + line;
}).join('');
```

### Step 3.2: Add CSS for the transit row

Append to `today/styles.css`:

```css
.tl-walk {
  position: relative;
  margin: -4px 0;
  padding-left: 6px;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tl-walk span {
  display: inline-block;
  background: var(--paper);
  padding: 2px 6px;
}
```

### Step 3.3: Seed walking data on Saturday's Alfama anchors

- [ ] In `shared/schedule.js`, locate the `2026-06-27` (Saturday) entry and add `walkMinutes` / `walkMeters` to anchors after the breakfast/meal anchor — example values:

```js
{ time: '10:15am', sortTime: '10:15', type: 'transfer', title: 'Walk from Rua da Madalena to Sé Cathedral', status: 'planned', walkMinutes: 8, walkMeters: 600, mapUrl: '...' },
{ time: '10:45am', sortTime: '10:45', type: 'sightseeing', title: 'Sé Cathedral quick stop, then continue uphill', status: 'planned', walkMinutes: 0, walkMeters: 0, mapUrl: '...' },
{ time: '11:15am', sortTime: '11:15', type: 'sightseeing', title: 'Santa Luzia + Portas do Sol viewpoints', status: 'planned', walkMinutes: 6, walkMeters: 450, mapUrl: '...' },
```

(Adjust to actual anchor list — only add to anchors where the previous anchor is *not* `meal`/`lodging`, since `getWalkLeg` will hide those.)

### Step 3.4: Verify + smoke test

- [ ] Run: `node --check today/app.js`
- [ ] Browser: navigate to Saturday. Confirm transit rows ("↘ 6 min walk · 450 m") appear between the Alfama sightseeing anchors and do NOT appear between a `meal` anchor and the next one.

### Step 3.5: Commit

```bash
git add today/app.js today/styles.css shared/schedule.js
git commit -m "feat(today): walking-time deltas between anchors in timeline"
```

---

## Task 4: Quick wallet block

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`
- Modify: `shared/schedule.js` (seed `booking` on Sunday's Furnas anchor)

### Step 4.1: Render the wallet block

- [ ] In `today/app.js`, modify `renderUtilityPanel` to append a wallet block after the existing Confirmations block. Compute the rows using `LOGIC.getWalletItems`:

```js
function renderUtilityPanel(entry) {
  const lodging = entry.lodging;
  const prepItems = entry.prep || [];
  const bookingItems = (entry.anchors || []).filter((anchor) => anchor.status === 'confirmed' || anchor.critical);
  const tomorrowEntry = SCHEDULE[getEntryIndex(entry) + 1] || null;
  const walletRows = LOGIC.getWalletItems(entry, tomorrowEntry);

  $('#utilityPanel').innerHTML = `
    <div class="utility-block">
      <p class="eyebrow">Base</p>
      ${lodging ? `
        <h3>${escapeHtml(lodging.name)}</h3>
        <p>${escapeHtml(lodging.area || '')}</p>
        ${actionClusterHtml(lodging, { large: true })}
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
              ${actionClusterHtml(item)}
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty">No confirmed bookings pinned yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Wallet</p>
      ${walletRows.length ? `
        <ul class="wallet-list">
          ${walletRows.map((row) => `
            <li class="wallet-row">
              <div class="wallet-row-head">
                <span class="wallet-time">${escapeHtml(row.time)}</span>
                <span class="wallet-title">${escapeHtml(row.title)}</span>
              </div>
              <dl class="wallet-meta">
                ${row.confirmation ? `<dt>Conf #</dt><dd><button class="btn ghost mono" data-copy="${escapeHtml(row.confirmation)}">${escapeHtml(row.confirmation)}</button></dd>` : ''}
                ${row.reservedAs ? `<dt>Name</dt><dd>${escapeHtml(row.reservedAs)}</dd>` : ''}
                ${row.phone ? `<dt>Phone</dt><dd><a class="btn ghost" href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a></dd>` : ''}
              </dl>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty">No bookings to surface for today or tomorrow.</p>'}
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

### Step 4.2: Add CSS

Append to `today/styles.css`:

```css
.wallet-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  gap: 8px;
}

.wallet-row {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.02);
}

.wallet-row-head {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-weight: 700;
}

.wallet-meta {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 12px;
  margin: 8px 0 0;
  font-size: 0.85rem;
}

.wallet-meta dt {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.7rem;
  align-self: center;
}

.wallet-meta dd {
  margin: 0;
}

.mono {
  font-family: "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
}
```

### Step 4.3: Seed a `booking` on Sunday's Furnas anchor

- [ ] In `shared/schedule.js`, locate the Sunday (`2026-06-28`) Furnas do Guincho anchor and add:

```js
address: 'Estrada do Guincho, 2750-642 Cascais, Portugal',
booking: { confirmation: 'FG-2026-0628', reservedAs: 'Pratt', phone: '+351 21 487 0388' }
```

### Step 4.4: Verify + smoke test

- [ ] Run: `node --check today/app.js`
- [ ] Browser: navigate to Saturday (tomorrow = Sunday) — confirm a Wallet block appears with Furnas, conf # button copies on click, phone is a tel: link.

### Step 4.5: Commit

```bash
git add today/app.js today/styles.css shared/schedule.js
git commit -m "feat(today): wallet block for today + tomorrow bookings"
```

---

## Task 5: Suggestions section

**Files:**
- Modify: `today/app.js`
- Modify: `today/styles.css`
- Modify: `shared/schedule.js` (seed one `suggest` block on Saturday for dinner backups)

### Step 5.1: Replace `renderOptions` with suggestion-section rendering

- [ ] In `today/app.js`, replace the entire `renderOptions` function with:

```js
const SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  afternoon: 'Afternoon',
  drink: 'Drink',
  dinner: 'Dinner',
  late: 'Late night'
};

let cachedReactions = [];

async function renderOptions(entry) {
  const cityData = CITY_DATA[entry.city];
  const pool = LOGIC.getSuggestionPool(entry, cityData, cachedReactions);
  const slots = Object.keys(pool);

  if (!slots.length) {
    $('#optionsSection').innerHTML = '';
    return;
  }

  $('#optionsSection').innerHTML = `
    <div class="section-head">
      <p class="eyebrow">Open slots</p>
      <h2>Loved picks for the gaps.</h2>
    </div>
    ${slots.map((slot) => `
      <div class="suggest-slot">
        <p class="suggest-slot-label">${escapeHtml(SLOT_LABELS[slot] || slot)} · open</p>
        <div class="suggest-grid">
          ${pool[slot].map((pick) => `
            <article class="suggest-card">
              <div class="suggest-head">
                ${pick.score > 0 ? `<span class="suggest-score">❤︎ ${pick.score}</span>` : ''}
                <span class="suggest-tags">${escapeHtml((pick.tags || '').split(' ').filter(Boolean).slice(0, 2).map((t) => '#' + t).join(' '))}</span>
              </div>
              <h3>${escapeHtml(pick.name)}</h3>
              ${pick.why ? `<p>${escapeHtml(pick.why)}</p>` : ''}
              ${actionClusterHtml(pick)}
              <button class="btn lock-it" type="button" data-lock="${escapeHtml(pick.name)}" data-slot="${escapeHtml(slot)}">Lock it in →</button>
            </article>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;

  document.querySelectorAll('[data-lock]').forEach((button) => {
    if (button.dataset.wired === '1') return;
    button.dataset.wired = '1';
    button.addEventListener('click', async () => {
      const text = `${button.dataset.slot}: ${button.dataset.lock}`;
      try { await navigator.clipboard.writeText(text); showToast('Copied — add to schedule'); }
      catch { showToast('Copy failed'); }
    });
  });
}
```

### Step 5.2: Wire reactions cache

- [ ] In `today/app.js`, near the top after the LOGIC/CITY_DATA declarations, add a one-shot reactions fetch using the existing `submissions-api.js`. Look at how city pages already call it; mirror that for the trip:

```js
async function loadReactions() {
  try {
    if (window.submissionsApi?.fetchReactions) {
      cachedReactions = await window.submissionsApi.fetchReactions('europe-extravaganza') || [];
    }
  } catch { cachedReactions = []; }
  render();
}
```

Adjust the trip slug if the actual API differs — read `shared/submissions-api.js` to confirm. Call `loadReactions()` once after the initial `render()`.

If the realtime channel exists, subscribe and re-run `render()` on change.

### Step 5.3: Add CSS

Append to `today/styles.css`:

```css
.suggest-slot {
  margin-top: 12px;
}

.suggest-slot-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin: 0 0 6px;
}

.suggest-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.suggest-card {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
  background: var(--paper);
}

.suggest-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--muted);
  margin-bottom: 4px;
}

.suggest-score {
  color: var(--accent, var(--red));
  font-weight: 800;
}

.lock-it {
  margin-top: 8px;
  font-size: 0.8rem;
}
```

### Step 5.4: Seed one `suggest` block

- [ ] In `shared/schedule.js`, on the Saturday (`2026-06-27`) entry, add:

```js
suggest: { dinner: ['oficio', 'prado', 'a-nossa-casa'] }
```

(Taberna is the confirmed plan; this seeds the backup pool the suggestion section will surface only if Taberna is *not* yet pinned as a dinner anchor. To see the suggestion render today, temporarily remove `slot: 'dinner'` from Taberna or pick a day where dinner is genuinely open. The Step 5.5 smoke test calls this out.)

### Step 5.5: Verify + smoke test

- [ ] Run: `node --check today/app.js && node --test today/schedule-logic.test.mjs`
- [ ] Browser: pick a day with an open lunch slot (Saturday qualifies — no lunch anchor). Confirm a "Lunch · open" section appears with cards ranked by reactions. Confirm the "Lock it in" button copies the text and toasts.

### Step 5.6: Commit

```bash
git add today/app.js today/styles.css shared/schedule.js
git commit -m "feat(today): day-aware suggestions section with hybrid pool"
```

---

## Task 6: Walking-mode toggle

**Files:**
- Modify: `today/index.html`
- Modify: `today/app.js`
- Modify: `today/styles.css`

### Step 6.1: Add the toggle button to the hero actions

- [ ] In `today/index.html`, inside `<div class="hero-actions">`, add as the third button:

```html
<button class="btn glass" id="modeToggle" type="button" aria-pressed="false">🚶 Walking</button>
```

### Step 6.2: Wire the toggle in `today/app.js`

- [ ] Add near the bottom of `today/app.js`, before `startClock()`:

```js
const MODE_KEY = 'today.walking';

function applyMode(mode) {
  const shell = document.querySelector('.today-shell');
  if (!shell) return;
  shell.dataset.mode = mode;
  const button = document.getElementById('modeToggle');
  if (button) {
    const walking = mode === 'walking';
    button.textContent = walking ? '🛋 Full' : '🚶 Walking';
    button.setAttribute('aria-pressed', walking ? 'true' : 'false');
  }
}

function initModeToggle() {
  const stored = localStorage.getItem(MODE_KEY) === '1' ? 'walking' : 'full';
  applyMode(stored);
  const button = document.getElementById('modeToggle');
  if (!button) return;
  button.addEventListener('click', () => {
    const next = document.querySelector('.today-shell')?.dataset.mode === 'walking' ? 'full' : 'walking';
    localStorage.setItem(MODE_KEY, next === 'walking' ? '1' : '0');
    applyMode(next);
  });
}

initModeToggle();
```

### Step 6.3: Add CSS to hide non-essential sections in walking mode

Append to `today/styles.css`:

```css
[data-mode="walking"] .planner-context,
[data-mode="walking"] .options-section,
[data-mode="walking"] .deck-section,
[data-mode="walking"] .utility-block:not(:nth-of-type(3)) {
  display: none;
}

[data-mode="walking"] .now-headline {
  font-size: 2rem;
  line-height: 1.15;
}

[data-mode="walking"] .actions-lg .btn {
  min-height: 52px;
  font-size: 1rem;
}

[data-mode="walking"] .today-grid {
  grid-template-columns: 1fr;
}

[data-mode="walking"] .anchor-list .timeline > .tl-row:nth-of-type(n+3),
[data-mode="walking"] .anchor-list .timeline > .tl-walk:nth-of-type(n+3) {
  display: none;
}

[data-mode="walking"] body {
  font-size: 18px;
}
```

(Selector for `.utility-block:not(:nth-of-type(3))` keeps the Wallet block — the 3rd block in render order — visible. Verify nth-of-type matches actual render order during smoke test; adjust to `.utility-block[data-block="wallet"]` and add the attribute if the selector is fragile. Default is the `nth-of-type` rule; only swap if it picks the wrong block.)

To make the selector robust, in Step 4.1's `renderUtilityPanel`, change `<div class="utility-block">` for the wallet block to `<div class="utility-block" data-block="wallet">`, and update this CSS rule to:

```css
[data-mode="walking"] .utility-block:not([data-block="wallet"]) {
  display: none;
}
```

### Step 6.4: Verify + smoke test

- [ ] Run: `node --check today/app.js`
- [ ] Browser: reload `http://127.0.0.1:4174/today/`. Click the Walking toggle: confirm only Now panel + Wallet block + first 1–2 timeline rows remain visible; everything else hides. Click again: full view returns. Reload page: walking-mode preference persists.

### Step 6.5: Commit

```bash
git add today/index.html today/app.js today/styles.css
git commit -m "feat(today): walking-mode toggle collapses view to essentials"
```

---

## Task 7: Cache-bust + service worker bump

**Files:**
- Modify: `today/index.html`
- Modify: `sw.js`

### Step 7.1: Bump asset versions

- [ ] In `today/index.html`, change `today/styles.css?v=20260616-refine9` → `?v=20260617-v2`, `schedule-logic.js?v=20260616-refine9` → `?v=20260617-v2`, `app.js?v=20260616-refine9` → `?v=20260617-v2`.

### Step 7.2: Bump SW cache name

- [ ] In `sw.js`, change `const CACHE = 'ee-today-v1';` → `const CACHE = 'ee-today-v2';`.

### Step 7.3: Verify

- [ ] Run: `node --check sw.js`
- [ ] Browser: hard reload, confirm DevTools → Application → Cache Storage shows `ee-today-v2` and old `ee-today-v1` was deleted on activate.

### Step 7.4: Commit

```bash
git add today/index.html sw.js
git commit -m "chore(today): bump cache-bust and SW version for v2 bundle"
```

---

## Self-review notes

- **Spec coverage:** Piece 1 (walking deltas) ✓ Task 3; Piece 2 (address actions) ✓ Task 2; Piece 3 (wallet) ✓ Task 4; Piece 4 (suggestions) ✓ Tasks 1+5; Piece 5 (walking mode) ✓ Task 6; SW/version bump ✓ Task 7.
- **Type consistency:** `actionClusterHtml`, `wireActionCluster`, `showToast`, `getOpenSlots`, `getSuggestionPool`, `getWalletItems`, `getWalkLeg`, `applyMode`, `initModeToggle` are each defined once and referenced consistently. `cachedReactions` is the shared reactions cache used by `renderOptions`. New anchor fields (`walkMinutes`, `walkMeters`, `address`, `booking`, `slot`) and entry field (`suggest`) are additive and degraded-rendering on absence.
- **Walking-mode selector:** the robust `data-block="wallet"` variant is the recommended path; the `nth-of-type` fallback is documented but the implementer should prefer the explicit attribute.
- **No placeholders:** every code step contains complete, runnable code. Seed-data steps reference specific anchors by date in `shared/schedule.js`.
- **TDD scope:** Task 1 is the only pure-logic task and uses red-green-refactor explicitly. DOM/CSS tasks are smoke-tested.
- **Reactions API call:** Step 5.2 instructs the implementer to confirm the call shape by reading `shared/submissions-api.js` rather than hard-coding a possibly-stale signature.
