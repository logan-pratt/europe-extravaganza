import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.GALWAY_NOTES = undefined;
await import('./notes-logic.js');

const NOTES = globalThis.GALWAY_NOTES;

test('supports notes and reactions for all four Galway travelers', () => {
  let state = NOTES.createEmptyNotesState();
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Logan', { reaction: 'love', note: 'Main event.' });
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Emily', { reaction: 'maybe' });
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Ashley', { note: 'Bring layers.' });
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Max', { reaction: 'concern' });

  assert.equal(NOTES.countOptionFeedback(state, 'tour:cliffs-half-day'), 4);
  assert.equal(NOTES.getFeedbackSummary(state).length, 1);
});

test('exports readable Galway notes and missing suggestions', () => {
  let state = NOTES.createEmptyNotesState();
  state = NOTES.saveOptionFeedback(state, 'logistics:return-rail', 'Logan', { reaction: 'love', note: 'Protect this train.' });
  state = NOTES.addSuggestion(state, {
    id: 'suggestion:pub',
    author: 'Emily',
    category: 'Pub',
    title: 'Add one Galway pub',
    note: 'For Thursday night.',
    url: 'https://example.com'
  });

  const text = NOTES.exportFeedbackText(state, { 'logistics:return-rail': 'Galway to Dublin train' });

  assert.match(text, /Galway notes/);
  assert.match(text, /Galway to Dublin train/);
  assert.match(text, /Logan: Love - Protect this train\./);
  assert.match(text, /Emily · Pub: Add one Galway pub - For Thursday night\. \(https:\/\/example\.com\)/);
});

test('exports, parses, and merges Galway share packets', () => {
  let local = NOTES.createEmptyNotesState();
  local = NOTES.saveOptionFeedback(local, 'day:thu', 'Logan', { reaction: 'maybe' });

  let incoming = NOTES.createEmptyNotesState();
  incoming = NOTES.saveOptionFeedback(incoming, 'day:thu', 'Emily', { reaction: 'love', note: 'Good arrival shape.' });
  incoming = NOTES.addSuggestion(incoming, {
    id: 'suggestion:lunch',
    author: 'Ashley',
    category: 'Restaurant',
    title: 'Fast Friday lunch',
    note: 'Needs to fit before the 3:05pm train.'
  });

  const parsed = NOTES.parseSharePacket(NOTES.exportSharePacket(incoming));
  const merged = NOTES.mergeNotesStates(local, parsed);

  assert.equal(merged.items['day:thu'].Logan.reaction, 'maybe');
  assert.equal(merged.items['day:thu'].Emily.reaction, 'love');
  assert.equal(merged.suggestions[0].title, 'Fast Friday lunch');
});

test('builds Galway final cut and toggles passport stamps', () => {
  let state = NOTES.createEmptyNotesState();
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Logan', { reaction: 'love' });
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Emily', { reaction: 'love' });
  state = NOTES.saveOptionFeedback(state, 'tour:cliffs-half-day', 'Ashley', { reaction: 'love' });
  state = NOTES.saveOptionFeedback(state, 'idea:pubs', 'Max', { reaction: 'concern' });

  const finalCut = NOTES.buildFinalCut(state, {
    'tour:cliffs-half-day': 'Cliffs tour',
    'idea:pubs': 'Pubs to research'
  });

  assert.deepEqual(finalCut.mustDo.map((item) => item.label), ['Cliffs tour']);
  assert.deepEqual(finalCut.maybe.map((item) => item.label), ['Pubs to research']);
  assert.deepEqual(NOTES.toggleStamp({}, 'cliffs'), { cliffs: true });
});
