import test from 'node:test';
import assert from 'node:assert/strict';
import notesLogic from './notes-logic.js';

const {
  createEmptyNotesState,
  saveOptionFeedback,
  getFeedbackSummary,
  exportFeedbackText,
  analyzeCoupleDecisions,
  buildFinalCut,
  getCountdownItems,
  toggleStamp,
  countOptionFeedback,
  addSuggestion,
  buildSubmissionPacket,
  exportSharePacket,
  parseSharePacket,
  mergeNotesStates
} = notesLogic;

test('saves Logan and Emily notes with quick reactions for one option', () => {
  const state = createEmptyNotesState();
  const updated = saveOptionFeedback(state, 'restaurant:trullo', 'Logan', {
    reaction: 'love',
    note: 'This feels like the right friend dinner.'
  });
  const finalState = saveOptionFeedback(updated, 'restaurant:trullo', 'Emily', {
    reaction: 'maybe',
    note: 'Sounds good, but check travel time after Wimbledon.'
  });

  assert.equal(finalState.items['restaurant:trullo'].Logan.reaction, 'love');
  assert.equal(finalState.items['restaurant:trullo'].Emily.note, 'Sounds good, but check travel time after Wimbledon.');
});

test('summarizes only options with notes or reactions', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'path:B', 'Emily', {
    reaction: 'love',
    note: ''
  });

  assert.deepEqual(getFeedbackSummary(state), [
    {
      optionId: 'path:B',
      Logan: { reaction: '', note: '' },
      Emily: { reaction: 'love', note: '' }
    }
  ]);
});

test('exports readable text grouped by option and author', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'warning:path-c', 'Logan', {
    reaction: 'nope',
    note: 'Do not let us do this.'
  });

  assert.equal(
    exportFeedbackText(state, { 'warning:path-c': 'Path C' }),
    'London Love Letter notes\n\nPath C\n- Logan: Nope — Do not let us do this.'
  );
});

test('analyzes couple decisions from Logan and Emily reactions', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Emily', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'path:c', 'Logan', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'path:c', 'Emily', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'wildcard:xoyo', 'Emily', { reaction: 'concern', note: '' });

  const analysis = analyzeCoupleDecisions(state, {
    'restaurant:trullo': 'Trullo',
    'path:c': 'Path C',
    'wildcard:xoyo': 'XOYO'
  });

  assert.deepEqual(analysis.bothLove.map((item) => item.label), ['Trullo']);
  assert.deepEqual(analysis.potentialConflict.map((item) => item.label), ['Path C']);
  assert.deepEqual(analysis.logisticsConcern.map((item) => item.label), ['XOYO']);
});

test('builds a final cut from reaction categories', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'upgrade:bath-spa', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'upgrade:bath-spa', 'Emily', { reaction: 'maybe', note: '' });
  state = saveOptionFeedback(state, 'warning:path-c', 'Logan', { reaction: 'nope', note: '' });
  state = saveOptionFeedback(state, 'warning:path-c', 'Emily', { reaction: 'concern', note: '' });

  const finalCut = buildFinalCut(state, {
    'upgrade:bath-spa': 'Bath spa date',
    'warning:path-c': 'Path C'
  });

  assert.deepEqual(finalCut.mustDo.map((item) => item.label), ['Bath spa date']);
  assert.deepEqual(finalCut.cut.map((item) => item.label), ['Path C']);
});

test('calculates countdown items from a supplied date', () => {
  const items = getCountdownItems(new Date('2026-06-01T12:00:00-07:00'));

  assert.equal(items.find((item) => item.id === 'trip').days, 34);
  assert.equal(items.find((item) => item.id === 'andrew-edmunds').days, 5);
});

test('toggles passport stamps without mutating previous state', () => {
  const first = toggleStamp({}, 'bath');
  const second = toggleStamp(first, 'bath');

  assert.equal(first.bath, true);
  assert.equal(second.bath, false);
});

test('counts authors with notes or reactions for a single option', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Emily', { reaction: '', note: 'Timing?' });

  assert.equal(countOptionFeedback(state, 'restaurant:trullo'), 2);
  assert.equal(countOptionFeedback(state, 'restaurant:harrison'), 0);
});

test('adds missing-plan suggestions and includes them in readable export', () => {
  const state = addSuggestion(createEmptyNotesState(), {
    id: 'suggestion:1',
    author: 'Emily',
    category: 'Activity',
    title: 'Afternoon tea',
    note: 'Could be cute if there is a rainy gap.',
    url: 'https://example.com/tea'
  });

  assert.equal(state.suggestions.length, 1);
  assert.equal(
    exportFeedbackText(state),
    'London Love Letter notes\n\nMissing suggestions\n- Emily · Activity: Afternoon tea — Could be cute if there is a rainy gap. (https://example.com/tea)'
  );
});

