const DATA = window.GALWAY_DATA;
const NOTES = window.GALWAY_NOTES;
let submitAuthorName = '';

let selectedDay = localStorage.getItem('galway.selectedDay') || 'thu';
let selectedPath = localStorage.getItem('galway.selectedPath') || 'pub-warm';
let noteState = loadNoteState();
let stampState = loadStampState();
const noteLabels = {};
const TRIP_SLUG = 'galway';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function slugify(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function optionId(type, name) {
  return `${type}:${slugify(name)}`;
}

function registerNoteLabel(id, label) {
  noteLabels[id] = label;
  return id;
}

function loadNoteState() {
  try {
    return NOTES.normalizeNotesState(JSON.parse(localStorage.getItem('galway.notes') || '{}'));
  } catch {
    return NOTES.createEmptyNotesState();
  }
}

function saveNoteState() {
  localStorage.setItem('galway.notes', JSON.stringify(noteState));
}

function rowToFeedback(row) {
  return { reaction: row.reaction || '', note: row.note || '' };
}

async function initSync() {
  const result = await window.fetchReactions(TRIP_SLUG);
  if (result.ok && result.data.length) {
    result.data.forEach((row) => {
      noteState = NOTES.saveOptionFeedback(noteState, row.card_id, row.author_name, rowToFeedback(row));
    });
    saveNoteState();
    renderAllDynamicSections();
  }

  window.subscribeReactions(TRIP_SLUG, (payload) => {
    if (!payload.new) return;
    const row = payload.new;
    noteState = NOTES.saveOptionFeedback(noteState, row.card_id, row.author_name, rowToFeedback(row));
    saveNoteState();
    const panel = document.querySelector(`.note-panel[data-note-id="${row.card_id}"]`);
    if (panel) updatePanelState(panel);
    renderNotesReview();
    renderFinalCut();
    renderGroupDashboard();
    renderDecisionsBanner();
  });
}

function loadStampState() {
  try {
    return JSON.parse(localStorage.getItem('galway.stamps') || '{}');
  } catch {
    return {};
  }
}

function saveStampState() {
  localStorage.setItem('galway.stamps', JSON.stringify(stampState));
}

function getOptionFeedback(id, author) {
  return noteState.items[id]?.[author] || { reaction: '', note: '' };
}

function statusClass(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('skip') || text.includes('avoid')) return 'skip';
  if (text.includes('maybe') || text.includes('protect') || text.includes('medium')) return 'maybe';
  return 'add';
}

function linkButtons(siteUrl, mapUrl) {
  return `
    <div class="link-grid">
      ${siteUrl ? `<a href="${siteUrl}" target="_blank" rel="noopener">${siteUrl.includes('google.com/maps') ? 'Open map' : 'Open site'}</a>` : ''}
      ${mapUrl ? `<a href="${mapUrl}" target="_blank" rel="noopener">Open map</a>` : ''}
    </div>
  `;
}

