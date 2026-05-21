(function initTripMetrics(root) {
  function hasFeedback(row) {
    return Boolean(row?.reaction || row?.note?.trim());
  }

  function pathDecisionIds(tripData) {
    const paths = tripData?.paths;
    if (!paths) return [];
    if (Array.isArray(paths)) return paths.map((path) => `path:${path.id}`).filter((id) => id !== 'path:undefined');
    return Object.keys(paths).map((id) => `path:${id}`);
  }

  function uniqueDecisionIds(tripData, reactions) {
    const ids = new Set(pathDecisionIds(tripData));
    reactions
      .filter((row) => row.card_type === 'decision')
      .forEach((row) => ids.add(row.card_id));
    return [...ids];
  }

  function getTripHubStatus({ tripData, reactions = [] }) {
    const feedbackCounts = new Map();
    reactions.forEach((row) => {
      if (!hasFeedback(row)) return;
      const key = row.card_id;
      if (!feedbackCounts.has(key)) feedbackCounts.set(key, new Set());
      feedbackCounts.get(key).add(row.author_name || row.author_key || 'Someone');
    });

    const reactionCount = reactions.filter((row) => row.reaction).length;
    const openDecisionCount = uniqueDecisionIds(tripData, reactions)
      .filter((id) => (feedbackCounts.get(id)?.size || 0) < 2)
      .length;

    return { reactionCount, openDecisionCount };
  }

  root.TRIP_METRICS = { getTripHubStatus };
})(typeof window !== 'undefined' ? window : globalThis.window);

