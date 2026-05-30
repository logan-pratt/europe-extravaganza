# Lisbon Food Tour Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the confirmed Friday Oh! My Cod Lisbon food tour into the Lisbon planner and rebalance Friday, Saturday, and Monday around it.

**Architecture:** Keep the existing static-data rendering pattern. Add one `confirmedBooking` object to `lisbon/data.js`, render it as a compact informational card below quick facts from `lisbon/app.js`, and use the existing data arrays for itinerary, activity, route, map, passport, and booking-timeline changes. No database or notes-logic changes are needed.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, existing localStorage and Supabase reaction sync.

---

### Task 1: Add The Confirmed Booking Anchor

**Files:**
- Modify: `lisbon/index.html`
- Modify: `lisbon/styles.css`
- Modify: `lisbon/data.js`
- Modify: `lisbon/app.js`

- [ ] **Step 1: Add the informational section below quick facts**

Insert `#confirmed-booking` after `#quick-facts` in `lisbon/index.html`:

```html
<section class="section reveal" id="confirmed-booking">
  <div class="section-head"><p class="eyebrow">Confirmed booking</p><h2>Friday evening belongs to the food tour.</h2></div>
  <div id="confirmedBooking"></div>
</section>
```

- [ ] **Step 2: Add the booking data**

Add `confirmedBooking` after `quickFacts` in `lisbon/data.js`:

```js
confirmedBooking: {
  kicker: 'Confirmed · Friday Jun 26',
  title: 'Oh! My Cod: 17 Tastings Lisbon Food Tour',
  time: '5:00-9:00pm · all four travelers',
  meet: 'Meet by 4:50pm under Rua Augusta Arch',
  address: 'R. Augusta 2 · Praça do Comércio / Terreiro do Paço',
  transit: 'Terreiro do Paço metro station is about a five-minute walk away. Tram 28 is also about five minutes away, but it is a nearby reference rather than the plan.',
  details: ['17 food and drink tastings', '4 gastronomic stops', 'Baixa · Mouraria · Alfama'],
  siteUrl: 'https://www.ohmycodtours.com/food-tours/lisbon-food-tour/',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20Augusta%20Arch%20R.%20Augusta%202%20Lisboa%201100-053'
},
```

- [ ] **Step 3: Render the booking card without feedback controls**

Add `renderConfirmedBooking()` in `lisbon/app.js` and call it from `renderAllDynamicSections()` immediately after `renderFacts()`:

```js
function renderConfirmedBooking() {
  const item = DATA.confirmedBooking;
  $('#confirmedBooking').innerHTML = `
    <article class="confirmed-booking-card">
      <div>
        <p class="eyebrow">${item.kicker}</p>
        <h3>${item.title}</h3>
        <p class="confirmed-booking-time">${item.time}</p>
      </div>
      <div class="confirmed-booking-meet">
        <strong>${item.meet}</strong>
        <span>${item.address}</span>
        <p>${item.transit}</p>
      </div>
      <div class="confirmed-booking-footer">
        <div class="tag-row">${item.details.map((detail) => `<span class="tag">${detail}</span>`).join('')}</div>
        ${linkButtons(item.siteUrl, item.mapUrl)}
      </div>
    </article>
  `;
}
```

- [ ] **Step 4: Style the compact card**

Add `.confirmed-booking-card`, `.confirmed-booking-meet`, `.confirmed-booking-footer`, and mobile rules in `lisbon/styles.css`. Use the existing whiskey-gold, green, wood, and paper variables. Keep the component readable in one card and avoid notes controls.

- [ ] **Step 5: Update cache-busting strings**

Change Lisbon CSS and JS query strings in `lisbon/index.html` from `20260520-presentation-mode` to `20260530-food-tour`.

### Task 2: Rebalance The Lisbon Schedule

**Files:**
- Modify: `lisbon/index.html`
- Modify: `lisbon/data.js`
- Modify: `lisbon/app.js`