function labelize(value) {
  return String(value).replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function feedbackPanel(id, label) {
  registerNoteLabel(id, label);
  const count = NOTES.countOptionFeedback(noteState, id);
  return `
    <details class="note-panel ${count ? 'has-notes' : ''}" data-note-id="${id}">
      <summary class="note-panel-head"><span>Notes</span><em>${count ? `${count} saved` : 'Add reaction'}</em></summary>
      <div class="note-authors">
        ${NOTES.NOTE_AUTHORS.map((author) => {
          const feedback = getOptionFeedback(id, author);
          return `
            <div class="note-author" data-author="${author}">
              <div class="note-author-head">
                <strong>${author}</strong>
                <div class="reaction-row">
                  ${NOTES.NOTE_REACTIONS.map(([value, text]) => `
                    <button class="reaction-button ${feedback.reaction === value ? 'active' : ''}" type="button" data-reaction="${value}">${text}</button>
                  `).join('')}
                </div>
              </div>
              <textarea class="note-text" rows="2" placeholder="${author}'s note...">${escapeHtml(feedback.note)}</textarea>
            </div>
          `;
        }).join('')}
      </div>
      <a class="review-notes-link" href="#notes">Review all notes</a>
    </details>
    ${reactionSummaryRow(id)}
  `;
}

function reactionSummaryRow(id) {
  const summary = NOTES.getReactionSummary(noteState, id);
  const emojiMap = { love: '❤️', maybe: '👍', nope: '✗', concern: '⚠️' };
  const parts = Object.entries(summary)
    .filter(([, authors]) => authors.length > 0)
    .map(([reaction, authors]) => `<span class="rsummary-item" title="${authors.join(', ')}">${emojiMap[reaction]} ${authors.length}</span>`);
  if (!parts.length) return '';
  return `<div class="reaction-summary">${parts.join('')}</div>`;
}

function computeOpenDecisions() {
  const decisionIds = Object.keys(noteLabels).filter((id) => NOTES.cardTypeFromId(id) === 'decision');
  return decisionIds.filter((id) => NOTES.countOptionFeedback(noteState, id) < 2);
}

function renderDecisionsBanner() {
  const banner = document.getElementById('decisionsBanner');
  if (!banner) return;
  const open = computeOpenDecisions();
  if (!open.length) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.innerHTML = `
    <span class="decisions-count">${open.length} ${open.length === 1 ? 'thing needs' : 'things need'} a decision</span>
    <a href="#plan" class="decisions-link">Review →</a>
  `;
}

function updatePanelState(panel) {
  const id = panel.dataset.noteId;
  const count = NOTES.countOptionFeedback(noteState, id);
  panel.classList.toggle('has-notes', count > 0);
  const countLabel = panel.querySelector('.note-panel-head em');
  if (countLabel) countLabel.textContent = count ? `${count} saved` : 'Add reaction';
  panel.querySelectorAll('.note-author').forEach((authorBlock) => {
    const feedback = getOptionFeedback(id, authorBlock.dataset.author);
    authorBlock.querySelectorAll('.reaction-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.reaction === feedback.reaction);
    });
  });
}

function registerAllNoteLabels() {
  DATA.quickFacts.forEach((item) => registerNoteLabel(optionId('fact', item[0]), item[0]));
  DATA.verdicts.forEach((item) => registerNoteLabel(optionId('verdict', item.title), item.title));
  DATA.days.forEach((day) => registerNoteLabel(`day:${day.id}`, `${day.day}: ${day.title}`));
  DATA.paths.forEach((path) => registerNoteLabel(`path:${path.id}`, path.name));
  registerNoteLabel(`tour:${DATA.tour.id}`, DATA.tour.title);
  DATA.logistics.forEach((item) => registerNoteLabel(`logistics:${item[0]}`, item[1]));
  DATA.restaurants.forEach((item) => registerNoteLabel(`restaurant:${item.id}`, item.name));
  DATA.bars.forEach((item) => registerNoteLabel(`bar:${item[0]}`, item[2]));
  DATA.lunch.forEach((item) => registerNoteLabel(`lunch:${item[0]}`, item[2]));
  DATA.activities.forEach((item) => registerNoteLabel(`activity:${item.id}`, item.name));
  DATA.routes.forEach((route) => registerNoteLabel(`route:${route.id}`, route.title));
  DATA.warnings.forEach((item) => registerNoteLabel(`warning:${item[0]}`, item[1]));
  DATA.bookingTimeline.forEach((item) => registerNoteLabel(optionId('booking', item[1]), item[1]));
}