test('exports and parses a portable share packet', () => {
  const state = addSuggestion(createEmptyNotesState(), {
    id: 'suggestion:tea',
    author: 'Emily',
    category: 'Restaurant',
    title: 'Sketch',
    note: 'Maybe too extra, but look it up.',
    url: ''
  });

  const packet = exportSharePacket(state);
  const parsed = parseSharePacket(packet);

  assert.equal(packet.startsWith('LONDON_LOVE_LETTER_NOTES_V1'), true);
  assert.equal(parsed.suggestions[0].title, 'Sketch');
});

test('merges imported notes and suggestions without dropping local notes', () => {
  const local = saveOptionFeedback(createEmptyNotesState(), 'restaurant:trullo', 'Logan', {
    reaction: 'love',
    note: 'I like this one.'
  });
  let incoming = saveOptionFeedback(createEmptyNotesState(), 'restaurant:trullo', 'Emily', {
    reaction: 'maybe',
    note: 'Need to check travel.'
  });
  incoming = addSuggestion(incoming, {
    id: 'suggestion:kew',
    author: 'Emily',
    category: 'Activity',
    title: 'Kew Gardens',
    note: 'Maybe if weather is perfect.',
    url: ''
  });

  const merged = mergeNotesStates(local, incoming);

  assert.equal(merged.items['restaurant:trullo'].Logan.reaction, 'love');
  assert.equal(merged.items['restaurant:trullo'].Emily.note, 'Need to check travel.');
  assert.equal(merged.suggestions.length, 1);
});

test('buildSubmissionPacket returns a plain object with version, exportedAt, and state', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'restaurant:trullo', 'Logan', {
    reaction: 'love',
    note: 'This one.'
  });

  const packet = buildSubmissionPacket(state);

  assert.equal(typeof packet, 'object');
  assert.equal(packet.version, 1);
  assert.equal(typeof packet.exportedAt, 'string');
  assert.deepEqual(packet.state, state);
});

test('exportSharePacket text contains the same data as buildSubmissionPacket', () => {
  const state = saveOptionFeedback(createEmptyNotesState(), 'restaurant:trullo', 'Logan', {
    reaction: 'love',
    note: ''
  });

  const packet = buildSubmissionPacket(state);
  const text = exportSharePacket(state);

  assert.ok(text.startsWith('LONDON_LOVE_LETTER_NOTES_V1'));
  const parsed = JSON.parse(text.replace(/^LONDON_LOVE_LETTER_NOTES_V1\s*/, ''));
  assert.deepEqual(parsed.state, packet.state);
});

test('getReactionSummary groups authors by reaction type for a card', () => {
  let state = createEmptyNotesState();
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Logan', { reaction: 'love', note: '' });
  state = saveOptionFeedback(state, 'restaurant:trullo', 'Emily', { reaction: 'maybe', note: '' });

  const summary = notesLogic.getReactionSummary(state, 'restaurant:trullo');

  assert.deepEqual(summary.love, ['Logan']);
  assert.deepEqual(summary.maybe, ['Emily']);
  assert.deepEqual(summary.nope, []);
  assert.deepEqual(summary.concern, []);
});

test('getReactionSummary returns empty arrays when no reactions exist', () => {
  const summary = notesLogic.getReactionSummary(createEmptyNotesState(), 'restaurant:trullo');

  assert.deepEqual(summary.love, []);
  assert.deepEqual(summary.maybe, []);
  assert.deepEqual(summary.nope, []);
  assert.deepEqual(summary.concern, []);
});

test('cardTypeFromId maps id prefixes to card type strings', () => {
  assert.equal(notesLogic.cardTypeFromId('day:sun'), 'activity');
  assert.equal(notesLogic.cardTypeFromId('path:B'), 'decision');
  assert.equal(notesLogic.cardTypeFromId('restaurant:trullo'), 'restaurant');
  assert.equal(notesLogic.cardTypeFromId('bar:the-lamb'), 'bar');
  assert.equal(notesLogic.cardTypeFromId('upgrade:bath-spa'), 'experience');
  assert.equal(notesLogic.cardTypeFromId('booking:clos-maggiore'), 'logistics');
  assert.equal(notesLogic.cardTypeFromId('unknown:foo'), 'activity');
});
