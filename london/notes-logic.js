(function initNotesLogic(root) {
  const NOTE_AUTHORS = ['Logan', 'Emily'];
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
    const previousOption = safeState.items[optionId] || {};
    const previousAuthor = previousOption[author] || {};
    const nextAuthor = {
      reaction: feedback.reaction ?? previousAuthor.reaction ?? '',
      note: feedback.note ?? previousAuthor.note ?? ''
    };

    return {
      ...safeState,
      items: {
        ...safeState.items,
        [optionId]: {
          ...previousOption,
          [author]: nextAuthor
        }
      }
    };
  }

  function hasFeedback(feedback) {
    return Boolean(feedback?.reaction || feedback?.note?.trim());
  }

  function getFeedbackSummary(state) {
    const safeState = normalizeNotesState(state);
    return Object.entries(safeState.items)
      .map(([optionId, feedback]) => ({
        optionId,
        Logan: feedback.Logan || { reaction: '', note: '' },
        Emily: feedback.Emily || { reaction: '', note: '' }
      }))
      .filter((item) => hasFeedback(item.Logan) || hasFeedback(item.Emily));
  }

  function countOptionFeedback(state, optionId) {
    const safeState = normalizeNotesState(state);
    const feedback = safeState.items[optionId] || {};
    return NOTE_AUTHORS.filter((author) => hasFeedback(feedback[author])).length;
  }

  function formatReaction(reaction) {
    const found = NOTE_REACTIONS.find(([value]) => value === reaction);
    return found ? found[1] : '';
  }

  function exportFeedbackText(state, labels = {}) {
    const safeState = normalizeNotesState(state);
    const summary = getFeedbackSummary(safeState);
    const sections = summary.map((item) => {
      const lines = NOTE_AUTHORS
        .map((author) => {
          const feedback = item[author];
          if (!hasFeedback(feedback)) return '';
          const reaction = formatReaction(feedback.reaction);
          const note = feedback.note?.trim();
          const separator = reaction && note ? ' — ' : '';
          return `- ${author}: ${reaction}${separator}${note}`;
        })
        .filter(Boolean);
      return `${labels[item.optionId] || item.optionId}\n${lines.join('\n')}`;
    });
    if (safeState.suggestions.length) {
      sections.push(`Missing suggestions\n${safeState.suggestions.map((suggestion) => {
        const url = suggestion.url ? ` (${suggestion.url})` : '';
        return `- ${suggestion.author} · ${suggestion.category}: ${suggestion.title} — ${suggestion.note}${url}`;
      }).join('\n')}`);
    }

    return ['London Love Letter notes', ...sections].join('\n\n');
  }

  function addSuggestion(state, suggestion) {
    const safeState = normalizeNotesState(state);
    const cleanSuggestion = {
      id: suggestion.id,
      author: suggestion.author || 'Emily',
      category: suggestion.category || 'Idea',
      title: suggestion.title || '',
      note: suggestion.note || '',
      url: suggestion.url || ''
    };
    if (!cleanSuggestion.id || !cleanSuggestion.title.trim()) return safeState;
    const withoutExisting = safeState.suggestions.filter((item) => item.id !== cleanSuggestion.id);
    return {
      ...safeState,
      suggestions: [...withoutExisting, cleanSuggestion]
    };
  }

  function buildSubmissionPacket(state) {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      state: normalizeNotesState(state)
    };
  }

  function exportSharePacket(state) {
    return `LONDON_LOVE_LETTER_NOTES_V1\n${JSON.stringify(buildSubmissionPacket(state), null, 2)}`;
  }

  function parseSharePacket(text) {
    const raw = String(text || '').trim();
    const json = raw.startsWith('LONDON_LOVE_LETTER_NOTES_V1')
      ? raw.replace(/^LONDON_LOVE_LETTER_NOTES_V1\s*/, '')
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
          {
            ...(current.items[optionId] || {}),
            ...feedback
          }
        ]))
      },
      suggestions: [...suggestionsById.values()]
    };
  }

  function itemWithLabel(item, labels) {
    return {
      ...item,
      label: labels[item.optionId] || item.optionId
    };
  }

  function reactionPair(item) {
    return [
      item.Logan?.reaction || '',
      item.Emily?.reaction || ''
    ];
  }

  function analyzeCoupleDecisions(state, labels = {}) {
    const summary = getFeedbackSummary(state).map((item) => itemWithLabel(item, labels));
    const buckets = {
      bothLove: [],
      loganLoves: [],
      emilyLoves: [],
      potentialConflict: [],
      logisticsConcern: [],
      easyYes: []
    };

    summary.forEach((item) => {
      const [logan, emily] = reactionPair(item);
      const reactions = [logan, emily];
      const hasLove = reactions.includes('love');
      const hasNope = reactions.includes('nope');
      const hasConcern = reactions.includes('concern');

      if (logan === 'love' && emily === 'love') {
        buckets.bothLove.push(item);
        buckets.easyYes.push(item);
      } else if (hasLove && (hasNope || hasConcern)) {
        buckets.potentialConflict.push(item);
      } else if (logan === 'love') {
        buckets.loganLoves.push(item);
        buckets.easyYes.push(item);
      } else if (emily === 'love') {
        buckets.emilyLoves.push(item);
        buckets.easyYes.push(item);
      } else if (hasConcern) {
        buckets.logisticsConcern.push(item);
      }
    });

    return buckets;
  }

  function buildFinalCut(state, labels = {}) {
    const summary = getFeedbackSummary(state).map((item) => itemWithLabel(item, labels));
    const finalCut = {
      mustDo: [],
      maybe: [],
      cut: [],
      discuss: []
    };

    summary.forEach((item) => {
      const [logan, emily] = reactionPair(item);
      const reactions = [logan, emily].filter(Boolean);
      const loves = reactions.filter((reaction) => reaction === 'love').length;
      const nopes = reactions.filter((reaction) => reaction === 'nope').length;
      const concerns = reactions.filter((reaction) => reaction === 'concern').length;
      const maybes = reactions.filter((reaction) => reaction === 'maybe').length;

      if (nopes && (concerns || nopes > 1 || loves === 0)) {
        finalCut.cut.push(item);
      } else if (loves === 2 || (loves === 1 && maybes >= 1)) {
        finalCut.mustDo.push(item);
      } else if (loves && nopes) {
        finalCut.discuss.push(item);
      } else if (concerns || maybes || loves) {
        finalCut.maybe.push(item);
      }
    });

    return finalCut;
  }

  function getCountdownItems(now = new Date()) {
    const dayMs = 24 * 60 * 60 * 1000;
    const items = [
      ['trip', 'London begins', '2026-07-05T00:00:00-07:00'],
      ['andrew-edmunds', 'Andrew Edmunds booking opens', '2026-06-06T09:30:00-07:00'],
      ['wimbledon-prep', 'Wimbledon prep window', '2026-06-23T00:00:00-07:00'],
      ['departure', 'Departure buffer check', '2026-07-09T00:00:00-07:00']
    ];

    return items.map(([id, label, iso]) => {
      const target = new Date(iso);
      const days = Math.ceil((target.getTime() - now.getTime()) / dayMs);
      return {
        id,
        label,
        date: iso,
        days,
        status: days < 0 ? 'past' : days === 0 ? 'today' : 'future'
      };
    });
  }

  function toggleStamp(state, stampId) {
    return {
      ...state,
      [stampId]: !state?.[stampId]
    };
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
    analyzeCoupleDecisions,
    buildFinalCut,
    getCountdownItems,
    toggleStamp,
    getReactionSummary,
    cardTypeFromId
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.LONDON_NOTES = api;
})(typeof window !== 'undefined' ? window : globalThis);
