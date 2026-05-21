# Group Awareness & Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real-time Supabase-backed reaction sync, visible reaction summaries on cards, hub live indicators, open decisions banners, and fix navigation dead ends (interactive route map, city switcher, prev/next footer, Kilkea coming-soon).

**Architecture:** Two independent streams. Part 1 (Tasks 1–3) is pure HTML/CSS — ship it independently as quick wins. Part 2 (Tasks 4–10) wires a new `card_reactions` Supabase table through the notes system in all four city pages. localStorage stays as an offline fallback; Supabase state merges on top on page load and stays live via realtime subscription.

**Tech Stack:** Vanilla JS, HTML/CSS, Supabase JS v2 (CDN, already loaded on all city pages), Node built-in test runner (`node --test`) for notes-logic tests. No build step; all pages are static files.

**Supabase project ref:** `dyquwyawnueostbegbyg`

**Constraints:**
- `london/styles.css` is minified — append new rules at the end of the file, never try to insert mid-line
- All city pages already load `supabase.js`, `supabase-config.js`, and `submissions-api.js`; the hub page (`index.html`) does not
- `NOTE_AUTHORS` differs by city: London = `['Logan', 'Emily']`; Lisbon/Dublin/Galway = `['Logan', 'Emily', 'Ashley', 'Max']`

---

## Part 1: Navigation & Structure (independent — ship first)

### Task 1: Interactive route map + Kilkea coming-soon

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Wrap navigable route nodes in anchor tags**

In `index.html`, replace the five `.route-node` divs inside `.route-map` with:

```html
<a class="route-node lisbon-node" href="lisbon/" style="--x:8%;--y:62%">
  <span>1</span><strong>Lisbon</strong><em>Atlantic light</em>
</a>
<div class="route-node kilkea-node disabled" aria-disabled="true" style="--x:31%;--y:28%">
  <span>2</span><strong>Kilkea</strong><em>Castle wedding</em>
</div>
<a class="route-node galway-node" href="galway/" style="--x:52%;--y:42%">
  <span>3</span><strong>Galway</strong><em>Cliffs + pubs</em>
</a>
<a class="route-node dublin-node" href="dublin/" style="--x:71%;--y:30%">
  <span>4</span><strong>Dublin</strong><em>Notes + pints</em>
</a>
<a class="route-node london-node" href="london/" style="--x:91%;--y:65%">
  <span>5</span><strong>London</strong><em>Final act</em>
</a>
```

- [ ] **Step 2: Add hover and disabled styles to styles.css**

Append to the end of `styles.css`:

```css
a.route-node {
  text-decoration: none;
  transition: transform .18s ease, box-shadow .18s ease;
}

a.route-node:hover {
  transform: translate(-50%, calc(-50% - 4px));
  box-shadow:
    0 0 0 1px rgba(201, 149, 66, .5),
    0 18px 36px rgba(0, 0, 0, .3),
    0 0 20px rgba(201, 149, 66, .22);
}

.route-node.disabled {
  opacity: .5;
  cursor: default;
}
```

- [ ] **Step 3: Rewrite Kilkea city card content**

In `index.html`, replace the contents of `<article class="city-card kilkea">`:

```html
<article class="city-card kilkea">
  <div class="city-image"></div>
  <div class="city-content">
    <p class="eyebrow">Kildare, Ireland · June 30-July 2</p>
    <h2>Kilkea Castle Wedding</h2>
    <div class="signature-row"><span>Stone</span><span>Garden green</span><span>Celebration</span></div>
    <p>Taylor and Austin's wedding at Kilkea Castle — castle grounds, gardens, close friends, and the turn into Ireland.</p>
    <ul>
      <li>Taylor and Austin's wedding · Kilkea Castle, Kildare</li>
      <li>Drive from Dublin Airport through the Kildare countryside</li>
      <li>Castle grounds, formal dinner, and the night before Galway</li>
    </ul>
    <span class="btn coming-soon">🔒 Planner coming soon · June 30</span>
  </div>
</article>
```

- [ ] **Step 4: Add coming-soon button style to styles.css**

Append to `styles.css`:

```css
.btn.coming-soon {
  color: rgba(255, 247, 233, .55);
  background: rgba(255, 247, 233, .07);
  border-color: rgba(255, 247, 233, .14);
  cursor: default;
  letter-spacing: .01em;
}

.btn.coming-soon:hover {
  transform: none;
  box-shadow: none;
}
```

- [ ] **Step 5: Verify in browser**

Open `http://localhost:8000` (`python3 -m http.server 8000` from project root).

