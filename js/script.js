// js/script.js
document.addEventListener('DOMContentLoaded', () => {

  /* changeing between themes */
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('cosmos-theme', t);
  };

  applyTheme(localStorage.getItem('cosmos-theme') || 'dark');

  document.querySelectorAll('[id^="theme-toggle"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('cosmos-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  /* modal handler for single modal on page center */
  function openModal(imgSrc, title, desc, modalId='modal', imgId='modal-img', titleId='modal-title', descId='modal-desc') {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    const imgEl = document.getElementById(imgId);
    const titleEl = document.getElementById(titleId);
    const descEl = document.getElementById(descId);
    if(imgEl) { imgEl.src = imgSrc; imgEl.alt = title || 'Image'; }
    if(titleEl) titleEl.textContent = title || '';
    if(descEl) descEl.textContent = desc || '';
    modal.setAttribute('aria-hidden', 'false');
    // trap focus (very lightweight)
    setTimeout(() => {
      const close = modal.querySelector('.modal-close');
      close?.focus();
    }, 80);
  }

  // planet cards 
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || '';
      const img = btn.dataset.img || 'assets/placeholder.png';
      const desc = btn.dataset.desc || '';
      // handle different modal ids by page: if current page has modal ids modal-img-2 etc, use them
      if(document.getElementById('modal-img-2')) {
        openModal(img, name, desc, 'modal', 'modal-img-2', 'modal-title-2', 'modal-title-2' in document ? 'modal-title-2' : 'modal-title-2');
      } else {
        openModal(img, name, desc);
      }
    });
  });

  // modal close buttons and background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if(e.target === modal || e.target.classList.contains('modal-close')) {
        modal.setAttribute('aria-hidden', 'true');
        const img = modal.querySelector('img');
        if(img) img.src = '';
      }
    });
  });

  /* gallery - showcase of modals in gallery */
  document.querySelectorAll('.gallery-item').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.dataset.src || img.src;
      const title = img.alt || 'Space image';
      // open modal with separate ids if present
      const modalImg = document.getElementById('modal-img-2') || document.getElementById('modal-img');
      const modalTitle = document.getElementById('modal-title-2') || document.getElementById('modal-title');
      const modalId = document.getElementById('modal-2') ? 'modal-2' : 'modal';
      if(modalImg) modalImg.src = src;
      if(modalTitle) modalTitle.textContent = title;
      const modalEl = document.querySelector('#modal') || null;
      if(modalEl) modalEl.setAttribute('aria-hidden', 'false');
    });
  });

  /* ACCORDION (FAQ) */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      // close others
      document.querySelectorAll('.acc-panel').forEach(p => p.style.display = 'none');
      if(!open){
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });
  });


});