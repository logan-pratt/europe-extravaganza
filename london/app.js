const DATA = window.TRIP_DATA;
const NOTES = window.LONDON_NOTES;
let selectedDay = localStorage.getItem('london.selectedDay') || 'sun';
let selectedPath = localStorage.getItem('london.selectedPath') || 'B';
let noteState = loadNoteState();
let stampState = loadStampState();
const noteLabels = {};
const DAY_CHAPTERS = [
  {
    dayId: 'sun',
    title: 'Soft Landing',
    subtitle: 'Bloomsbury, pub glass, first-night London glow',
    stamp: 'Bloomsbury'
  },
  {
    dayId: 'mon',
    title: 'The Spa Date',
    subtitle: 'Bath turns into romance when the day has room',
    stamp: 'Bath'
  },
  {
    dayId: 'tue',
    title: 'Grass Court Fever',
    subtitle: 'Queue early, wander the grounds, make Wimbledon the ritual',
    stamp: 'Wimbledon'
  },
  {
    dayId: 'wed',
    title: 'The Final London Night',
    subtitle: 'Markets, river light, theater, and Clos Maggiore',
    stamp: 'Covent Garden'
  },
  {
    dayId: 'thu',
    title: 'Last Look',
    subtitle: 'Coffee, Russell Square, and enough airport buffer',
    stamp: 'Departure'
  }
];
const MAP_PINS = [
  { id: 'hotel', label: 'Kimpton Fitzroy', x: 49, y: 35, target: '#plan' },
  { id: 'bath', label: 'Bath day', x: 13, y: 67, day: 'mon' },
  { id: 'wimbledon', label: 'Wimbledon', x: 34, y: 78, target: '#wimbledon' },
  { id: 'soho', label: 'Andrew Edmunds', x: 43, y: 47, target: '#food' },
  { id: 'borough', label: 'Borough walk', x: 58, y: 61, target: '#walks' },
  { id: 'covent', label: 'Clos Maggiore', x: 50, y: 50, target: '#wednesday' },
  { id: 'islington', label: 'Friend dinner', x: 62, y: 30, target: '#food' },
  { id: 'studio', label: 'Studio Tour', x: 77, y: 16, path: 'A' }
];
const PASSPORT_STAMPS = [
  ['bloomsbury', 'Bloomsbury', 'Arrival glow'],
  ['bath', 'Bath', 'Spa date'],
  ['wimbledon', 'Wimbledon', 'Grass courts'],
  ['soho', 'Soho', 'Andrew Edmunds'],
  ['south-bank', 'South Bank', 'River walk'],
  ['covent-garden', 'Covent Garden', 'Final dinner'],
  ['west-end', 'West End', 'The Mousetrap'],
  ['primrose-hill', 'Primrose Hill', 'Sunset option']
];

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
    return NOTES.normalizeNotesState(JSON.parse(localStorage.getItem('london.notes') || '{}'));
  } catch {
    return NOTES.createEmptyNotesState();
  }
}

function saveNoteState() {
  localStorage.setItem('london.notes', JSON.stringify(noteState));
}

function loadStampState() {
  try {
    return JSON.parse(localStorage.getItem('london.stamps') || '{}');
  } catch {
    return {};
  }
}

function saveStampState() {
  localStorage.setItem('london.stamps', JSON.stringify(stampState));
}

function getOptionFeedback(id, author) {
  return noteState.items[id]?.[author] || { reaction: '', note: '' };
}

