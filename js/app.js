// BMG Property Intelligence - Shared Application Interactions
// Version 1.0.0

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initLeadModal();
  initActiveNavLink();
});

// Toast notification helper
function showToast(message, duration = 3000) {
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

// Free Property Analysis Lead Modal
function initLeadModal() {
  const openButtons = document.querySelectorAll('[data-open-lead-modal]');
  const modal = document.getElementById('leadModal');
  const closeBtn = document.getElementById('closeLeadModal');
  const leadForm = document.getElementById('leadCaptureForm');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value || 'Owner';
      const address = document.getElementById('leadAddress')?.value || '';
      showToast(`Thank you, ${name}! Your rental market appraisal request for ${address || 'your property'} has been submitted.`);
      leadForm.reset();
      modal.classList.remove('active');
    });
  }
}
