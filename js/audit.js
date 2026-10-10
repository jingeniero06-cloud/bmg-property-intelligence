// BMG Forensic SEO Audit & 500-Page Crawl Explorer Engine
// Version 2.0.0 (Northline Luxury Edition)

let currentPage = 1;
let pageSize = 25;
let filteredRecords = [];

document.addEventListener('DOMContentLoaded', () => {
  if (typeof BMG_AUDIT_RECORDS === 'undefined') {
    console.error('BMG_AUDIT_RECORDS dataset not loaded!');
    return;
  }
  
  filteredRecords = [...BMG_AUDIT_RECORDS];
  initAuditDashboard();
  initTableControls();
  renderCrawlTable();
});

function initAuditDashboard() {
  const severityBtns = document.querySelectorAll('[data-defect-filter]');
  const defectCards = document.querySelectorAll('.defect-item');
  
  severityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      severityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-defect-filter');
      
      defectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-severity') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initTableControls() {
  const searchInput = document.getElementById('crawlSearch');
  const statusFilter = document.getElementById('filterStatus');
  const depthFilter = document.getElementById('filterDepth');
  const metaFilter = document.getElementById('filterMeta');
  const headingFilter = document.getElementById('filterHeading');
  const speedFilter = document.getElementById('filterSpeed');
  const sortSelect = document.getElementById('sortRecords');
  const pageSizeSelect = document.getElementById('pageSizeSelect');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');

  const applyFilters = () => {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const statusVal = statusFilter?.value || 'all';
    const depthVal = depthFilter?.value || 'all';
    const metaVal = metaFilter?.value || 'all';
    const headingVal = headingFilter?.value || 'all';
    const speedVal = speedFilter?.value || 'all';
    const sortVal = sortSelect?.value || 'default';

    filteredRecords = BMG_AUDIT_RECORDS.filter(r => {
      if (q) {
        const matchUrl = r.url.toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchMeta = (r.meta || '').toLowerCase().includes(q);
        if (!matchUrl && !matchTitle && !matchMeta) return false;
      }
      
      if (statusVal !== 'all' && String(r.status) !== statusVal) return false;

      if (depthVal === 'thin' && r.words >= 400) return false;
      if (depthVal === 'standard' && (r.words < 400 || r.words > 1500)) return false;
      if (depthVal === 'pillar' && r.words <= 1500) return false;

      if (metaVal === 'missing' && r.meta.length > 0) return false;
      if (metaVal === 'short' && (r.meta.length === 0 || r.meta.length >= 120)) return false;
      if (metaVal === 'optimal' && (r.meta.length < 120 || r.meta.length > 160)) return false;
      if (metaVal === 'long' && r.meta.length <= 160) return false;

      if (headingVal === 'missing_h1' && r.h1_count > 0) return false;
      if (headingVal === 'multiple_h1' && r.h1_count <= 1) return false;
      if (headingVal === 'normal_h1' && r.h1_count !== 1) return false;

      if (speedVal === 'fast' && r.time >= 500) return false;
      if (speedVal === 'medium' && (r.time < 500 || r.time > 1000)) return false;
      if (speedVal === 'slow' && r.time <= 1000) return false;

      return true;
    });

    if (sortVal === 'fastest') {
      filteredRecords.sort((a, b) => a.time - b.time);
    } else if (sortVal === 'slowest') {
      filteredRecords.sort((a, b) => b.time - a.time);
    } else if (sortVal === 'words_desc') {
      filteredRecords.sort((a, b) => b.words - a.words);
    } else if (sortVal === 'words_asc') {
      filteredRecords.sort((a, b) => a.words - b.words);
    } else if (sortVal === 'title_len') {
      filteredRecords.sort((a, b) => b.title_len - a.title_len);
    }

    currentPage = 1;
    renderCrawlTable();
  };

  searchInput?.addEventListener('input', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);
  depthFilter?.addEventListener('change', applyFilters);
  metaFilter?.addEventListener('change', applyFilters);
  headingFilter?.addEventListener('change', applyFilters);
  speedFilter?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  pageSizeSelect?.addEventListener('change', () => {
    pageSize = parseInt(pageSizeSelect.value, 10) || 25;
    currentPage = 1;
    renderCrawlTable();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'all';
    if (depthFilter) depthFilter.value = 'all';
    if (metaFilter) metaFilter.value = 'all';
    if (headingFilter) headingFilter.value = 'all';
    if (speedFilter) speedFilter.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    applyFilters();
  });

  exportCsvBtn?.addEventListener('click', exportFilteredCsv);
  exportJsonBtn?.addEventListener('click', exportFilteredJson);
}