Confirm:
- Lisbon, Galway, Dublin, London route nodes are clickable and navigate
- Kilkea route node is dimmed, cursor is default, does not navigate
- Hovering a live node shows the gold glow lift
- Kilkea city card button reads "🔒 Planner coming soon · June 30" and does not lift on hover
- Kilkea card has 3 concrete bullets (no "TBD")

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "feat: make route map interactive, improve Kilkea coming-soon"
```

---

### Task 2: City switcher in all trip page navbars

**Files:**
- Modify: `london/index.html`, `lisbon/index.html`, `dublin/index.html`, `galway/index.html`
- Modify: `london/styles.css`, `lisbon/styles.css`, `dublin/styles.css`, `galway/styles.css`

- [ ] **Step 1: Add city pills to London navbar**

In `london/index.html`, replace the `<div class="navlinks">` block:

```html
<div class="navlinks">
  <div class="city-pills">
    <a class="city-pill" href="../">Hub</a>
    <a class="city-pill" href="../lisbon/">L</a>
    <a class="city-pill" href="../galway/">G</a>
    <a class="city-pill" href="../dublin/">D</a>
    <a class="city-pill active" aria-current="page" href="#">Lon</a>
  </div>
  <div class="nav-divider"></div>
  <a href="#plan">Plan</a><a href="#wednesday">Wed</a><a href="#food">Food</a><a href="#prices">£</a><a href="#actions">Book</a>
  <button id="themeToggle" class="ghost">☾</button>
</div>
```

- [ ] **Step 2: Add city pills to Lisbon navbar**

In `lisbon/index.html`, replace the `<div class="navlinks">` block with:

```html
<div class="navlinks">
  <div class="city-pills">
    <a class="city-pill" href="../">Hub</a>
    <a class="city-pill active" aria-current="page" href="#">L</a>
    <a class="city-pill" href="../galway/">G</a>
    <a class="city-pill" href="../dublin/">D</a>
    <a class="city-pill" href="../london/">Lon</a>
  </div>
  <div class="nav-divider"></div>
  <a href="#plan">Plan</a>
  <a href="#moods">Moods</a>
  <a href="#restaurants">Food</a>
  <a href="#bars">Bars</a>
  <a href="#notes">Notes</a>
</div>
```

- [ ] **Step 3: Add city pills to Dublin navbar**

Read `dublin/index.html` to find the current navlinks content, then replace:

```html
<div class="navlinks">
  <div class="city-pills">
    <a class="city-pill" href="../">Hub</a>
    <a class="city-pill" href="../lisbon/">L</a>
    <a class="city-pill" href="../galway/">G</a>
    <a class="city-pill active" aria-current="page" href="#">D</a>
    <a class="city-pill" href="../london/">Lon</a>
  </div>
  <div class="nav-divider"></div>
  [keep existing Dublin section links verbatim]
</div>
```

- [ ] **Step 4: Add city pills to Galway navbar**

Read `galway/index.html` to find the current navlinks content, then replace:

```html
<div class="navlinks">
  <div class="city-pills">
    <a class="city-pill" href="../">Hub</a>
    <a class="city-pill" href="../lisbon/">L</a>
    <a class="city-pill active" aria-current="page" href="#">G</a>
    <a class="city-pill" href="../dublin/">D</a>
    <a class="city-pill" href="../london/">Lon</a>
  </div>
  <div class="nav-divider"></div>
  [keep existing Galway section links verbatim]
</div>
```

- [ ] **Step 5: Add city pill styles**

Append the following to `london/styles.css`, `lisbon/styles.css`, `dublin/styles.css`, and `galway/styles.css` (same rules in all four):

```css
.city-pills {
  display: flex;
  gap: 2px;
}

.city-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .82rem;
  font-weight: 800;
  text-decoration: none;
  color: rgba(255, 247, 236, .7);
  transition: background .15s ease, color .15s ease;
}

.city-pill:hover {
  background: rgba(255, 255, 255, .12);
  color: #fff7ec;
}

.city-pill.active {
  background: var(--gold);
  color: #2b1b10;
}

.nav-divider {
  width: 1px;
  background: rgba(255, 247, 236, .22);
  align-self: stretch;
  margin: 0 6px;
}

@media (max-width: 640px) {
  .navlinks > a:not(.city-pill),
  .navlinks > button:not(.ghost),
  .nav-divider {
    display: none;
  }
}
```

- [ ] **Step 6: Verify in browser**

Open each of the four city pages. Confirm:
- City pills appear in the left of the nav bar
- Active city pill is gold (distinct color)
- Clicking a different city navigates correctly
- On 375px viewport, section links disappear but city pills stay visible
- London dark mode: pills still readable

- [ ] **Step 7: Commit**

```bash
git add london/index.html lisbon/index.html dublin/index.html galway/index.html
git add london/styles.css lisbon/styles.css dublin/styles.css galway/styles.css
git commit -m "feat: add city switcher to all trip page navbars"
```

---

### Task 3: Prev/next city footer nav

**Files:**
- Modify: `lisbon/index.html`, `galway/index.html`, `dublin/index.html`, `london/index.html`
- Modify: `lisbon/styles.css`, `galway/styles.css`, `dublin/styles.css`, `london/styles.css`

Trip order: Lisbon → Galway → Dublin → London.

- [ ] **Step 1: Add footer nav to Lisbon**

In `lisbon/index.html`, add immediately before the closing `</main>` tag:

```html
<nav class="city-nav-footer" aria-label="Trip navigation">
  <a class="btn" href="../">← Hub</a>
  <a class="btn primary" href="../galway/">Next: Galway →</a>
