// BMG 100% White-Hat Backlinks Outreach CRM & Pitch Engine
// Version 2.0.0 (Northline Luxury Edition)

let activeMarketFilter = 'all';
let activeTierFilter = 'all';
let activeSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof BMG_BACKLINK_TARGETS === 'undefined') {
    console.error('BMG_BACKLINK_TARGETS dataset not loaded!');
    return;
  }

  initBacklinksCRM();
  renderBacklinkCards();
});

function initBacklinksCRM() {
  const marketTabs = document.querySelectorAll('[data-market-tab]');
  const tierSelect = document.getElementById('tierFilterSelect');
  const searchInput = document.getElementById('targetSearchInput');
  const resetBtn = document.getElementById('resetBacklinkFilters');

  marketTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      marketTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeMarketFilter = tab.getAttribute('data-market-tab');
      renderBacklinkCards();
    });
  });

  tierSelect?.addEventListener('change', () => {
    activeTierFilter = tierSelect.value;
    renderBacklinkCards();
  });

  searchInput?.addEventListener('input', () => {
    activeSearchQuery = searchInput.value.toLowerCase().trim();
    renderBacklinkCards();
  });

  resetBtn?.addEventListener('click', () => {
    activeMarketFilter = 'all';
    activeTierFilter = 'all';
    activeSearchQuery = '';
    if (tierSelect) tierSelect.value = 'all';
    if (searchInput) searchInput.value = '';
    marketTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-market-tab="all"]')?.classList.add('active');
    renderBacklinkCards();
  });

  const modal = document.getElementById('pitchModal');
  const closeBtn = document.getElementById('closePitchModal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function getStoredStatus(targetId) {
  try {
    return localStorage.getItem(`bmg_crm_status_${targetId}`) || 'Not Contacted';
  } catch (e) {
    return 'Not Contacted';
  }
}

function setStoredStatus(targetId, status) {
  try {
    localStorage.setItem(`bmg_crm_status_${targetId}`, status);
    showToast(`Status updated to: ${status}`);
    renderBacklinkCards();
  } catch (e) {
    console.error(e);
  }
}

