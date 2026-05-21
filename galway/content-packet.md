# Galway Content Packet

This packet captured the starting point for Galway research. The researched content has now been implemented in `galway/data.js`; use that file as the current source of truth.

## Goal

Build out Galway from its fixed transport and Cliffs-tour spine into a complete short-stay planner with researched restaurants, pubs, short walks, rainy/low-energy variants, booking notes, map links, and clear Add / Maybe / Skip recommendations.

Status: implemented. This file is retained as handoff context, not as live page data.

## Current Source Of Truth

### Trip Identity

- Page title: Galway: Rails, Pubs & Cliffs
- Dates: July 2-3, 2026
- Travelers: Logan, Emily, Ashley, Max
- Tagline: Galway, with one clean Cliffs mission.
- Current subtitle: A short west-coast Ireland chapter for Logan, Emily, Ashley, and Max: rail in, Galway night, Cliffs of Moher half-day tour, rail back to Dublin.
- Desired mood: west-coast Ireland, pub-warm, social, easy, scenic, compact, not overplanned.

### Fixed Transport

Outbound rail:

- Date: July 2, 2026
- Route: Dublin to Galway
- Depart Dublin: 1:02pm
- Arrive Galway: 3:50pm
- Duration: 2h 48m

Return rail:

- Date: July 3, 2026
- Route: Galway to Dublin
- Depart Galway: 3:05pm
- Arrive Dublin: 5:44pm
- Duration: 2h 39m

Constraints:

- The Galway chapter is bounded by the 1:02pm Dublin departure and the 3:05pm Galway return.
- Leave enough post-tour buffer on July 3 for lunch, bags, and boarding.
- Do not add a long Friday afternoon plan before Dublin.

### Confirmed Tour

- Tour: From Galway: Cliffs of Moher Half-Day Express Trip
- Provider: Lally Tours
- Date: July 3, 2026
- Start: 8:00am
- Duration: 5.25 hours for planning
- Realistic Galway return anchor: about 1:30pm
- Language: English
- Current booking note says: 2 adults, age 18-64
- Meeting point: Outside the HYDE Hotel, Forster Street
- Address: 10 Forster St, Galway, H91 TCP0, Ireland
- Arrive by: 7:45am
- Note: Meet outside the HYDE Hotel on Forster Street at 7:45am. Look for the Lally Tours team in blue jackets. Plan around a realistic Galway return of about 1:30pm.
- Existing meeting point map: https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland

Constraints:

- Keep the tour as the Friday morning anchor.
- Treat rain/wind as a packing and expectation note unless the operator changes the plan.
- Research should verify tour details against the provider if possible, but do not rewrite the anchor without explaining the conflict.

### Current Executive Strategy

- Add: Protect the rails.
- Add: The July 3 Lally Tours Cliffs of Moher half-day express trip is the main event.
- Maybe: Keep night one flexible. Add pubs and dinner later, but keep Thursday evening low-friction after travel.
- Protect: Arrive by 7:45am. The tour note says to meet outside HYDE Hotel 15 minutes before the 8:00am departure.

### Current Film Chapters

1. Rail West
   - Dublin train, Galway arrival, easy evening
   - Stamp: 1:02pm train

2. Cliffs Run
   - HYDE Hotel meetup, Lally Tours, back by early afternoon
   - Stamp: 8:00am tour

3. Capital Return
   - Galway to Dublin, same rail beat as the Dublin page
   - Stamp: 3:05pm train

## Current Itinerary

### Thursday, July 2

Title: Dublin to Galway, then keep the evening open

Mood: West-coast arrival without overplanning the first night.

Current timeline:

- 1:02-3:50pm: Train Dublin to Galway. This is the fixed arrival spine for the chapter.
- 3:50-4:30pm: Arrive Galway, get bags sorted, and keep the transfer simple.
- Evening: Dinner, pubs, or a short walk to be researched and added later.
- Before bed: Set the morning plan: HYDE Hotel meetup at 7:45am for the Cliffs tour.

Current watch notes:

- Do not make Thursday night complicated before the early tour.
- Confirm where bags are going before adding dinner/pub reservations.
- Keep the next morning's meetup details visible.

Current variants:

- Low energy: Arrive, check in / drop bags, simple dinner, one pint, bed.
- Rain: Taxi or shortest luggage route, indoor dinner, early night.

Existing link:

- Galway station map: https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station

### Friday, July 3

Title: Cliffs of Moher tour, then train to Dublin

Mood: A clean half-day scenic mission with no logistics fog.

Current timeline:

- 7:45am: Arrive outside the HYDE Hotel, Forster Street. Look for the Lally Tours team in blue jackets.
- 8:00am: From Galway: Cliffs of Moher Half-Day Express Trip departs.
- 8:00am-~1:30pm: Tour window. Use 1:30pm as the realistic Galway return anchor.
- 1:30-2:30pm: Return to Galway, quick lunch / bags / buffer.
- 2:30pm: Be station-minded.
- 3:05-5:44pm: Train Galway to Dublin. This matches the arrival rail card at the top of the Dublin page.

