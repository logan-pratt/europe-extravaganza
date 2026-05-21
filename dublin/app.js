const DATA = window.DUBLIN_DATA;
const NOTES = window.DUBLIN_NOTES;
let submitAuthorName = '';

let selectedDay = localStorage.getItem('dublin.selectedDay') || 'fri';
let selectedPath = localStorage.getItem('dublin.selectedPath') || 'pints-pages';
let noteState = loadNoteState();
let stampState = loadStampState();
const noteLabels = {};
const TRIP_SLUG = 'dublin';

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
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
    return NOTES.normalizeNotesState(JSON.parse(localStorage.getItem('dublin.notes') || '{}'));
  } catch {
    return NOTES.createEmptyNotesState();
  }
}

function saveNoteState() {
  localStorage.setItem('dublin.notes', JSON.stringify(noteState));
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
  });
}

function loadStampState() {
  try {
    return JSON.parse(localStorage.getItem('dublin.stamps') || '{}');
  } catch {
    return {};
  }
}

function saveStampState() {
  localStorage.setItem('dublin.stamps', JSON.stringify(stampState));
}

function getOptionFeedback(id, author) {
  return noteState.items[id]?.[author] || { reaction: '', note: '' };
}

function statusClass(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('skip') || text.includes('closed')) return 'skip';
  if (text.includes('maybe') || text.includes('rainy')) return 'maybe';
  return 'add';
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
  DATA.days.forEach((day) => registerNoteLabel(`day:${day.id}`, `${day.day}: ${day.title}`));
  DATA.paths.forEach((path) => registerNoteLabel(`path:${path.id}`, path.name));
  DATA.restaurants.forEach((item) => registerNoteLabel(`restaurant:${item[0]}`, item[2]));
  DATA.pubs.forEach((item) => registerNoteLabel(`pub:${item[0]}`, item[2]));
  DATA.activities.forEach((item) => registerNoteLabel(`activity:${item[0]}`, item[1]));
  DATA.warnings.forEach((item) => registerNoteLabel(`warning:${item[0]}`, item[1]));
  DATA.events.forEach((item) => registerNoteLabel(`event:${item[0]}`, item[1]));
  DATA.routes.forEach((route) => registerNoteLabel(`route:${route.id}`, route.title));
  DATA.bookingTimeline.forEach((item) => registerNoteLabel(optionId('booking', item[1]), item[1]));
  DATA.priceReality.forEach((item) => registerNoteLabel(optionId('price', item[0]), item[0]));
}

function toast(message) {
  const toastEl = $('#toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied'));
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
      localStorage.setItem('dublin.selectedDay', selectedDay);
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
      localStorage.setItem('dublin.selectedDay', selectedDay);
      renderDayTabs();
      renderDayDetail();
    });
  });
}

function renderDayDetail() {
  const day = DATA.days.find((item) => item.id === selectedDay);
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
        <div><strong>Low energy</strong><p>${day.variants.low}</p></div>
        <div><strong>Rain plan</strong><p>${day.variants.rain}</p></div>
      </div>
      <div class="watchouts"><strong>Stress-test notes</strong><ul>${day.watch.map((item) => `<li>${item}</li>`).join('')}</ul></div>
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
      localStorage.setItem('dublin.selectedPath', selectedPath);
      renderPaths();
      renderPathDetail();
    });
  });
}

