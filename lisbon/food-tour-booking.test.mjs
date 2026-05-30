import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('./data.js', import.meta.url), 'utf8'), context);

const data = context.window.LISBON_DATA;
const friday = data.days.find((day) => day.id === 'fri');
const saturday = data.days.find((day) => day.id === 'sat');
const monday = data.days.find((day) => day.id === 'mon');

test('exposes the confirmed Friday food-tour anchor', () => {
  assert.equal(data.confirmedBooking.title, 'Oh! My Cod: 17 Tastings Lisbon Food Tour');
  assert.match(data.confirmedBooking.meet, /4:50pm/);
  assert.match(data.confirmedBooking.address, /R\. Augusta 2/);
  assert.match(data.confirmedBooking.siteUrl, /ohmycodtours\.com/);
});

test('rebalances the Lisbon itinerary around the booked food tour', () => {
  assert.match(friday.title, /Food Tour/);
  assert.match(friday.timeline.map((item) => item.join(' ')).join(' '), /5:00-9:00pm/);
  assert.doesNotMatch(friday.timeline.map((item) => item.join(' ')).join(' '), /Prado|Ofício|Taberna da Rua das Flores/);
  assert.match(saturday.timeline.map((item) => item.join(' ')).join(' '), /fancy dinner/i);
  assert.match(monday.timeline.map((item) => item.join(' ')).join(' '), /Santa Luzia/);
});

test('adds food-tour supporting surfaces', () => {
  assert.ok(data.activities.some((item) => item.id === 'oh-my-cod-food-tour' && item.verdict === 'Add / Confirmed'));
  assert.ok(data.routes.some((item) => item.id === 'friday-food-tour'));
  assert.ok(data.mapPins.some((item) => item[0] === 'rua-augusta-arch'));
  assert.ok(data.stamps.some((item) => item[0] === 'food-tour'));
  assert.ok(data.bookingTimeline.some((item) => item[1] === 'Tour-day logistics'));
  assert.ok(data.bookingTimeline.some((item) => item[1] === 'Saturday fancy dinner'));
});
