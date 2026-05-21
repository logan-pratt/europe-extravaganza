const DATA = window.GALWAY_DATA;
const NOTES = window.GALWAY_NOTES;

let selectedDay = localStorage.getItem('galway.selectedDay') || 'thu';
let noteState = loadNoteState();
let stampState = loadStampState();
const noteLabels = {};

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
    return NOTES.normalizeNotesState(JSON.parse(localStorage.getItem('galway.notes') || '{}'));
  } catch {
    return NOTES.createEmptyNotesState();
  }
}

function saveNoteState() {
  localStorage.setItem('galway.notes', JSON.stringify(noteState));
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
  if (text.includes('maybe') || text.includes('protect')) return 'maybe';
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
  DATA.verdicts.forEach((item) => registerNoteLabel(optionId('verdict', item.title), item.title));
  DATA.days.forEach((day) => registerNoteLabel(`day:${day.id}`, `${day.day}: ${day.title}`));
  registerNoteLabel(`tour:${DATA.tour.id}`, DATA.tour.title);
  DATA.logistics.forEach((item) => registerNoteLabel(`logistics:${item[0]}`, item[1]));
  DATA.ideas.forEach((item) => registerNoteLabel(`idea:${item[0]}`, item[1]));
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
      <div class="watchouts"><strong>Watchouts</strong><ul>${day.watch.map((item) => `<li>${item}</li>`).join('')}</ul></div>
      <div class="link-grid">${day.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join('')}</div>
      ${feedbackPanel(`day:${day.id}`, `${day.day}: ${day.title}`)}
    </div>
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
      </div>
      <div class="mini-note"><strong>Meeting point:</strong> ${tour.meetingPoint}<br>${tour.address}</div>
      <div class="callout"><strong>Note from Lally Tours:</strong> ${tour.note}</div>
      <div class="link-grid"><a href="${tour.link}" target="_blank" rel="noopener">Open map</a></div>
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
    <div class="send-instructions">
      <span class="label">How to send Logan your notes</span>
      <h3>React as you browse, then send one packet.</h3>
      <ol>
        <li>Pick your name on any card and tap Love, Maybe, Nope, or Concern.</li>
        <li>Add notes in the text boxes, plus any missing restaurant, pub, activity, or logistics idea below.</li>
        <li>Come back to this Shared notes section and tap Copy share packet.</li>
        <li>Send the copied packet to Logan so feedback can be merged.</li>
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
      </article>
      <article class="collab-card">
        <span class="label">Import</span><h3>Merge packet</h3><textarea id="sharePacketInput" rows="5" placeholder="Paste GALWAY_TRIP_NOTES_V1 packet here"></textarea><button class="btn" type="button" id="importSharePacket">Import notes</button>
      </article>
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
    updatePanelState(panel);
    renderNotesReview();
    renderFinalCut();
    renderGroupDashboard();
  });

  document.addEventListener('input', (event) => {
    if (!event.target.classList.contains('note-text')) return;
    const panel = event.target.closest('.note-panel');
    noteState = NOTES.saveOptionFeedback(noteState, panel.dataset.noteId, event.target.closest('.note-author').dataset.author, { note: event.target.value });
    saveNoteState();
    updatePanelState(panel);
    renderNotesReview();
    renderFinalCut();
    renderGroupDashboard();
  });
}

function finalSummary() {
  return `Galway July 2-3, 2026:
Thursday July 2: Train Dublin to Galway, 1:02pm-3:50pm. Keep arrival evening flexible for dinner, pubs, or a short walk.
Friday July 3: Lally Tours From Galway: Cliffs of Moher Half-Day Express Trip. Meet outside HYDE Hotel, Forster Street at 7:45am for 8:00am departure. Tour is 5 hours, English, 2 adults listed.
Friday July 3: Train Galway to Dublin, 3:05pm-5:44pm.`;
}

function renderAllDynamicSections() {
  renderVerdicts();
  renderChapters();
  renderDayTabs();
  renderDayDetail();
  renderTour();
  renderCardGrid('#logisticsGrid', DATA.logistics, 'logistics');
  renderCardGrid('#ideaGrid', DATA.ideas, 'idea');
  renderPassport();
  renderFinalCut();
  renderGroupDashboard();
  renderNotesReview();
}

function init() {
  registerAllNoteLabels();
  renderAllDynamicSections();
  bindNoteEvents();

  $('#copyHero').addEventListener('click', () => copyText(finalSummary()));
  $('#copyFull').addEventListener('click', () => copyText(finalSummary()));
  $('#copyNotes').addEventListener('click', copyNotes);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: 0.01, rootMargin: '0px 0px -80px 0px' });
  $$('.reveal').forEach((element) => observer.observe(element));
}

init();