function renderCrawlTable() {
  const tbody = document.getElementById('crawlTableBody');
  const statsLabel = document.getElementById('crawlStatsLabel');
  const paginationControls = document.getElementById('paginationControls');

  if (!tbody) return;

  const total = filteredRecords.length;
  if (statsLabel) {
    statsLabel.innerHTML = `Showing <strong>${total}</strong> of <strong>${BMG_AUDIT_RECORDS.length}</strong> audited pages`;
  }

  if (total === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px; color: var(--muted);">
          <strong>No matching URLs found.</strong><br>Try adjusting your search query or resetting filters.
        </td>
      </tr>
    `;
    if (paginationControls) paginationControls.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(total / pageSize);
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageItems = filteredRecords.slice(startIdx, endIdx);

  tbody.innerHTML = pageItems.map(r => {
    let speedBadge = `<span class="badge badge-pass">${r.time}ms</span>`;
    if (r.time > 1000) {
      speedBadge = `<span class="badge badge-danger">${r.time}ms</span>`;
    } else if (r.time >= 500) {
      speedBadge = `<span class="badge badge-warning">${r.time}ms</span>`;
    }

    const hasMeta = r.meta && r.meta.length > 0;
    const metaBadge = hasMeta 
      ? `<span style="color:var(--muted); font-size:0.75rem;">${r.meta_len} chars</span>` 
      : `<span class="badge badge-danger" style="font-size:0.7rem;">Missing Meta</span>`;

    const h1Badge = r.h1_count === 1 
      ? `<span class="badge badge-pass" style="font-size:0.7rem;">1x H1</span>`
      : (r.h1_count === 0 ? `<span class="badge badge-danger" style="font-size:0.7rem;">0x H1</span>` : `<span class="badge badge-warning" style="font-size:0.7rem;">${r.h1_count}x H1</span>`);

    return `
      <tr>
        <td style="font-weight: 700; color: var(--muted); width: 45px;">#${r.id}</td>
        <td>
          <a href="${r.url}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; color: var(--ink); word-break: break-all; display: block; max-width: 440px;">
            ${r.url}
          </a>
          <div style="font-size: 0.82rem; color: var(--muted); margin-top: 3px;">
            ${r.title ? r.title.substring(0, 68) + (r.title.length > 68 ? '...' : '') : '<em style="color:var(--red);">Missing Title</em>'}
          </div>
        </td>
        <td style="white-space: nowrap;">
          <span class="badge badge-pass">${r.status} OK</span>
        </td>
        <td>${speedBadge}</td>
        <td>
          <strong style="color:var(--ink);">${r.words.toLocaleString()}</strong> words
          ${r.words < 400 ? '<span class="badge badge-danger" style="margin-left:4px;">Thin</span>' : ''}
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div>${metaBadge}</div>
            <div>${h1Badge}</div>
          </div>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn btn-dark btn-sm" onclick="inspectPageDetails(${r.id})">
            Inspect
          </button>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination(totalPages, total, startIdx + 1, endIdx);
}

function renderPagination(totalPages, total, startItem, endItem) {
  const container = document.getElementById('paginationControls');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = `<span style="font-size:0.875rem; color:var(--muted);">Showing all ${total} results</span>`;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; width: 100%; margin-top: 20px;">
      <div style="font-size: 0.9rem; color: var(--muted);">
        Showing <strong>${startItem}</strong>-<strong>${endItem}</strong> of <strong>${total}</strong> records
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button class="btn btn-dark btn-sm" ${currentPage === 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} onclick="changePage(${currentPage - 1})">
          ← Prev
        </button>
        <span style="font-size: 0.88rem; font-weight: 700; color: var(--ink); padding: 0 10px;">
          Page ${currentPage} of ${totalPages}
        </span>
        <button class="btn btn-dark btn-sm" ${currentPage === totalPages ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} onclick="changePage(${currentPage + 1})">
          Next →
        </button>
      </div>
    </div>
  `;
}

function changePage(page) {
  currentPage = page;
  renderCrawlTable();
  const tableEl = document.getElementById('crawlDatabaseSection');
  if (tableEl) {
    tableEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// Modal Inspect Function
window.inspectPageDetails = function(recordId) {
  const record = BMG_AUDIT_RECORDS.find(r => r.id === recordId);
  if (!record) return;

  const modal = document.getElementById('pageDetailModal');
  const body = document.getElementById('pageDetailBody');
  const title = document.getElementById('pageDetailTitle');

  if (!modal || !body) return;

  if (title) title.textContent = `Technical Forensics: Record #${record.id}`;

  body.innerHTML = `
    <div style="margin-bottom: 22px;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing: 0.05em;">Target URL</div>
      <a href="${record.url}" target="_blank" rel="noopener noreferrer" style="font-size: 1.1rem; font-weight: 700; color: var(--ink); word-break: break-all;">
        ${record.url} ↗
      </a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px;">
      <div style="background: var(--paper-2); padding: 14px; border-radius: 8px; border: 1px solid var(--line-dark);">
        <span style="font-size: 0.75rem; color: var(--muted); text-transform:uppercase;">HTTP Status</span>
        <div style="font-size: 1.15rem; font-weight: 800; color: #065f46;">${record.status} OK</div>
      </div>
      <div style="background: var(--paper-2); padding: 14px; border-radius: 8px; border: 1px solid var(--line-dark);">
        <span style="font-size: 0.75rem; color: var(--muted); text-transform:uppercase;">Response TTFB</span>
        <div style="font-size: 1.15rem; font-weight: 800; color: ${record.time > 1000 ? 'var(--red)' : (record.time >= 500 ? 'var(--amber)' : '#065f46')};">
          ${record.time} ms
        </div>
      </div>
      <div style="background: var(--paper-2); padding: 14px; border-radius: 8px; border: 1px solid var(--line-dark);">
        <span style="font-size: 0.75rem; color: var(--muted); text-transform:uppercase;">Word Count</span>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--ink);">${record.words.toLocaleString()} words</div>
      </div>
      <div style="background: var(--paper-2); padding: 14px; border-radius: 8px; border: 1px solid var(--line-dark);">
        <span style="font-size: 0.75rem; color: var(--muted); text-transform:uppercase;">Canonical Tag</span>
        <div style="font-size: 0.85rem; font-weight: 700; color: #065f46;">${record.canonical_status || 'SELF_REFERENTIAL'}</div>
      </div>
    </div>

    <div style="margin-bottom: 18px;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing:0.05em;">Page Title (${record.title_len} chars)</div>
      <div style="background: var(--paper-2); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--line-dark); font-weight: 600; color:var(--ink);">
        ${record.title || '<em style="color:var(--red);">None</em>'}
      </div>
    </div>

    <div style="margin-bottom: 18px;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing:0.05em;">Meta Description (${record.meta_len} chars)</div>
      <div style="background: var(--paper-2); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--line-dark); color: ${record.meta ? 'var(--text)' : 'var(--red)'};">
        ${record.meta || '<em>Missing meta description tag. Recommended length: 140-160 characters.</em>'}
      </div>
    </div>

    <div style="margin-bottom: 18px;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing:0.05em;">Heading Hierarchy (${record.h1_count}x H1, ${record.h2_count}x H2)</div>
      <div style="background: var(--paper-2); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--line-dark); font-size: 0.88rem;">
        <strong>H1 Tag Content:</strong> ${record.h1 || '<em>No H1 tag detected</em>'}
      </div>
    </div>

    <div style="margin-bottom: 18px;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 700; letter-spacing:0.05em;">Links & Media</div>
      <div style="display: flex; gap: 20px; font-size: 0.9rem;">
        <div>Internal Outlinks: <strong>${record.internal_outlinks || 0}</strong></div>
        <div>External Outlinks: <strong>${record.external_outlinks || 0}</strong></div>
        <div>Images: <strong>${record.images || 0}</strong></div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  const closeBtn = document.getElementById('closePageDetailModal');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }
};

function exportFilteredCsv() {
  if (!filteredRecords.length) {
    alert('No records to export');
    return;
  }

  const headers = ['ID', 'URL', 'Status', 'Response_Time_ms', 'Title', 'Title_Length', 'Meta_Description', 'Meta_Length', 'Canonical_Status', 'H1_Count', 'H1_Content', 'H2_Count', 'Word_Count'];
  const rows = filteredRecords.map(r => [
    r.id,
    `"${(r.url || '').replace(/"/g, '""')}"`,
    r.status,
    r.time,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    r.title_len,
    `"${(r.meta || '').replace(/"/g, '""')}"`,
    r.meta_len,
    `"${(r.canonical_status || '').replace(/"/g, '""')}"`,
    r.h1_count,
    `"${(r.h1 || '').replace(/"/g, '""')}"`,
    r.h2_count,
    r.words
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, 'bmg-500-crawl-audit-filtered.csv', 'text/csv;charset=utf-8;');
  showToast(`Exported ${filteredRecords.length} records to CSV!`);
}

function exportFilteredJson() {
  if (!filteredRecords.length) {
    alert('No records to export');
    return;
  }

  const jsonContent = JSON.stringify(filteredRecords, null, 2);
  downloadBlob(jsonContent, 'bmg-500-crawl-audit-filtered.json', 'application/json');
  showToast(`Exported ${filteredRecords.length} records to JSON!`);
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
