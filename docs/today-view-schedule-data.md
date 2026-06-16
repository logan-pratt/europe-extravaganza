# Today View · Schedule Ground-Truth Data

**Purpose:** the authoritative source facts for `shared/schedule.js` (the Today-view spine), assembled from the existing `*/data.js` files plus the inter-city seams that live in no `data.js`. Where a fact is private (phone numbers, booking refs) and exists nowhere in the repo, it is marked **`TODO(you)`** rather than invented.

**How to use:** populate each `shared/schedule.js` row from the master table below; pull confirmations/lodging/legs from the detail tables; resolve the `TODO(you)` checklist at the end with the real numbers before the trip.

> Assembled by reading `lisbon/`, `galway/`, `dublin/`, `london/` `data.js`, `index.html`, and `AGENTS.md`. Nothing here was invented; derived facts cite their day. Verify anything tagged *verify* against a booking.

---

## ⚠️ Findings that change the schedule model

These will break a naive `date → single city` lookup if not handled:

1. **Three days are split across two cities.** The spine cannot assume one city per date:
   - **Jul 2** — Kilkea (morning checkout + drive) → **Galway** (1:02pm train, `GALWAY_DATA.thu`).
   - **Jul 3** — **Galway** (Cliffs tour, `GALWAY_DATA.fri`, returns ~1:30pm) → **Dublin** (3:05pm train, `DUBLIN_DATA.fri`). *Both `data.js` files define a `fri`/July 3 day.*
   - **Jul 5** — **Dublin** (morning + flight, `DUBLIN_DATA.sun`) → **London** (evening arrival, `TRIP_DATA.sun`). *Both define a `sun`/July 5 day.*

   Recommend each schedule row support an **ordered list of segments** (`[{city, dayId, fromTime}]`) rather than a single `{city, dayId}`. The Now/Next logic then flows naturally across the seam.

2. **Dates carry no year and globals are inconsistently named.** Pin everything to 2026 and map slug→global explicitly:
   ```js
   const CITY_GLOBALS = {
     lisbon: 'LISBON_DATA', galway: 'GALWAY_DATA',
     dublin: 'DUBLIN_DATA', london: 'TRIP_DATA',   // ← London is NOT LONDON_DATA
   };
   ```
   (This is also the latent hub bug: `index.html` reads `window.LONDON_DATA`, which is undefined, so the London status badge silently never renders.)

3. **Kilkea has no `data.js`.** Jun 30 – Jul 1 (and the Jul 2 morning) have no city timeline to render. The Today view will land on these dates empty unless the schedule row carries enough standalone content (legs + lodging + wedding anchors). Treat Kilkea as **schedule-only** for now.

4. **Trip start date is ambiguous.** The hub says *"June 24–30 Lisbon"* and *"June 24–July 9,"* but the first Lisbon day in `LISBON_DATA` is **June 25** (Logan + Emily land 11:50am). June 24 is almost certainly the overnight US→Lisbon flight. **`TODO(you)`: confirm whether anyone is on the ground Jun 24, or if it's purely in-transit.**

---

## Master table (Jun 24 – Jul 9, 2026)