function renderBacklinkCards() {
  const container = document.getElementById('backlinkTargetsContainer');
  const countLabel = document.getElementById('backlinkCountLabel');
  if (!container) return;

  const filtered = BMG_BACKLINK_TARGETS.filter(t => {
    if (activeMarketFilter !== 'all') {
      if (activeMarketFilter === 'm1' && !t.market.includes('Market 1')) return false;
      if (activeMarketFilter === 'm2' && !t.market.includes('Market 2')) return false;
      if (activeMarketFilter === 'm3' && !t.market.includes('Market 3')) return false;
      if (activeMarketFilter === 'm4' && !t.market.includes('Market 4')) return false;
    }

    if (activeTierFilter !== 'all' && t.tier !== activeTierFilter) return false;

    if (activeSearchQuery) {
      const matchName = t.name.toLowerCase().includes(activeSearchQuery);
      const matchUrl = t.domain.toLowerCase().includes(activeSearchQuery);
      const matchCategory = t.category.toLowerCase().includes(activeSearchQuery);
      if (!matchName && !matchUrl && !matchCategory) return false;
    }

    return true;
  });

  if (countLabel) {
    countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${BMG_BACKLINK_TARGETS.length}</strong> vetted high-authority targets`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; background:#ffffff; border:1px solid var(--line-dark); border-radius:18px; padding:60px 20px; text-align:center;">
        <h3 style="color:var(--ink); margin-bottom:8px;">No matching targets found</h3>
        <p style="color:var(--muted);">Try adjusting your search criteria or resetting filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const status = getStoredStatus(t.id);
    let statusClass = 'badge-pass';
    if (status === 'Not Contacted') statusClass = 'badge-warning';
    if (status === 'Pitched') statusClass = 'badge-info';
    if (status === 'Followed Up') statusClass = 'badge-warning';
    if (status === 'Secured') statusClass = 'badge-pass';

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:14px;">
            <span class="badge ${t.tier.includes('.gov') || t.tier.includes('.edu') ? 'badge-pass' : 'badge-info'}">
              ${t.tier}
            </span>
            <div class="dr-badge" title="Domain Rating">
              DR <span>${t.dr}</span>
            </div>
          </div>

          <h3 style="font-size:1.25rem; color:var(--ink); margin-bottom:4px; line-height:1.25;">
            ${t.name}
          </h3>
          <div style="font-size:0.84rem; color:var(--muted); margin-bottom:14px;">
            <a href="${t.url}" target="_blank" rel="noopener noreferrer" style="color:var(--bmg-blue); display:inline-flex; align-items:center; gap:4px;">
              ${t.domain} ↗
            </a>
          </div>

          <div style="font-size:0.88rem; color:var(--text); margin-bottom:14px; background:var(--paper-2); padding:12px; border-radius:8px; border:1px solid var(--line-dark);">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--muted); font-weight:700; letter-spacing:0.04em;">Target Placement</div>
            <strong style="color:var(--ink);">${t.placement}</strong>
          </div>

          <div style="font-size:0.86rem; color:var(--muted); margin-bottom:16px; line-height:1.55;">
            ${t.strategy}
          </div>
        </div>

        <div>
          <div style="border-top:1px dashed var(--line-dark); padding-top:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; font-size:0.84rem;">
            <div>Traffic: <strong style="color:var(--ink);">${t.traffic}</strong></div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="badge ${statusClass}">${status}</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <button class="btn btn-gold btn-sm" onclick="openPitchModal(${t.id})">
              View Pitch Script
            </button>
            <button class="btn btn-dark btn-sm" onclick="quickMailto(${t.id})">
              Email Client ↗
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getPopulatedPitch(target) {
  const template = BMG_PITCH_TEMPLATES[target.pitch_type] || BMG_PITCH_TEMPLATES['trade'];
  const subject = template.subject.replace(/{NAME}/g, target.name).replace(/{URL}/g, target.url);
  const body = template.body.replace(/{NAME}/g, target.name).replace(/{URL}/g, target.url);
  return { subject, body, templateName: template.name };
}

window.openPitchModal = function(targetId) {
  const target = BMG_BACKLINK_TARGETS.find(t => t.id === targetId);
  if (!target) return;

  const modal = document.getElementById('pitchModal');
  const body = document.getElementById('pitchModalBody');
  const title = document.getElementById('pitchModalTitle');

  if (!modal || !body) return;

  const pitch = getPopulatedPitch(target);
  const currentStatus = getStoredStatus(target.id);

  if (title) title.innerHTML = `Tailored Outreach: <strong>${target.name}</strong>`;

  body.innerHTML = `
    <div style="background:var(--paper-2); border:1px solid var(--line-dark); border-radius:12px; padding:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:0.75rem; text-transform:uppercase; color:var(--muted); font-weight:700; letter-spacing:0.04em;">Target Portal & Placement</div>
        <div style="font-size:1.05rem; font-weight:700; color:var(--ink);">${target.placement}</div>
        <div style="font-size:0.84rem; color:var(--muted); margin-top:2px;">Target URL: <a href="${target.url}" target="_blank" style="color:var(--bmg-blue);">${target.url}</a></div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <div class="dr-badge">DR <span>${target.dr}</span></div>
        <div style="font-size:0.85rem; font-weight:700; color:var(--ink);">${target.traffic}</div>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:0.82rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Contact Recipient</span>
        <span style="font-size:0.82rem; color:var(--muted);">Template: <em>${pitch.templateName}</em></span>
      </div>
      <input type="text" readonly value="${target.email}" style="width:100%; padding:10px 14px; background:var(--paper-2); border:1px solid var(--line-dark); border-radius:8px; font-weight:600; color:var(--ink);">
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:0.82rem; font-weight:700; color:var(--muted); text-transform:uppercase; margin-bottom:6px;">Email Subject Line</div>
      <input type="text" id="modalPitchSubject" readonly value="${pitch.subject}" style="width:100%; padding:10px 14px; background:var(--paper-2); border:1px solid var(--line-dark); border-radius:8px; font-weight:700; color:var(--ink);">
    </div>

    <div style="margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:0.82rem; font-weight:700; color:var(--muted); text-transform:uppercase;">Email Body (Pre-Filled Pitch)</span>
        <button class="btn btn-dark btn-sm" onclick="copyPitchText(${target.id})">
          📋 Copy Body Text
        </button>
      </div>
      <textarea id="modalPitchBody" readonly rows="10" style="width:100%; padding:14px; background:var(--paper-2); border:1px solid var(--line-dark); border-radius:8px; font-family:monospace; font-size:0.86rem; line-height:1.6; color:var(--text); resize:vertical;">${pitch.body}</textarea>
    </div>

    <div style="border-top:1px solid var(--line-dark); padding-top:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:0.88rem; font-weight:700; color:var(--ink);">CRM Status:</span>
        <select class="filter-select" style="padding:6px 12px; font-size:0.84rem;" onchange="setStoredStatus(${target.id}, this.value)">
          <option value="Not Contacted" ${currentStatus === 'Not Contacted' ? 'selected' : ''}>Not Contacted</option>
          <option value="Pitched" ${currentStatus === 'Pitched' ? 'selected' : ''}>Pitched</option>
          <option value="Followed Up" ${currentStatus === 'Followed Up' ? 'selected' : ''}>Followed Up</option>
          <option value="Secured" ${currentStatus === 'Secured' ? 'selected' : ''}>Secured (Live Link!)</option>
        </select>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn btn-gold btn-sm" onclick="copyFullPitch(${target.id})">
          📋 Copy Entire Pitch
        </button>
        <button class="btn btn-dark btn-sm" onclick="quickMailto(${target.id})">
          ✉️ Open in Mail Client
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.copyPitchText = function(targetId) {
  const target = BMG_BACKLINK_TARGETS.find(t => t.id === targetId);
  if (!target) return;
  const pitch = getPopulatedPitch(target);
  copyTextToClipboard(pitch.body, 'Pitch body copied to clipboard!');
};

window.copyFullPitch = function(targetId) {
  const target = BMG_BACKLINK_TARGETS.find(t => t.id === targetId);
  if (!target) return;
  const pitch = getPopulatedPitch(target);
  const full = `To: ${target.email}\nSubject: ${pitch.subject}\n\n${pitch.body}`;
  copyTextToClipboard(full, 'Full pitch (To, Subject & Body) copied to clipboard!');
};

window.quickMailto = function(targetId) {
  const target = BMG_BACKLINK_TARGETS.find(t => t.id === targetId);
  if (!target) return;
  const pitch = getPopulatedPitch(target);
  const mailtoUrl = `mailto:${encodeURIComponent(target.email)}?subject=${encodeURIComponent(pitch.subject)}&body=${encodeURIComponent(pitch.body)}`;
  window.location.href = mailtoUrl;
  setStoredStatus(target.id, 'Pitched');
};
