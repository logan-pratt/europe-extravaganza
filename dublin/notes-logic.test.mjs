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

test('supports notes and reactions for all four Dublin travelers', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:mister-s', 'Logan', { reaction: 'love', note: 'First-night heat.' });
  state = saveOptionFeedback(state, 'restaurant:mister-s', 'Emily', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:mister-s', 'Ashley', { reaction: 'maybe', note: 'Depends on timing.' });
  state = saveOptionFeedback(state, 'restaurant:mister-s', 'Max', { reaction: 'concern', note: 'Late train buffer?' });

  assert.deepEqual(NOTE_AUTHORS, ['Logan', 'Emily', 'Ashley', 'Max']);
  assert.equal(countOptionFeedback(state, 'restaurant:mister-s'), 4);
  assert.equal(state.items['restaurant:mister-s'].Max.note, 'Late train buffer?');
});

test('summarizes only Dublin options with feedback', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'path:pints-pages', 'Ashley', {
    reaction: 'love',
    note: ''
  });

  assert.deepEqual(getFeedbackSummary(state), [
    {
      optionId: 'path:pints-pages',
      Logan: { reaction: '', note: '' },
      Emily: { reaction: '', note: '' },
      Ashley: { reaction: 'love', note: '' },
      Max: { reaction: '', note: '' }
    }
  ]);
});

test('exports readable Dublin notes and missing suggestions', () => {
  let state = saveOptionFeedback(createEmptyNotesState(), 'pub:cobblestone', 'Max', {
    reaction: 'love',
    note: 'This is the memory.'
  });
  state = addSuggestion(state, {
    id: 'suggestion:tea',
    author: 'Emily',
    category: 'Cafe',
    title: 'Final coffee',
    note: 'Find something near Marlin before the airport.',
    url: 'https://example.com/coffee'
  });

  assert.equal(
    exportFeedbackText(state, { 'pub:cobblestone': 'The Cobblestone' }),
    'Dublin notes\n\nThe Cobblestone\n- Max: Love - This is the memory.\n\nMissing suggestions\n- Emily · Cafe: Final coffee - Find something near Marlin before the airport. (https://example.com/coffee)'
  );
});

test('exports, parses, and merges Dublin share packets', () => {
  const local = saveOptionFeedback(createEmptyNotesState(), 'activity:marshs-library', 'Logan', {
    reaction: 'love',
    note: 'Bookish and compact.'
  });
  let incoming = saveOptionFeedback(createEmptyNotesState(), 'activity:marshs-library', 'Ashley', {
    reaction: 'maybe',
    note: 'Rain plan yes.'
  });
  incoming = addSuggestion(incoming, {
    id: 'suggestion:bonobo',
    author: 'Max',
    category: 'Pub',
    title: 'Bonobo',
    note: 'Maybe after Cobblestone.',
    url: ''
  });

  const packet = exportSharePacket(incoming);
  const merged = mergeNotesStates(local, parseSharePacket(packet));

  assert.equal(packet.startsWith('DUBLIN_TRIP_NOTES_V1'), true);
  assert.equal(merged.items['activity:marshs-library'].Logan.reaction, 'love');
  assert.equal(merged.items['activity:marshs-library'].Ashley.note, 'Rain plan yes.');
  assert.equal(merged.suggestions[0].title, 'Bonobo');
});

test('analyzes four-person decision buckets', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:delahunt', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:delahunt', 'Emily', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:delahunt', 'Ashley', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:delahunt', 'Max', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'event:take-that', 'Logan', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'event:take-that', 'Emily', { reaction: 'concern', note: '' });
  state = saveOptionFeedback(state, 'pub:cobblestone', 'Max', { reaction: 'love', note: '' });

  const analysis = analyzeGroupDecisions(state, {
    'restaurant:delahunt': 'Delahunt',
    'event:take-that': 'Take That',
    'pub:cobblestone': 'The Cobblestone'
  });

  assert.deepEqual(analysis.allLove.map((item) => item.label), ['Delahunt']);
  assert.deepEqual(analysis.maxLoves.map((item) => item.label), ['The Cobblestone']);
  assert.deepEqual(analysis.conflictConcern.map((item) => item.label), ['Take That']);
  assert.deepEqual(analysis.easyYes.map((item) => item.label), ['Delahunt']);
});

test('builds final cut for all-love, mixed, concern, and cut scenarios', () => {
  let state = createEmptyNotesState();
  for (const author of NOTE_AUTHORS) {
    state = saveOptionFeedback(state, 'restaurant:mister-s', author, { reaction: 'love', note: '' });
  }
  state = saveOptionFeedback(state, 'activity:book-of-kells', 'Logan', { reaction: 'maybe', note: '' });
  state = saveOptionFeedback(state, 'activity:book-of-kells', 'Emily', { reaction: 'concern', note: '' });
  state = saveOptionFeedback(state, 'event:brenn', 'Ashley', { reaction: 'maybe', note: '' });
  state = saveOptionFeedback(state, 'warning:chester-beatty', 'Max', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'warning:chester-beatty', 'Emily', { reaction: 'nope', note: '' });

  const cut = buildFinalCut(state, {
    'restaurant:mister-s': 'Mister S',
    'activity:book-of-kells': 'Book of Kells',
    'event:brenn': 'Brenn!',
    'warning:chester-beatty': 'Chester Beatty'
  });

  assert.deepEqual(cut.mustDo.map((item) => item.label), ['Mister S']);
  assert.deepEqual(cut.discuss.map((item) => item.label), ['Book of Kells']);
  assert.deepEqual(cut.maybe.map((item) => item.label), ['Brenn!']);
  assert.deepEqual(cut.cut.map((item) => item.label), ['Chester Beatty']);
});

test('calculates Dublin countdown items and toggles passport stamps', () => {
  const items = getCountdownItems(new Date('2026-06-01T12:00:00-07:00'));
  const stamped = toggleStamp({}, 'mister-s');

  assert.equal(items.find((item) => item.id === 'trip').days, 32);
  assert.equal(items.find((item) => item.id === 'uno-mas').days, -28);
  assert.equal(items.find((item) => item.id === 'uno-mas').status, 'past');
  assert.equal(stamped['mister-s'], true);
  assert.equal(toggleStamp(stamped, 'mister-s')['mister-s'], false);
});
