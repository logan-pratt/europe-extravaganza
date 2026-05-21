(function initLisbonNotesLogic(root) {
  const NOTE_AUTHORS = ['Logan', 'Emily', 'Ashley', 'Max'];
  const NOTE_REACTIONS = [
    ['love', 'Love'],
    ['maybe', 'Maybe'],
    ['nope', 'Nope'],
    ['concern', 'Concern']
  ];

  function createEmptyNotesState() {
    return { items: {}, suggestions: [] };
  }

  function normalizeNotesState(state) {
    if (!state || typeof state !== 'object' || !state.items || typeof state.items !== 'object') {
      return createEmptyNotesState();
    }
    return {
      items: state.items,
      suggestions: Array.isArray(state.suggestions) ? state.suggestions : []
    };
  }

  function saveOptionFeedback(state, optionId, author, feedback) {
    const safeState = normalizeNotesState(state);
    if (!NOTE_AUTHORS.includes(author)) return safeState;
    const previousOption = safeState.items[optionId] || {};
    const previousAuthor = previousOption[author] || {};
    return {
      ...safeState,
      items: {
        ...safeState.items,
        [optionId]: {
          ...previousOption,
          [author]: {
            reaction: feedback.reaction ?? previousAuthor.reaction ?? '',
            note: feedback.note ?? previousAuthor.note ?? ''
          }
        }
      }
    };
  }

  function hasFeedback(feedback) {
    return Boolean(feedback?.reaction || feedback?.note?.trim());
  }

  function emptyAuthorFeedback() {
    return { reaction: '', note: '' };
  }

  function getFeedbackSummary(state) {
    const safeState = normalizeNotesState(state);
    return Object.entries(safeState.items)
      .map(([optionId, feedback]) => ({
        optionId,
        ...Object.fromEntries(NOTE_AUTHORS.map((author) => [author, feedback[author] || emptyAuthorFeedback()]))
      }))
      .filter((item) => NOTE_AUTHORS.some((author) => hasFeedback(item[author])));
  }

  function countOptionFeedback(state, optionId) {
    const feedback = normalizeNotesState(state).items[optionId] || {};
    return NOTE_AUTHORS.filter((author) => hasFeedback(feedback[author])).length;
  }

  function formatReaction(reaction) {
    const found = NOTE_REACTIONS.find(([value]) => value === reaction);
    return found ? found[1] : '';
  }

  function exportFeedbackText(state, labels = {}) {
    const safeState = normalizeNotesState(state);
    const sections = getFeedbackSummary(safeState).map((item) => {
      const lines = NOTE_AUTHORS
        .map((author) => {
          const feedback = item[author];
          if (!hasFeedback(feedback)) return '';
          const reaction = formatReaction(feedback.reaction);
          const note = feedback.note?.trim();
          const separator = reaction && note ? ' - ' : '';
          return `- ${author}: ${reaction}${separator}${note}`;
        })
        .filter(Boolean);
      return `${labels[item.optionId] || item.optionId}\n${lines.join('\n')}`;
    });

    if (safeState.suggestions.length) {
      sections.push(`Missing suggestions\n${safeState.suggestions.map((suggestion) => {
        const url = suggestion.url ? ` (${suggestion.url})` : '';
        return `- ${suggestion.author} · ${suggestion.category}: ${suggestion.title} - ${suggestion.note}${url}`;
      }).join('\n')}`);
    }

    return ['Lisbon notes', ...sections].join('\n\n');
  }

  function addSuggestion(state, suggestion) {
    const safeState = normalizeNotesState(state);
    const cleanSuggestion = {
      id: suggestion.id,
      author: NOTE_AUTHORS.includes(suggestion.author) ? suggestion.author : 'Logan',
      category: suggestion.category || 'Idea',
      title: suggestion.title || '',
      note: suggestion.note || '',
      url: suggestion.url || ''
    };
    if (!cleanSuggestion.id || !cleanSuggestion.title.trim()) return safeState;
    const suggestions = safeState.suggestions.filter((item) => item.id !== cleanSuggestion.id);
    return { ...safeState, suggestions: [...suggestions, cleanSuggestion] };
  }

  function buildSubmissionPacket(state) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      state: normalizeNotesState(state)
    };
  }

  function exportSharePacket(state) {
    return `LISBON_TRIP_NOTES_V1\n${JSON.stringify(buildSubmissionPacket(state), null, 2)}`;
  }

  function parseSharePacket(text) {
    const raw = String(text || '').trim();
    const json = raw.startsWith('LISBON_TRIP_NOTES_V1')
      ? raw.replace(/^LISBON_TRIP_NOTES_V1\s*/, '')
      : raw;
    const parsed = JSON.parse(json);
    return normalizeNotesState(parsed.state || parsed);
  }

  function mergeNotesStates(currentState, incomingState) {
    const current = normalizeNotesState(currentState);
    const incoming = normalizeNotesState(incomingState);
    const suggestionsById = new Map();
    current.suggestions.forEach((suggestion) => suggestionsById.set(suggestion.id, suggestion));
    incoming.suggestions.forEach((suggestion) => suggestionsById.set(suggestion.id, suggestion));
    return {
      items: {
        ...current.items,
        ...Object.fromEntries(Object.entries(incoming.items).map(([optionId, feedback]) => [
          optionId,
          { ...(current.items[optionId] || {}), ...feedback }
        ]))
      },
      suggestions: [...suggestionsById.values()]
    };
  }

  function itemWithLabel(item, labels) {
    return { ...item, label: labels[item.optionId] || item.optionId };
  }

  function reactionsFor(item) {
    return NOTE_AUTHORS.map((author) => item[author]?.reaction || '').filter(Boolean);
  }

  function analyzeGroupDecisions(state, labels = {}) {
    const buckets = {
      allLove: [],
      loganLoves: [],
      emilyLoves: [],
      ashleyLoves: [],
      maxLoves: [],
      conflictConcern: [],
      easyYes: []
    };

    getFeedbackSummary(state).map((item) => itemWithLabel(item, labels)).forEach((item) => {
      const reactions = reactionsFor(item);
      const loves = reactions.filter((reaction) => reaction === 'love').length;
      const hasNope = reactions.includes('nope');
      const hasConcern = reactions.includes('concern');

      if (loves === NOTE_AUTHORS.length) buckets.allLove.push(item);
      if (item.Logan?.reaction === 'love' && loves < NOTE_AUTHORS.length) buckets.loganLoves.push(item);
      if (item.Emily?.reaction === 'love' && loves < NOTE_AUTHORS.length) buckets.emilyLoves.push(item);
      if (item.Ashley?.reaction === 'love' && loves < NOTE_AUTHORS.length) buckets.ashleyLoves.push(item);
      if (item.Max?.reaction === 'love' && loves < NOTE_AUTHORS.length) buckets.maxLoves.push(item);
      if (hasNope || hasConcern) buckets.conflictConcern.push(item);
      if (loves >= 3 && !hasNope && !hasConcern) buckets.easyYes.push(item);
    });

    return buckets;
  }

  function buildFinalCut(state, labels = {}) {
    const finalCut = { mustDo: [], maybe: [], cut: [], discuss: [] };
    getFeedbackSummary(state).map((item) => itemWithLabel(item, labels)).forEach((item) => {
      const reactions = reactionsFor(item);
      const loves = reactions.filter((reaction) => reaction === 'love').length;
      const maybes = reactions.filter((reaction) => reaction === 'maybe').length;
      const nopes = reactions.filter((reaction) => reaction === 'nope').length;
      const concerns = reactions.filter((reaction) => reaction === 'concern').length;

      if (nopes >= 2 || (nopes && loves === 0)) finalCut.cut.push(item);
      else if (loves >= 3 && !concerns) finalCut.mustDo.push(item);
      else if (concerns && (loves || maybes)) finalCut.discuss.push(item);
      else if (loves && (nopes || concerns)) finalCut.discuss.push(item);
      else if (loves || maybes || concerns) finalCut.maybe.push(item);
    });
    return finalCut;
  }

  function getCountdownItems(now = new Date()) {
    const dayMs = 24 * 60 * 60 * 1000;
    const items = [
      ['trip', 'Lisbon begins', '2026-06-25T00:00:00-07:00'],
      ['sintra', 'Book Sintra timed tickets', '2026-05-28T00:00:00-07:00'],
      ['dinners', 'Lock top Lisbon dinners', '2026-05-25T00:00:00-07:00'],
      ['cascais', 'Reserve Cascais dinner', '2026-05-28T00:00:00-07:00'],
      ['airport', 'Pre-book 3:30am airport transfer', '2026-06-28T00:00:00-07:00'],
      ['pack', 'Pack before final dinner', '2026-06-29T18:00:00-07:00']
    ];
    return items.map(([id, label, iso]) => {
      const days = Math.ceil((new Date(iso).getTime() - now.getTime()) / dayMs);
      return { id, label, date: iso, days, status: days < 0 ? 'past' : days === 0 ? 'today' : 'future' };
    });
  }

  function toggleStamp(state, stampId) {
    return { ...state, [stampId]: !state?.[stampId] };
  }

  function getReactionSummary(state, cardId) {
    const safeState = normalizeNotesState(state);
    const feedback = safeState.items[cardId] || {};
    const summary = {};
    NOTE_REACTIONS.forEach(([value]) => {
      summary[value] = NOTE_AUTHORS.filter((author) => feedback[author]?.reaction === value);
    });
    return summary;
  }

  const CARD_TYPE_MAP = {
    day: 'activity', path: 'decision', restaurant: 'restaurant', bar: 'bar',
    activity: 'activity', price: 'logistics', wildcard: 'activity', seasonal: 'activity',
    event: 'activity', upgrade: 'experience', warning: 'logistics', booking: 'logistics',
    experience: 'experience', route: 'experience', fact: 'logistics', verdict: 'logistics'
  };

  function cardTypeFromId(id) {
    return CARD_TYPE_MAP[String(id).split(':')[0]] || 'activity';
  }

  const api = {
    NOTE_AUTHORS,
    NOTE_REACTIONS,
    createEmptyNotesState,
    normalizeNotesState,
    saveOptionFeedback,
    hasFeedback,
    getFeedbackSummary,
    countOptionFeedback,
    formatReaction,
    exportFeedbackText,
    addSuggestion,
    buildSubmissionPacket,
    exportSharePacket,
    parseSharePacket,
    mergeNotesStates,
    analyzeGroupDecisions,
    buildFinalCut,
    getCountdownItems,
    toggleStamp,
    getReactionSummary,
    cardTypeFromId
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.LISBON_NOTES = api;
})(typeof window !== 'undefined' ? window : globalThis);