Current watch notes:

- Be at HYDE Hotel by 7:45am.
- Keep lunch short enough to protect the 3:05pm train.
- Do not add a long afternoon plan before Dublin.

Current variants:

- Low energy: Tour, simple lunch, station buffer, Dublin train.
- Rain: Tour still runs unless operator changes it; bring layers and keep the post-tour plan minimal.

Existing link:

- HYDE Hotel meeting point: https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland

## Current Cards In Galway Data

### Logistics Cards

1. Dublin to Galway train
   - Verdict: Add
   - Copy: July 2, 1:02pm-3:50pm. This is the fixed start of the Galway section.
   - Note: Protect the departure time and keep luggage movement simple.
   - Link: https://www.irishrail.ie/en-ie/

2. Galway to Dublin train
   - Verdict: Add
   - Copy: July 3, 3:05pm-5:44pm. Same train block shown at the top of the Dublin page.
   - Note: Leave enough post-tour buffer for lunch, bags, and boarding.
   - Link: https://www.irishrail.ie/en-ie/

3. HYDE Hotel meeting point
   - Verdict: Add
   - Copy: Tour meeting point is outside HYDE Hotel, Forster Street.
   - Note: Arrive at 7:45am for the 8:00am departure.
   - Link: https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland

### Former Research Parking Lot

These placeholders have been replaced in `galway/data.js` by researched restaurant, pub, lunch, activity, route, warning, weather, booking, map pin, and source-note sections.

Top dinner decision:

- Cava Bodega: best group-energy dinner.
- Ard Bia at Nimmos: most atmospheric Galway dinner.

Top pub flow:

- Taaffes early if timing works.
- Dinner.
- Tig Coili or Tigh Neachtain.
- Done around 11pm.

Friday lunch:

- Fast central lunch only because the tour return anchor is about 1:30pm.
- McDonagh's if timing is clean.
- Merchant Bar, Little Jungle, GBC, or Esquires if timing is tight.

### Passport Stamps

- Dublin to Galway train: 1:02pm westbound
- First Galway night: Pubs / dinner TBD
- HYDE Hotel meetup: 7:45am sharp
- Cliffs of Moher: Half-day express
- Galway to Dublin train: 3:05pm return

## Existing Planner Features To Preserve

- Add / Maybe / Skip status controls.
- Four-author notes: Logan, Emily, Ashley, Max.
- Reactions: Love, Maybe, Nope, Concern.
- Per-card notes dropdowns.
- Missing suggestion form.
- Notes review grouped by option/person.
- Copy clean plan.
- Copy notes.
- Export/import legacy sharing stays available only as collapsed backup tooling; the visible collaboration model is DB-backed synced reactions and notes.
- Supabase-backed shared submissions, if present in the current branch.
- Final-cut logic.
- Passport/stamp progress.
- City navigation: Lisbon -> Galway -> Dublin -> London.

## Lisbon Data Shape To Imitate

Lisbon is much richer than Galway today. Galway research should aim to fill comparable categories, scaled to a 26-hour stay.

Lisbon currently includes:

- `meta`: title, dates, tagline, subtitle, base.
- `quickFacts`: home base, arrivals/departures, big day, main caution.
- `verdicts`: top Add / Protect / Skip strategy cards.
- `chapters`: film-like daily beats.
- `days`: day-by-day itinerary with mood, image, scores, timeline, optional ideas, watch notes, variants, and links.
- `paths`: traveler modes such as Romantic / Scenic, Fun / Social, Low-Energy, Big Adventure, Rain / Heat, Final Night.
- `restaurants`: ranked restaurant cards with role, verdict, tags, why, booking notes, website, and map link.
- `bars`: ranked bars/cafes/nightlife cards with role, verdict, why, website, and map link.
- `activities`: activity cards with verdict, why, price, time, website, and map link.
- `warnings`: skip/maybe caution cards.
- `events`: date-specific events worth considering.
- `routes`: named walk/route spines with stops and notes.
- `mapPins`: stylized map pins.
- `stamps`: passport moments.
- `bookingTimeline`: what to reserve/check and when.

For Galway, keep the research compact. The page does not need Lisbon's volume, but it now has enough real options to replace the three placeholder idea cards.

## Research Assignment

Research Galway for July 2-3, 2026 and return structured content that can be added to `galway/data.js`.

### Must Research

1. Thursday dinner options
   - 6-10 options.
   - Prioritize central Galway, walkable or easy from station / lodging / HYDE Hotel area.
   - Need a mix of lively Irish, seafood, modern casual, reservation-friendly, and fallback.
   - Include booking notes, official website if available, Google Maps link, and why it fits this group.

