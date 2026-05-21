const sb = window.supabaseClient;

let allSubmissions = [];
let activeTrip = 'all';
let activeStatus = 'all';
let listActionsBound = false;

const PACKET_HEADERS = {
  london: 'LONDON_LOVE_LETTER_NOTES_V1',
  dublin: 'DUBLIN_TRIP_NOTES_V1',
  lisbon: 'LISBON_TRIP_NOTES_V1',
  galway: 'GALWAY_TRIP_NOTES_V1'
};

const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function hasFeedback(f) {
  return Boolean(f?.reaction || f?.note?.trim());
}

function buildPacketPreview(packet) {
  if (!packet?.state?.items) return '<p class="muted">No reactions recorded.</p>';
  const items = Object.entries(packet.state.items);
  const withFeedback = items.filter(([, fb]) => Object.values(fb).some(hasFeedback));
  if (!withFeedback.length) return '<p class="muted">No reactions recorded.</p>';
  return withFeedback.slice(0, 12).map(([optionId, fb]) => {
    const authors = Object.entries(fb).filter(([, f]) => hasFeedback(f));
    const authorHtml = authors.map(([author, f]) => {
      const chip = f.reaction ? `<span class="reaction-chip ${f.reaction}">${f.reaction}</span>` : '';
      const note = f.note?.trim() ? ` <em>${escapeHtml(f.note)}</em>` : '';
      return `<span class="author-reaction"><strong>${author}</strong>${chip}${note}</span>`;
    }).join(' · ');
    return `<div class="packet-item"><span class="packet-label">${escapeHtml(optionId)}</span><div class="packet-reactions">${authorHtml}</div></div>`;
  }).join('');
}

function copyPacketText(submission) {
  const header = PACKET_HEADERS[submission.trip_slug] || 'TRIP_NOTES_V1';
  const text = `${header}\n${JSON.stringify(submission.packet, null, 2)}`;
  navigator.clipboard.writeText(text).then(() => toast('Copied packet'));
}

async function markStatus(id, status) {
  const { error } = await sb.from('trip_submissions').update({
    status,
    reviewed_at: status === 'reviewed' ? new Date().toISOString() : undefined
  }).eq('id', id);
  if (error) { toast('Update failed'); return; }
  const sub = allSubmissions.find((s) => s.id === id);
  if (sub) sub.status = status;
  renderSubmissions();
  toast(status === 'reviewed' ? 'Marked reviewed' : 'Archived');
}

function renderCard(sub) {
  const actions = [
    `<button class="btn" data-copy="${sub.id}">Copy packet</button>`,
    sub.status !== 'reviewed' ? `<button class="btn" data-mark="${sub.id}" data-status="reviewed">Mark reviewed</button>` : '',
    sub.status !== 'archived' ? `<button class="btn" data-mark="${sub.id}" data-status="archived">Archive</button>` : ''
  ].filter(Boolean).join('');

  return `
    <div class="submission-card" data-id="${sub.id}">
      <div class="submission-meta">
        <span class="status-badge ${sub.status}">${sub.status}</span>
        <span class="trip-badge">${sub.trip_slug}</span>
        <span class="submission-date">${formatDate(sub.created_at)}</span>
        ${sub.reviewed_at ? `<span class="submission-date">Reviewed ${formatDate(sub.reviewed_at)}</span>` : ''}
      </div>
      <div class="packet-preview">${buildPacketPreview(sub.packet)}</div>
      <div class="card-actions">${actions}</div>
    </div>
  `;
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

function renderSubmissions() {
  const list = $('#submissionsList');
  let filtered = allSubmissions;
  if (activeTrip !== 'all') filtered = filtered.filter((s) => s.trip_slug === activeTrip);
  if (activeStatus !== 'all') filtered = filtered.filter((s) => s.status === activeStatus);

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">No submissions match the current filters.</div>';
    return;
  }

  const byTrip = groupBy(filtered, 'trip_slug');
  const tripOrder = ['dublin', 'london', 'lisbon', 'galway'];
  const trips = tripOrder.filter((t) => byTrip[t]);

  list.innerHTML = trips.map((trip) => {
    const byAuthor = groupBy(byTrip[trip], 'author_name');
    const authorHtml = Object.entries(byAuthor).map(([author, subs]) => `
      <div class="author-group">
        <div class="author-name">${escapeHtml(author)}</div>
        ${subs.map(renderCard).join('')}
      </div>
    `).join('');
    return `<div class="trip-group"><div class="trip-group-head">${trip}</div>${authorHtml}</div>`;
  }).join('');
}

async function loadSubmissions() {
  const { data, error } = await sb.from('trip_submissions').select('*').order('created_at', { ascending: false });
  if (error) { toast('Failed to load submissions'); return; }
  allSubmissions = data || [];
  renderSubmissions();
}

function bindListActions() {
  $('#submissionsList').addEventListener('click', (event) => {
    const copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      const sub = allSubmissions.find((s) => s.id === copyBtn.dataset.copy);
      if (sub) copyPacketText(sub);
      return;
    }
    const markBtn = event.target.closest('[data-mark]');
    if (markBtn) markStatus(markBtn.dataset.mark, markBtn.dataset.status);
  });
}

function showSubmissionsView(user) {
  $('#loginView').style.display = 'none';
  $('#submissionsView').style.display = 'block';
  $('#logoutBtn').style.display = 'inline-flex';
  if (!listActionsBound) { bindListActions(); listActionsBound = true; }
  loadSubmissions();
}

function showLoginView() {
  $('#loginView').style.display = 'flex';
  $('#submissionsView').style.display = 'none';
  $('#logoutBtn').style.display = 'none';
}

async function init() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    showSubmissionsView(session.user);
  } else {
    showLoginView();
  }

  sb.auth.onAuthStateChange((_event, session) => {
    if (session) showSubmissionsView(session.user);
    else showLoginView();
  });

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value;
    const password = $('#loginPassword').value;
    const errEl = $('#loginError');
    errEl.style.display = 'none';
    const btn = $('#loginForm button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    const { error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    btn.textContent = 'Sign in';
    if (error) {
      errEl.textContent = error.message;
      errEl.style.display = 'block';
    }
  });

  $('#logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
  });

  document.querySelectorAll('#tripTabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#tripTabs .tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeTrip = tab.dataset.trip;
      renderSubmissions();
    });
  });

  document.querySelectorAll('#statusTabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#statusTabs .tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeStatus = tab.dataset.status;
      renderSubmissions();
    });
  });
}

init();
