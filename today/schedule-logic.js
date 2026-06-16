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

  root.TODAY_LOGIC = {
    dateKey,
    getScheduleState,
    parseSortTime,
    sortAnchors,
    getCurrentAndNextAnchors,
    annotateAnchors,
    getOpenSlotOptions,
    rankReactionOptions
  };
})(typeof window !== 'undefined' ? window : globalThis.window);