function renderPathDetail() {
  const path = DATA.paths.find((item) => item.id === selectedPath);
  $('#pathDetail').innerHTML = `
    <article class="path-info">
      <p class="eyebrow">Selected path</p>
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

function renderRestaurants(filter = 'all') {
  const items = DATA.restaurants.filter((item) => filter === 'all' || item[8].includes(filter) || statusClass(item[4]) === filter);
  $('#restaurantGrid').innerHTML = items.map(([id, rank, name, role, verdict, why, booking, link]) => `
    <article class="option-card ${statusClass(verdict)}">
      <div class="card-topline"><span class="rank">#${rank}</span><span class="status-badge">${verdict}</span></div>
      <h3>${name}</h3>
      <p class="role">${role}</p>
      <p>${why}</p>
      <div class="mini-note"><strong>Booking:</strong> ${booking}</div>
      <div class="link-grid"><a href="${link}" target="_blank" rel="noopener">Open site</a></div>
      ${feedbackPanel(`restaurant:${id}`, name)}
    </article>
  `).join('');
}

function renderPubs(filter = 'all') {
  const items = DATA.pubs.filter((item) => filter === 'all' || statusClass(item[4]) === filter);
  $('#pubGrid').innerHTML = items.map(([id, rank, name, role, verdict, area, note, link]) => `
    <article class="option-card ${statusClass(verdict)}">
      <div class="card-topline"><span class="rank">#${rank}</span><span class="status-badge">${verdict}</span></div>
      <h3>${name}</h3>
      <p class="role">${role} · ${area}</p>
      <p>${note}</p>
      <div class="link-grid"><a href="${link}" target="_blank" rel="noopener">${link.includes('google.com/maps') ? 'Open map' : 'Open site'}</a></div>
      ${feedbackPanel(`pub:${id}`, name)}
    </article>
  `).join('');
}

function renderActivities() {
  $('#cultureGrid').innerHTML = DATA.activities.map(([id, name, verdict, why, price, time, link]) => `
    <article class="option-card ${statusClass(verdict)}">
      <span class="status-badge">${verdict}</span>
      <h3>${name}</h3>
      <p>${why}</p>
      <div class="mini-note"><strong>${price}</strong> · ${time}</div>
      <div class="link-grid"><a href="${link}" target="_blank" rel="noopener">Open site</a></div>
      ${feedbackPanel(`activity:${id}`, name)}
    </article>
  `).join('');
}

function renderWarnings() {
  $('#warningGrid').innerHTML = DATA.warnings.map(([id, name, level, text, link]) => `
    <article class="option-card ${level}">
      <span class="status-badge">${level === 'skip' ? 'Avoid' : 'Conditional'}</span>
      <h3>${name}</h3>
      <p>${text}</p>
      ${link ? `<div class="link-grid"><a href="${link}" target="_blank" rel="noopener">Source</a></div>` : ''}
      ${feedbackPanel(`warning:${id}`, name)}
    </article>
  `).join('');
}

function renderEvents() {
  $('#eventGrid').innerHTML = DATA.events.map(([id, name, date, verdict, place, why, link]) => `
    <article class="option-card ${statusClass(verdict)}">
      <span class="status-badge">${verdict}</span>
      <h3>${name}</h3>
      <p class="role">${date} · ${place}</p>
      <p>${why}</p>
      <div class="link-grid"><a href="${link}" target="_blank" rel="noopener">Open listing</a></div>
      ${feedbackPanel(`event:${id}`, name)}
    </article>
  `).join('');
}

function renderRoutes() {
  $('#routeGrid').innerHTML = DATA.routes.map((route) => `
    <article class="route-card">
      <span class="label">${route.stops.length} stops</span>
      <h3>${route.title}</h3>
      <ol>${route.stops.map((stop) => `<li>${stop}</li>`).join('')}</ol>
      <p>${route.note}</p>
      ${feedbackPanel(`route:${route.id}`, route.title)}
    </article>
  `).join('');
}

function renderMap() {
  $('#dublinMap').innerHTML = `
    <div class="map-river"></div>
    <div class="map-label west">Smithfield</div>
    <div class="map-label centre">Georgian core</div>
    <div class="map-label south">Camden / Marlin</div>
    ${DATA.mapPins.map(([id, label, x, y, target]) => `
      <button class="map-pin" type="button" style="--x:${x}%;--y:${y}%" data-target="${target}" data-pin="${id}">
        <span></span><strong>${label}</strong>
      </button>
    `).join('')}
  `;
  $$('#dublinMap .map-pin').forEach((button) => {
    button.addEventListener('click', () => document.querySelector(button.dataset.target).scrollIntoView({ behavior: 'smooth' }));
  });
}

function renderPassport() {
  const chosen = Object.values(stampState).filter(Boolean).length;
  $('#passportGrid').innerHTML = `
    <div class="passport-score"><span class="label">Stamped</span><strong>${chosen}/${DATA.stamps.length}</strong><p>Shared Dublin motifs, saved on this browser.</p></div>
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

function renderCountdown() {
  $('#countdownGrid').innerHTML = NOTES.getCountdownItems(new Date()).map((item) => `
    <article class="countdown-card ${item.status}">
      <span>${item.status === 'past' ? 'Passed' : item.status === 'today' ? 'Today' : 'In'}</span>
      <strong>${item.status === 'past' ? Math.abs(item.days) : item.days}</strong>
      <p>${item.label}</p>
    </article>
  `).join('');
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

function renderPrices() {
  $('#priceGrid').innerHTML = DATA.priceReality.map(([name, cost, note, link]) => `
    <article class="price-card">
      <span class="label">Budget</span>
      <h3>${name}</h3>
      <p><strong>${cost}</strong></p>
      <p>${note}</p>
      ${link ? `<div class="link-grid"><a href="${link}" target="_blank" rel="noopener">Source</a></div>` : ''}
      ${feedbackPanel(optionId('price', name), name)}
    </article>
  `).join('');
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
    <div class="send-instructions">
      <span class="label">How to send Logan your notes</span>
      <h3>React as you browse, then send one packet.</h3>
      <ol>
        <li>Pick your name on any card and tap Love, Maybe, Nope, or Concern.</li>
        <li>Add notes in the text boxes, plus any missing restaurant, pub, activity, or nightlife idea below.</li>
        <li>Come back to this Shared notes section and tap Copy share packet.</li>
        <li>Send the copied packet to Logan by text, Slack, email, or wherever the group is planning.</li>
      </ol>
      <p>Logan can paste that packet into Import notes to merge everyone’s feedback into one final cut.</p>
    </div>
    ${summary.length ? `
      <div class="notes-toolbar"><span>${summary.length} noted option${summary.length === 1 ? '' : 's'}</span><button class="btn" type="button" id="copyNotesInline">Copy readable notes</button></div>
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
      <div class="empty-notes"><span class="label">No notes yet</span><h3>Leave reactions as you browse.</h3><p>Four-person notes save locally in this browser.</p></div>
    `}
    <div class="collab-grid">
      <article class="collab-card">
        <span class="label">Export</span><h3>Copy share packet</h3><p>Send this to the group so another browser can import your notes.</p><button class="btn primary" type="button" id="copySharePacket">Copy share packet</button>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
          <select id="submitAuthorSelect" style="flex:1;min-width:0">
            <option value="">Your name</option>
            <option>Logan</option>
            <option>Emily</option>
            <option>Ashley</option>
            <option>Max</option>
          </select>
          <button class="btn" type="button" id="submitToLogan" disabled>Submit to Logan</button>
        </div>
      </article>
      <article class="collab-card">
        <span class="label">Import</span><h3>Merge packet</h3><textarea id="sharePacketInput" rows="5" placeholder="Paste DUBLIN_TRIP_NOTES_V1 packet here"></textarea><button class="btn" type="button" id="importSharePacket">Import notes</button>
      </article>
      <article class="collab-card suggestion-card">
        <span class="label">Missing idea</span><h3>Add a suggestion</h3>
        <form id="suggestionForm">
          <div class="form-row">
            <select name="author">${NOTES.NOTE_AUTHORS.map((author) => `<option>${author}</option>`).join('')}</select>
            <select name="category"><option>Activity</option><option>Restaurant</option><option>Place</option><option>Pub</option><option>Nightlife</option><option>Other</option></select>
          </div>
          <input name="title" placeholder="Suggestion title" />
          <input name="url" placeholder="Optional link" />
          <textarea name="note" rows="3" placeholder="Why should this be considered?"></textarea>
          <button class="btn primary" type="submit">Add suggestion</button>
        </form>
      </article>
    </div>
    <div class="suggestions-panel"><div class="notes-toolbar"><span>Missing suggestions</span></div>${renderSuggestionsList()}</div>
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
      const result = await window.submitPacket('dublin', submitAuthorName, NOTES.buildSubmissionPacket(noteState));
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
      category: String(form.get('category') || 'Activity'),
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
  return `Dublin July 3-5, 2026:
Friday: Galway train 3:05pm, arrive Dublin 5:44pm, Marlin reset, first pint, Mister S, O’Donoghue’s or Cobblestone.
Saturday: Georgian walk, one cultural anchor, Delahunt default or Library Street alternative, trad/session night depending energy.
Sunday: coffee, one short stroll only, taxi/airport buffer for London.
Avoid: Chester Beatty, Dublin Castle campus, Howth/Poolbeg, hop-on-hop-off, long museum blocks.`;
}

function applyPresentationMode(enabled) {
  document.body.classList.toggle('presentation-mode', enabled);
  localStorage.setItem('dublin.presentationMode', enabled ? 'true' : 'false');
  const button = $('#presentationToggle');
  if (!button) return;
  button.textContent = enabled ? 'Exit presentation' : 'Presentation mode';
  button.setAttribute('aria-pressed', String(enabled));
}

function bindPresentationMode() {
  applyPresentationMode(localStorage.getItem('dublin.presentationMode') === 'true');
  $('#presentationToggle')?.addEventListener('click', () => {
    applyPresentationMode(!document.body.classList.contains('presentation-mode'));
  });
}

function renderAllDynamicSections() {
  const restaurantFilter = $('.chip[data-restaurant-filter].active')?.dataset.restaurantFilter || 'all';
  const pubFilter = $('.chip[data-pub-filter].active')?.dataset.pubFilter || 'all';
  renderVerdicts();
  renderChapters();
  renderDayTabs();
  renderDayDetail();
  renderPaths();
  renderPathDetail();
  renderRestaurants(restaurantFilter);
  renderPubs(pubFilter);
  renderActivities();
  renderWarnings();
  renderEvents();
  renderRoutes();
  renderMap();
  renderPassport();
  renderFinalCut();
  renderGroupDashboard();
  renderCountdown();
  renderBookingTimeline();
  renderPrices();
  renderNotesReview();
}

function init() {
  registerAllNoteLabels();
  renderAllDynamicSections();
  bindNoteEvents();
  bindPresentationMode();
  initSync();

  $('#copyHero').addEventListener('click', () => copyText(finalSummary()));
  $('#copyFull').addEventListener('click', () => copyText(finalSummary()));
  $('#copyNotes').addEventListener('click', copyNotes);

  $$('.chip[data-restaurant-filter]').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip[data-restaurant-filter]').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    renderRestaurants(chip.dataset.restaurantFilter);
  }));
  $$('.chip[data-pub-filter]').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip[data-pub-filter]').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    renderPubs(chip.dataset.pubFilter);
  }));

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: 0.01, rootMargin: '0px 0px -80px 0px' });
  $$('.reveal').forEach((element) => observer.observe(element));
}

init();
