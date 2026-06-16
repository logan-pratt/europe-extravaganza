const SCHEDULE = window.TRIP_SCHEDULE || [];
const LOGIC = window.TODAY_LOGIC;
const CITY_DATA = {
  lisbon: window.LISBON_DATA,
  galway: window.GALWAY_DATA,
  dublin: window.DUBLIN_DATA,
  london: window.TRIP_DATA
};

let selectedDate = initialSelectedDate();

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function formatDate(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatLongDate(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function initialSelectedDate() {
  const hashDate = location.hash.replace('#', '');
  if (SCHEDULE.some((entry) => entry.date === hashDate)) return hashDate;
  const state = LOGIC.getScheduleState(SCHEDULE, new Date());
  return state.today?.date || state.next?.date || SCHEDULE[0]?.date || '';
}

function cityLabel(city) {
  return {
    lisbon: 'Lisbon',
    kilkea: 'Kilkea',
    galway: 'Galway',
    dublin: 'Dublin',
    london: 'London'
  }[city] || city || 'Trip';
}

function getEntry(dateKey) {
  return SCHEDULE.find((entry) => entry.date === dateKey) || null;
}

function selectDate(dateKey, shouldUpdateHash = true) {
  const entry = getEntry(dateKey) || SCHEDULE[0];
  if (!entry) return;

  selectedDate = entry.date;
  if (shouldUpdateHash && location.hash.replace('#', '') !== selectedDate) {
    history.replaceState(null, '', `#${selectedDate}`);
  }
  render();
}

function selectedDateLabel() {
  const state = LOGIC.getScheduleState(SCHEDULE, new Date());
  return state.today?.date || state.next?.date || SCHEDULE[0]?.date || '';
}

function getEntryIndex(entry) {
  return SCHEDULE.findIndex((item) => item.date === entry?.date);
}

function getDayData(city, dayId) {
  if (!city || !dayId) return null;
  return CITY_DATA[city]?.days?.find((day) => day.id === dayId) || null;
}

function anchorLinks(anchor) {
  const links = [];
  if (anchor.mapUrl) links.push(`<a href="${escapeHtml(anchor.mapUrl)}" target="_blank" rel="noopener">Map</a>`);
  if (anchor.siteUrl) links.push(`<a href="${escapeHtml(anchor.siteUrl)}" target="_blank" rel="noopener">Site</a>`);
  return links.length ? `<div class="anchor-actions">${links.join('')}</div>` : '';
}

function renderDayChips() {
  const actualToday = LOGIC.getScheduleState(SCHEDULE, new Date()).today?.date;
  $('#dayChips').innerHTML = SCHEDULE.map((entry) => `
    <button class="day-chip ${entry.date === selectedDate ? 'active' : ''} ${entry.date === actualToday ? 'is-today' : ''}" type="button" data-date="${entry.date}">
      <strong>${formatDate(entry.date)}</strong>
      <span>${cityLabel(entry.city)}</span>
      ${entry.date === actualToday ? '<em>Today</em>' : ''}
    </button>
  `).join('');

  document.querySelectorAll('.day-chip').forEach((button) => {
    button.addEventListener('click', () => {
      selectDate(button.dataset.date);
    });
  });
}

function renderStatus(entry) {
  const liveState = LOGIC.getScheduleState(SCHEDULE, new Date());
  const selectedIsToday = liveState.today?.date === entry.date;
  const prefix = selectedIsToday ? 'Today' : formatLongDate(entry.date);
  let message = `${prefix} · ${entry.label}`;

  if (liveState.status === 'pretrip') {
    message = `Trip starts in ${liveState.daysUntilStart} days · Previewing ${entry.label}`;
  } else if (liveState.status === 'posttrip') {
    message = `That’s a wrap · Browsing the finished itinerary`;
  } else if (liveState.status === 'gap' && liveState.next) {
    message = `Between pinned days · Next up: ${liveState.next.label}`;
  }

  $('#statusStrip').textContent = message;
}

function renderNowPanel(entry) {
  const actualTodayKey = LOGIC.dateKey(new Date());
  const selectedIsToday = entry.date === actualTodayKey;
  const anchors = LOGIC.sortAnchors(entry.anchors || []);
  const live = selectedIsToday ? LOGIC.getCurrentAndNextAnchors(entry, new Date()) : { current: null, next: anchors[0] };
  const focus = live.next || live.current || anchors[0];
  const label = selectedIsToday ? (live.next ? 'Next move' : 'Current anchor') : 'First anchor';
  const countdown = selectedIsToday ? LOGIC.getNextCountdown(entry, new Date()) : null;
  const showCountdown = countdown && focus && countdown.anchor === focus;

  if (!focus) {
    $('#nowPanel').innerHTML = `
      <div class="now-title"><div><p class="eyebrow">${label}</p><h2>${escapeHtml(entry.label)}</h2></div></div>
      <p class="empty">No fixed anchors yet. Use the planner context below.</p>
    `;
    return;
  }

  $('#nowPanel').innerHTML = `
    <div class="now-title">
      <div>
        <p class="eyebrow">${label}</p>
        <h2>${escapeHtml(focus.title)}</h2>
      </div>
      <div class="now-times">
        <span class="time-badge">${escapeHtml(focus.time)}</span>
        ${showCountdown ? `<span class="count-badge">${escapeHtml(countdown.label)}</span>` : ''}
      </div>
    </div>
    <div class="anchor-meta">
      <span class="status-badge ${escapeHtml(focus.status || 'planned')}">${escapeHtml(focus.status || 'planned')}</span>
      <span class="type-badge">${escapeHtml(focus.type || 'plan')}</span>
      ${focus.critical ? '<span class="type-badge">Critical</span>' : ''}
      ${focus.leaveBy ? `<span class="type-badge">Leave by ${escapeHtml(focus.leaveBy)}</span>` : ''}
    </div>
    ${focus.note ? `<p>${escapeHtml(focus.note)}</p>` : ''}
    ${anchorLinks(focus)}
  `;
}

function renderUtilityPanel(entry) {
  const lodging = entry.lodging;
  const prepItems = entry.prep || [];
  const bookingItems = (entry.anchors || []).filter((anchor) => anchor.status === 'confirmed' || anchor.critical);

  $('#utilityPanel').innerHTML = `
    <div class="utility-block">
      <p class="eyebrow">Base</p>
      ${lodging ? `
        <h3>${escapeHtml(lodging.name)}</h3>
        <p>${escapeHtml(lodging.area || '')}</p>
        <div class="link-row"><a href="${escapeHtml(lodging.mapUrl)}" target="_blank" rel="noopener">Map base</a></div>
      ` : '<p class="empty">No lodging pinned for this day yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Booking wallet</p>
      ${bookingItems.length ? `
        <ul class="mini-list">
          ${bookingItems.map((item) => `<li><strong>${escapeHtml(item.time)}</strong> · ${escapeHtml(item.title)}</li>`).join('')}
        </ul>
      ` : '<p class="empty">No confirmed bookings pinned yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Prep</p>
      ${prepItems.length ? `
        <ul class="mini-list">${prepItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      ` : '<p class="empty">No prep notes yet.</p>'}
    </div>
  `;
}

const TRAVEL_TYPES = new Set(['flight', 'train', 'transfer']);

function anchorBadges(anchor, timing) {
  return `
    <div class="anchor-meta">
      <span class="time-badge">${escapeHtml(anchor.time)}</span>
      ${timing === 'current' ? '<span class="live-badge">Now</span>' : ''}
      ${timing === 'next' ? '<span class="live-badge next">Next</span>' : ''}
      <span class="status-badge ${escapeHtml(anchor.status || 'planned')}">${escapeHtml(anchor.status || 'planned')}</span>
      <span class="type-badge">${escapeHtml(anchor.type || 'plan')}</span>
      ${anchor.leaveBy ? `<span class="type-badge">Leave by ${escapeHtml(anchor.leaveBy)}</span>` : ''}
    </div>`;
}

function standardHtml(anchor, timing) {
  return `
    <article class="tl-card anchor-card ${anchor.critical ? 'critical' : ''} ${timing ? `timing-${timing}` : ''}">
      ${anchorBadges(anchor, timing)}
      <h3>${escapeHtml(anchor.title)}</h3>
      ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
      ${anchorLinks(anchor)}
    </article>`;
}

function ticketHtml(anchor, timing) {
  return `
    <article class="tl-card ticket ${timing ? `timing-${timing}` : ''}">
      <div class="ticket-main">
        ${anchorBadges(anchor, timing)}
        <h3>${escapeHtml(anchor.title)}</h3>
        ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
        ${anchorLinks(anchor)}
      </div>
      <div class="ticket-stub">
        <span class="ticket-mode">${escapeHtml(anchor.type || 'go')}</span>
        <span class="ticket-time">${escapeHtml(anchor.time)}</span>
        ${anchor.leaveBy ? `<span class="ticket-leave">Leave ${escapeHtml(anchor.leaveBy)}</span>` : ''}
      </div>
    </article>`;
}

function anchorCardHtml(anchor, timing) {
  return TRAVEL_TYPES.has(anchor.type) ? ticketHtml(anchor, timing) : standardHtml(anchor, timing);
}

function renderAnchors(entry) {
  $('#todayTitle').textContent = `${formatLongDate(entry.date)} · ${entry.label}`;
  const actualTodayKey = LOGIC.dateKey(new Date());
  const selectedIsToday = entry.date === actualTodayKey;
  const annotated = selectedIsToday
    ? LOGIC.annotateAnchors(entry, new Date())
    : LOGIC.sortAnchors(entry.anchors || []).map((anchor) => ({ anchor, timing: '' }));

  if (!annotated.length) {
    $('#anchorList').innerHTML = '<p class="empty">No anchors for this day yet.</p>';
    return;
  }

  const nowLine = selectedIsToday ? LOGIC.getNowLine(entry, new Date()) : null;
  const lineHtml = (frac) => `<div class="now-line" style="--frac:${frac}"><span>now</span></div>`;

  const body = annotated.map(({ anchor, timing }, i) => {
    const card = `<div class="tl-row">${anchorCardHtml(anchor, timing)}</div>`;
    const line = nowLine && nowLine.index === i ? lineHtml(nowLine.fraction) : '';
    return card + line;
  }).join('');

  const topLine = nowLine && nowLine.index === -1 ? lineHtml(0) : '';
  $('#anchorList').innerHTML = `<div class="timeline">${topLine}${body}</div>`;
}

function renderDayContext(entry) {
  const day = getDayData(entry.city, entry.dayId);
  const secondaryDay = getDayData(entry.secondaryCity, entry.secondaryDayId);
  const dayCards = [secondaryDay, day].filter(Boolean);

  if (!dayCards.length) {
    $('#plannerContext').innerHTML = `
      <div class="section-head">
        <p class="eyebrow">Planner context</p>
        <h2>No city planner yet.</h2>
      </div>
      <p class="empty">This day is covered by the schedule anchors above.</p>
    `;
    return;
  }

  $('#plannerContext').innerHTML = `
    <div class="section-head">
      <p class="eyebrow">Planner context</p>
      <h2>From the city pages.</h2>
    </div>
    <div class="context-grid">
      ${dayCards.map((dayItem) => `
        <article class="context-card">
          <h3>${escapeHtml(dayItem.title)}</h3>
          <p>${escapeHtml(dayItem.mood || '')}</p>
          <ul class="timeline-list">
            ${(dayItem.timeline || []).map(([time, text]) => `
              <li><time>${escapeHtml(time)}</time><span>${escapeHtml(text)}</span></li>
            `).join('')}
          </ul>
        </article>
      `).join('')}
    </div>
  `;
}

function renderDeck(entry) {
  const index = getEntryIndex(entry);
  const tomorrow = SCHEDULE[index + 1] || null;
  const prep = tomorrow?.prepPreviousNight || [];

  $('#deckGrid').innerHTML = `
    <article class="deck-card">
      <p class="eyebrow">Tonight</p>
      <h3>${tomorrow ? `Prep for ${escapeHtml(tomorrow.label)}` : 'No next day'}</h3>
      ${prep.length ? `<ul class="mini-list">${prep.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="empty">No previous-night prep pinned.</p>'}
    </article>
    <article class="deck-card">
      <p class="eyebrow">Tomorrow</p>
      ${tomorrow ? `
        <h3>${formatDate(tomorrow.date)} · ${escapeHtml(tomorrow.label)}</h3>
        <p>${escapeHtml((tomorrow.anchors || [])[0]?.title || 'No fixed first anchor yet.')}</p>
        <button class="btn" type="button" data-jump-date="${tomorrow.date}">Open tomorrow</button>
      ` : '<p class="empty">That is the end of the schedule.</p>'}
    </article>
  `;

  const jump = document.querySelector('[data-jump-date]');
  if (jump) {
    jump.addEventListener('click', () => {
      selectDate(jump.dataset.jumpDate);
    });
  }
}

function optionLabelMap(city) {
  const data = CITY_DATA[city];
  const labels = {};
  if (!data) return labels;

  (data.restaurants || []).forEach((item) => {
    if (Array.isArray(item)) labels[`restaurant:${item[0]}`] = item[2];
    else labels[`restaurant:${item.id}`] = item.name;
  });
  (data.activities || []).forEach((item) => {
    if (Array.isArray(item)) labels[`activity:${item[0]}`] = item[1];
    else labels[`activity:${item.id}`] = item.name;
  });
  (data.bars || data.pubs || []).forEach((item) => {
    if (Array.isArray(item)) labels[`bar:${item[0]}`] = item[2];
    else labels[`bar:${item.id}`] = item.name;
  });
  return labels;
}

async function renderOptions(entry) {
  const options = LOGIC.getOpenSlotOptions(entry);

  if (!options.length) {
    $('#optionsSection').innerHTML = '';
    return;
  }

  $('#optionsSection').innerHTML = `
    <div class="section-head">
      <p class="eyebrow">Open slots</p>
      <h2>Useful options.</h2>
    </div>
    <div class="options-grid">
      ${options.map((option) => `
        <article class="option-card">
          <span class="status-badge tbd">TBD</span>
          <h3>${escapeHtml(option)}</h3>
        </article>
      `).join('')}
    </div>
  `;
}

function renderEmpty() {
  $('.today-shell').innerHTML = '<section class="section"><h1>Today</h1><p class="empty">No schedule data loaded.</p></section>';
}

function todBucket(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 10) return 'dawn';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

function applyTheme(entry) {
  document.documentElement.dataset.city = entry.city || 'trip';
  document.documentElement.dataset.tod = todBucket(new Date());
}

function render() {
  if (!SCHEDULE.length) {
    renderEmpty();
    return;
  }

  const entry = getEntry(selectedDate) || SCHEDULE[0];
  selectedDate = entry.date;
  applyTheme(entry);
  renderDayChips();
  renderStatus(entry);
  renderNowPanel(entry);
  renderUtilityPanel(entry);
  renderAnchors(entry);
  renderDayContext(entry);
  renderDeck(entry);
  renderOptions(entry);
}

$('#jumpToday').addEventListener('click', () => {
  selectDate(selectedDateLabel());
});

window.addEventListener('hashchange', () => {
  const hashDate = location.hash.replace('#', '');
  if (hashDate && hashDate !== selectedDate) selectDate(hashDate, false);
});

let clockTimer = null;
function startClock() {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = setInterval(() => {
    const todayKey = LOGIC.dateKey(new Date());
    if (selectedDate !== todayKey) return;
    const entry = getEntry(selectedDate);
    if (!entry) return;
    renderStatus(entry);
    renderNowPanel(entry);
    renderAnchors(entry);
    applyTheme(entry);
  }, 45000);
}

render();
startClock();