</nav>
```

- [ ] **Step 2: Add footer nav to Galway**

In `galway/index.html`, add before `</main>`:

```html
<nav class="city-nav-footer" aria-label="Trip navigation">
  <a class="btn" href="../lisbon/">← Lisbon</a>
  <a class="btn primary" href="../dublin/">Next: Dublin →</a>
</nav>
```

- [ ] **Step 3: Add footer nav to Dublin**

In `dublin/index.html`, add before `</main>`:

```html
<nav class="city-nav-footer" aria-label="Trip navigation">
  <a class="btn" href="../galway/">← Galway</a>
  <a class="btn primary" href="../london/">Next: London →</a>
</nav>
```

- [ ] **Step 4: Add footer nav to London**

In `london/index.html`, add before `</main>` (after the share section):

```html
<nav class="city-nav-footer" aria-label="Trip navigation">
  <a class="btn" href="../dublin/">← Dublin</a>
  <span class="btn disabled">Final destination</span>
</nav>
```

- [ ] **Step 5: Add footer nav styles**

Append to each city's CSS file:

```css
.city-nav-footer {
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  padding: 28px 0 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
```

- [ ] **Step 6: Verify and commit**

Open each city page, scroll to the very bottom. Confirm prev/next links are present and navigate correctly.

```bash
git add lisbon/index.html galway/index.html dublin/index.html london/index.html
git add lisbon/styles.css galway/styles.css dublin/styles.css london/styles.css
git commit -m "feat: add prev/next city footer nav to all trip pages"
```

---

## Part 2: Real-Time Reactions

### Task 4: Create card_reactions table in Supabase

**Files:** None local — uses Supabase MCP tools against project `dyquwyawnueostbegbyg`.

- [ ] **Step 1: Apply migration**

Use `mcp__supabase__apply_migration` with:

```sql
create table if not exists card_reactions (
  id uuid primary key default gen_random_uuid(),
  trip_slug text not null,
  card_id text not null,
  card_type text not null default 'activity',
  author_name text not null,
  author_key text not null,
  reaction text not null default '',
  note text not null default '',
  client_id text not null,
  updated_at timestamptz not null default now(),
  constraint card_reactions_upsert_key unique (trip_slug, card_id, author_key)
);

alter table card_reactions enable row level security;

create policy "anon_read_reaction_feedback" on card_reactions for select to anon using (true);
create policy "admin_manage_card_reactions" on card_reactions for all to authenticated using (true) with check (true);
```

Then apply `supabase/card-reactions-rls-hardening.sql` so anonymous browsers use the narrow
`upsert_card_reaction(...)` RPC instead of broad table update rights.

- [ ] **Step 2: Enable Realtime**

Use `mcp__supabase__execute_sql`:

```sql
alter publication supabase_realtime add table card_reactions;
```

- [ ] **Step 3: Verify with test row**

Use `mcp__supabase__execute_sql`:

```sql
insert into card_reactions
  (trip_slug, card_id, card_type, author_name, author_key, reaction, note, client_id)
values
  ('_test', 'restaurant:test', 'restaurant', 'Logan', 'logan', 'love', 'plan test', 'plan-test-client')
on conflict (trip_slug, card_id, author_key) do update
  set reaction = excluded.reaction, updated_at = now();

select trip_slug, card_id, author_name, reaction from card_reactions where trip_slug = '_test';
```

Expected: one row with `trip_slug = '_test'`, `reaction = 'love'`.

Clean up:

```sql
delete from card_reactions where trip_slug = '_test';
```

- [ ] **Step 4: Confirm with mcp__supabase__list_tables**

Expected: `card_reactions` appears in the results.

---

### Task 5: Extend submissions-api.js with per-card reaction functions

**Files:**
- Modify: `shared/submissions-api.js`

- [ ] **Step 1: Replace submissions-api.js**

Replace the entire file with:

```js
(function () {
  function getClientId() {
    let id = sessionStorage.getItem('trip.clientId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('trip.clientId', id);
    }
    return id;
  }

  async function submitPacket(tripSlug, authorName, packet) {
    try {
      const { error } = await window.supabaseClient
        .from('trip_submissions')
        .insert({
          trip_slug: tripSlug,
          author_name: authorName,
          author_key: authorName.toLowerCase(),
          packet: packet,
          client_id: getClientId()
        });
      if (error) return { ok: false, error };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  async function upsertReaction(tripSlug, cardId, cardType, authorName, reaction, note) {
    if (!window.supabaseClient) return { ok: false, error: 'no supabase client' };
    try {
      const { error } = await window.supabaseClient
        .from('card_reactions')
        .upsert(
          {
            trip_slug: tripSlug,
            card_id: cardId,
            card_type: cardType,
            author_name: authorName,
            author_key: authorName.toLowerCase(),
            reaction: reaction,
            note: note,
            client_id: getClientId(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'trip_slug,card_id,author_key' }
        );
      if (error) return { ok: false, error };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  async function fetchReactions(tripSlug) {
    if (!window.supabaseClient) return { ok: false, error: 'no supabase client', data: [] };
    try {
      const { data, error } = await window.supabaseClient
        .from('card_reactions')
        .select('card_id, card_type, author_name, reaction, note')
        .eq('trip_slug', tripSlug);
      if (error) return { ok: false, error, data: [] };
      return { ok: true, data: data || [] };
    } catch (err) {
      return { ok: false, error: err, data: [] };
    }
  }

  function subscribeReactions(tripSlug, callback) {
    if (!window.supabaseClient) return null;
    return window.supabaseClient
      .channel(`card-reactions:${tripSlug}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'card_reactions', filter: `trip_slug=eq.${tripSlug}` },
        callback
      )
      .subscribe();
  }

  window.submitPacket = submitPacket;
  window.upsertReaction = upsertReaction;
  window.fetchReactions = fetchReactions;
  window.subscribeReactions = subscribeReactions;
})();
```

- [ ] **Step 2: Verify in browser console**

Open any city page (e.g. `http://localhost:8000/london/`). In DevTools console:

```js
typeof window.upsertReaction   // "function"
typeof window.fetchReactions   // "function"
typeof window.subscribeReactions  // "function"
```

- [ ] **Step 3: Commit**

```bash
git add shared/submissions-api.js
git commit -m "feat: add upsertReaction, fetchReactions, subscribeReactions to submissions-api"
```

---

### Task 6: Add getReactionSummary and cardTypeFromId to all notes-logic files

**Files:**
- Modify: `london/notes-logic.js`, `lisbon/notes-logic.js`, `dublin/notes-logic.js`, `galway/notes-logic.js`
- Modify: `london/notes-logic.test.mjs`, `lisbon/notes-logic.test.mjs`, `dublin/notes-logic.test.mjs`, `galway/notes-logic.test.mjs`

`getReactionSummary(state, cardId)` returns `{ love: [...authorNames], maybe: [...], nope: [...], concern: [...] }`.
`cardTypeFromId(id)` derives the card type from the ID prefix (e.g. `'restaurant:trullo'` → `'restaurant'`).

Do London first, then replicate.

- [ ] **Step 1: Write failing tests in london/notes-logic.test.mjs**

Add to the end of `london/notes-logic.test.mjs`:

```js
test('getReactionSummary groups authors by reaction type for a card', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Emily', { reaction: 'maybe', note: '' });

  const summary = notesLogic.getReactionSummary(state, 'restaurant:trullo');

  assert.deepEqual(summary.love, ['Logan']);
  assert.deepEqual(summary.maybe, ['Emily']);
  assert.deepEqual(summary.nope, []);
  assert.deepEqual(summary.concern, []);
});

test('getReactionSummary returns empty arrays when no reactions exist', () => {
  const summary = notesLogic.getReactionSummary(createEmptyNotesState(), 'restaurant:trullo');

  assert.deepEqual(summary.love, []);
  assert.deepEqual(summary.maybe, []);
  assert.deepEqual(summary.nope, []);
  assert.deepEqual(summary.concern, []);
});

test('cardTypeFromId maps id prefixes to card type strings', () => {
  assert.equal(notesLogic.cardTypeFromId('day:sun'), 'activity');
  assert.equal(notesLogic.cardTypeFromId('path:B'), 'decision');
  assert.equal(notesLogic.cardTypeFromId('restaurant:trullo'), 'restaurant');
  assert.equal(notesLogic.cardTypeFromId('bar:the-lamb'), 'bar');
  assert.equal(notesLogic.cardTypeFromId('upgrade:bath-spa'), 'experience');
  assert.equal(notesLogic.cardTypeFromId('booking:clos-maggiore'), 'logistics');
  assert.equal(notesLogic.cardTypeFromId('unknown:foo'), 'activity');
});
```

- [ ] **Step 2: Confirm tests fail**

```bash
node --test london/notes-logic.test.mjs 2>&1 | tail -10
```

Expected: failures for `getReactionSummary is not a function` and `cardTypeFromId is not a function`.

- [ ] **Step 3: Add the two functions to london/notes-logic.js**

In `london/notes-logic.js`, add these functions immediately before the `const api = {` line (around line 260):

```js
  function getReactionSummary(state, cardId) {
    const safeState = normalizeNotesState(state);
    const feedback = safeState.items[cardId] || {};
    const summary = {};
    NOTE_REACTIONS.forEach(([value]) => {
      summary[value] = NOTE_AUTHORS.filter((author) => feedback[author]?.reaction === value);
    });
    return summary;
  }

  const CARD_TYPE_MAP = {
    day: 'activity', path: 'decision', restaurant: 'restaurant', bar: 'bar',
    activity: 'activity', price: 'logistics', wildcard: 'activity', seasonal: 'activity',
    event: 'activity', upgrade: 'experience', warning: 'logistics', booking: 'logistics',
    experience: 'experience', route: 'experience', fact: 'logistics', verdict: 'logistics'
  };

  function cardTypeFromId(id) {
    return CARD_TYPE_MAP[String(id).split(':')[0]] || 'activity';
  }
```

Also add both to the `api` object:

```js
  const api = {
    // ... all existing keys ...
    getReactionSummary,
    cardTypeFromId
  };
```

- [ ] **Step 4: Confirm tests pass**

```bash
node --test london/notes-logic.test.mjs 2>&1 | tail -10
```

Expected: all tests pass, 0 failures.

- [ ] **Step 5: Replicate to lisbon, dublin, galway**

The implementation is identical. For each of the three cities:

a. Add the same three tests to `[city]/notes-logic.test.mjs` (use the same test text — the logic is identical across cities since it closes over the per-city `NOTE_AUTHORS`).

b. Add `getReactionSummary`, `CARD_TYPE_MAP`, and `cardTypeFromId` to `[city]/notes-logic.js` in the same position (before the `api` object).

c. Add both to the city's `api` export object.

d. Run: `node --test [city]/notes-logic.test.mjs` — confirm all pass.

- [ ] **Step 6: Run all four test suites**

```bash
node --test london/notes-logic.test.mjs
node --test lisbon/notes-logic.test.mjs
node --test dublin/notes-logic.test.mjs
node --test galway/notes-logic.test.mjs
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add london/notes-logic.js lisbon/notes-logic.js dublin/notes-logic.js galway/notes-logic.js
git add london/notes-logic.test.mjs lisbon/notes-logic.test.mjs dublin/notes-logic.test.mjs galway/notes-logic.test.mjs
git commit -m "feat: add getReactionSummary and cardTypeFromId to all notes-logic modules"
```

---

### Task 7: Wire Supabase sync into each city's app.js

This task modifies `app.js` in all four cities. The London and Lisbon patterns are shown in full; Dublin and Galway follow the same pattern.

**Key points:**
- `TRIP_SLUG` is the city name string passed to Supabase: `'london'`, `'lisbon'`, `'dublin'`, `'galway'`
- `noteState` is the existing in-memory object
- On page load: fetch all reactions for the trip, merge into `noteState`, then re-render
- On reaction/note save: call `window.upsertReaction(...)` alongside the existing `saveNoteState()` call
- On realtime event: update `noteState` with the changed row, re-render the affected panel

**Files:**
- Modify: `london/app.js`, `lisbon/app.js`, `dublin/app.js`, `galway/app.js`

- [ ] **Step 1: Add TRIP_SLUG constant to london/app.js**

At the top of `london/app.js`, after the existing `const` declarations (around line 8), add:

```js
const TRIP_SLUG = 'london';
```

- [ ] **Step 2: Add rowToFeedback helper to london/app.js**

Add this function near the other helper functions (after `getOptionFeedback`, around line 115):

```js
function rowToFeedback(row) {
  return { reaction: row.reaction || '', note: row.note || '' };
}
```

- [ ] **Step 3: Add initSync to london/app.js**

Add this async function after `rowToFeedback`:

```js
async function initSync() {
  const result = await window.fetchReactions(TRIP_SLUG);
  if (result.ok && result.data.length) {
    result.data.forEach((row) => {
      noteState = NOTES.saveOptionFeedback(noteState, row.card_id, row.author_name, rowToFeedback(row));
    });
    saveNoteState();
    renderAllDynamicSections();
  }

  window.subscribeReactions(TRIP_SLUG, (payload) => {
    if (!payload.new) return;
    const row = payload.new;
    noteState = NOTES.saveOptionFeedback(noteState, row.card_id, row.author_name, rowToFeedback(row));
    saveNoteState();
    const panel = document.querySelector(`.note-panel[data-note-id="${row.card_id}"]`);
    if (panel) updatePanelState(panel);
    renderNotesReview();
    refreshWowSurfaces();
  });
}
```

- [ ] **Step 4: Add upsert call to bindNoteEvents in london/app.js**

In `bindNoteEvents`, find the click handler that saves reactions (around line 890):

```js
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { reaction: nextReaction });
    saveNoteState();
    updatePanelState(panel);
    renderNotesReview();
    refreshWowSurfaces();
```

Add the upsert call after `saveNoteState()`:

```js
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { reaction: nextReaction });
    saveNoteState();
    window.upsertReaction(TRIP_SLUG, id, NOTES.cardTypeFromId(id), author, nextReaction, noteState.items[id]?.[author]?.note || '');
    updatePanelState(panel);
    renderNotesReview();
    refreshWowSurfaces();
```

Also find the input handler that saves notes (around line 902):

```js
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { note: event.target.value });
    saveNoteState();
    updatePanelState(panel);
```

Add the upsert after `saveNoteState()`:

```js
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { note: event.target.value });
    saveNoteState();
    window.upsertReaction(TRIP_SLUG, id, NOTES.cardTypeFromId(id), author, noteState.items[id]?.[author]?.reaction || '', event.target.value);
    updatePanelState(panel);
```

- [ ] **Step 5: Call initSync from init() in london/app.js**

At the end of `init()`, after `bindNoteEvents()` and before `init()` closes, add:

```js
  initSync();
```

- [ ] **Step 6: Verify London sync in browser**

1. Open `http://localhost:8000/london/` in two browser tabs.
2. In tab 1: add a reaction to any card (e.g. Love on a restaurant).
3. In tab 2 (without refreshing): within ~1 second the reaction panel on the same card should update.

If realtime doesn't fire within 5s, check the browser console for Supabase channel subscription errors.

- [ ] **Step 7: Replicate to lisbon/app.js, dublin/app.js, galway/app.js**

Repeat steps 1–5 for each city. The only difference is `TRIP_SLUG`:
- Lisbon: `const TRIP_SLUG = 'lisbon';`
- Dublin: `const TRIP_SLUG = 'dublin';`
- Galway: `const TRIP_SLUG = 'galway';`

The `rowToFeedback`, `initSync`, and upsert call patterns are identical. Find the equivalent `bindNoteEvents` event listeners in each city's app.js (they follow the same structure) and add the upsert calls in the same positions.

- [ ] **Step 8: Commit**

```bash
git add london/app.js lisbon/app.js dublin/app.js galway/app.js
git commit -m "feat: wire Supabase realtime reaction sync into all city app.js files"
```

---

### Task 8: Add reaction summary row to feedback panels + styles

**Files:**
- Modify: `london/app.js`, `lisbon/app.js`, `dublin/app.js`, `galway/app.js`
- Modify: `london/styles.css`, `lisbon/styles.css`, `dublin/styles.css`, `galway/styles.css`

The summary row shows `❤️ 2 · 👍 1` etc. below the panel, reading from the already-hydrated `noteState`.

- [ ] **Step 1: Add reactionSummaryRow helper to london/app.js**

Add after the `feedbackPanel` function (around line 147):

```js
function reactionSummaryRow(id) {
  const summary = NOTES.getReactionSummary(noteState, id);
  const emojiMap = { love: '❤️', maybe: '👍', nope: '✗', concern: '⚠️' };
  const parts = Object.entries(summary)
    .filter(([, authors]) => authors.length > 0)
    .map(([reaction, authors]) => `<span class="rsummary-item" title="${authors.join(', ')}">${emojiMap[reaction]} ${authors.length}</span>`);
  if (!parts.length) return '';
  return `<div class="reaction-summary">${parts.join('')}</div>`;
}
```

- [ ] **Step 2: Update feedbackPanel in london/app.js to include the summary row**

In `feedbackPanel`, change the returned template to append the summary row before the closing tag:

```js
function feedbackPanel(id, label) {
  registerNoteLabel(id, label);
  const feedbackCount = NOTES.countOptionFeedback(noteState, id);
  const hasNotes = feedbackCount > 0;
  return `
    <details class="note-panel ${hasNotes ? 'has-notes' : ''}" data-note-id="${id}">
      <summary class="note-panel-head">
        <span>Notes</span>
        <em>${hasNotes ? `${feedbackCount} saved` : 'Add reaction'}</em>
      </summary>
      <div class="note-authors">
        ${NOTES.NOTE_AUTHORS.map((author) => {
          const feedback = getOptionFeedback(id, author);
          return `
            <div class="note-author" data-author="${author}">
              <div class="note-author-head">
                <strong>${author}</strong>
                <div class="reaction-row">
                  ${NOTES.NOTE_REACTIONS.map(([value, text]) => `
                    <button class="reaction-button ${feedback.reaction === value ? 'active' : ''}" type="button" data-reaction="${value}">${text}</button>
                  `).join('')}
                </div>
              </div>
              <textarea class="note-text" rows="2" placeholder="${author}'s note...">${escapeHtml(feedback.note)}</textarea>
            </div>
          `;
        }).join('')}
      </div>
      <a class="review-notes-link" href="#notes">Review all notes</a>
    </details>
    ${reactionSummaryRow(id)}
  `;
}
```

- [ ] **Step 3: Add reaction summary styles**

Append to `london/styles.css`:

```css
.reaction-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.rsummary-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--gold) 14%, var(--paper2));
  border: 1px solid color-mix(in srgb, var(--gold) 22%, var(--line));
  font-size: .8rem;
  font-weight: 700;
  color: var(--ink);
}
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:8000/london/`. Add a Love reaction to a restaurant card. Close the note panel. Confirm a `❤️ 1` pill appears below the panel, outside the `<details>`.

Add a Maybe reaction as a different author. Confirm `❤️ 1 · 👍 1` appears.

- [ ] **Step 5: Replicate to lisbon, dublin, galway**

Repeat steps 1–4 for each city's `app.js` and `styles.css`. The `reactionSummaryRow` function and the updated `feedbackPanel` template are identical. The CSS rules are identical.

- [ ] **Step 6: Commit**

```bash
git add london/app.js lisbon/app.js dublin/app.js galway/app.js
git add london/styles.css lisbon/styles.css dublin/styles.css galway/styles.css
git commit -m "feat: add live reaction summary row to all feedback panels"
```

---

### Task 9: Open decisions banner on each city page

**Files:**
- Modify: `london/app.js`, `lisbon/app.js`, `dublin/app.js`, `galway/app.js`
- Modify: `london/index.html`, `lisbon/index.html`, `dublin/index.html`, `galway/index.html`
- Modify: `london/styles.css`, `lisbon/styles.css`, `dublin/styles.css`, `galway/styles.css`

A "decision" card is one whose `cardTypeFromId(id) === 'decision'` — i.e., cards with `path:` prefix. These are the path pickers that require the group to choose.

An "open decision" is a decision card where fewer than 2 group members have reacted.

- [ ] **Step 1: Add computeOpenDecisions to london/app.js**

Add after `reactionSummaryRow`:

```js
function computeOpenDecisions() {
  const decisionIds = Object.keys(noteLabels).filter((id) => NOTES.cardTypeFromId(id) === 'decision');
  return decisionIds.filter((id) => NOTES.countOptionFeedback(noteState, id) < 2);
}
```

- [ ] **Step 2: Add renderDecisionsBanner to london/app.js**

```js
function renderDecisionsBanner() {
  const banner = document.getElementById('decisionsBanner');
  if (!banner) return;
  const open = computeOpenDecisions();
  if (!open.length) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.innerHTML = `
    <span class="decisions-count">${open.length} ${open.length === 1 ? 'thing needs' : 'things need'} a decision</span>
    <a href="#wednesday" class="decisions-link">Review →</a>
  `;
}
```

- [ ] **Step 3: Add the banner element to london/index.html**

In `london/index.html`, find the `<section class="section reveal" id="verdict">` line and add the banner div immediately before it:

```html
<div id="decisionsBanner" class="decisions-banner" hidden></div>
<section class="section reveal" id="verdict">
```

- [ ] **Step 4: Call renderDecisionsBanner from init() and refreshWowSurfaces()**

In `london/app.js`, add `renderDecisionsBanner()` at the end of `init()`:

```js
  renderDecisionsBanner();
```

Also add it inside `refreshWowSurfaces()`:

```js
function refreshWowSurfaces() {
  renderCoupleDashboard();
  renderFinalCut();
  renderDecisionsBanner();
}
```

- [ ] **Step 5: Add decisions banner styles**

Append to `london/styles.css`:

```css
.decisions-banner {
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto 0;
  padding: 14px 20px;
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--claret) 10%, var(--paper2));
  border: 1px solid color-mix(in srgb, var(--claret) 28%, var(--line));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: .95rem;
}

.decisions-count {
  font-weight: 700;
  color: var(--claret);
}

.decisions-link {
  color: var(--claret);
  font-weight: 800;
  text-decoration: none;
}

.decisions-link:hover {
  text-decoration: underline;
}
```

- [ ] **Step 6: Verify in browser**

Open `http://localhost:8000/london/`. The banner should appear above the verdict section if no path decisions have been reacted to. Add reactions to path:B and path:C. The banner count should decrease. Add a reaction to path:A. Banner should disappear.

- [ ] **Step 7: Replicate to lisbon, dublin, galway**

For each city:

a. Add `computeOpenDecisions` and `renderDecisionsBanner` to the city's `app.js` (identical code). The `#wednesday` link in `renderDecisionsBanner` should point to the city's decision section — read the city's `index.html` to find the correct anchor:
- London: `href="#wednesday"` (path picker section id)
- Lisbon: check `lisbon/index.html` for the sintra path picker section id (likely `#sintra` or `#paths`)
- Dublin: check `dublin/index.html`
- Galway: check `galway/index.html`

b. Add `<div id="decisionsBanner" class="decisions-banner" hidden></div>` before the verdict section in each city's `index.html`.

c. Add `renderDecisionsBanner()` to `init()` and `refreshWowSurfaces()` in each city's `app.js`.

d. Append the same CSS to each city's `styles.css`.

- [ ] **Step 8: Commit**

```bash
git add london/app.js lisbon/app.js dublin/app.js galway/app.js
git add london/index.html lisbon/index.html dublin/index.html galway/index.html
git add london/styles.css lisbon/styles.css dublin/styles.css galway/styles.css
git commit -m "feat: add open decisions banner to all city pages"
```

---

### Task 10: Hub live indicators + add Supabase scripts to hub page

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

The hub page doesn't currently load Supabase. We add it and show reaction + open decision counts per city.

- [ ] **Step 1: Add Supabase scripts to index.html**

In `index.html`, add before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="shared/supabase-config.js"></script>
<script src="shared/submissions-api.js"></script>
<script>
(async function () {
  const cities = ['lisbon', 'galway', 'dublin', 'london'];
  const results = await Promise.all(cities.map((slug) => window.fetchReactions(slug)));

  cities.forEach((slug, i) => {
    const el = document.getElementById(`status-${slug}`);
    if (!el) return;
    const data = results[i].ok ? results[i].data : [];
    const reactionCount = data.filter((r) => r.reaction).length;
    const decisionCount = data.filter((r) => r.card_type === 'decision' && !r.reaction).length;
    const parts = [];
    if (reactionCount) parts.push(`${reactionCount} reaction${reactionCount === 1 ? '' : 's'}`);
    if (decisionCount) parts.push(`${decisionCount} open decision${decisionCount === 1 ? '' : 's'}`);
    el.textContent = parts.length ? parts.join(' · ') : '';
    el.hidden = !parts.length;
  });
})();
</script>
```

- [ ] **Step 2: Add status elements to each city card in index.html**

For each active city card (lisbon, galway, dublin, london), add a status span inside `.city-content`, after the `<ul>` and before the `<a class="btn">`:

Lisbon:
```html
<span id="status-lisbon" class="city-card-status" hidden></span>
```

Galway:
```html
<span id="status-galway" class="city-card-status" hidden></span>
```

Dublin:
```html
<span id="status-dublin" class="city-card-status" hidden></span>
```

London:
```html
<span id="status-london" class="city-card-status" hidden></span>
```

- [ ] **Step 3: Add city-card-status styles to styles.css**

Append to `styles.css`:

```css
.city-card-status {
  display: block;
  margin: 0 0 14px;
  color: var(--muted);
  font-size: .82rem;
  font-weight: 700;
}
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:8000`. After reactions have been left on any city page, the hub page should show e.g. "14 reactions · 2 open decisions" on the appropriate city card. Cards with no activity show nothing (the element is hidden).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add live reaction and decision counts to hub city cards"
```

---

### Task 11: Demote export UI on all city pages

**Files:**
- Modify: `london/index.html`, `lisbon/index.html`, `dublin/index.html`, `galway/index.html`
- Modify: `london/styles.css`, `lisbon/styles.css`, `dublin/styles.css`, `galway/styles.css`

- [ ] **Step 1: Remove "Copy summary" from London hero actions**

In `london/index.html`, in the `<div class="hero-actions">`, remove:

```html
<button class="btn glass" id="copyHero">Copy summary</button>
```

Keep the other hero buttons unchanged.

- [ ] **Step 2: Wrap London share section in a details disclosure**

In `london/index.html`, find the `<section class="section reveal" id="share">` and replace:

```html
<section class="section reveal" id="share"><div class="share-panel">...</div></section>
```

With:

```html
<section class="section" id="share">
  <details class="export-disclosure">
    <summary>Export &amp; legacy sharing</summary>
    <div class="share-panel">
      [keep existing share-panel contents verbatim]
    </div>
  </details>
</section>
```

- [ ] **Step 3: Add export disclosure styles**

Append to `london/styles.css`:

```css
.export-disclosure {
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  padding: 14px 0 56px;
}

.export-disclosure > summary {
  cursor: pointer;
  color: var(--muted);
  font-size: .88rem;
  font-weight: 700;
  list-style: none;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}

.export-disclosure > summary::-webkit-details-marker {
  display: none;
}

.export-disclosure > summary::before {
  content: '+ ';
}

.export-disclosure[open] > summary::before {
  content: '− ';
}
```

- [ ] **Step 4: Replicate to lisbon, dublin, galway**

Each city page follows the same pattern:

a. Remove the `copyHero` button from hero actions (if present).

b. Wrap the share/export section in `<details class="export-disclosure">`.

c. Append the same `.export-disclosure` CSS to the city's stylesheet.

- [ ] **Step 5: Verify in browser**

Open each city page. Confirm:
- The hero CTA row no longer has a "Copy summary" button
- The bottom of each page has a collapsed "Export & legacy sharing" disclosure
- Clicking the disclosure opens the original share panel content
- All print/PDF, copy, and share-packet functionality still works when expanded

- [ ] **Step 6: Commit**

```bash
git add london/index.html lisbon/index.html dublin/index.html galway/index.html
git add london/styles.css lisbon/styles.css dublin/styles.css galway/styles.css
git commit -m "feat: demote legacy export UI to collapsed disclosure on all city pages"
```

---

## Self-Review Checklist

Spec coverage:
- [x] A1 card reaction summaries → Task 8
- [x] A2 hub live indicators → Task 10
- [x] A3 demote export UI → Task 11
- [x] A4 open decisions banner → Task 9
- [x] Supabase schema → Task 4
- [x] submissions-api CRUD → Task 5
- [x] getReactionSummary / cardTypeFromId → Task 6
- [x] Supabase sync in app.js → Task 7
- [x] B1 interactive route map → Task 1
- [x] B2 city switcher → Task 2
- [x] B3 Kilkea coming-soon → Task 1
- [x] B4 prev/next footer → Task 3
- [x] Mobile: section links hidden on ≤640px, city pills stay visible → Task 2 Step 5
