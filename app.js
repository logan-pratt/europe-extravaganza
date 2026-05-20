const DATA = window.TRIP_DATA;
let selectedDay = localStorage.getItem('london.selectedDay') || 'sun';
let selectedPath = localStorage.getItem('london.selectedPath') || 'B';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

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
    </article>
  `).join('');
}

function renderWarnings() {
  $('#warningGrid').innerHTML = DATA.overstuffWarnings.map((warning) => `
    <article class="warning-card ${warning.level}">
      <span class="status-badge">${statusLabel(warning.level)}</span>
      <h3>${warning.name}</h3>
      <p>${warning.text}</p>
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
    </article>
  `).join('');
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

function init() {
  setTheme();
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
  renderChecklist();
  updateArrivalText();

  $('#themeToggle').addEventListener('click', () => {
    const next = !(localStorage.getItem('london.dark') === 'true');
    localStorage.setItem('london.dark', next);
    setTheme();
  });
  $('#copyHero').addEventListener('click', () => copyText(finalSummary()));
  $('#copyFull').addEventListener('click', () => copyText(finalSummary()));
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
