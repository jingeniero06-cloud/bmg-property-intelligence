// BMG Property Intelligence - Application & Interactive UI Engine
// Version 2.0.0 (Universal Bulletproof Edition)

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initUniversalModals();
  initActiveNavLink();
});

// Toast notification helper
function showToast(message, duration = 3500) {
  let toast = document.getElementById('bmgToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bmgToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Copy to clipboard helper
function copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(err => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    alert('Please copy manually:\n' + text);
  }
  document.body.removeChild(textArea);
}

// Mobile navigation toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-btn, .mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links, .main-nav');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const isExpanded = navLinks.classList.contains('mobile-active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }
}

// Active Nav link detection
function initActiveNavLink() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn), .nav-link:not(.btn)');
  if (!navLinks.length) return;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Universal Bulletproof Modal Handler
function initUniversalModals() {
  // Open buttons
  const leadOpenButtons = document.querySelectorAll('[data-open-lead-modal]');
  const genericOpenButtons = document.querySelectorAll('[data-open-modal]');
  const leadModal = document.getElementById('leadModal');
  const leadForm = document.getElementById('leadCaptureForm');

  leadOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (leadModal) openModal(leadModal);
    });
  });

  genericOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(targetId);
      if (targetModal) openModal(targetModal);
    });
  });

  // Universal close buttons across all modals
  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentModal = btn.closest('.modal-overlay, .modal');
      if (parentModal) closeModal(parentModal);
    });
  });

  // Universal backdrop click to close
  document.querySelectorAll('.modal-overlay, .modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Universal Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active, .modal.active').forEach(m => {
        closeModal(m);
      });
    }
  });

  // Lead Form Submit Handler
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value || 'Owner';
      const address = document.getElementById('leadAddress')?.value || '';
      showToast(`Thank you, ${name}! Your valuation analysis request for ${address || 'your property'} has been submitted.`);
      leadForm.reset();
      if (leadModal) closeModal(leadModal);
    });
  }
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  const stillOpen = document.querySelectorAll('.modal-overlay.active, .modal.active');
  if (stillOpen.length === 0) {
    document.body.style.overflow = '';
  }
}

window.openModal = openModal;
window.closeModal = closeModal;
