import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.window = {};
await import('./trip-metrics.js');

const { getTripHubStatus } = globalThis.window.TRIP_METRICS;

test('counts known decision cards as open even when Supabase has no rows yet', () => {
  const status = getTripHubStatus({
    tripSlug: 'dublin',
    tripData: {
      paths: [
        { id: 'pints-pages' },
        { id: 'foodie-romantic' },
        { id: 'pub-trad-social' }
      ]
    },
    reactions: []
  });

  assert.equal(status.reactionCount, 0);
  assert.equal(status.openDecisionCount, 3);
});

test('keeps a decision open until at least two people leave feedback', () => {
  const status = getTripHubStatus({
    tripSlug: 'london',
    tripData: { paths: { A: {}, B: {} } },
    reactions: [
      { card_id: 'path:A', card_type: 'decision', author_name: 'Logan', reaction: 'love', note: '' },
      { card_id: 'path:B', card_type: 'decision', author_name: 'Logan', reaction: '', note: 'Still debating' },
      { card_id: 'path:B', card_type: 'decision', author_name: 'Emily', reaction: 'maybe', note: '' }
    ]
  });

  assert.equal(status.reactionCount, 2);
  assert.equal(status.openDecisionCount, 1);
});

