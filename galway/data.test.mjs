import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
globalThis.GALWAY_DATA = undefined;
await import('./data.js');

const DATA = globalThis.GALWAY_DATA;

test('uses the realistic Lally return anchor in Galway timing', () => {
  const friday = DATA.days.find((day) => day.id === 'fri');

  assert.equal(DATA.tour.duration, '5.25 hours');
  assert.match(DATA.tour.note, /1:30pm/);
  assert.ok(friday.timeline.some(([time, text]) => time.includes('~1:30pm') && text.includes('return')));
  assert.ok(friday.timeline.some(([time]) => time.includes('2:30pm')));
});

test('includes researched Galway dinner, pub, lunch, warning, and booking sections', () => {
  assert.ok(DATA.quickFacts.length >= 7);
  assert.ok(DATA.paths.length >= 4);
  assert.ok(DATA.restaurants.some((item) => item.id === 'cava-bodega'));
  assert.ok(DATA.restaurants.some((item) => item.id === 'ard-bia-nimmos'));
  assert.ok(DATA.bars.some((item) => item[0] === 'tig-coili'));
  assert.ok(DATA.lunch.some((item) => item[0] === 'merchant-bar'));
  assert.ok(DATA.activities.some((item) => item.id === 'latin-quarter-walk'));
  assert.ok(DATA.warnings.some((item) => item[0] === 'ambitious-friday-lunch'));
  assert.ok(DATA.bookingTimeline.some((item) => item[1] === 'Fast lunch + station buffer'));
});

