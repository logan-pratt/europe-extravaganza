import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.window = {};
await import('./schedule-logic.js');

const {
  getScheduleState,
  parseSortTime,
  sortAnchors,
  getCurrentAndNextAnchors,
  annotateAnchors,
  getOpenSlotOptions,
  rankReactionOptions,
  formatCountdown,
  getNextCountdown,
  getNowLine
} = globalThis.window.TODAY_LOGIC;

const sampleSchedule = [
  {
    date: '2026-06-27',
    city: 'lisbon',
    dayId: 'sat',
    label: 'Lisbon · Belem + Taberna',
    anchors: [
      { time: 'Dinner', sortTime: '18:30', title: 'Go to Taberna da Rua das Flores', status: 'confirmed', critical: true },
      { time: 'Lunch', sortTime: '13:00', title: 'Canalha or O Vinhaca', status: 'tentative' },
      { time: 'Morning', sortTime: '10:00', title: 'Belem sightseeing', status: 'tentative' }
    ],
    prep: ['Bring sunscreen.'],
    prepPreviousNight: ['Decide lunch direction before bed.']
  },
  {
    date: '2026-06-28',
    city: 'lisbon',
    dayId: 'sun',
    label: 'Sintra + Cascais',
    anchors: [
      { time: '10:00am', sortTime: '10:00', title: 'Pena Palace booking', status: 'confirmed', critical: true },
      { time: '12:30-1:30pm', sortTime: '12:30', title: 'Quinta da Regaleira booking', status: 'confirmed', critical: true },
      { time: '8:00pm', sortTime: '20:00', title: 'Furnas do Guincho reservation', status: 'confirmed', critical: true }
    ],
    prep: ['Use rideshare for the Sintra to Cascais leg.']
  },
  {
    date: '2026-06-30',
    city: 'kilkea',
    dayId: null,
    label: 'Lisbon to Kilkea',
    anchors: [
      { time: '6:00am', sortTime: '06:00', title: 'LIS to Dublin flight', status: 'confirmed', critical: true, leaveBy: '3:30am' }
    ],
    prepPreviousNight: ['Pack before dinner.', 'Confirm 3:30am airport move.']
  }
];

test('finds active schedule entry and neighboring trip days', () => {
  const state = getScheduleState(sampleSchedule, new Date('2026-06-28T09:15:00'));

  assert.equal(state.status, 'active');
  assert.equal(state.today.label, 'Sintra + Cascais');
  assert.equal(state.previous.label, 'Lisbon · Belem + Taberna');
  assert.equal(state.next.label, 'Lisbon to Kilkea');
});

test('reports pre-trip and post-trip states outside the schedule', () => {
  const preTrip = getScheduleState(sampleSchedule, new Date('2026-06-20T09:00:00'));
  const postTrip = getScheduleState(sampleSchedule, new Date('2026-07-10T09:00:00'));

  assert.equal(preTrip.status, 'pretrip');
  assert.equal(preTrip.next.label, 'Lisbon · Belem + Taberna');
  assert.equal(preTrip.daysUntilStart, 7);
  assert.equal(postTrip.status, 'posttrip');
  assert.equal(postTrip.previous.label, 'Lisbon to Kilkea');
});

test('parses structured times before falling back to labels', () => {
  assert.equal(parseSortTime({ sortTime: '20:00', time: 'Dinner' }), 1200);
  assert.equal(parseSortTime({ time: '12:30-1:30pm' }), 750);
  assert.equal(parseSortTime({ time: 'Morning' }), 540);
  assert.equal(parseSortTime({ time: 'After' }), 1320);
});

test('sorts anchors by explicit time and keeps unparseable entries stable', () => {
  const sorted = sortAnchors([
    { time: 'Later', title: 'Unparseable A' },
    { time: '8:00pm', title: 'Dinner' },
    { time: 'Morning', title: 'Walk' },
    { time: 'Later', title: 'Unparseable B' }
  ]);

  assert.deepEqual(sorted.map((anchor) => anchor.title), [
    'Walk',
    'Dinner',
    'Unparseable A',
    'Unparseable B'
  ]);
});

