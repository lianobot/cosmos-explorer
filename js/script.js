// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // set year in footers
  // Fixed version — works everywhere
  const year = new Date().getFullYear();
  const yearEl1 = document.getElementById('year');
  const yearEl2 = document.getElementById('year-2');
  const yearEl3 = document.getElementById('year-3');

  if (yearEl1) yearEl1.textContent = year;
  if (yearEl2) yearEl2.textContent = year;
  if (yearEl3) yearEl3.textContent = year;

  /* NAV TOGGLE for small screens */
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const listId = btn.getAttribute('aria-controls') || btn.nextElementSibling?.id;
      const list = listId ? document.getElementById(listId) : btn.nextElementSibling;
      if(!list) return;
      const isVisible = list.style.display === 'flex' || list.style.display === 'block';
      list.style.display = isVisible ? '' : 'flex';
      btn.setAttribute('aria-expanded', String(!isVisible));
    });
  });

  /* THEME toggle - default: dark (Option B look) */
  function applyTheme(name){
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem('cosmos-theme', name);
  }
  const themeButtons = document.querySelectorAll('[id^="theme-toggle"]');
  const savedTheme = localStorage.getItem('cosmos-theme') || 'dark';
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // toggle between 'dark' and 'light'
      const current = localStorage.getItem('cosmos-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      // For simplicity, 'light' just adds a class that lightens backgrounds via inline style variable
      if(next === 'light'){
        document.documentElement.style.setProperty('--bg', '#f7f9fc');
        document.documentElement.style.setProperty('--panel', '#ffffff');
        document.documentElement.style.setProperty('--text', '#071025');
        document.documentElement.style.setProperty('--muted', '#5b6a76');
        document.documentElement.style.setProperty('--accent', '#0b6efd');
        document.documentElement.style.setProperty('--accent-2', '#7b61ff');
      } else {
        // restore dark palette
        document.documentElement.style.removeProperty('--bg');
        document.documentElement.style.removeProperty('--panel');
        document.documentElement.style.removeProperty('--text');
        document.documentElement.style.removeProperty('--muted');
        document.documentElement.style.removeProperty('--accent');
        document.documentElement.style.removeProperty('--accent-2');
      }
      applyTheme(next);
    });
  });

  /* GENERIC MODAL HANDLER (single shared modal on page) */
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
  function closeModal(modalId='modal', imgId='modal-img', titleId='modal-title', descId='modal-desc') {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    const imgEl = document.getElementById(imgId);
    if(imgEl) imgEl.src = '';
  }

  // planet cards - view buttons
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

  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => {
    const modal = b.closest('.modal');
    if(modal) modal.setAttribute('aria-hidden','true');
  }));

  /* PLANET SEARCH & FILTER (planets.html) */
  const planetGrid = document.getElementById('planet-grid');
  const searchInput = document.getElementById('search-planet');
  const filterSelect = document.getElementById('filter-type');

  function filterPlanets(){
    if(!planetGrid) return;
    const q = searchInput?.value?.toLowerCase() || '';
    const type = filterSelect?.value || 'all';
    Array.from(planetGrid.querySelectorAll('.planet-card')).forEach(card => {
      const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const t = card.dataset.type || 'all';
      const matches = (name.includes(q) || q === '') && (type === 'all' || type === t);
      card.style.display = matches ? '' : 'none';
    });
  }
  searchInput?.addEventListener('input', filterPlanets);
  filterSelect?.addEventListener('change', filterPlanets);

  /* QUIZ (explore.html) */
  const quizData = [
    {
      q: "Which planet is known as the Red Planet?",
      choices: ["Venus","Mars","Jupiter","Mercury"],
      a: 1
    },
    {
      q: "Which planet has the largest diameter?",
      choices: ["Saturn","Neptune","Jupiter","Earth"],
      a: 2
    },
    {
      q: "Approximately how long does sunlight take to reach Earth?",
      choices: ["8 minutes","3 hours","1 second","24 hours"],
      a: 0
    },
    {
      q: "Which planet has prominent rings visible from afar?",
      choices: ["Mercury","Venus","Saturn","Mars"],
      a: 2
    },
    {
      q: "Which planet is closest to the Sun?",
      choices: ["Earth","Mercury","Venus","Mars"],
      a: 1
    }
  ];

  const quizQuestion = document.getElementById('quiz-question');
  const quizChoices = document.getElementById('quiz-choices');
  const nextBtn = document.getElementById('next-q');
  const restartBtn = document.getElementById('restart-q');
  const feedback = document.getElementById('quiz-feedback');

  let qIndex = 0;
  let score = 0;
  let answered = false;

  function loadQuestion(index){
    if(!quizQuestion || !quizChoices) return;
    answered = false;
    feedback.textContent = '';
    const q = quizData[index];
    quizQuestion.textContent = (index + 1) + '. ' + q.q;
    quizChoices.innerHTML = '';
    q.choices.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.type = 'button';
      btn.textContent = ch;
      btn.dataset.index = i;
      btn.addEventListener('click', () => handleChoice(btn, i, q.a));
      quizChoices.appendChild(btn);
    });
    nextBtn.disabled = true;
  }

  function handleChoice(btn, i, correctIndex){
    if(answered) return;
    answered = true;
    const choices = Array.from(quizChoices.querySelectorAll('.choice'));
    choices.forEach(c => c.classList.remove('correct','wrong'));
    if(i === correctIndex){
      btn.classList.add('correct');
      feedback.textContent = 'Correct!';
      score++;
    } else {
      btn.classList.add('wrong');
      feedback.textContent = 'Incorrect — the correct answer is: ' + quizData[qIndex].choices[correctIndex] + '.';
      // highlight the correct one
      const choicesButtons = Array.from(quizChoices.querySelectorAll('.choice'));
      const correctBtn = choicesButtons.find(cb => Number(cb.dataset.index) === correctIndex);
      if(correctBtn) correctBtn.classList.add('correct');
    }
    nextBtn.disabled = false;
    if(qIndex === quizData.length - 1){
      nextBtn.textContent = 'Finish';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  nextBtn?.addEventListener('click', () => {
    if(!answered) return;
    qIndex++;
    if(qIndex < quizData.length){
      loadQuestion(qIndex);
    } else {
      // show results
      quizQuestion.textContent = `Quiz complete — Score: ${score} / ${quizData.length}`;
      quizChoices.innerHTML = `<p class="muted">Nice work! You can restart the quiz to try again.</p>`;
      feedback.textContent = '';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
    }
  });

  restartBtn?.addEventListener('click', () => {
    qIndex = 0; score = 0; answered = false;
    nextBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    loadQuestion(0);
  });

  // load first question if quiz area exists
  if(quizQuestion && quizChoices && nextBtn && restartBtn){
    loadQuestion(0);
  }

  /* GALLERY (explore.html) - click to open modal */
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

  /* small accessibility: close modal with Escape key */
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal').forEach(m => m.setAttribute('aria-hidden','true'));
      document.querySelectorAll('.modal img').forEach(img => img.src = '');
    }
  });

});