- [ ] **Step 1: Update the mini calendar and film chapters**

Use:

```html
<span><b>Fri 26</b> reunion + food tour</span>
<span><b>Sat 27</b> Belém + fancy dinner</span>
```

Use:

```js
{ dayId: 'fri', title: 'Reunion + Food Tour', subtitle: 'Easy Baixa day, reset, booked tasting walk', stamp: '17 tastings' },
{ dayId: 'mon', title: 'Alfama + Final Toast', subtitle: 'Viewpoints, souvenirs, nata, early dinner, airport discipline', stamp: 'Final Lisbon glow' }
```

- [ ] **Step 2: Rewrite Friday**

Replace Friday's midday-through-night timeline with a deliberately light day: relaxed Baixa wander, small lunch, Airbnb reset, leave for Rua Augusta Arch, meet by `4:50pm`, tour `5:00-9:00pm`, and one optional drink only if energy holds. Remove the formal Friday dinner and separate Alfama viewpoints walk. Add tour and map links.

- [ ] **Step 3: Rewrite Saturday's dinner label**

Keep Belém and waterfront plans. Make the dinner row say the fancy dinner is the open decision, with the ranked restaurant list remaining the place to choose it.

- [ ] **Step 4: Move Alfama viewpoints to Monday**

Add Sé Cathedral, Santa Luzia, Portas do Sol, and Alfama lanes to Monday morning or midday while preserving souvenirs, nata, packing, early dinner, and the early night.

- [ ] **Step 5: Update the copied summary**

Change `finalSummary()` in `lisbon/app.js` so Friday mentions the booked tour, Saturday mentions the open fancy-dinner choice, and Monday mentions Alfama viewpoints.

### Task 3: Update Supporting Planner Surfaces

**Files:**
- Modify: `lisbon/data.js`

- [ ] **Step 1: Add the tour activity**

Add an `Add / Confirmed` activity with the tour site, Rua Augusta Arch map link, `5:00-9:00pm`, and meeting-by-`4:50pm` detail.

- [ ] **Step 2: Update routes and map**

Add a Friday food-tour route from Rua da Madalena to Rua Augusta Arch and note the tour's Baixa, Mouraria, and Alfama flow. Change the Alfama route note to Monday. Add a `Rua Augusta Arch` map pin linking to `#confirmed-booking`.

- [ ] **Step 3: Add the passport stamp**

Add:

```js
['food-tour', '17 Lisbon tastings', 'Baixa · Mouraria · Alfama']
```

- [ ] **Step 4: Update booking timeline**

Add a `Tour-day logistics` item covering light lunch, comfortable shoes, water, and arriving ten minutes early. Replace the generic top-dinners item with `Saturday fancy dinner` as an open decision. Keep Sunday tickets, Cascais dinner, hours checks, and airport discipline.

### Task 4: Verify The Lisbon Planner

**Files:**
- Test: `lisbon/notes-logic.test.mjs`

- [ ] **Step 1: Run focused syntax and logic checks**

Run:

```bash
node --check lisbon/app.js
node --check lisbon/data.js
node --test lisbon/notes-logic.test.mjs
```

Expected: both syntax checks exit `0`; all Lisbon notes-logic tests pass.

- [ ] **Step 2: Run the static server**

Run:

```bash
python3 -m http.server 4174
```

- [ ] **Step 3: Smoke-test desktop and mobile**

Open `http://127.0.0.1:4174/lisbon/`. Confirm the compact booking card, Friday itinerary, Monday itinerary, Rua Augusta Arch pin, activity card, booking timeline, passport stamp, and copied summary agree. Test a mobile viewport and confirm there is no text overlap.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git diff -- lisbon/index.html lisbon/styles.css lisbon/data.js lisbon/app.js
```

Confirm the change remains Lisbon-only and does not alter notes, reaction sync, or Supabase behavior.