| ISO date | Day | Primary city | Segments (city · dayId) | Source global | Day-of headline |
|---|---|---|---|---|---|
| 2026-06-24 | Wed | — (transit) | none | — | Overnight US → Lisbon (Logan + Emily). *Pre-trip / in-flight.* |
| 2026-06-25 | Thu | lisbon | lisbon · `thu` | `LISBON_DATA` | Logan + Emily land LIS 11:50am · soft landing |
| 2026-06-26 | Fri | lisbon | lisbon · `fri` | `LISBON_DATA` | Ashley + Max arrive ~10am · **food tour 5–9pm (confirmed)** |
| 2026-06-27 | Sat | lisbon | lisbon · `sat` | `LISBON_DATA` | Belém / waterfront / big group night |
| 2026-06-28 | Sun | lisbon | lisbon · `sun` | `LISBON_DATA` | Sintra + Cascais big day (early start) |
| 2026-06-29 | Mon | lisbon | lisbon · `mon` | `LISBON_DATA` | Final Lisbon day · pack · airport discipline |
| 2026-06-30 | Tue | kilkea | *(transition)* → kilkea · — | none (Kilkea) | **3:30am leave → 6:00am LIS→DUB flight → drive to Kilkea Castle** |
| 2026-07-01 | Wed | kilkea | kilkea · — | none (Kilkea) | **Taylor + Austin wedding day** at Kilkea Castle |
| 2026-07-02 | Thu | galway | kilkea · — → galway · `thu` | `GALWAY_DATA` | Checkout + drive to Heuston · **1:02pm train → Galway 3:50pm** · pub night |
| 2026-07-03 | Fri | galway→dublin | galway · `fri` → dublin · `fri` | `GALWAY_DATA`, `DUBLIN_DATA` | **Cliffs tour 8am (HYDE 7:45am)** → **3:05pm train → Dublin 5:44pm** → Mister S |
| 2026-07-04 | Sat | dublin | dublin · `sat` | `DUBLIN_DATA` | **Guinness Storehouse 12:00pm (fixed)** · Georgian walk · Delahunt · trad |
| 2026-07-05 | Sun | dublin→london | dublin · `sun` → london · `sun` | `DUBLIN_DATA`, `TRIP_DATA` | Coffee + **DUB→London flight (Heathrow)** → Kimpton check-in → Bloomsbury pub |
| 2026-07-06 | Mon | london | london · `mon` | `TRIP_DATA` | **Wimbledon day** |
| 2026-07-07 | Tue | london | london · `tue` | `TRIP_DATA` | Open London day (Bath candidate) |
| 2026-07-08 | Wed | london | london · `wed` | `TRIP_DATA` | Final London day · **Wednesday path decision** · Clos Maggiore |
| 2026-07-09 | Thu | london | london · `thu` | `TRIP_DATA` | Departure |

---

## Lodging (per night)

| Nights | City | Name | Address | mapUrl | Phone |
|---|---|---|---|---|---|
| Jun 25–29 | Lisbon | Rua da Madalena 214 (Airbnb) | Rua da Madalena 214, Lisbon 1100-204, Portugal | in `LISBON_DATA.meta.base.mapUrl` | `TODO(you)` — host/contact |
| Jun 30 – Jul 2 | Kilkea | Kilkea Castle | Castledermot, Co. Kildare *(verify)* | `TODO(you)` build maps query | `TODO(you)` |
| Jul 2–3 | Galway | **`TODO(you)` — Galway hotel not named in data** | `TODO(you)` | `TODO(you)` | `TODO(you)` |
| Jul 3–5 | Dublin | Marlin Hotel Dublin | 11 Bow Lane East, St Stephen's Green, Dublin 2, D02 AY81 | build from address | `TODO(you)` |
| Jul 5–9 | London | Kimpton Fitzroy London | Bloomsbury / Russell Square *(verify full street address)* | `TRIP_DATA` links use name-based maps dir | `TODO(you)` |

> Galway lodging is genuinely absent from `GALWAY_DATA` — the data only references a generic "lodging / hotel area" and the **HYDE Hotel** (10 Forster St, H91 TCP0), which is the *tour meetup point*, **not** confirmed lodging. Don't assume they're the same.

---

## Confirmed anchors & fixed bookings

Surface these in the Today view's "locked" band. *Confirmed* = booked per data; *fixed* = immovable time but ref unknown.

| Date | Anchor | Time | Status | Detail / `TODO` |
|---|---|---|---|---|
| Jun 26 | Oh! My Cod food tour (all 4) | 5:00–9:00pm, meet **4:50pm** Rua Augusta Arch | **Confirmed** | `LISBON_DATA.confirmedBooking` — site + mapUrl present |
| Jun 30 | LIS → DUB flight | 6:00am (leave base 3:30–3:45am) | Fixed | `TODO(you)`: airline + flight # + booking ref |
| Jul 1 | Wedding ceremony | `TODO(you)` time | Fixed | `TODO(you)`: ceremony time, dress code, venue/grounds map |
| Jul 2 | Heuston → Galway train | 1:02pm → 3:50pm (2h48m) | Fixed | `GALWAY_DATA.meta.outbound` — `TODO(you)`: Irish Rail booking ref |
| Jul 3 | Lally Cliffs of Moher half-day | HYDE 7:45am, depart 8:00am, return ~1:30pm | Fixed | `GALWAY_DATA` — `TODO(you)`: tour booking ref |
| Jul 3 | Galway → Dublin train | 3:05pm → 5:44pm (2h39m) | Fixed | `GALWAY_DATA.meta.return` / `DUBLIN_DATA.meta.arrival` — `TODO(you)`: ref |
| Jul 4 | Guinness Storehouse tour | 12:00pm | Fixed | `DUBLIN_DATA` verdicts — `TODO(you)`: booking ref |
| Jul 5 | DUB → London flight | leave Marlin ~2.75–3.25h pre-flight | Fixed | `TODO(you)`: airline + time + ref (lands Heathrow per `TRIP_DATA`) |
| Jul 6 | Wimbledon | `TODO(you)` | Planned | `TODO(you)`: Queue vs tickets, departure time |
| Jul 8 | Clos Maggiore + Wednesday path | evening | **Open decision** | `TRIP_DATA` booking timeline — A/B/C path still undecided |
| Jul 9 | London → US departure | `TODO(you)` | Fixed | `TODO(you)`: airline + time + ref |

