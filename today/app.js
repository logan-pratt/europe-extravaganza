const SCHEDULE = window.TRIP_SCHEDULE || [];
const LOGIC = window.TODAY_LOGIC;
const CITY_DATA = {
  lisbon: window.LISBON_DATA,
  galway: window.GALWAY_DATA,
  dublin: window.DUBLIN_DATA,
  london: window.TRIP_DATA
};

let selectedDate = initialSelectedDate();

const reactionsByCity = {};
const subscribedCities = new Set();

const SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  afternoon: 'Afternoon',
  drink: 'Drink',
  dinner: 'Dinner',
  late: 'Late night'
};

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
  if (entry.city && !(entry.city in reactionsByCity)) {
    loadReactionsFor(entry.city);
  }
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

function boltUrl(address) {
  return `https://bolt.eu/en/?pickup_address=&destination_address=${encodeURIComponent(address)}`;
}

function uberUrl(address) {
  const q = encodeURIComponent(address);
  return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${q}`;
}

function actionClusterHtml(target, { large = false } = {}) {
  if (!target) return '';
  const cls = large ? 'actions actions-lg' : 'actions';
  const parts = [];
  if (target.mapUrl) parts.push(`<a class="btn ghost" href="${escapeHtml(target.mapUrl)}" target="_blank" rel="noopener">Map</a>`);
  if (target.address) {
    parts.push(`<button class="btn ghost" type="button" data-copy="${escapeHtml(target.address)}">Copy</button>`);
    parts.push(`<a class="btn ghost" href="${escapeHtml(boltUrl(target.address))}" target="_blank" rel="noopener">Bolt</a>`);
    parts.push(`<a class="btn ghost" href="${escapeHtml(uberUrl(target.address))}" target="_blank" rel="noopener">Uber</a>`);
  }
  return parts.length ? `<div class="${cls}">${parts.join('')}</div>` : '';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('visible'), 1600);
}

function wireActionCluster(root = document) {
  root.querySelectorAll('[data-copy]').forEach((button) => {
    if (button.dataset.wired === '1') return;
    button.dataset.wired = '1';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast('Copied');
      } catch {
        showToast('Copy failed');
      }
    });
  });
}

function renderDayChips() {
  const actualToday = LOGIC.getScheduleState(SCHEDULE, new Date()).today?.date;
  $('#dayChips').innerHTML = SCHEDULE.map((entry) => `
    <button class="day-chip ${entry.date === selectedDate ? 'active' : ''} ${entry.date === actualToday ? 'is-today' : ''}" type="button" data-date="${entry.date}" aria-label="${escapeHtml(formatLongDate(entry.date))} ${escapeHtml(cityLabel(entry.city))}">
      <span class="dc-dow">${new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>
      <span class="dc-num">${new Date(entry.date + 'T00:00:00').getDate()}</span>
      <span class="dc-city">${escapeHtml(cityLabel(entry.city))}</span>
    </button>
  `).join('');

  document.querySelectorAll('.day-chip').forEach((button) => {
    button.addEventListener('click', () => {
      selectDate(button.dataset.date);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const nowLine = selectedIsToday ? LOGIC.getNowLine(entry, new Date()) : null;
  const showBar = !!(nowLine && nowLine.hasSegment);
  const barPct = showBar ? Math.round(nowLine.fraction * 100) : 0;

  if (!focus) {
    $('#nowPanel').innerHTML = `
      <div class="now-title"><div><p class="eyebrow">${label}</p><h2>${escapeHtml(entry.label)}</h2></div></div>
      <p class="empty">No fixed anchors yet. Use the planner context below.</p>
    `;
    return;
  }

  // Compute walking-mode next-preview values
  const tomorrowEntry = SCHEDULE[getEntryIndex(entry) + 1] || null;
  const walletRows = LOGIC.getWalletItems(entry, tomorrowEntry);
  const allAnchors = LOGIC.sortAnchors(entry.anchors || []);
  const walkLive = selectedIsToday ? LOGIC.getCurrentAndNextAnchors(entry, new Date()) : { current: null, next: allAnchors[0] };
  const walkCurrent = walkLive.next || walkLive.current || allAnchors[0];
  const walkCurrentIdx = walkCurrent ? allAnchors.indexOf(walkCurrent) : -1;
  const walkNextAnchor = walkCurrentIdx >= 0 ? allAnchors[walkCurrentIdx + 1] : null;

  const walkNextHtml = walkNextAnchor ? `
    <div class="walk-only walk-next">
      <span class="walk-next-time">${escapeHtml(walkNextAnchor.time)}</span>
      <span class="walk-next-title">${escapeHtml(walkNextAnchor.title)}</span>
      ${typeof walkNextAnchor.walkMinutes === 'number' ? `<span class="walk-next-delta">↘ ${walkNextAnchor.walkMinutes} min</span>` : ''}
    </div>` : '';

  // Find a wallet row matching the current or next anchor
  const walletTitles = new Set([walkCurrent?.title, walkNextAnchor?.title].filter(Boolean));
  const matchedWalletRows = walletRows.filter((r) => walletTitles.has(r.title));
  const walletPanelHtml = matchedWalletRows.length
    ? `<ul class="wallet-list">${matchedWalletRows.map((row) => `
        <li class="wallet-row">
          <div class="wallet-row-head">
            <span class="wallet-time">${escapeHtml(row.time)}</span>
            <span class="wallet-title">${escapeHtml(row.title)}</span>
          </div>
          <dl class="wallet-meta">
            ${row.confirmation ? `<dt>Conf #</dt><dd><button class="btn ghost mono" data-copy="${escapeHtml(row.confirmation)}">${escapeHtml(row.confirmation)}</button></dd>` : ''}
            ${row.reservedAs ? `<dt>Name</dt><dd>${escapeHtml(row.reservedAs)}</dd>` : ''}
            ${row.phone ? `<dt>Phone</dt><dd><a class="btn ghost" href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a></dd>` : ''}
          </dl>
        </li>`).join('')}</ul>`
    : '<p class="empty">No booking for next move.</p>';

  $('#nowPanel').innerHTML = `
    <p class="now-eyebrow"><span class="now-pulse"></span>${label}</p>
    <h2 class="now-headline">${escapeHtml(focus.title)}</h2>
    <p class="now-where">${escapeHtml(entry.label)}${focus.type ? ` · ${escapeHtml(focus.type)}` : ''}</p>
    ${showCountdown ? `
      <div class="now-count">
        <span class="now-count-big">${escapeHtml(countdown.label)}</span>
        <span class="now-count-at">· ${escapeHtml(focus.time)}</span>
      </div>` : `<div class="now-count"><span class="now-count-at">${escapeHtml(focus.time)}</span></div>`}
    ${showBar ? `<div class="now-bar"><i style="width:${barPct}%"></i></div>` : ''}
    <div class="now-foot">
      <span class="meta-status ${escapeHtml(focus.status || 'planned')}">${escapeHtml(focus.status || 'planned')}</span>
      ${focus.critical ? '<span class="chip-flag critical">Critical</span>' : ''}
      ${focus.leaveBy ? `<span class="chip-flag leaveby">Leave by ${escapeHtml(focus.leaveBy)}</span>` : ''}
      ${actionClusterHtml(focus, { large: true })}
    </div>
    ${walkNextHtml}
    <button class="walk-only walk-wallet-btn btn ghost" type="button" id="walletRevealBtn">Wallet ↓</button>
    <div class="walk-only walk-wallet-panel" id="walletRevealPanel" hidden>${walletPanelHtml}</div>
  `;

  const revealBtn = document.getElementById('walletRevealBtn');
  const revealPanel = document.getElementById('walletRevealPanel');
  if (revealBtn && revealPanel) {
    revealBtn.addEventListener('click', () => {
      const isHidden = revealPanel.hasAttribute('hidden');
      if (isHidden) revealPanel.removeAttribute('hidden');
      else revealPanel.setAttribute('hidden', '');
      revealBtn.textContent = isHidden ? 'Wallet ↑' : 'Wallet ↓';
    });
  }
}

function renderUtilityPanel(entry) {
  const lodging = entry.lodging;
  const prepItems = entry.prep || [];
  const bookingItems = (entry.anchors || []).filter((anchor) => anchor.status === 'confirmed' || anchor.critical);
  const tomorrowEntry = SCHEDULE[getEntryIndex(entry) + 1] || null;
  const walletRows = LOGIC.getWalletItems(entry, tomorrowEntry);

  $('#utilityPanel').innerHTML = `
    <div class="utility-block">
      <p class="eyebrow">Base</p>
      ${lodging ? `
        <h3>${escapeHtml(lodging.name)}</h3>
        <p>${escapeHtml(lodging.area || '')}</p>
        ${actionClusterHtml(lodging, { large: true })}
      ` : '<p class="empty">No lodging pinned for this day yet.</p>'}
    </div>
    <div class="utility-block">
      <p class="eyebrow">Confirmations</p>
      ${bookingItems.length ? `
        <ul class="wallet-strip">
          ${bookingItems.map((item) => `
            <li class="wallet-item ${item.critical ? 'critical' : ''}">
              <span class="wallet-time">${escapeHtml(item.time)}</span>
              <span class="wallet-title">${escapeHtml(item.title)}</span>
              ${item.leaveBy ? `<span class="chip-flag leaveby">Leave ${escapeHtml(item.leaveBy)}</span>` : ''}
              ${actionClusterHtml(item)}
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty">No confirmed bookings pinned yet.</p>'}
    </div>
    <div class="utility-block" data-block="wallet">
      <p class="eyebrow">Wallet</p>
      ${walletRows.length ? `
        <ul class="wallet-list">
          ${walletRows.map((row) => `
            <li class="wallet-row">
              <div class="wallet-row-head">
                <span class="wallet-time">${escapeHtml(row.time)}</span>
                <span class="wallet-title">${escapeHtml(row.title)}</span>
              </div>
              <dl class="wallet-meta">
                ${row.confirmation ? `<dt>Conf #</dt><dd><button class="btn ghost mono" data-copy="${escapeHtml(row.confirmation)}">${escapeHtml(row.confirmation)}</button></dd>` : ''}
                ${row.reservedAs ? `<dt>Name</dt><dd>${escapeHtml(row.reservedAs)}</dd>` : ''}
                ${row.phone ? `<dt>Phone</dt><dd><a class="btn ghost" href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a></dd>` : ''}
              </dl>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty">No bookings to surface for today or tomorrow.</p>'}
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

function anchorMeta(anchor, timing) {
  const status = anchor.status || 'planned';
  return `
    <div class="meta">
      <span class="meta-time">${escapeHtml(anchor.time)}</span>
      <span class="meta-status ${escapeHtml(status)}">${escapeHtml(status)}</span>
      ${timing === 'current' ? '<span class="badge now">Now</span>' : ''}
      ${timing === 'next' ? '<span class="badge next">Next</span>' : ''}
    </div>`;
}

function standardHtml(anchor, timing) {
  return `
    <article class="tl-card anchor-card ${anchor.critical ? 'critical' : ''} ${timing ? `timing-${timing}` : ''}">
      ${anchorMeta(anchor, timing)}
      <h3>${escapeHtml(anchor.title)}</h3>
      ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
      ${actionClusterHtml(anchor)}
    </article>`;
}

function ticketHtml(anchor, timing) {
  return `
    <article class="tl-card ticket ${anchor.critical ? 'critical' : ''} ${timing ? `timing-${timing}` : ''}">
      <div class="ticket-main">
        ${anchorMeta(anchor, timing)}
        <h3>${escapeHtml(anchor.title)}</h3>
        ${anchor.leaveBy ? `<span class="chip-flag leaveby">Leave by ${escapeHtml(anchor.leaveBy)}</span>` : ''}
        ${anchor.note ? `<p>${escapeHtml(anchor.note)}</p>` : ''}
        ${actionClusterHtml(anchor)}
      </div>
      <div class="ticket-stub">
        <span class="ticket-mode">${escapeHtml(anchor.type || 'go')}</span>
        <span class="ticket-time">${escapeHtml(anchor.time)}</span>
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

  const focusTitle = annotated.find(({ timing }) => timing === 'next')?.anchor.title
    || annotated.find(({ timing }) => timing === 'current')?.anchor.title
    || annotated[0].anchor.title;
  const topIsFocus = annotated[0].anchor.title === focusTitle;

  const nowLine = selectedIsToday ? LOGIC.getNowLine(entry, new Date()) : null;
  const lineHtml = (frac) => `<div class="now-line" style="--frac:${frac}"><span>now</span></div>`;

  const body = annotated.map(({ anchor, timing }, i) => {
    const prevAnchor = annotated[i - 1]?.anchor;
    const leg = i > 0 ? LOGIC.getWalkLeg(prevAnchor, anchor) : null;
    const legHtml = leg && !leg.hidden ? `
    <div class="tl-walk">
      <span>↘ ${leg.minutes} min walk${leg.meters ? ` · ${leg.meters} m` : ''}</span>
    </div>` : '';

    let cardInner;
    if (i === 0 && topIsFocus && !TRAVEL_TYPES.has(anchor.type)) {
      cardInner = `<div class="tl-card is-echo"><span class="meta-time">${escapeHtml(anchor.time)}</span><span>${escapeHtml(anchor.title)} — shown above</span></div>`;
    } else {
      cardInner = anchorCardHtml(anchor, timing);
    }
    const card = `<div class="tl-row ${timing ? `timing-${timing}` : ''}">${cardInner}</div>`;
    const line = nowLine && nowLine.index === i ? lineHtml(nowLine.fraction) : '';
    return legHtml + card + line;
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
  const cityData = CITY_DATA[entry.city];
  const pool = LOGIC.getSuggestionPool(entry, cityData, reactionsByCity[entry.city] || []);
  const slots = Object.keys(pool);

  if (!slots.length) {
    $('#optionsSection').innerHTML = '';
    return;
  }

  $('#optionsSection').innerHTML = `
    <div class="section-head">
      <p class="eyebrow">Open slots</p>
      <h2>Loved picks for the gaps.</h2>
    </div>
    ${slots.map((slot) => `
      <div class="suggest-slot">
        <p class="suggest-slot-label">${escapeHtml(SLOT_LABELS[slot] || slot)} · open</p>
        <div class="suggest-grid">
          ${pool[slot].map((pick) => `
            <article class="suggest-card">
              <div class="suggest-head">
                ${pick.score > 0 ? `<span class="suggest-score">❤︎ ${pick.score}</span>` : ''}
                <span class="suggest-tags">${escapeHtml((pick.tags || '').split(' ').filter(Boolean).slice(0, 2).map((t) => '#' + t).join(' '))}</span>
              </div>
              <h3>${escapeHtml(pick.name)}</h3>
              ${pick.why ? `<p>${escapeHtml(pick.why)}</p>` : ''}
              ${actionClusterHtml(pick)}
              <button class="btn lock-it" type="button" data-lock="${escapeHtml(pick.name)}" data-slot="${escapeHtml(slot)}">Lock it in →</button>
            </article>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;

  document.querySelectorAll('[data-lock]').forEach((button) => {
    if (button.dataset.wired === '1') return;
    button.dataset.wired = '1';
    button.addEventListener('click', async () => {
      const text = `${button.dataset.slot}: ${button.dataset.lock}`;
      try { await navigator.clipboard.writeText(text); showToast('Copied — add to schedule'); }
      catch { showToast('Copy failed'); }
    });
  });
}

async function loadReactionsFor(city) {
  if (!city) return;
  try {
    if (typeof window.fetchReactions === 'function') {
      const result = await window.fetchReactions(city);
      reactionsByCity[city] = result?.data || [];
    }
  } catch {
    reactionsByCity[city] = reactionsByCity[city] || [];
  }

  if (!subscribedCities.has(city) && typeof window.subscribeReactions === 'function') {
    subscribedCities.add(city);
    window.subscribeReactions(city, async () => {
      try {
        const result = await window.fetchReactions(city);
        reactionsByCity[city] = result?.data || [];
      } catch { /* keep existing cache */ }
      render();
    });
  }

  render();
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
  wireActionCluster();
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

const MODE_KEY = 'today.walking';

function applyMode(mode) {
  const shell = document.querySelector('.today-shell');
  if (!shell) return;
  shell.dataset.mode = mode;
  const button = document.getElementById('modeToggle');
  if (button) {
    const walking = mode === 'walking';
    button.textContent = walking ? '🛋 Full' : '🚶 Walking';
    button.setAttribute('aria-pressed', walking ? 'true' : 'false');
  }
}

function initModeToggle() {
  const stored = localStorage.getItem(MODE_KEY) === '1' ? 'walking' : 'full';
  applyMode(stored);
  const button = document.getElementById('modeToggle');
  if (!button) return;
  button.addEventListener('click', () => {
    const next = document.querySelector('.today-shell')?.dataset.mode === 'walking' ? 'full' : 'walking';
    localStorage.setItem(MODE_KEY, next === 'walking' ? '1' : '0');
    applyMode(next);
  });
}

render();
initModeToggle();
startClock();

(function initReactions() {
  const entry = getEntry(selectedDate) || SCHEDULE[0];
  if (entry?.city) loadReactionsFor(entry.city);
})();