2. Thursday pubs / music
   - 6-10 options.
   - Prioritize atmospheric, central, real Galway energy.
   - Flag which are best for trad music, which are touristy but still worthwhile, and which are better for one pint only.
   - Keep in mind the early 7:45am tour meetup.

3. Friday quick lunch / coffee / bakery after tour
   - 4-8 options.
   - Must work between the expected ~1:30pm tour return and 3:05pm train.
   - Prioritize fast, central, near station / HYDE / Eyre Square if possible.

4. Short central walk
   - 1-3 route options.
   - Should fit Thursday arrival evening.
   - Keep it compact: Latin Quarter, Shop Street, Spanish Arch, Long Walk, Claddagh, canals, Eyre Square as appropriate.
   - Include rain and low-energy variants.

5. Rain / wind / fatigue plan
   - Galway and the Cliffs can be weather-exposed.
   - Give practical packing and expectation notes.
   - Do not overbuild indoor museums unless they are short, central, and truly useful.

6. Warnings / skips
   - Identify things that are not worth squeezing into this short stop.
   - Examples to evaluate: Aran Islands, Connemara, long museum blocks, Salthill if timing is tight, late-night pub crawl before early tour.

7. Booking/check timeline
   - What to reserve now, week-of, day-before, morning-of.
   - Include train/tour/hotel or bag logistics, restaurant holds, pub no-reservation assumptions, weather check.

### Nice To Research

- One or two Galway-specific events on July 2, 2026 if reliable event calendars exist this far out.
- Best local seafood or oyster option for a short-stay group dinner.
- Best photo stop at golden hour if weather allows.
- Whether the Lally Tours half-day return time makes a seated lunch realistic before the 3:05pm train.

## Desired Output Format

Return concise Markdown plus a JavaScript-ready data proposal.

Use this shape:

```js
{
  quickFacts: [
    ['Rail in', 'July 2, 1:02pm-3:50pm', '...', '...'],
    ['Cliffs tour', 'July 3, 8:00am', '...', '...']
  ],
  paths: [
    {
      id: 'pub-warm',
      name: 'Pub-Warm Galway',
      badge: 'Thursday default',
      best: '...',
      scores: { Stress: 2, 'Group fun': 9, Atmosphere: 10, Logistics: 8 },
      includes: ['...'],
      cuts: ['...'],
      why: '...',
      tradeoff: '...'
    }
  ],
  restaurants: [
    {
      id: 'example-id',
      rank: 1,
      name: 'Restaurant Name',
      role: 'Thursday dinner anchor',
      verdict: 'Add',
      tags: 'central seafood group reservation',
      why: '...',
      booking: '...',
      siteUrl: '...',
      mapUrl: '...'
    }
  ],
  bars: [
    ['example-id', 1, 'Pub Name', 'Trad music / one pint', 'Add', 'Why it fits.', 'siteUrl', 'mapUrl']
  ],
  lunch: [
    ['example-id', 1, 'Lunch/Coffee Name', 'Quick post-tour lunch', 'Add', 'Why it works before 3:05pm train.', 'siteUrl', 'mapUrl']
  ],
  activities: [
    {
      id: 'latin-quarter-walk',
      name: 'Latin Quarter / Spanish Arch / Long Walk',
      verdict: 'Add',
      why: 'Compact arrival-evening Galway texture.',
      price: 'Free',
      time: '45-90 minutes',
      siteUrl: '',
      mapUrl: '...'
    }
  ],
  warnings: [
    ['aran-islands', 'Aran Islands', 'skip', 'Too big for this 26-hour stop with fixed trains and Cliffs tour.', 'mapUrl']
  ],
  routes: [
    {
      id: 'arrival-walk',
      title: 'Arrival Galway Walk',
      stops: ['Galway Station', 'Eyre Square', 'Shop Street', 'Latin Quarter', 'Spanish Arch', 'Long Walk'],
      note: 'Keep this optional and weather-dependent.'
    }
  ],
  mapPins: [
    ['station', 'Galway Station', 50, 52, '#logistics']
  ],
  bookingTimeline: [
    ['Now / ASAP', 'Thursday dinner hold', 'high', ['...', '...']]
  ]
}
```

## Tone And Selection Criteria

Prefer:

- Real Galway personality over generic highest-rated lists.
- Central, walkable, easy-to-sequence options.
- Places that work for four people.
- Options that preserve the Friday morning tour.
- Clear reservation advice.
- Clear "why this fits" judgment.

Avoid:

- Long excursions.
- Distant restaurants unless there is a very strong reason.
- Late-night plans that risk the Cliffs tour.
- Filling the page with generic landmarks.
- Recommending Guinness Storehouse or Dublin items in the Galway section.
- Inventing exact hours, menus, event lineups, or booking policies without a source.

## Source Expectations

For each recommended restaurant, pub, tour detail, event, or booking claim, include:

- Official site where possible.
- Google Maps link.
- Date accessed.
- Any uncertainty or seasonal-hour caveat.

If sources conflict, call that out directly.