function toast(message) {
  const toastEl = $('#toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function copyText(text) {
  if (!navigator.clipboard) {
    toast('Copy unavailable');
    return;
  }
  navigator.clipboard.writeText(text).then(() => toast('Copied')).catch(() => toast('Copy unavailable'));
}

function renderVerdicts() {
  $('#verdictGrid').innerHTML = DATA.verdicts.map((item) => `
    <article class="verdict-card ${statusClass(item.status)}">
      <span class="status-badge">${item.status}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      ${feedbackPanel(optionId('verdict', item.title), item.title)}
    </article>
  `).join('');
}

function renderTimingBanner() {
  const timing = DATA.criticalTiming;
  $('#timingBanner').innerHTML = `
    <article class="timing-card">
      <span class="label">Critical timing</span>
      <h2>${timing.title}</h2>
      <p>${timing.text}</p>
      <div class="timing-facts">${timing.facts.map((fact) => `<span>${fact}</span>`).join('')}</div>
    </article>
  `;
}

function renderFacts() {
  $('#factGrid').innerHTML = DATA.quickFacts.map(([label, title, text, note]) => `
    <article class="fact-card">
      <span class="label">${label}</span>
      <h3>${title}</h3>
      <p>${text}</p>
      <div class="mini-note">${note}</div>
      ${feedbackPanel(optionId('fact', label), title)}
    </article>
  `).join('');
}

function renderChapters() {
  $('#chapterGrid').innerHTML = DATA.chapters.map((chapter, index) => {
    const day = DATA.days.find((item) => item.id === chapter.dayId);
    return `
      <article class="chapter-card" style="--img:url('${day.image}')">
        <div class="chapter-number">Chapter ${index + 1}</div>
        <h3>${chapter.title}</h3>
        <p>${chapter.subtitle}</p>
        <button class="chapter-jump" type="button" data-day-jump="${chapter.dayId}">${chapter.stamp}</button>
      </article>
    `;
  }).join('');

  $$('.chapter-jump').forEach((button) => {
    button.addEventListener('click', () => {
      selectedDay = button.dataset.dayJump;
      localStorage.setItem('galway.selectedDay', selectedDay);
      renderDayTabs();
      renderDayDetail();
      $('#plan').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderDayTabs() {
  $('#dayTabs').innerHTML = DATA.days.map((day) => `
    <button class="day-tab ${day.id === selectedDay ? 'active' : ''}" type="button" data-day="${day.id}">
      <span>${day.date}</span>
      <strong>${day.day}</strong>
    </button>
  `).join('');

  $$('#dayTabs .day-tab').forEach((button) => {
    button.addEventListener('click', () => {
      selectedDay = button.dataset.day;
      localStorage.setItem('galway.selectedDay', selectedDay);
      renderDayTabs();
      renderDayDetail();
    });
  });
}

function renderDayDetail() {
  const day = DATA.days.find((item) => item.id === selectedDay);
  const variants = Object.entries(day.variants || {});
  $('#dayDetail').innerHTML = `
    <div class="day-photo" style="--img:url('${day.image}')">
      <div class="floating-note">
        <span class="label">${day.day} · ${day.date}</span>
        <h3>${day.mood}</h3>
      </div>
    </div>
    <div class="day-body">
      <p class="eyebrow">${day.date}</p>
      <h3>${day.title}</h3>
      <div class="tag-row">${Object.entries(day.scores).map(([key, value]) => `<span class="tag">${key} ${value}/10</span>`).join('')}</div>
      <div class="timeline">${day.timeline.map(([time, text]) => `
        <div class="timeline-item"><div class="timeline-time">${time}</div><div>${text}</div></div>
      `).join('')}</div>
      <div class="variant-grid">
        ${variants.map(([name, text]) => `<div><strong>${labelize(name)}</strong><p>${text}</p></div>`).join('')}
      </div>
      <div class="watchouts"><strong>Optional ideas</strong><ul>${day.optional.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      <div class="watchouts caution"><strong>Watchouts</strong><ul>${day.watch.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      <div class="link-grid">${day.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join('')}</div>
      ${feedbackPanel(`day:${day.id}`, `${day.day}: ${day.title}`)}
    </div>
  `;
}

function renderPaths() {
  $('#pathPicker').innerHTML = DATA.paths.map((path) => `
    <button class="path-button ${path.id === selectedPath ? 'active' : ''}" type="button" data-path="${path.id}">
      <span class="label">${path.badge}</span>
      <h3>${path.name}</h3>
      <p>${path.best}</p>
    </button>
  `).join('');

  $$('#pathPicker .path-button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedPath = button.dataset.path;
      localStorage.setItem('galway.selectedPath', selectedPath);
      renderPaths();
      renderPathDetail();
    });
  });
}

function renderPathDetail() {
  const path = DATA.paths.find((item) => item.id === selectedPath) || DATA.paths[0];
  $('#pathDetail').innerHTML = `
    <article class="path-info">
      <p class="eyebrow">Selected mood</p>
      <h3>${path.name}</h3>
      <p>${path.best}</p>
      <div class="scorebars">${Object.entries(path.scores).map(([key, value]) => `
        <div class="score-row"><span>${key}</span><div class="bar"><span style="width:${value * 10}%"></span></div><strong>${value}</strong></div>
      `).join('')}</div>
      <div class="path-lists">
        <div><strong>Includes</strong><ul>${path.includes.map((item) => `<li>${item}</li>`).join('')}</ul></div>
        <div><strong>Cuts</strong><ul>${path.cuts.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      </div>
      <div class="callout"><strong>Why this works:</strong> ${path.why}</div>
      <div class="callout subtle"><strong>Tradeoff:</strong> ${path.tradeoff}</div>
      ${feedbackPanel(`path:${path.id}`, path.name)}
    </article>
  `;
}

function renderTour() {
  const tour = DATA.tour;
  $('#tourGrid').innerHTML = `
    <article class="tour-card">
      <span class="status-badge">Confirmed</span>
      <h3>${tour.title}</h3>
      <p class="role">${tour.provider} · ${tour.date} · ${tour.start}</p>
      <div class="tour-facts">
        <div><span>Travelers</span><strong>${tour.travelers}</strong></div>
        <div><span>Language</span><strong>${tour.language}</strong></div>
        <div><span>Duration</span><strong>${tour.duration}</strong></div>
        <div><span>Arrive by</span><strong>${tour.arriveBy}</strong></div>
        <div><span>Return anchor</span><strong>${tour.returnAnchor}</strong></div>
      </div>
      <div class="mini-note"><strong>Meeting point:</strong> ${tour.meetingPoint}<br>${tour.address}</div>
      <div class="callout"><strong>Note from Lally Tours:</strong> ${tour.note}</div>
      ${linkButtons(tour.link, tour.mapUrl)}
      ${feedbackPanel(`tour:${tour.id}`, tour.title)}
    </article>
  `;
}

function renderCardGrid(selector, items, type) {
  $(selector).innerHTML = items.map(([id, name, verdict, text, note, link]) => `
    <article class="option-card ${statusClass(verdict)}">
      <span class="status-badge">${verdict}</span>
      <h3>${name}</h3>
      <p>${text}</p>
      <div class="mini-note"><strong>Note:</strong> ${note}</div>
      ${link ? `<div class="link-grid"><a href="${link}" target="_blank" rel="noopener">${link.includes('google.com/maps') ? 'Open map' : 'Open site'}</a></div>` : ''}
      ${feedbackPanel(`${type}:${id}`, name)}
    </article>
  `).join('');
}

function renderRestaurants() {
  $('#restaurantGrid').innerHTML = DATA.restaurants.map((item) => `
    <article class="option-card ${statusClass(item.verdict)}">
      <div class="card-topline"><span class="rank">#${item.rank}</span><span class="status-badge">${item.verdict}</span></div>
      <h3>${item.name}</h3>
      <p class="role">${item.role}</p>
      <p>${item.why}</p>
      <div class="mini-note"><strong>Booking:</strong> ${item.booking}</div>
      ${item.sourceNote ? `<p class="source-note">${item.sourceNote}</p>` : ''}
      ${linkButtons(item.siteUrl, item.mapUrl)}
      ${feedbackPanel(`restaurant:${item.id}`, item.name)}
    </article>
  `).join('');
}

function renderRankedRows(selector, items, type) {
  $(selector).innerHTML = items.map(([id, rank, name, role, verdict, note, siteUrl, mapUrl]) => `
    <article class="option-card ${statusClass(verdict)}">
      <div class="card-topline"><span class="rank">#${rank}</span><span class="status-badge">${verdict}</span></div>
      <h3>${name}</h3>
      <p class="role">${role}</p>
      <p>${note}</p>
      ${linkButtons(siteUrl, mapUrl)}
      ${feedbackPanel(`${type}:${id}`, name)}
    </article>
  `).join('');
}

function renderActivities() {
  $('#activityGrid').innerHTML = DATA.activities.map((item) => `
    <article class="option-card ${statusClass(item.verdict)}">
      <span class="status-badge">${item.verdict}</span>
      <h3>${item.name}</h3>
      <p>${item.why}</p>
      <div class="mini-note"><strong>${item.price}</strong> · ${item.time}</div>
      ${item.variants ? `<div class="tiny-list">${Object.entries(item.variants).map(([name, text]) => `<p><strong>${labelize(name)}:</strong> ${text}</p>`).join('')}</div>` : ''}
      ${linkButtons(item.siteUrl, item.mapUrl)}
      ${feedbackPanel(`activity:${item.id}`, item.name)}
    </article>
  `).join('');
}

function renderRoutes() {
  $('#routeGrid').innerHTML = DATA.routes.map((route) => `
    <article class="route-card">
      <span class="label">${route.time}</span>
      <h3>${route.title}</h3>
      <ol>${route.stops.map((stop) => `<li>${stop}</li>`).join('')}</ol>
      <p>${route.note}</p>
      ${feedbackPanel(`route:${route.id}`, route.title)}
    </article>
  `).join('');
}

function renderWarnings() {
  $('#warningGrid').innerHTML = DATA.warnings.map(([id, name, level, text, link]) => `
    <article class="option-card ${level}">
      <span class="status-badge">${level === 'skip' ? 'Avoid' : 'Conditional'}</span>
      <h3>${name}</h3>
      <p>${text}</p>
      ${linkButtons('', link)}
      ${feedbackPanel(`warning:${id}`, name)}
    </article>
  `).join('');
}

function renderWeather() {
  const weather = DATA.weather;
  $('#weatherGrid').innerHTML = `
    <article class="weather-card wide">
      <span class="label">July reality</span>
      <h3>Rain shortens the plan, not the trip.</h3>
      <p>${weather.galwayJuly}</p>
      <div class="callout"><strong>Cliffs:</strong> ${weather.cliffsTourRain}</div>
      <div class="callout subtle"><strong>Galway evening:</strong> ${weather.galwayEveningRain}</div>
    </article>
    <article class="weather-card">
      <span class="label">Pack</span>
      <h3>Cliffs kit</h3>
      <ul>${weather.cliffsPacking.map((item) => `<li>${item}</li>`).join('')}</ul>
    </article>
    <article class="weather-card">
      <span class="label">Fallbacks</span>
      <h3>Warm and central</h3>
      <ul>${weather.indoorFallbacks.map((item) => `<li>${item}</li>`).join('')}</ul>
    </article>
  `;
}

function renderBookingTimeline() {
  $('#bookTimeline').innerHTML = DATA.bookingTimeline.map(([date, name, priority, actions]) => `
    <article class="book-step ${priority}">
      <div class="book-date">${date}</div>
      <div>
        <span class="label">${priority}</span>
        <h3>${name}</h3>
        <ul>${actions.map((action) => `<li>${action}</li>`).join('')}</ul>
        ${feedbackPanel(optionId('booking', name), name)}
      </div>
    </article>
  `).join('');
}

function renderMapPins() {
  $('#mapPinGrid').innerHTML = DATA.mapPins.map((pin) => `
    <a class="pin-card ${pin.category}" href="${pin.mapUrl}" target="_blank" rel="noopener">
      <span>${pin.category}</span>
      <strong>${pin.label}</strong>
      <em>${pin.note}</em>
    </a>
  `).join('');
}

function renderSourceNotes() {
  $('#sourceGrid').innerHTML = DATA.sourceNotes.map((source) => `
    <article class="source-card">
      <span class="label">${source.accessed}</span>
      <h3>${source.claim}</h3>
      <p>${source.note}</p>
      <div class="link-grid"><a href="${source.url}" target="_blank" rel="noopener">Open source</a></div>
    </article>
  `).join('');
}

function renderPassport() {
  const chosen = Object.values(stampState).filter(Boolean).length;
  $('#passportGrid').innerHTML = `
    <div class="passport-score"><span class="label">Stamped</span><strong>${chosen}/${DATA.stamps.length}</strong><p>Shared Galway motifs, saved on this browser.</p></div>
    <div class="stamp-grid">
      ${DATA.stamps.map(([id, title, subtitle]) => `
        <button class="stamp-card ${stampState[id] ? 'stamped' : ''}" type="button" data-stamp="${id}">
          <span>${stampState[id] ? 'Stamped' : 'Stamp'}</span><strong>${title}</strong><em>${subtitle}</em>
        </button>
      `).join('')}
    </div>
  `;
  $$('#passportGrid .stamp-card').forEach((button) => {
    button.addEventListener('click', () => {
      stampState = NOTES.toggleStamp(stampState, button.dataset.stamp);
      saveStampState();
      renderPassport();
    });
  });
}

function listCut(items, empty) {
  if (!items.length) return `<p>${empty}</p>`;
  return `<ul>${items.slice(0, 8).map((item) => `<li>${item.label}</li>`).join('')}</ul>`;
}

function renderFinalCut() {
  const cut = NOTES.buildFinalCut(noteState, noteLabels);
  $('#finalCutGrid').innerHTML = `
    <article class="final-card must"><span class="label">Must-do</span><h3>Protect these</h3>${listCut(cut.mustDo, 'All-love or near-all-love choices land here.')}</article>
    <article class="final-card maybe"><span class="label">Maybe</span><h3>Energy allows</h3>${listCut(cut.maybe, 'Soft maybes collect here.')}</article>
    <article class="final-card discuss"><span class="label">Discuss</span><h3>Group chat</h3>${listCut(cut.discuss, 'Mixed excitement and concern lands here.')}</article>
    <article class="final-card cut"><span class="label">Cut</span><h3>Let it go</h3>${listCut(cut.cut, 'No hard cuts yet.')}</article>
  `;
}

function renderGroupDashboard() {
  const analysis = NOTES.analyzeGroupDecisions(noteState, noteLabels);
  const cards = [
    ['allLove', 'All love', 'Easy yes'],
    ['loganLoves', 'Logan loves', 'Make the case'],
    ['emilyLoves', 'Emily loves', 'Protect'],
    ['ashleyLoves', 'Ashley loves', 'Priority'],
    ['maxLoves', 'Max loves', 'Pitch it'],
    ['conflictConcern', 'Conflict / concern', 'Discuss'],
    ['easyYes', 'Easy yes', 'No friction']
  ];
  $('#decisionDashboard').innerHTML = cards.map(([key, title, badge]) => {
    const items = analysis[key];
    return `
      <article class="decision-card">
        <span class="label">${badge}</span>
        <h3>${title}</h3>
        <strong class="decision-count">${items.length}</strong>
        ${items.length ? `<ul>${items.slice(0, 4).map((item) => `<li>${item.label}</li>`).join('')}</ul>` : '<p>No signal yet.</p>'}
      </article>
    `;
  }).join('');
}

function renderSuggestionsList() {
  if (!noteState.suggestions.length) return '<p class="muted">No missing suggestions yet.</p>';
  return `
    <div class="suggestion-list">
      ${noteState.suggestions.map((suggestion) => `
        <article class="suggestion-item">
          <span>${escapeHtml(suggestion.author)} · ${escapeHtml(suggestion.category)}</span>
          <h4>${escapeHtml(suggestion.title)}</h4>
          <p>${escapeHtml(suggestion.note)}</p>
          ${suggestion.url ? `<a href="${escapeHtml(suggestion.url)}" target="_blank" rel="noopener">Open link</a>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function renderNotesReview() {
  const summary = NOTES.getFeedbackSummary(noteState);
  $('#notesReview').innerHTML = `
    ${summary.length ? `
      <div class="notes-toolbar"><span>${summary.length} noted option${summary.length === 1 ? '' : 's'}</span></div>
      <div class="notes-grid">
        ${summary.map((item) => `
          <article class="note-summary-card">
            <h3>${noteLabels[item.optionId] || item.optionId}</h3>
            ${NOTES.NOTE_AUTHORS.map((author) => {
              const feedback = item[author];
              if (!NOTES.hasFeedback(feedback)) return '';
              const reaction = NOTES.formatReaction(feedback.reaction);
              return `<div class="summary-author"><span>${author}</span><p>${reaction ? `<strong>${reaction}</strong>` : ''}${reaction && feedback.note ? ' · ' : ''}${escapeHtml(feedback.note)}</p></div>`;
            }).join('')}
          </article>
        `).join('')}
      </div>
    ` : `
      <div class="empty-notes"><span class="label">No notes yet</span><h3>Leave reactions as you browse.</h3><p>Reactions sync when the database is available; this browser also keeps a local copy.</p></div>
    `}
    <div class="collab-grid primary-collab">
      <article class="collab-card suggestion-card">
        <span class="label">Missing idea</span><h3>Add a suggestion</h3>
        <form id="suggestionForm">
          <div class="form-row">
            <select name="author">${NOTES.NOTE_AUTHORS.map((author) => `<option>${author}</option>`).join('')}</select>
            <select name="category"><option>Restaurant</option><option>Pub</option><option>Activity</option><option>Logistics</option><option>Other</option></select>
          </div>
          <input name="title" placeholder="Suggestion title" />
          <input name="url" placeholder="Optional link" />
          <textarea name="note" rows="3" placeholder="Why should this be considered?"></textarea>
          <button class="btn primary" type="submit">Add suggestion</button>
        </form>
      </article>
    </div>
    <div class="suggestions-panel"><div class="notes-toolbar"><span>Missing suggestions</span></div>${renderSuggestionsList()}</div>
    <details class="backup-tools">
      <summary>Backup tools</summary>
      <div class="collab-grid">
        <article class="collab-card">
          <span class="label">Backup</span><h3>Copy local notes</h3><p>Use these only if database sync is unavailable or you need to move notes manually.</p>
          <button class="btn" type="button" id="copyNotesInline">Copy readable notes</button>
          <button class="btn" type="button" id="copySharePacket">Copy share packet</button>
          <div style="margin-top:0.75rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
            <select id="submitAuthorSelect" style="flex:1;min-width:0">
              <option value="">Your name</option>
              <option>Logan</option>
              <option>Emily</option>
              <option>Ashley</option>
              <option>Max</option>
            </select>
            <button class="btn" type="button" id="submitToLogan" disabled>Submit local backup</button>
          </div>
        </article>
        <article class="collab-card">
          <span class="label">Import</span><h3>Merge packet</h3><textarea id="sharePacketInput" rows="5" placeholder="Paste GALWAY_TRIP_NOTES_V1 packet here"></textarea><button class="btn" type="button" id="importSharePacket">Import notes</button>
        </article>
      </div>
    </details>
  `;
  bindCollaborationControls();
  const inlineCopy = $('#copyNotesInline');
  if (inlineCopy) inlineCopy.addEventListener('click', copyNotes);
}

function copyNotes() {
  copyText(NOTES.exportFeedbackText(noteState, noteLabels));
}

function copySharePacket() {
  copyText(NOTES.exportSharePacket(noteState));
}

function suggestionId(author, title) {
  return `suggestion:${slugify(author)}:${slugify(title)}:${Date.now()}`;
}

function bindCollaborationControls() {
  const copyPacket = $('#copySharePacket');
  if (copyPacket) copyPacket.addEventListener('click', copySharePacket);

  const nameSelect = $('#submitAuthorSelect');
  if (nameSelect) {
    nameSelect.value = submitAuthorName;
    nameSelect.addEventListener('change', () => {
      submitAuthorName = nameSelect.value;
      const btn = $('#submitToLogan');
      if (btn) btn.disabled = !submitAuthorName;
    });
  }

  const submitBtn = $('#submitToLogan');
  if (submitBtn) {
    submitBtn.disabled = !submitAuthorName;
    submitBtn.addEventListener('click', async () => {
      if (!submitAuthorName || !window.submitPacket) return;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      const result = await window.submitPacket('galway', submitAuthorName, NOTES.buildSubmissionPacket(noteState));
      if (result.ok) {
        submitBtn.textContent = 'Sent ✓';
      } else {
        submitBtn.textContent = 'Copy share packet instead';
        submitBtn.disabled = false;
        submitBtn.addEventListener('click', copySharePacket, { once: true });
      }
    });
  }

  const importPacket = $('#importSharePacket');
  if (importPacket) importPacket.addEventListener('click', () => {
    try {
      noteState = NOTES.mergeNotesStates(noteState, NOTES.parseSharePacket($('#sharePacketInput').value));
      saveNoteState();
      renderAllDynamicSections();
      toast('Imported notes');
    } catch {
      toast('Could not import that packet');
    }
  });

  const suggestionForm = $('#suggestionForm');
  if (suggestionForm) suggestionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(suggestionForm);
    const title = String(form.get('title') || '').trim();
    if (!title) {
      toast('Add a title');
      return;
    }
    noteState = NOTES.addSuggestion(noteState, {
      id: suggestionId(form.get('author'), title),
      author: String(form.get('author') || 'Logan'),
      category: String(form.get('category') || 'Restaurant'),
      title,
      note: String(form.get('note') || '').trim(),
      url: String(form.get('url') || '').trim()
    });
    saveNoteState();
    renderAllDynamicSections();
    toast('Suggestion saved');
  });
}

function bindNoteEvents() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.reaction-button');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const panel = button.closest('.note-panel');
    const author = button.closest('.note-author').dataset.author;
    const id = panel.dataset.noteId;
    const current = getOptionFeedback(id, author);
    const nextReaction = current.reaction === button.dataset.reaction ? '' : button.dataset.reaction;
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { reaction: nextReaction });
    saveNoteState();
    window.upsertReaction(TRIP_SLUG, id, NOTES.cardTypeFromId(id), author, nextReaction, noteState.items[id]?.[author]?.note || '');
    updatePanelState(panel);
    renderNotesReview();
    renderFinalCut();
    renderGroupDashboard();
  });

  document.addEventListener('input', (event) => {
    if (!event.target.classList.contains('note-text')) return;
    const panel = event.target.closest('.note-panel');
    const id = panel.dataset.noteId;
    const author = event.target.closest('.note-author').dataset.author;
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { note: event.target.value });
    saveNoteState();
    window.upsertReaction(TRIP_SLUG, id, NOTES.cardTypeFromId(id), author, noteState.items[id]?.[author]?.reaction || '', event.target.value);
    updatePanelState(panel);
    renderNotesReview();
    renderFinalCut();
    renderGroupDashboard();
  });
}

function finalSummary() {
  return `Galway July 2-3, 2026:
Thursday July 2: Train Dublin to Galway, 1:02pm-3:50pm. Optional compact walk, Cava Bodega or Ard Bia dinner, one trad pub, done around 11:00pm.
Friday July 3: Lally Tours From Galway: Cliffs of Moher Half-Day Express Trip. Meet outside HYDE Hotel, Forster Street at 7:45am for 8:00am departure. Treat return as around 1:30pm.
Friday July 3: Quick central lunch / bags / station buffer from about 1:30-2:30pm. Train Galway to Dublin, 3:05pm-5:44pm.`;
}

function renderAllDynamicSections() {
  renderTimingBanner();
  renderFacts();
  renderVerdicts();
  renderChapters();
  renderDayTabs();
  renderDayDetail();
  renderPaths();
  renderPathDetail();
  renderTour();
  renderCardGrid('#logisticsGrid', DATA.logistics, 'logistics');
  renderRestaurants();
  renderRankedRows('#barGrid', DATA.bars, 'bar');
  renderRankedRows('#lunchGrid', DATA.lunch, 'lunch');
  renderActivities();
  renderRoutes();
  renderWeather();
  renderWarnings();
  renderBookingTimeline();
  renderMapPins();
  renderSourceNotes();
  renderPassport();
  renderFinalCut();
  renderGroupDashboard();
  renderNotesReview();
}

function init() {
  registerAllNoteLabels();
  renderAllDynamicSections();
  bindNoteEvents();
  initSync();
  renderDecisionsBanner();

  $('#copyHero')?.addEventListener('click', () => copyText(finalSummary()));
  $('#copyFull').addEventListener('click', () => copyText(finalSummary()));
  $('#copyNotes').addEventListener('click', copyNotes);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: 0.01, rootMargin: '0px 0px -80px 0px' });
  $$('.reveal').forEach((element) => observer.observe(element));
}

init();