---

## Inter-city legs (the seams — exist in no `data.js`)

These are the highest-stakes Today-view content. Each should be a `leg` on its date's schedule row.

| Date | Leg | Detail | Source / `TODO` |
|---|---|---|---|
| Jun 24→25 | US → Lisbon (Logan + Emily) | Overnight; land LIS Thu 11:50am | `LISBON_DATA` quickFacts |
| Jun 26 | Ashley + Max → Lisbon | Arrive ~10:00am, head to Baixa | `LISBON_DATA.fri` |
| Jun 30 | **Lisbon → Dublin** | Leave base 3:30–3:45am · 6:00am flight LIS→DUB | `LISBON_DATA` quickFacts; `TODO(you)`: flight # |
| Jun 30 | **Dublin Airport → Kilkea Castle** | Drive ~1h15m; M50 eFlow toll note | per original plan; `TODO(you)`: rental car pickup + route confirm |
| Jul 2 | **Kilkea → Dublin Heuston** | Morning checkout + drive (~1h) to make 1:02pm train | derived; `TODO(you)`: departure time from castle |
| Jul 2 | Heuston → Galway (train) | 1:02pm → 3:50pm, 2h48m | `GALWAY_DATA.meta.outbound` |
| Jul 3 | Galway → Dublin (train) | 3:05pm → 5:44pm, 2h39m · Heuston · taxi to Marlin | `GALWAY_DATA.meta.return` |
| Jul 5 | **Dublin → London** | Taxi to DUB, flight to Heathrow, Piccadilly Line → Russell Square | `DUBLIN_DATA.sun` + `TRIP_DATA.sun`; `TODO(you)`: flight # |
| Jul 9 | London → US | Departure | `TODO(you)`: flight # + time |

---

## `TODO(you)` — private facts to supply

Only you have these; the schedule stays placeholder-accurate until they're filled:

- [ ] **Jun 24:** Is anyone in Lisbon on the 24th, or is it pure transit? (resolves the start-date ambiguity)
- [ ] **Flights:** LIS→DUB (Jun 30 6:00am), DUB→London (Jul 5), London→US (Jul 9) — airline, exact time, booking ref each
- [ ] **US→Lisbon** arrival flights for Logan+Emily (Jun 25) and Ashley+Max (Jun 26) — optional, for completeness
- [ ] **Kilkea wedding:** ceremony time, dress code, grounds/venue map (Jul 1)
- [ ] **Kilkea logistics:** rental car pickup details + confirmed Dublin Airport→Kilkea route/time; castle departure time Jul 2 morning
- [ ] **Galway lodging:** hotel name + address + phone (absent from data)
- [ ] **Booking refs:** Irish Rail (Jul 2 & Jul 3 trains), Lally Cliffs tour, Guinness Storehouse 12pm (Jul 4)
- [ ] **Lodging phones:** Lisbon Airbnb host, Kilkea Castle, Marlin Dublin, Kimpton Fitzroy
- [ ] **Address verify:** Kilkea Castle full address, Kimpton Fitzroy full street address
- [ ] **Wimbledon (Jul 6):** Queue vs purchased tickets, hotel departure time
- [ ] **Wednesday path (Jul 8):** lock Path A / B / C so it can move from "open decision" to "locked"

---

*This doc is read-only input for `shared/schedule.js`; it intentionally touches none of the files Codex is building.*
