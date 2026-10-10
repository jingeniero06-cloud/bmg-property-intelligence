// BMG 100% White-Hat Backlinks Outreach CRM & Pitch Engine
// Version 1.0.0

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

  // Pitch modal handlers
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
    // Market tab
    if (activeMarketFilter !== 'all') {
      if (activeMarketFilter === 'm1' && !t.market.includes('Market 1')) return false;
      if (activeMarketFilter === 'm2' && !t.market.includes('Market 2')) return false;
      if (activeMarketFilter === 'm3' && !t.market.includes('Market 3')) return false;
      if (activeMarketFilter === 'm4' && !t.market.includes('Market 4')) return false;
    }

    // Tier
    if (activeTierFilter !== 'all' && t.tier !== activeTierFilter) return false;

    // Search query
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
      <div style="grid-column: 1/-1; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:60px 20px; text-align:center;">
        <h3 style="color:var(--bmg-primary); margin-bottom:8px;">No matching targets found</h3>
        <p style="color:#64748b;">Try adjusting your search criteria or resetting filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const status = getStoredStatus(t.id);
    let statusClass = 'badge-neutral';
    if (status === 'Pitched') statusClass = 'badge-info';
    if (status === 'Followed Up') statusClass = 'badge-warning';
    if (status === 'Secured') statusClass = 'badge-pass';

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">
        <div style="position:absolute; top:0; left:0; width:4px; height:100%; background: ${t.dr >= 80 ? '#1078BE' : '#FD9204'};"></div>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:12px;">
            <span class="badge ${t.tier.includes('.gov') || t.tier.includes('.edu') ? 'badge-pass' : 'badge-neutral'}">
              ${t.tier}
            </span>
            <div class="dr-badge" title="Domain Rating">
              DR <span>${t.dr}</span>
            </div>
          </div>

          <h3 style="font-size:1.15rem; font-weight:800; color:var(--bmg-primary); margin-bottom:4px; line-height:1.3;">
            ${t.name}
          </h3>
          <div style="font-size:0.8125rem; color:#64748b; margin-bottom:12px;">
            <a href="${t.url}" target="_blank" rel="noopener noreferrer" style="color:var(--bmg-blue); display:inline-flex; align-items:center; gap:4px;">
              ${t.domain} ↗
            </a>
          </div>

          <div style="font-size:0.875rem; color:#334155; margin-bottom:12px; background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:700;">Target Placement</div>
            <strong style="color:var(--bmg-primary);">${t.placement}</strong>
          </div>

          <div style="font-size:0.8125rem; color:#475569; margin-bottom:14px; line-height:1.5;">
            ${t.strategy}
          </div>
        </div>

        <div>
          <div style="border-top:1px dashed #e2e8f0; padding-top:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; font-size:0.8125rem;">
            <div>Traffic: <strong style="color:#0f172a;">${t.traffic}</strong></div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="badge ${statusClass}">${status}</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="openPitchModal(${t.id})">
              View Pitch Script
            </button>
            <button class="btn btn-outline btn-sm" onclick="quickMailto(${t.id})">
              Email Client ↗
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Generate populated pitch
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
    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:14px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:0.75rem; text-transform:uppercase; color:#1e40af; font-weight:700;">Target Portal & Placement</div>
        <div style="font-size:0.95rem; font-weight:700; color:var(--bmg-primary);">${target.placement}</div>
        <div style="font-size:0.8125rem; color:#475569;">Target URL: <a href="${target.url}" target="_blank" style="color:var(--bmg-blue);">${target.url}</a></div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="dr-badge">DR <span>${target.dr}</span></div>
        <div style="font-size:0.8125rem; font-weight:700; color:#475569;">${target.traffic}</div>
      </div>
    </div>

    <div style="margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:0.8125rem; font-weight:700; color:#64748b; text-transform:uppercase;">Contact Recipient</span>
        <span style="font-size:0.8125rem; color:#64748b;">Template: <em>${pitch.templateName}</em></span>
      </div>
      <input type="text" readonly value="${target.email}" style="width:100%; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-weight:600; color:var(--bmg-primary);">
    </div>

    <div style="margin-bottom:14px;">
      <div style="font-size:0.8125rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:6px;">Email Subject Line</div>
      <input type="text" id="modalPitchSubject" readonly value="${pitch.subject}" style="width:100%; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-weight:700; color:var(--bmg-primary);">
    </div>

    <div style="margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:0.8125rem; font-weight:700; color:#64748b; text-transform:uppercase;">Email Body (Pre-Filled Pitch)</span>
        <button class="btn btn-outline btn-sm" onclick="copyPitchText(${target.id})">
          📋 Copy Body Text
        </button>
      </div>
      <textarea id="modalPitchBody" readonly rows="10" style="width:100%; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-family:monospace; font-size:0.85rem; line-height:1.5; color:#1e293b; resize:vertical;">${pitch.body}</textarea>
    </div>

    <div style="border-top:1px solid #e2e8f0; padding-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:0.875rem; font-weight:700; color:var(--bmg-primary);">CRM Status:</span>
        <select class="filter-select" style="padding:6px 10px; font-size:0.8125rem;" onchange="setStoredStatus(${target.id}, this.value)">
          <option value="Not Contacted" ${currentStatus === 'Not Contacted' ? 'selected' : ''}>Not Contacted</option>
          <option value="Pitched" ${currentStatus === 'Pitched' ? 'selected' : ''}>Pitched</option>
          <option value="Followed Up" ${currentStatus === 'Followed Up' ? 'selected' : ''}>Followed Up</option>
          <option value="Secured" ${currentStatus === 'Secured' ? 'selected' : ''}>Secured (Live Link!)</option>
        </select>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-accent btn-sm" onclick="copyFullPitch(${target.id})">
          📋 Copy Entire Pitch
        </button>
        <button class="btn btn-primary btn-sm" onclick="quickMailto(${target.id})">
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
