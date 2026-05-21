import test from 'node:test';
import assert from 'node:assert/strict';
import notesLogic from './notes-logic.js';

const {
  NOTE_AUTHORS,
  createEmptyNotesState,
  saveOptionFeedback,
  getFeedbackSummary,
  exportFeedbackText,
  addSuggestion,
  exportSharePacket,
  parseSharePacket,
  mergeNotesStates,
  analyzeGroupDecisions,
  buildFinalCut,
  getCountdownItems,
  toggleStamp,
  countOptionFeedback
} = notesLogic;

test('supports notes and reactions for all four Lisbon travelers', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:o-velho-eurico', 'Logan', { reaction: 'love', note: 'Top Lisbon personality.' });
  state = saveOptionFeedback(state, 'restaurant:o-velho-eurico', 'Emily', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:o-velho-eurico', 'Ashley', { reaction: 'maybe', note: 'Can we book it?' });
  state = saveOptionFeedback(state, 'restaurant:o-velho-eurico', 'Max', { reaction: 'concern', note: 'Closed Sunday/Monday.' });

  assert.deepEqual(NOTE_AUTHORS, ['Logan', 'Emily', 'Ashley', 'Max']);
  assert.equal(countOptionFeedback(state, 'restaurant:o-velho-eurico'), 4);
  assert.equal(state.items['restaurant:o-velho-eurico'].Max.note, 'Closed Sunday/Monday.');
});

test('summarizes only Lisbon options with feedback', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'path:big-adventure', 'Ashley', {
    reaction: 'love',
    note: ''
  });

  assert.deepEqual(getFeedbackSummary(state), [
    {
      optionId: 'path:big-adventure',
      Logan: { reaction: '', note: '' },
      Emily: { reaction: '', note: '' },
      Ashley: { reaction: 'love', note: '' },
      Max: { reaction: '', note: '' }
    }
  ]);
});

test('exports readable Lisbon notes and missing suggestions', () => {
  let state = saveOptionFeedback(createEmptyNotesState(), 'activity:regaleira', 'Max', {
    reaction: 'love',
    note: 'Anchor the Sintra day here.'
  });
  state = addSuggestion(state, {
    id: 'suggestion:miradouro',
    author: 'Emily',
    category: 'Viewpoint',
    title: 'Extra sunset view',
    note: 'Add if we have energy Monday.',
    url: 'https://example.com/view'
  });

  assert.equal(
    exportFeedbackText(state, { 'activity:regaleira': 'Quinta da Regaleira' }),
    'Lisbon notes\n\nQuinta da Regaleira\n- Max: Love - Anchor the Sintra day here.\n\nMissing suggestions\n- Emily · Viewpoint: Extra sunset view - Add if we have energy Monday. (https://example.com/view)'
  );
});

test('exports, parses, and merges Lisbon share packets', () => {
  const local = saveOptionFeedback(createEmptyNotesState(), 'restaurant:hifen', 'Logan', {
    reaction: 'love',
    note: 'Default Cascais dinner.'
  });
  let incoming = saveOptionFeedback(createEmptyNotesState(), 'restaurant:hifen', 'Ashley', {
    reaction: 'maybe',
    note: 'Only if we are not wrecked.'
  });
  incoming = addSuggestion(incoming, {
    id: 'suggestion:belem',
    author: 'Max',
    category: 'Bakery',
    title: 'Pastéis de Belém',
    note: 'Tradition stop if line is sane.',
    url: ''
  });

  const packet = exportSharePacket(incoming);
  const merged = mergeNotesStates(local, parseSharePacket(packet));

  assert.equal(packet.startsWith('LISBON_TRIP_NOTES_V1'), true);
  assert.equal(merged.items['restaurant:hifen'].Logan.reaction, 'love');
  assert.equal(merged.items['restaurant:hifen'].Ashley.note, 'Only if we are not wrecked.');
  assert.equal(merged.suggestions[0].title, 'Pastéis de Belém');
});

test('analyzes four-person decision buckets', () => {
  let state = createEmptyNotesState();
  for (const author of NOTE_AUTHORS) {
    state = saveOptionFeedback(state, 'activity:sintra', author, { reaction: 'love', note: '' });
  }
  state = saveOptionFeedback(state, 'warning:tram-28', 'Logan', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'warning:tram-28', 'Emily', { reaction: 'concern', note: '' });
  state = saveOptionFeedback(state, 'restaurant:ramiro', 'Max', { reaction: 'love', note: '' });

  const analysis = analyzeGroupDecisions(state, {
    'activity:sintra': 'Edited Sintra',
    'warning:tram-28': 'Tram 28 line',
    'restaurant:ramiro': 'Ramiro'
  });

  assert.deepEqual(analysis.allLove.map((item) => item.label), ['Edited Sintra']);
  assert.deepEqual(analysis.maxLoves.map((item) => item.label), ['Ramiro']);
  assert.deepEqual(analysis.conflictConcern.map((item) => item.label), ['Tram 28 line']);
});

test('builds final cut for Lisbon choices', () => {
  let state = createEmptyNotesState();
  for (const author of NOTE_AUTHORS) {
    state = saveOptionFeedback(state, 'restaurant:prado-wine-bar', author, { reaction: 'love', note: '' });
  }
  state = saveOptionFeedback(state, 'activity:pena', 'Logan', { reaction: 'maybe', note: '' });
  state = saveOptionFeedback(state, 'activity:pena', 'Emily', { reaction: 'concern', note: '' });
  state = saveOptionFeedback(state, 'event:rock-in-rio', 'Ashley', { reaction: 'maybe', note: '' });
  state = saveOptionFeedback(state, 'warning:pink-street', 'Max', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'warning:pink-street', 'Emily', { reaction: 'nope', note: '' });

  const cut = buildFinalCut(state, {
    'restaurant:prado-wine-bar': 'Prado Wine Bar',
    'activity:pena': 'Pena Palace',
    'event:rock-in-rio': 'Rock in Rio',
    'warning:pink-street': 'Pink Street'
  });

  assert.deepEqual(cut.mustDo.map((item) => item.label), ['Prado Wine Bar']);
  assert.deepEqual(cut.discuss.map((item) => item.label), ['Pena Palace']);
  assert.deepEqual(cut.maybe.map((item) => item.label), ['Rock in Rio']);
  assert.deepEqual(cut.cut.map((item) => item.label), ['Pink Street']);
});

test('calculates Lisbon countdown items and toggles stamps', () => {
  const items = getCountdownItems(new Date('2026-06-01T12:00:00-07:00'));
  const stamped = toggleStamp({}, 'regaleira');

  assert.equal(items.find((item) => item.id === 'trip').days, 24);
  assert.equal(items.find((item) => item.id === 'dinners').days, -7);
  assert.equal(items.find((item) => item.id === 'dinners').status, 'past');
  assert.equal(stamped.regaleira, true);
  assert.equal(toggleStamp(stamped, 'regaleira').regaleira, false);
});