function feedbackPanel(id, label) {
  registerNoteLabel(id, label);
  const feedbackCount = NOTES.countOptionFeedback(noteState, id);
  const hasNotes = feedbackCount > 0;
  return `
    <details class="note-panel ${hasNotes ? 'has-notes' : ''}" data-note-id="${id}">
      <summary class="note-panel-head">
        <span>Notes</span>
        <em>${hasNotes ? `${feedbackCount} saved` : 'Add reaction'}</em>
      </summary>
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
  const feedbackCount = NOTES.countOptionFeedback(noteState, id);
  panel.classList.toggle('has-notes', feedbackCount > 0);
  const countLabel = panel.querySelector('.note-panel-head em');
  if (countLabel) countLabel.textContent = feedbackCount ? `${feedbackCount} saved` : 'Add reaction';
  panel.querySelectorAll('.note-author').forEach((authorBlock) => {
    const author = authorBlock.dataset.author;
    const feedback = getOptionFeedback(id, author);
    authorBlock.querySelectorAll('.reaction-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.reaction === feedback.reaction);
    });
  });
}

function registerAllNoteLabels() {
  DATA.days.forEach((day) => registerNoteLabel(`day:${day.id}`, `${day.day}: ${day.title}`));
  Object.entries(DATA.paths).forEach(([id, path]) => registerNoteLabel(`path:${id}`, path.name));
  DATA.restaurantGuides.forEach((item) => registerNoteLabel(optionId('restaurant', item.name), item.name));
  DATA.priceReality.forEach((item) => registerNoteLabel(optionId('price', item.name), item.name));
  DATA.wildcards.forEach((item) => registerNoteLabel(optionId('wildcard', item.name), item.name));
  DATA.seasonalEvents.forEach((item) => registerNoteLabel(optionId('seasonal', item.name), item.name));
  DATA.romanticUpgrades.forEach((item) => registerNoteLabel(optionId('upgrade', item.name), item.name));
  DATA.overstuffWarnings.forEach((item) => registerNoteLabel(optionId('warning', item.name), item.name));
  DATA.bookingTimeline.forEach((item) => registerNoteLabel(optionId('booking', item.name), item.name));
  DATA.experiences.forEach((item) => registerNoteLabel(optionId('experience', item[0]), item[0]));
}

function toast(message) {
  const toastEl = $('#toast');
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function setTheme() {
  const isDark = localStorage.getItem('london.dark') === 'true';
  document.documentElement.classList.toggle('dark', isDark);
  $('#themeToggle').textContent = isDark ? '☀' : '☾';
}

function renderDayChapters() {
  $('#chapterGrid').innerHTML = DAY_CHAPTERS.map((chapter, index) => {
    const day = DATA.days.find((item) => item.id === chapter.dayId);
    return `
      <article class="chapter-card" style="--img:url('${day.hero}')">
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
      localStorage.setItem('london.selectedDay', selectedDay);
      renderDayTabs();
      renderDayDetail();
      document.getElementById('plan').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderCoupleDashboard() {
  const analysis = NOTES.analyzeCoupleDecisions(noteState, noteLabels);
  const cards = [
    ['bothLove', 'Both love', 'Easy yes', 'These are the moments with no debate.'],
    ['loganLoves', 'Logan loves', 'Make the case', 'Worth keeping if Emily is not against it.'],
    ['emilyLoves', 'Emily loves', 'Protect these', 'These should get priority oxygen.'],
    ['potentialConflict', 'Potential conflict', 'Talk it out', 'One person is excited, the other is wary.'],
    ['logisticsConcern', 'Logistics concern', 'Stress check', 'Good idea, but watch the clock.']
  ];

  $('#decisionDashboard').innerHTML = cards.map(([key, title, badge, empty]) => {
    const items = analysis[key];
    return `
      <article class="decision-card ${key}">
        <span class="label">${badge}</span>
        <h3>${title}</h3>
        <strong class="decision-count">${items.length}</strong>
        ${items.length ? `<ul>${items.slice(0, 4).map((item) => `<li>${item.label}</li>`).join('')}</ul>` : `<p>${empty}</p>`}
      </article>
    `;
  }).join('');
}

function renderLoveMap() {
  $('#loveMap').innerHTML = `
    <div class="map-river"></div>
    <div class="map-label west">Bath / west</div>
    <div class="map-label centre">Central London</div>
    <div class="map-label north">North London</div>
    ${MAP_PINS.map((pin) => `
      <button class="map-pin" type="button" style="--x:${pin.x}%;--y:${pin.y}%" data-pin="${pin.id}">
        <span></span>
        <strong>${pin.label}</strong>
      </button>
    `).join('')}
  `;

  $$('.map-pin').forEach((button) => {
    button.addEventListener('click', () => {
      const pin = MAP_PINS.find((item) => item.id === button.dataset.pin);
      if (pin.day) {
        selectedDay = pin.day;
        localStorage.setItem('london.selectedDay', selectedDay);
        renderDayTabs();
        renderDayDetail();
        document.getElementById('plan').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (pin.path) {
        selectedPath = pin.path;
        localStorage.setItem('london.selectedPath', selectedPath);
        renderPathPicker();
        renderPathDetail();
      }
      document.querySelector(pin.target || '#top').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderPassportStamps() {
  const chosen = Object.values(stampState).filter(Boolean).length;
  $('#passportGrid').innerHTML = `
    <div class="passport-score">
      <span class="label">Stamped</span>
      <strong>${chosen}/${PASSPORT_STAMPS.length}</strong>
      <p>Your chosen London motifs, saved on this browser.</p>
    </div>
    <div class="stamp-grid">
      ${PASSPORT_STAMPS.map(([id, title, subtitle]) => `
        <button class="stamp-card ${stampState[id] ? 'stamped' : ''}" type="button" data-stamp="${id}">
          <span>${stampState[id] ? 'Stamped' : 'Stamp'}</span>
          <strong>${title}</strong>
          <em>${subtitle}</em>
        </button>
      `).join('')}
    </div>
  `;

  $$('.stamp-card').forEach((button) => {
    button.addEventListener('click', () => {
      stampState = NOTES.toggleStamp(stampState, button.dataset.stamp);
      saveStampState();
      renderPassportStamps();
    });
  });
}

function listFinalCutItems(items, emptyText) {
  if (!items.length) return `<p>${emptyText}</p>`;
  return `<ul>${items.slice(0, 6).map((item) => `<li>${item.label}</li>`).join('')}</ul>`;
}

function renderFinalCut() {
  const cut = NOTES.buildFinalCut(noteState, noteLabels);
  $('#finalCutGrid').innerHTML = `
    <article class="final-card must">
      <span class="label">Must-do</span>
      <h3>Protect these</h3>
      ${listFinalCutItems(cut.mustDo, 'React to a few cards and the site will start calling the easy yeses.')}
    </article>
    <article class="final-card maybe">
      <span class="label">Maybe</span>
      <h3>Energy permitting</h3>
      ${listFinalCutItems(cut.maybe, 'Your soft maybes will collect here.')}
    </article>
    <article class="final-card discuss">
      <span class="label">Discuss</span>
      <h3>Needs a conversation</h3>
      ${listFinalCutItems(cut.discuss, 'Anything split between excitement and resistance lands here.')}
    </article>
    <article class="final-card cut">
      <span class="label">Cut</span>
      <h3>Let it go</h3>
      ${listFinalCutItems(cut.cut, 'No hard cuts yet. That is either harmony or not enough reactions.')}
    </article>
  `;
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

function refreshWowSurfaces() {
  renderCoupleDashboard();
  renderFinalCut();
}

function renderDayTabs() {
  const wrapper = $('#dayTabs');
  wrapper.innerHTML = DATA.days.map((day) => `
    <button class="day-tab ${day.id === selectedDay ? 'active' : ''}" data-day="${day.id}">
      <span>${day.date}</span>
      <strong>${day.day}</strong>
    </button>
  `).join('');

  wrapper.querySelectorAll('.day-tab').forEach((button) => {
    button.addEventListener('click', () => {
      selectedDay = button.dataset.day;
      localStorage.setItem('london.selectedDay', selectedDay);
      renderDayTabs();
      renderDayDetail();
    });
  });
}

function getWednesdayTimeline() {
  return DATA.paths[selectedPath].timeline;
}

function renderDayDetail() {
  const day = DATA.days.find((item) => item.id === selectedDay);
  const timeline = day.id === 'wed' ? getWednesdayTimeline() : day.timeline;
  const title = day.id === 'wed' ? `${day.title}: ${DATA.paths[selectedPath].name}` : day.title;
  const mood = day.id === 'wed' ? DATA.paths[selectedPath].badge : day.mood;
  const hero = day.id === 'wed' ? DATA.paths[selectedPath].hero : day.hero;
  const score = day.id === 'wed' ? DATA.paths[selectedPath].scores : day.score;

  $('#dayDetail').innerHTML = `
    <div class="day-photo" style="--img:url('${hero}')">
      <div class="floating-note">
        <span class="label">${day.day} · ${day.date}</span>
        <h3>${mood}</h3>
      </div>
    </div>
    <div class="day-body">
      <p class="eyebrow">${day.date}</p>
      <h3>${title}</h3>
      <div class="tag-row">
        ${Object.entries(score).map(([key, value]) => `<span class="tag">${key} ${value}/10</span>`).join('')}
      </div>
      <div class="timeline">
        ${timeline.map(([time, text]) => `
          <div class="timeline-item">
            <div class="timeline-time">${time}</div>
            <div>${text}</div>
          </div>
        `).join('')}
      </div>
      <div class="watchouts">
        <strong>Stress-test notes</strong>
        <ul>${day.watch.map((watchout) => `<li>${watchout}</li>`).join('')}</ul>
      </div>
      <div class="link-grid">
        ${day.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name} ↗</a>`).join('')}
      </div>
      ${feedbackPanel(`day:${day.id}`, `${day.day}: ${day.title}`)}
    </div>
  `;
}

function renderPathPicker() {
  const wrapper = $('#pathPicker');
  wrapper.innerHTML = Object.entries(DATA.paths).map(([id, path]) => `
    <button class="path-button ${id === selectedPath ? 'active' : ''}" data-path="${id}">
      <span class="label">${id === 'B' ? 'Recommended' : id === 'C' ? 'Skip unless' : 'Optional'}</span>
      <h3>${path.name}</h3>
      <p>${path.badge}</p>
    </button>
  `).join('');

  wrapper.querySelectorAll('.path-button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedPath = button.dataset.path;
      localStorage.setItem('london.selectedPath', selectedPath);
      renderPathPicker();
      renderPathDetail();
      if (selectedDay === 'wed') renderDayDetail();
      toast(`Selected ${DATA.paths[selectedPath].name}`);
    });
  });
}

function renderPathDetail() {
  const path = DATA.paths[selectedPath];
  $('#pathPhoto').style.setProperty('--img', `url('${path.hero}')`);
  $('#pathName').textContent = path.name;
  $('#pathBest').textContent = path.best;
  $('#pathWhy').textContent = path.why;
  $('#pathTradeoff').textContent = path.trade;
  $('#pathScores').innerHTML = Object.entries(path.scores).map(([key, value]) => `
    <div class="score-row">
      <span>${key}</span>
      <div class="bar"><span style="width:${value * 10}%"></span></div>
      <strong>${value}</strong>
    </div>
  `).join('');
  $('#pathTimeline').innerHTML = path.timeline.map(([time, text]) => `
    <div class="timeline-item">
      <div class="timeline-time">${time}</div>
      <div>${text}</div>
    </div>
  `).join('');
  const noteSlot = $('#pathNoteSlot') || document.createElement('div');
  noteSlot.id = 'pathNoteSlot';
  noteSlot.innerHTML = feedbackPanel(`path:${selectedPath}`, path.name);
  if (!$('#pathNoteSlot')) $('.path-info').append(noteSlot);
}

function renderPathCalculator() {
  const wrapper = $('#pathCalculator');
  wrapper.innerHTML = `
    <div class="calculator-copy">
      <p class="eyebrow">Wednesday path calculator</p>
      <h3 id="calcResultTitle"></h3>
      <p id="calcResultText"></p>
      <div class="calc-score-grid" id="calcScores"></div>
    </div>
    <div class="slider-stack">
      ${[
        ['hp', 'HP importance', 4],
        ['london', 'London atmosphere', 9],
        ['romance', 'Romance', 9],
        ['stress', 'Stress tolerance', 5]
      ].map(([id, label, value]) => `
        <label class="calc-slider">
          <span><strong>${label}</strong><em id="${id}Value">${value}</em></span>
          <input type="range" min="0" max="10" value="${value}" data-calc="${id}">
        </label>
      `).join('')}
    </div>
  `;

  wrapper.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('input', updatePathCalculation);
  });
  updatePathCalculation();
}

function updatePathCalculation() {
  const values = Object.fromEntries($$('#pathCalculator input[type="range"]').map((input) => [input.dataset.calc, Number(input.value)]));
  Object.entries(values).forEach(([key, value]) => {
    const label = $(`#${key}Value`);
    if (label) label.textContent = value;
  });

  const scores = {
    A: (values.hp * 1.55) + (values.romance * 1.05) + ((10 - values.stress) * 0.55) + ((10 - values.london) * 0.4),
    B: (values.london * 1.5) + (values.romance * 1.25) + ((10 - values.hp) * 0.35) + ((10 - Math.abs(values.stress - 5)) * 0.65),
    C: (values.hp * 1.15) + (values.london * 1.05) + (values.romance * 0.9) + (values.stress * 1.25) - 6
  };
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const result = DATA.paths[winner];
  const warnings = {
    A: 'Best when HP matters more than central London wandering.',
    B: 'Best when romance and London atmosphere matter most.',
    C: 'Only makes sense with very high stress tolerance. Treat the warning seriously.'
  };

  $('#calcResultTitle').textContent = `${result.name}`;
  $('#calcResultText').textContent = warnings[winner];
  $('#calcScores').innerHTML = Object.entries(scores).map(([id, score]) => `
    <button class="calc-pill ${id === winner ? 'active' : ''}" data-path-jump="${id}">
      <span>${id}</span>
      <strong>${Math.max(0, Math.round(score))}</strong>
    </button>
  `).join('');

  $$('#calcScores button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedPath = button.dataset.pathJump;
      localStorage.setItem('london.selectedPath', selectedPath);
      renderPathPicker();
      renderPathDetail();
      if (selectedDay === 'wed') renderDayDetail();
    });
  });
}

function restaurantTags(restaurant) {
  return ['all', ...(restaurant.tags || [])];
}

function renderRestaurants(filter = 'all') {
  const items = DATA.restaurantGuides.filter((restaurant) => restaurantTags(restaurant).includes(filter));
  $('#restaurantGrid').innerHTML = items.map((restaurant) => `
    <article class="restaurant-card order-card">
      <div class="restaurant-img" style="--img:url('${restaurant.image}')"></div>
      <div class="restaurant-content">
        <div class="card-topline">
          <span class="label">${restaurant.role}</span>
          <span class="tiny-note">${restaurant.best}</span>
        </div>
        <h3>${restaurant.name}</h3>
        <p><strong>${restaurant.verdict}</strong></p>
        <details open>
          <summary>What to order</summary>
          <ul>${restaurant.order.map((item) => `<li>${item}</li>`).join('')}</ul>
        </details>
        <details>
          <summary>Price reality</summary>
          <p>${restaurant.price}</p>
        </details>
        <details>
          <summary>Booking notes</summary>
          <p>${restaurant.booking}</p>
        </details>
        <div class="link-grid">
          ${restaurant.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name} ↗</a>`).join('')}
        </div>
        ${feedbackPanel(optionId('restaurant', restaurant.name), restaurant.name)}
      </div>
    </article>
  `).join('');
}

function renderPriceReality() {
  $('#priceGrid').innerHTML = DATA.priceReality.map((item) => `
    <article class="price-card">
      <span class="label">Budget</span>
      <h3>${item.name}</h3>
      <p><strong>${item.cost}</strong></p>
      <p>${item.note}</p>
      <div class="action-line">${item.action}</div>
      <div class="link-grid">${item.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name} ↗</a>`).join('')}</div>
      ${feedbackPanel(optionId('price', item.name), item.name)}
    </article>
  `).join('');
}