test('selects current and next anchors for the device clock', () => {
  const { current, next, remaining } = getCurrentAndNextAnchors(sampleSchedule[0], new Date('2026-06-27T14:15:00'));

  assert.equal(current.title, 'Canalha or O Vinhaca');
  assert.equal(next.title, 'Go to Taberna da Rua das Flores');
  assert.deepEqual(remaining.map((anchor) => anchor.title), ['Go to Taberna da Rua das Flores']);
});

test('annotates anchors as current and next for day-of scanning', () => {
  const annotated = annotateAnchors(sampleSchedule[0], new Date('2026-06-27T14:15:00'));

  assert.deepEqual(annotated.map(({ anchor, timing }) => [anchor.title, timing]), [
    ['Belem sightseeing', 'past'],
    ['Canalha or O Vinhaca', 'current'],
    ['Go to Taberna da Rua das Flores', 'next']
  ]);
});

test('surfaces tomorrow prep from the next scheduled day', () => {
  const state = getScheduleState(sampleSchedule, new Date('2026-06-29T20:00:00'));

  assert.equal(state.tomorrowPrep.length, 2);
  assert.equal(state.tomorrowPrep[0], 'Pack before dinner.');
});

test('shows open slots only when the schedule explicitly has open choices', () => {
  assert.deepEqual(getOpenSlotOptions(sampleSchedule[1]), []);

  const explicitOptions = getOpenSlotOptions({
    options: ['Bath day trip candidate', 'Central London wandering'],
    anchors: [{ title: 'Dinner booked', status: 'confirmed' }]
  });
  assert.deepEqual(explicitOptions, ['Bath day trip candidate', 'Central London wandering']);

  const tbdAnchors = getOpenSlotOptions({
    anchors: [
      { title: 'Booked dinner', status: 'confirmed' },
      { title: 'TBD final Lisbon day', status: 'tbd' }
    ]
  });
  assert.deepEqual(tbdAnchors, ['TBD final Lisbon day']);
});

test('ranks reacted options by positive minus negative feedback', () => {
  const ranked = rankReactionOptions([
    { card_id: 'restaurant:canalha', card_type: 'restaurant', author_name: 'Logan', reaction: 'love' },
    { card_id: 'restaurant:canalha', card_type: 'restaurant', author_name: 'Emily', reaction: 'maybe' },
    { card_id: 'restaurant:ramiro', card_type: 'restaurant', author_name: 'Ashley', reaction: 'nope' },
    { card_id: 'activity:belem-waterfront', card_type: 'activity', author_name: 'Max', reaction: 'concern' },
    { card_id: 'activity:belem-waterfront', card_type: 'activity', author_name: 'Emily', reaction: 'love' }
  ]);

  assert.deepEqual(ranked.map((item) => [item.id, item.score]), [
    ['restaurant:canalha', 3]
  ]);
  assert.equal(ranked[0].positiveReactions, 2);
});

test('formats human countdown labels', () => {
  assert.equal(formatCountdown(0), 'now');
  assert.equal(formatCountdown(-5), 'now');
  assert.equal(formatCountdown(25), 'in 25m');
  assert.equal(formatCountdown(70), 'in 1h 10m');
  assert.equal(formatCountdown(120), 'in 2h');
});

test('computes the next-anchor countdown for the device clock', () => {
  const result = getNextCountdown(sampleSchedule[1], new Date('2026-06-28T11:20:00'));
  assert.equal(result.anchor.title, 'Quinta da Regaleira booking');
  assert.equal(result.minutesUntil, 70);
  assert.equal(result.label, 'in 1h 10m');
  assert.equal(getNextCountdown(sampleSchedule[1], new Date('2026-06-28T23:00:00')), null);
});

test('positions the now-line relative to the day anchors', () => {
  const before = getNowLine(sampleSchedule[1], new Date('2026-06-28T08:00:00'));
  assert.equal(before.index, -1);
  assert.equal(before.fraction, 0);

  const between = getNowLine(sampleSchedule[1], new Date('2026-06-28T11:15:00'));
  assert.equal(between.index, 0);
  assert.equal(Math.round(between.fraction * 100), 50);

  const after = getNowLine(sampleSchedule[1], new Date('2026-06-28T21:00:00'));
  assert.equal(after.index, 2);
  assert.equal(after.fraction, 1);
});
