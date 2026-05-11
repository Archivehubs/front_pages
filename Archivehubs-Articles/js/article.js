/**
 * ARCHIVEHUBS — Articles Page Script
 * /Archivehubs-Articles/js/article.js
 *
 * Handles everything specific to Archive_article.html:
 *   Quill editor, manage modal tabs, draft/schedule/publish,
 *   help modal, settings section, slide animations.
 *
 * Load in Archive_article.html:
 *   <script type="module" src="js/article.js"></script>
 *   (Quill must be loaded before this via CDN script tag)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Quill editor initialisation ─────────────────────────── */

  function selectLocalImage(quillInstance) {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      if (!file || !/^image\//.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = quillInstance.getSelection();
        quillInstance.insertEmbed(range ? range.index : 0, 'image', e.target.result, 'user');
      };
      reader.readAsDataURL(file);
    };
  }

  if (typeof Quill !== 'undefined') {
    const toolbar1 = document.getElementById('toolbar');
    const editor1  = document.getElementById('editor-cont');
    if (toolbar1 && editor1) {
      const quill = new Quill('#editor-cont', {
        theme: 'snow',
        modules: { toolbar: { container: '#toolbar', handlers: { image: () => selectLocalImage(quill) } } },
      });

      const bracketBtn = document.getElementById('bracket-btn');
      bracketBtn?.addEventListener('click', () => {
        const range = quill.getSelection();
        if (range?.length > 0) {
          const text = quill.getText(range.index, range.length).trim();
          quill.deleteText(range.index, range.length);
          quill.insertText(range.index, `[${text}]`);
        } else {
          alert('Please select some text to wrap with brackets.');
        }
      });
    }

    const toolbar2 = document.getElementById('toolbar2');
    const editor2  = document.getElementById('editor-container');
    if (toolbar2 && editor2) {
      const quill2 = new Quill('#editor-container', {
        theme: 'snow',
        modules: { toolbar: { container: '#toolbar2', handlers: { image: () => selectLocalImage(quill2) } } },
      });
      _initContentEditablePlaceholder(editor2);
    }
  }

  /* ── Contenteditable placeholder ─────────────────────────── */

  function _initContentEditablePlaceholder(el) {
    if (!el) return;
    const ph = document.createElement('div');
    ph.className   = 'placeholder';
    ph.textContent = el.dataset.placeholder || 'Start writing…';
    el.parentElement.insertBefore(ph, el);

    function update() {
      const html = el.innerHTML.trim();
      ph.style.display = (html === '' || html === '<br>') ? 'block' : 'none';
    }

    el.addEventListener('input',  update);
    el.addEventListener('focus',  update);
    el.addEventListener('blur',   update);
    update();
  }

  /* ── Manage modal (Draft / Schedule / Publish) ────────────── */

  const manageModal  = document.getElementById('manageModal');
  const modalClose   = document.getElementById('modalClose');
  const modalBdrop   = manageModal?.querySelector('.modalBackdrop');
  const navBtns      = manageModal?.querySelectorAll('.nav-btn');
  const tabContents  = manageModal?.querySelectorAll('.tab-content');

  const MODAL_BUTTONS = {
    'draft-btn':    'draftArticle',
    'schedule-btn': 'scheduleArticle',
    'publish-btn':  'publishedArticle',
  };

  Object.entries(MODAL_BUTTONS).forEach(([btnId, tabId]) => {
    document.getElementById(btnId)?.addEventListener('click', () => {
      if (!manageModal) return;
      manageModal.style.display = 'block';
      navBtns?.forEach(t => t.classList.remove('active'));
      tabContents?.forEach(c => c.classList.remove('active'));
      const targetTab = Array.from(navBtns || []).find(t => t.dataset.tab === tabId);
      const targetCnt = document.getElementById(tabId);
      targetTab?.classList.add('active');
      targetCnt?.classList.add('active');
    });
  });

  const closeModal = () => { if (manageModal) manageModal.style.display = 'none'; };
  modalClose?.addEventListener('click', closeModal);
  modalBdrop?.addEventListener('click', closeModal);
  manageModal?.querySelector('.closeArticle')?.addEventListener('click', closeModal);

  navBtns?.forEach(tab => {
    tab.addEventListener('click', () => {
      navBtns.forEach(t => t.classList.remove('active'));
      tabContents?.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const content = manageModal?.querySelector(`#${tab.dataset.tab}`);
      content?.classList.add('active');
    });
  });

  manageModal?.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const opts = btn.nextElementSibling;
      if (opts) opts.style.display = opts.style.display === 'block' ? 'none' : 'block';
    });
  });

  /* ── Settings section ─────────────────────────────────────── */

  const settingsModal   = document.getElementById('settingsModal');
  const settingsSection = document.querySelector('.articleSettings');
  const openSettingsBtn = document.getElementById('settings-btn');
  const closeSettingsBtn= document.getElementById('settingsCloseBtn');

  if (settingsSection) settingsSection.style.display = 'none';
  if (settingsModal)   settingsModal.style.display   = 'none';

  openSettingsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (settingsModal)   settingsModal.style.display   = 'flex';
    if (settingsSection) settingsSection.style.display = 'block';
  });

  closeSettingsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (settingsModal)   settingsModal.style.display   = 'none';
    if (settingsSection) settingsSection.style.display = 'none';
  });

  /* ── Help modal ───────────────────────────────────────────── */

  const helpModal            = document.getElementById('helpModal');
  const helpCloseBtn         = document.getElementById('helpCloseBtn');
  const helpBtn              = document.getElementById('help-btn');
  const helpSelect           = document.getElementById('helpTopArchiveSelect');
  const helpItems            = document.querySelectorAll('.helpContentItem');

  helpBtn?.addEventListener('click', (e) => { e.stopPropagation(); if (helpModal) helpModal.style.display = 'flex'; });
  helpCloseBtn?.addEventListener('click', () => { if (helpModal) helpModal.style.display = 'none'; });

  function _showHelpContent(type) {
    helpItems.forEach(item => {
      item.style.display = item.dataset.type === type ? 'block' : 'none';
    });
  }

  if (helpSelect) {
    helpSelect.addEventListener('change', (e) => _showHelpContent(e.target.value));
    _showHelpContent(helpSelect.value);
  }

  /* ── Manage article dropdown ──────────────────────────────── */

  const manageBtn     = document.querySelector('.manage-btn');
  const manageArticle = document.querySelector('.manageArticle');
  if (manageArticle) manageArticle.style.display = 'none';

  manageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (manageArticle) manageArticle.style.display = manageArticle.style.display === 'block' ? 'none' : 'block';
  });

  manageArticle?.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => { if (manageArticle) manageArticle.style.display = 'none'; });

  manageArticle?.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => { if (manageArticle) manageArticle.style.display = 'none'; });
  });

  /* ── Next section dropdown ────────────────────────────────── */

  const nextBtn     = document.querySelector('.next-btn');
  const nextSection = document.querySelector('.nextSection');
  if (nextSection) nextSection.style.display = 'none';

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nextSection) nextSection.style.display = nextSection.style.display === 'block' ? 'none' : 'block';
  });

  nextSection?.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => { if (nextSection) nextSection.style.display = 'none'; });
  nextSection?.querySelectorAll('button').forEach(b => { b.addEventListener('click', () => { if (nextSection) nextSection.style.display = 'none'; }); });

  /* ── Slide animation (get started) ───────────────────────── */

  document.getElementById('start-btn')?.addEventListener('click', () => {
    document.querySelector('.startArticle')?.classList.add('slide-up');
    setTimeout(() => document.querySelector('.getStartedClick')?.classList.add('slide-in'), 300);
  });

  document.querySelector('.back-arrow')?.addEventListener('click', () => {
    document.querySelector('.getStartedClick')?.classList.remove('slide-in');
    setTimeout(() => document.querySelector('.startArticle')?.classList.remove('slide-up'), 300);
  });

});