function statusLabel(status) {
  return status === 'add' ? 'Add' : status === 'maybe' ? 'Maybe' : 'Skip';
}

function renderWildcards() {
  $('#wildcardGrid').innerHTML = DATA.wildcards.map((item) => `
    <article class="status-card ${item.status}">
      <span class="status-badge">${statusLabel(item.status)}</span>
      <h3>${item.name}</h3>
      <p class="muted">${item.date}</p>
      <p><strong>${item.genre}</strong> · ${item.location}</p>
      <p>${item.why}</p>
      <p class="tiny-note">${item.price}</p>
      <div class="link-grid">${item.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name} ↗</a>`).join('')}</div>
      ${feedbackPanel(optionId('wildcard', item.name), item.name)}
    </article>
  `).join('');
}

function renderSeasonal(filter = 'all') {
  const items = DATA.seasonalEvents.filter((item) => filter === 'all' || item.status === filter);
  $('#seasonalGrid').innerHTML = items.map((item) => `
    <article class="status-card ${item.status}">
      <span class="status-badge">${statusLabel(item.status)}</span>
      <h3>${item.name}</h3>
      <p class="muted">${item.date} · ${item.location}</p>
      <p><strong>${item.price}</strong></p>
      <p>${item.why}</p>
      <a href="${item.link}" target="_blank" rel="noopener">Open site ↗</a>
      ${feedbackPanel(optionId('seasonal', item.name), item.name)}
    </article>
  `).join('');
}

function renderRomanticUpgrades() {
  $('#upgradeGrid').innerHTML = DATA.romanticUpgrades.map((upgrade) => `
    <article class="upgrade-card">
      <span class="label">${upgrade.when}</span>
      <h3>${upgrade.name}</h3>
      <p><strong>${upgrade.cost}</strong></p>
      <p>${upgrade.why}</p>
      <details>
        <summary>How to do it</summary>
        <ul>${upgrade.instructions.map((item) => `<li>${item}</li>`).join('')}</ul>
      </details>
      <a href="${upgrade.link}" target="_blank" rel="noopener">Open details ↗</a>
      ${feedbackPanel(optionId('upgrade', upgrade.name), upgrade.name)}
    </article>
  `).join('');
}

function renderWarnings() {
  $('#warningGrid').innerHTML = DATA.overstuffWarnings.map((warning) => `
    <article class="warning-card ${warning.level}">
      <span class="status-badge">${statusLabel(warning.level)}</span>
      <h3>${warning.name}</h3>
      <p>${warning.text}</p>
      ${feedbackPanel(optionId('warning', warning.name), warning.name)}
    </article>
  `).join('');
}

function renderBookingTimeline() {
  $('#bookTimeline').innerHTML = DATA.bookingTimeline.map((item) => `
    <article class="book-step ${item.priority}">
      <div class="book-date">${item.date}</div>
      <div>
        <span class="label">${item.priority}</span>
        <h3>${item.name}</h3>
        <ul>${item.actions.map((action) => `<li>${action}</li>`).join('')}</ul>
        ${feedbackPanel(optionId('booking', item.name), item.name)}
      </div>
    </article>
  `).join('');
}

function renderExperiences() {
  $('#experienceGrid').innerHTML = DATA.experiences.map((experience) => `
    <article class="experience-card">
      <span class="label">${experience[1]}</span>
      <h3>${experience[0]}</h3>
      <p><strong>Best when:</strong> ${experience[2]}</p>
      <p>${experience[3]}</p>
      <a href="${experience[4]}" target="_blank" rel="noopener">Open route/site ↗</a>
      ${feedbackPanel(optionId('experience', experience[0]), experience[0])}
    </article>
  `).join('');
}

function renderNotesReview() {
  const summary = NOTES.getFeedbackSummary(noteState);
  const wrapper = $('#notesReview');
  const collaboration = `
    <div class="collab-grid">
      <article class="collab-card">
        <span class="label">Send notes</span>
        <h3>Copy a share packet</h3>
        <p>Emily can copy this from her device and send it to you. You can paste it below to merge her notes into yours.</p>
        <button class="btn primary" type="button" id="copySharePacket">Copy share packet</button>
      </article>
      <article class="collab-card">
        <span class="label">Import</span>
        <h3>Merge someone else’s packet</h3>
        <textarea id="sharePacketInput" rows="5" placeholder="Paste the LONDON_LOVE_LETTER_NOTES_V1 packet here"></textarea>
        <button class="btn" type="button" id="importSharePacket">Import notes</button>
      </article>
      <article class="collab-card suggestion-card">
        <span class="label">Missing idea</span>
        <h3>Suggest something not on the site</h3>
        <form id="suggestionForm">
          <div class="form-row">
            <select name="author" aria-label="Author"><option>Emily</option><option>Logan</option></select>
            <select name="category" aria-label="Category"><option>Activity</option><option>Restaurant</option><option>Place</option><option>Nightlife</option><option>Other</option></select>
          </div>
          <input name="title" placeholder="Suggestion title" />
          <input name="url" placeholder="Optional link" />
          <textarea name="note" rows="3" placeholder="Why should this be considered?"></textarea>
          <button class="btn primary" type="submit">Add suggestion</button>
        </form>
      </article>
    </div>
    <div class="suggestions-panel">
      <div class="notes-toolbar"><span>Missing suggestions</span></div>
      ${renderSuggestionsList()}
    </div>
  `;

  if (!summary.length) {
    wrapper.innerHTML = `
      ${noteState.suggestions.length ? '' : `<div class="empty-notes">
        <span class="label">No notes yet</span>
        <h3>Leave reactions as you browse.</h3>
        <p>Use Logan and Emily notes on any card, then come back here for the full readout.</p>
      </div>`}
      ${collaboration}
    `;
    bindCollaborationControls();
    return;
  }

  wrapper.innerHTML = `
    <div class="notes-toolbar">
      <span>${summary.length} noted option${summary.length === 1 ? '' : 's'}</span>
      <button class="btn" type="button" id="copyNotesInline">Copy notes</button>
    </div>
    <div class="notes-grid">
      ${summary.map((item) => `
        <article class="note-summary-card">
          <h3>${noteLabels[item.optionId] || item.optionId}</h3>
          ${NOTES.NOTE_AUTHORS.map((author) => {
            const feedback = item[author];
            if (!NOTES.hasFeedback(feedback)) return '';
            const reaction = NOTES.formatReaction(feedback.reaction);
            return `
              <div class="summary-author">
                <span>${author}</span>
                <p>${reaction ? `<strong>${reaction}</strong>` : ''}${reaction && feedback.note ? ' · ' : ''}${escapeHtml(feedback.note)}</p>
              </div>
            `;
          }).join('')}
        </article>
      `).join('')}
    </div>
    ${collaboration}
  `;

  const copyInline = $('#copyNotesInline');
  if (copyInline) copyInline.addEventListener('click', copyNotes);
  bindCollaborationControls();
}

function copyNotes() {
  copyText(NOTES.exportFeedbackText(noteState, noteLabels));
}

function renderAllDynamicSections() {
  const foodFilter = $('.chip[data-filter].active')?.dataset.filter || 'all';
  const seasonalFilter = $('.chip[data-season-filter].active')?.dataset.seasonFilter || 'all';
  renderDayTabs();
  renderDayDetail();
  renderPathPicker();
  renderPathDetail();
  renderRestaurants(foodFilter);
  renderPriceReality();
  renderWildcards();
  renderSeasonal(seasonalFilter);
  renderRomanticUpgrades();
  renderWarnings();
  renderExperiences();
  renderBookingTimeline();
  renderNotesReview();
  refreshWowSurfaces();
}

function copySharePacket() {
  copyText(NOTES.exportSharePacket(noteState));
}

function suggestionId(author, title) {
  return `suggestion:${slugify(author)}:${slugify(title)}:${Date.now()}`;
}

function renderSuggestionsList() {
  if (!noteState.suggestions.length) {
    return '<p class="muted">No missing-place suggestions yet.</p>';
  }
  return `
    <div class="suggestion-list">
      ${noteState.suggestions.map((suggestion) => `
        <article class="suggestion-item">
          <span>${escapeHtml(suggestion.author)} · ${escapeHtml(suggestion.category)}</span>
          <h4>${escapeHtml(suggestion.title)}</h4>
          <p>${escapeHtml(suggestion.note)}</p>
          ${suggestion.url ? `<a href="${escapeHtml(suggestion.url)}" target="_blank" rel="noopener">Open link ↗</a>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function bindCollaborationControls() {
  const copyPacket = $('#copySharePacket');
  if (copyPacket) copyPacket.addEventListener('click', copySharePacket);

  const importPacket = $('#importSharePacket');
  if (importPacket) importPacket.addEventListener('click', () => {
    const input = $('#sharePacketInput');
    try {
      const incoming = NOTES.parseSharePacket(input.value);
      noteState = NOTES.mergeNotesStates(noteState, incoming);
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
      toast('Add a suggestion title');
      return;
    }
    noteState = NOTES.addSuggestion(noteState, {
      id: suggestionId(form.get('author'), title),
      author: String(form.get('author') || 'Emily'),
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
    updatePanelState(panel);
    renderNotesReview();
    refreshWowSurfaces();
  });

  document.addEventListener('input', (event) => {
    if (!event.target.classList.contains('note-text')) return;
    const panel = event.target.closest('.note-panel');
    const author = event.target.closest('.note-author').dataset.author;
    const id = panel.dataset.noteId;
    noteState = NOTES.saveOptionFeedback(noteState, id, author, { note: event.target.value });
    saveNoteState();
    updatePanelState(panel);
    renderNotesReview();
    refreshWowSurfaces();
  });
}

function renderChecklist() {
  const items = [
    'Request Clos Maggiore conservatory seating',
    'Set Andrew Edmunds reminder for June 6, 2026 at 9:30am Pacific / 5:30pm London',
    'Decide Wednesday Path A, B, or C',
    'If Path A/C: buy Studio Tour tickets',
    'If Path B/C: buy The Mousetrap tickets',
    'Choose Trullo vs The Tamil Prince with your friend',
    'Check Wimbledon Queue page the week before',
    'Pack portable charger, sunscreen, light jacket, refillable bottle',
    'Download eSIM: Airalo, Nomad, or Ubigi',
    'Bring £20–40 cash backup'
  ];
  const saved = JSON.parse(localStorage.getItem('london.checks') || '{}');
  $('#checklist').innerHTML = items.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-check="${index}" ${saved[index] ? 'checked' : ''}>
      <span class="${saved[index] ? 'done' : ''}">${item}</span>
    </label>
  `).join('');

  $$('#checklist input').forEach((input) => {
    input.addEventListener('change', () => {
      saved[input.dataset.check] = input.checked;
      localStorage.setItem('london.checks', JSON.stringify(saved));
      renderChecklist();
    });
  });
}

function updateArrivalText() {
  const value = parseFloat($('#arrivalSlider').value);
  let message;
  if (value <= 6.5) {
    message = 'Excellent. This is the right level of insurance for quarterfinal day.';
  } else if (value <= 7.5) {
    message = 'Acceptable, but you are giving up some queue safety.';
  } else {
    message = 'Too late for a once-in-a-trip Wimbledon plan. This turns into a gamble.';
  }
  const hour = Math.floor(value);
  const minutes = value % 1 ? '30' : '00';
  $('#arrivalText').innerHTML = `<strong>${hour}:${minutes}am:</strong> ${message}`;
}

function finalSummary() {
  return `London July 5–9, 2026 final plan:
Sunday: arrive via LHR, settle into Kimpton Fitzroy, The Lamb + The Harrison/Noble Rot.
Monday: keep Bath — Roman Baths, Georgian wandering, Thermae rooftop spa, Andrew Edmunds 8:15pm+.
Tuesday: Wimbledon grounds/Hill day; arrive 6:30–7am. Friend dinner: Trullo for foodie, Tamil Prince for lively/social.
Wednesday: preferred Path B — Borough Market/South Bank/St Paul’s walk, Soane’s or Covent Garden, The Mousetrap, Clos Maggiore late dinner. Path A if HP Studio Tour matters most. Avoid Path C unless you accept rushing.
Thursday: depart with airport buffer.`;
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard'));
}

function applyPresentationMode(enabled) {
  document.body.classList.toggle('presentation-mode', enabled);
  localStorage.setItem('london.presentationMode', enabled ? 'true' : 'false');
  const button = $('#presentationToggle');
  if (!button) return;
  button.textContent = enabled ? 'Exit presentation' : 'Presentation mode';
  button.setAttribute('aria-pressed', String(enabled));
}

function bindPresentationMode() {
  applyPresentationMode(localStorage.getItem('london.presentationMode') === 'true');
  $('#presentationToggle')?.addEventListener('click', () => {
    applyPresentationMode(!document.body.classList.contains('presentation-mode'));
  });
}

function init() {
  registerAllNoteLabels();
  setTheme();
  renderDayChapters();
  renderLoveMap();
  renderPassportStamps();
  renderDayTabs();
  renderDayDetail();
  renderPathPicker();
  renderPathDetail();
  renderPathCalculator();
  renderRestaurants();
  renderPriceReality();
  renderWildcards();
  renderSeasonal();
  renderRomanticUpgrades();
  renderWarnings();
  renderExperiences();
  renderBookingTimeline();
  renderCountdown();
  refreshWowSurfaces();
  renderNotesReview();
  renderChecklist();
  updateArrivalText();
  bindNoteEvents();
  bindPresentationMode();

  $('#themeToggle').addEventListener('click', () => {
    const next = !(localStorage.getItem('london.dark') === 'true');
    localStorage.setItem('london.dark', next);
    setTheme();
  });
  $('#copyHero').addEventListener('click', () => copyText(finalSummary()));
  $('#copyFull').addEventListener('click', () => copyText(finalSummary()));
  $('#copyNotes').addEventListener('click', copyNotes);
  $$('.chip[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip[data-filter]').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    renderRestaurants(chip.dataset.filter);
  }));
  $$('.chip[data-season-filter]').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip[data-season-filter]').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    renderSeasonal(chip.dataset.seasonFilter);
  }));
  $('#arrivalSlider').addEventListener('input', updateArrivalText);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: 0.12 });
  $$('.reveal').forEach((element) => observer.observe(element));
}

init();
