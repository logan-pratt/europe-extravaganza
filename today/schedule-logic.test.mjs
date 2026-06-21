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
  getNowLine,
  getOpenSlots,
  getSuggestionPool,
  getWalkLeg,
  isConfirmedPlan,
  getConfirmedAnchors
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

test('getWalkLeg returns null when current anchor is a travel type', () => {
  const prev = { type: 'sightseeing', title: 'View' };
  const flight = { type: 'flight', title: 'LIS → DUB', walkMinutes: 10, walkMeters: 800 };
  const train = { type: 'train', title: 'To Galway', walkMinutes: 5, walkMeters: 400 };
  const transfer = { type: 'transfer', title: 'Walk to arch', walkMinutes: 6, walkMeters: 500 };
  assert.equal(getWalkLeg(prev, flight), null);
  assert.equal(getWalkLeg(prev, train), null);
  assert.equal(getWalkLeg(prev, transfer), null);
});

test('confirmed-only helpers keep confirmed plans and booking-backed reservations', () => {
  const entry = {
    anchors: [
      { time: '9:00am', sortTime: '09:00', title: 'Confirmed flight', status: 'confirmed' },
      { time: '1:00pm', sortTime: '13:00', title: 'Booked lunch', status: 'planned', booking: { confirmation: 'L-2' } },
      { time: '4:00pm', sortTime: '16:00', title: 'Loose walk', status: 'planned' },
      { time: '8:00pm', sortTime: '20:00', title: 'Dinner maybe', status: 'tbd', critical: true }
    ]
  };

  assert.equal(isConfirmedPlan(entry.anchors[0]), true);
  assert.equal(isConfirmedPlan(entry.anchors[1]), true);
  assert.equal(isConfirmedPlan(entry.anchors[2]), false);
  assert.equal(isConfirmedPlan(entry.anchors[3]), false);
  assert.deepEqual(getConfirmedAnchors(entry).map((anchor) => anchor.title), [
    'Confirmed flight',
    'Booked lunch'
  ]);
});
