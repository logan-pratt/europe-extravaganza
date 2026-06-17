(function initTodayLogic(root) {
  const LABEL_TIMES = {
    morning: 9 * 60,
    breakfast: 8 * 60,
    midday: 12 * 60,
    lunch: 13 * 60,
    afternoon: 15 * 60,
    sunset: 19 * 60,
    dinner: 20 * 60,
    evening: 20 * 60,
    night: 22 * 60,
    after: 22 * 60,
    airport: 6 * 60
  };

  function dateKey(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function dateDays(value) {
    const key = typeof value === 'string' ? value : dateKey(value);
    const [year, month, day] = key.split('-').map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  }

  function parseClock(hourText, minuteText, meridiemText) {
    let hour = Number(hourText);
    const minute = Number(minuteText || 0);
    const meridiem = meridiemText?.toLowerCase();
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    return hour * 60 + minute;
  }

  function parseSortTime(anchor) {
    if (anchor?.sortTime) {
      const match = String(anchor.sortTime).trim().match(/^(\d{1,2}):(\d{2})$/);
      if (match) return Number(match[1]) * 60 + Number(match[2]);
    }

    const text = String(anchor?.time || '').trim();
    const rangeMeridiem = text.match(/-\s*\d{1,2}(?::\d{2})?\s*(am|pm)\b/i)?.[1];
    const clockMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
    if (clockMatch) {
      const meridiem = clockMatch[3] || rangeMeridiem;
      return parseClock(clockMatch[1], clockMatch[2], meridiem);
    }

    const normalized = text.toLowerCase();
    const label = Object.keys(LABEL_TIMES).find((key) => normalized.includes(key));
    return label ? LABEL_TIMES[label] : null;
  }

  function sortAnchors(anchors = []) {
    return anchors
      .map((anchor, index) => {
        const minutes = parseSortTime(anchor);
        return { anchor, index, minutes: Number.isFinite(minutes) ? minutes : 1440 + index };
      })
      .sort((a, b) => (a.minutes - b.minutes) || (a.index - b.index))
      .map((item) => item.anchor);
  }

  function minutesFromDate(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    return date.getHours() * 60 + date.getMinutes();
  }

  function getCurrentAndNextAnchors(entry, now = new Date()) {
    const anchors = sortAnchors(entry?.anchors || []);
    const currentMinutes = minutesFromDate(now);
    let current = null;
    let next = null;

    anchors.forEach((anchor) => {
      const minutes = parseSortTime(anchor);
      if (!Number.isFinite(minutes)) return;
      if (minutes <= currentMinutes) current = anchor;
      if (!next && minutes > currentMinutes) next = anchor;
    });

    return {
      current,
      next,
      remaining: next ? anchors.slice(anchors.indexOf(next)) : []
    };
  }

  function annotateAnchors(entry, now = new Date()) {
    const anchors = sortAnchors(entry?.anchors || []);
    const { current, next } = getCurrentAndNextAnchors(entry, now);
    return anchors.map((anchor) => {
      let timing = 'future';
      if (anchor === current) timing = 'current';
      else if (anchor === next) timing = 'next';
      else if (current && parseSortTime(anchor) < parseSortTime(current)) timing = 'past';
      return { anchor, timing };
    });
  }

  function getScheduleState(schedule = [], now = new Date()) {
    const ordered = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
    const todayKey = dateKey(now);
    const todayDays = dateDays(todayKey);
    const today = ordered.find((entry) => entry.date === todayKey) || null;
    const previous = [...ordered].reverse().find((entry) => entry.date < todayKey) || null;
    const next = ordered.find((entry) => entry.date > todayKey) || null;
    const first = ordered[0] || null;
    const last = ordered[ordered.length - 1] || null;
    const daysUntilStart = first ? dateDays(first.date) - todayDays : null;

    let status = 'active';
    if (!today && first && todayKey < first.date) status = 'pretrip';
    if (!today && last && todayKey > last.date) status = 'posttrip';
    if (!today && status === 'active') status = 'gap';

    const tomorrow = ordered.find((entry) => dateDays(entry.date) === todayDays + 1) || null;
    const tomorrowPrep = tomorrow?.prepPreviousNight || [];

    return {
      status,
      today,
      previous,
      next,
      first,
      last,
      daysUntilStart,
      tomorrow,
      tomorrowPrep
    };
  }

  function rankReactionOptions(reactions = []) {
    const weights = { love: 2, maybe: 1, concern: -2, nope: -2 };
    const byId = new Map();

    reactions.forEach((row) => {
      const id = row.card_id;
      if (!id) return;
      if (!byId.has(id)) {
        byId.set(id, { id, cardType: row.card_type || '', score: 0, reactions: 0, positiveReactions: 0 });
      }
      const item = byId.get(id);
      const weight = weights[row.reaction] || 0;
      item.score += weight;
      item.reactions += row.reaction ? 1 : 0;
      item.positiveReactions += weight > 0 ? 1 : 0;
    });

    return [...byId.values()]
      .filter((item) => item.score > 0)
      .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id));
  }

  function getOpenSlotOptions(entry = {}) {
    if (Array.isArray(entry.options) && entry.options.length) return entry.options;
    return (entry.anchors || [])
      .filter((anchor) => String(anchor.status || '').toLowerCase() === 'tbd')
      .map((anchor) => anchor.title)
      .filter(Boolean);
  }

  function formatCountdown(minutesUntil) {
    if (!Number.isFinite(minutesUntil) || minutesUntil <= 0) return 'now';
    const hours = Math.floor(minutesUntil / 60);
    const minutes = minutesUntil % 60;
    if (hours <= 0) return `in ${minutes}m`;
    if (minutes === 0) return `in ${hours}h`;
    return `in ${hours}h ${minutes}m`;
  }

  function getNextCountdown(entry, now = new Date()) {
    const { next } = getCurrentAndNextAnchors(entry, now);
    if (!next) return null;
    const target = parseSortTime(next);
    if (!Number.isFinite(target)) return null;
    const minutesUntil = target - minutesFromDate(now);
    return { anchor: next, minutesUntil, label: formatCountdown(minutesUntil) };
  }

  function getNowLine(entry, now = new Date()) {
    const sorted = sortAnchors(entry?.anchors || []);
    const times = sorted.map((anchor) => parseSortTime(anchor));
    const current = minutesFromDate(now);

    let index = -1;
    for (let i = 0; i < sorted.length; i += 1) {
      if (Number.isFinite(times[i]) && times[i] <= current) index = i;
    }
    let nextIndex = -1;
    for (let i = index + 1; i < sorted.length; i += 1) {
      if (Number.isFinite(times[i]) && times[i] > current) { nextIndex = i; break; }
    }

    let fraction = index < 0 ? 0 : 1;
    if (index >= 0 && nextIndex >= 0) {
      const span = times[nextIndex] - times[index];
      fraction = span > 0 ? (current - times[index]) / span : 0;
    }
    return {
      index,
      nextIndex,
      hasSegment: index >= 0 && nextIndex >= 0,
      fraction: Math.max(0, Math.min(1, fraction))
    };
  }

  const SLOT_WINDOWS = {
    breakfast: [6 * 60, 10 * 60 + 30],
    lunch:     [11 * 60 + 30, 14 * 60 + 30],
    afternoon: [14 * 60 + 30, 17 * 60 + 30],
    drink:     [17 * 60, 19 * 60 + 30],
    dinner:    [19 * 60, 22 * 60],
    late:      [22 * 60, 25 * 60]
  };

  const TYPE_TO_SLOT = {
    meal: ['breakfast', 'lunch', 'dinner'],
    booking: ['lunch', 'dinner', 'drink'],
    drink: ['drink'],
    sightseeing: ['afternoon'],
    arrival: ['afternoon']
  };

  function getOpenSlots(entry = {}) {
    const anchors = entry.anchors || [];
    const filled = new Set();

    anchors.forEach((anchor) => {
      if (anchor.slot) { filled.add(anchor.slot); return; }
      const minutes = parseSortTime(anchor);
      Object.entries(SLOT_WINDOWS).forEach(([slot, [from, to]]) => {
        if (Number.isFinite(minutes) && minutes >= from && minutes < to) filled.add(slot);
      });
      (TYPE_TO_SLOT[anchor.type] || []).forEach((slot) => {
        const [from, to] = SLOT_WINDOWS[slot];
        if (Number.isFinite(minutes) && minutes >= from && minutes < to) filled.add(slot);
      });
    });

    return Object.keys(SLOT_WINDOWS).filter((slot) => !filled.has(slot));
  }

  const SLOT_TAGS = {
    breakfast: ['breakfast', 'coffee'],
    lunch:     ['lunch'],
    afternoon: ['afternoon', 'sightseeing'],
    drink:     ['drink', 'wine', 'cocktail', 'bar', 'rooftop'],
    dinner:    ['dinner'],
    late:      ['late', 'fado', 'nightlife']
  };

  function normalizeOption(item) {
    if (Array.isArray(item)) {
      return { id: item[0], name: item[2] || item[1], tags: String(item[3] || '').toLowerCase(), why: item[5] || '', mapUrl: item[7] || item[6] || '' };
    }
    return { id: item.id, name: item.name, tags: String(item.tags || '').toLowerCase(), why: item.why || item.role || '', mapUrl: item.mapUrl || '' };
  }

  function collectCityOptions(cityData) {
    if (!cityData) return [];
    return [
      ...(cityData.restaurants || []),
      ...(cityData.bars || cityData.pubs || []),
      ...(cityData.activities || [])
    ].map(normalizeOption).filter((o) => o.id && o.name);
  }

  function scoreFor(id, reactionScores) {
    const entry = reactionScores.get(id);
    return entry ? entry.score : 0;
  }

  function buildReactionScores(reactions = []) {
    const ranked = rankReactionOptions(reactions);
    const map = new Map();
    ranked.forEach((row) => map.set(row.id, row));
    return map;
  }

  function getSuggestionPool(entry = {}, cityData = null, reactions = []) {
    const openSlots = getOpenSlots(entry);
    const all = collectCityOptions(cityData);
    const byId = new Map(all.map((o) => [o.id, o]));
    const reactionScores = buildReactionScores(reactions);
    const out = {};

    openSlots.forEach((slot) => {
      const manual = entry.suggest && Array.isArray(entry.suggest[slot]) ? entry.suggest[slot] : null;
      let pool;
      if (manual) {
        pool = manual.map((id) => byId.get(id)).filter(Boolean);
      } else {
        const tagSet = SLOT_TAGS[slot] || [slot];
        pool = all.filter((o) => tagSet.some((tag) => o.tags.includes(tag)));
      }

      const ranked = [...pool]
        .map((o) => ({ ...o, score: scoreFor(o.id, reactionScores) }))
        .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
        .slice(0, 3);

      if (ranked.length) out[slot] = ranked;
    });

    return out;
  }

  function getWalletItems(today, tomorrow) {
    const rows = [];
    const pushFrom = (entry) => {
      if (!entry) return;
      sortAnchors(entry.anchors || []).forEach((anchor) => {
        if (!anchor.booking) return;
        rows.push({
          date: entry.date,
          time: anchor.time,
          title: anchor.title,
          confirmation: anchor.booking.confirmation || '',
          reservedAs: anchor.booking.reservedAs || '',
          phone: anchor.booking.phone || '',
          mapUrl: anchor.mapUrl || '',
          address: anchor.address || ''
        });
      });
    };
    pushFrom(today);
    pushFrom(tomorrow);
    return rows;
  }

  const HIDE_WALK_FROM = new Set(['meal', 'lodging']);

  function getWalkLeg(prevAnchor, anchor) {
    if (!anchor || typeof anchor.walkMinutes !== 'number') return null;
    const hidden = !!(prevAnchor && HIDE_WALK_FROM.has(prevAnchor.type));
    return {
      minutes: anchor.walkMinutes,
      meters: typeof anchor.walkMeters === 'number' ? anchor.walkMeters : null,
      hidden
    };
  }

  root.TODAY_LOGIC = {
    dateKey,
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
    getWalletItems,
    getWalkLeg
  };
})(typeof window !== 'undefined' ? window : globalThis.window);
