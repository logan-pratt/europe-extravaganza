# Lisbon Food Tour Booking Design

**Date:** 2026-05-30  
**Scope:** Update the Lisbon planner around the confirmed Friday food tour booking.

## Confirmed Booking

Logan, Emily, Ashley, and Max are booked for **Oh! My Cod: 17 Tastings Lisbon Food Tour** on Friday, June 26, 2026 from **5:00-9:00pm**.

- Meet by **4:50pm** under the Rua Augusta Arch.
- Address: R. Augusta 2, Lisboa, 1100-053.
- Landmark: in front of Praça do Comércio, also called Terreiro do Paço.
- Public transport note: Terreiro do Paço metro station is about a five-minute walk away. Tram 28 is also about a five-minute walk away, but it remains a nearby reference rather than a required itinerary item.
- Tour site: https://www.ohmycodtours.com/food-tours/lisbon-food-tour/
- Tour shape: four hours, 17 food and drink tastings, four stops, and walking through Baixa, Mouraria, and Alfama.

## Approved Approach

Use an integrated booking anchor. Add one compact confirmed-booking card near the Lisbon quick facts and update the existing schedule around it. Do not add a larger reservations board yet.

The tour card is informational, not a new group decision. It should not expose reactions or notes controls.

## Itinerary Changes

### Friday, June 26

Make Friday a light arrival and food-tour day:

1. Ashley and Max arrive around 10:00am and regroup near Rua da Madalena.
2. Keep daytime easy: bag drop, coffee or nata, a relaxed Baixa wander, and a small lunch only.
3. Leave room for an Airbnb reset.
4. Walk to Rua Augusta Arch and arrive by 4:50pm.
5. Take the food tour from 5:00-9:00pm.
6. Afterward, allow one optional drink only if energy holds. Do not plan a formal dinner.

### Saturday, June 27

Keep Belém and the waterfront plan. Make the fancy Saturday dinner the highlighted open food decision. The restaurant is not yet chosen.

### Sunday, June 28

Keep the edited Sintra and Cascais day unchanged.

### Monday, June 29

Move the separate Alfama viewpoint walk to Monday morning or midday:

- Sé Cathedral
- Santa Luzia
- Portas do Sol
- Alfama lanes

Preserve Monday's souvenir stop, nata stop, packing discipline, early dinner, and early return home before the 6:00am Tuesday flight.

## Planner Surfaces

Update the Lisbon planner consistently:

- Add a compact confirmed-tour section directly below quick facts.
- Change Friday's film chapter to `Reunion + Food Tour`.
- Change Monday's film chapter to include `Alfama viewpoints`.
- Add the booked tour as an `Add / Confirmed` activity with site and map links.
- Add `Rua Augusta Arch` to the Lisbon constellation map.
- Add a food-tour passport stamp.
- Add a tour-day logistics item to the booking timeline: light lunch, comfortable shoes, water, and arrival ten minutes early.
- Add a Saturday fancy-dinner open-decision item to the booking timeline.
- Update Friday and Monday route cards so the walking flows match the new schedule.
- Update the copied Lisbon summary.
- Update the Lisbon mini calendar so Friday reads as the booked food-tour day and Saturday retains the fancy-dinner slot.

## Existing Behavior

Keep the planner static and GitHub Pages-compatible. Preserve existing notes, reactions, Supabase sync, final-cut behavior, presentation mode, and mobile behavior.

## Verification

- Run `node --check lisbon/app.js`.
- Run `node --check lisbon/data.js`.
- Run `node --test lisbon/notes-logic.test.mjs`.
- Smoke-test `/lisbon/` in the browser at desktop and mobile widths.
- Confirm the compact booking card, Friday itinerary, Monday itinerary, map pin, activity card, booking timeline, passport stamp, and copied summary all agree.
