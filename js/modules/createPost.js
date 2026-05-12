/**
 * ARCHIVEHUBS — Create Post Modal Module (COMPLETELY FIXED)
 * /js/modules/createPost.js
 */

const CreatePost = (() => {
  'use strict';

  /* ── Data ─────────────────────────────────────────────────── */
  const BG_COLORS = [
    { color: '#ffffff', label: 'White',  border: true },
    { color: '#000000', label: 'Black' },
    { color: '#f7d000', label: 'Brand Yellow' },
    { color: '#ff4757', label: 'Red' },
    { color: '#2ed573', label: 'Green' },
    { color: '#1e90ff', label: 'Blue' },
    { color: '#a29bfe', label: 'Lavender' },
    { color: '#fd79a8', label: 'Pink' },
    { color: '#636e72', label: 'Gray' },
  ];

  const BG_GRADIENTS = [
    { color: 'linear-gradient(135deg,#f7d000,#ff6b6b)', label: 'Sunrise' },
    { color: 'linear-gradient(135deg,#a29bfe,#fd79a8)', label: 'Cotton Candy' },
    { color: 'linear-gradient(135deg,#00b894,#00cec9)', label: 'Teal' },
    { color: 'linear-gradient(135deg,#6c5ce7,#a29bfe)', label: 'Violet' },
    { color: 'linear-gradient(135deg,#fd79a8,#e17055)', label: 'Flamingo' },
    { color: 'linear-gradient(135deg,#1e90ff,#00cec9)', label: 'Ocean' },
    { color: 'linear-gradient(135deg,#f7d000,#2ed573)', label: 'Lemon Mint' },
    { color: 'linear-gradient(135deg,#1c1e21,#636e72)', label: 'Dark Smoke' },
  ];

  const TEXT_COLORS = [
    '#1c1e21', '#f7d000', '#ff4757', '#1e90ff',
    '#2ed573', '#fd79a8', '#a29bfe', '#fd9644',
    '#636e72', '#00cec9',
  ];

  const EMOJIS = [
    '😊','😂','😍','🤣','😢','😎','😡','😴','😅','😇',
    '❤️','💛','💚','💙','💜','🖤','💔','💖','👍','👎',
    '👏','🙏','👌','🎉','✨','🔥','✅','❌','🚀','💯',
    '🤔','🙌','😤','🥳','😭','🤯','💪','👀','🫶','⭐',
  ];

  const AUDIENCE_OPTIONS = [
    { value: 'Public',               icon: 'globe',            title: 'Public',                desc: 'Anyone on or off Archivehubs' },
    { value: 'Connections',          icon: 'groups',           title: 'Connections',           desc: 'Your connections on Archivehubs', default: true },
    { value: 'ConnectionsExcept',    icon: 'group_remove',     title: 'Connections except...', desc: "Don't show to some connections" },
    { value: 'Groups',               icon: 'group',            title: 'Groups',                desc: 'Show to specific groups' },
    { value: 'OnlyMe',               icon: 'lock',             title: 'Only Me',               desc: 'Only visible to you' },
    { value: 'SpecificConnections',  icon: 'person_check',     title: 'Specific Connections',  desc: 'Show to select connections only' },
    { value: 'Custom',               icon: 'manage_accounts',  title: 'Custom',                desc: 'Include and exclude connections' },
  ];

  const PEOPLE = [
    { id: 1, name: 'Sarah Johnson',    role: 'Software Engineer at Tech Corp',    initial: 'S' },
    { id: 2, name: 'Michael Chen',     role: 'Product Manager at ArchiveHubs',    initial: 'M' },
    { id: 3, name: 'David Kim',        role: 'AI Researcher at OpenAI',           initial: 'D' },
    { id: 4, name: 'Emma Watson',      role: 'Senior UI/UX Designer at Apple',    initial: 'E' },
    { id: 5, name: 'James Rodriguez',  role: 'Backend Developer at Microsoft',    initial: 'J' },
    { id: 6, name: 'Lisa Thompson',    role: 'Data Scientist at Google',          initial: 'L' },
  ];

  const FONT_SIZES = [
    { label: 'Small',  value: '14px' },
    { label: 'Normal', value: '18px', active: true },
    { label: 'Large',  value: '24px' },
    { label: 'Huge',   value: '32px' },
  ];

  /* ── State ────────────────────────────────────────────────── */
  let state = {
    selectedBg:       null,
    selectedTextColor: null,
    selectedFontSize:  '18px',
    selectedAudience:  'Connections',
    selectedPeople:    [],
    mediaFiles:        [],
    mediaPreviews:     [],
    hasLocation:       false,
    locationText:      '',
    isOpen:            false,
  };

  let el = {};

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    _cacheElements();
    if (!el.overlay) {
      console.warn('CreatePost: #createPostModal not found in DOM.');
      return;
    }
    _buildColorGrids();
    _buildFullColorPicker();
    _buildAudienceOptions();
    _buildEmojiPicker();
    _buildSizeOptions();
    _attachEventListeners();
  }

  /* ── DOM cache ─────────────────────────────────────────────── */
  function _cacheElements() {
    el.overlay = document.getElementById('createPostModal');
    if (!el.overlay) return;

    el.backdrop        = el.overlay.querySelector('.cp-backdrop');
    el.modal           = el.overlay.querySelector('.cp-modal');
    el.closeBtn        = el.overlay.querySelector('#cpCloseBtn');
    el.backBtn         = el.overlay.querySelector('#cpBackBtn');
    el.audienceBtn     = el.overlay.querySelector('#cpAudienceBtn');
    el.audienceIcon    = el.overlay.querySelector('#cpAudienceIcon');
    el.audienceLabel   = el.overlay.querySelector('#cpAudienceLabel');
    el.content         = el.overlay.querySelector('#cpContent');
    el.editor          = el.overlay.querySelector('#cpEditor');
    el.mediaGrid       = el.overlay.querySelector('#cpMediaGrid');
    el.locationTag     = el.overlay.querySelector('#cpLocationTag');
    el.peopleTags      = el.overlay.querySelector('#cpPeopleTags');
    el.bgColorBtn      = el.overlay.querySelector('#cpBgColorBtn');
    el.bgPopup         = el.overlay.querySelector('#cpBgPopup');
    el.bgColorGrid     = el.overlay.querySelector('#cpBgColorGrid');
    el.moreColorsBtn   = el.overlay.querySelector('#cpMoreColorsBtn');
    el.textColorBtn    = el.overlay.querySelector('#cpTextColorBtn');
    el.textColorIcon   = el.overlay.querySelector('#cpTextColorIcon');
    el.textPopup       = el.overlay.querySelector('#cpTextPopup');
    el.textColorGrid   = el.overlay.querySelector('#cpTextColorGrid');
    el.fontSizeBtn     = el.overlay.querySelector('#cpFontSizeBtn');
    el.sizePopup       = el.overlay.querySelector('#cpSizePopup');
    el.boldBtn         = el.overlay.querySelector('#cpBoldBtn');
    el.italicBtn       = el.overlay.querySelector('#cpItalicBtn');
    el.photoInput      = el.overlay.querySelector('#cpPhotoInput');
    el.gifInput        = el.overlay.querySelector('#cpGifInput');
    el.photoBtn        = el.overlay.querySelector('#cpPhotoBtn');
    el.gifBtn          = el.overlay.querySelector('#cpGifBtn');
    el.tagBtn          = el.overlay.querySelector('#cpTagBtn');
    el.emojiBtn        = el.overlay.querySelector('#cpEmojiBtn');
    el.locationBtn     = el.overlay.querySelector('#cpLocationBtn');
    el.emojiPicker     = el.overlay.querySelector('#cpEmojiPicker');
    el.emojiGrid       = el.overlay.querySelector('#cpEmojiGrid');
    el.postBtn         = el.overlay.querySelector('#cpPostBtn');
    el.fullColor       = el.overlay.querySelector('#cpFullColor');
    el.fullColorBack   = el.overlay.querySelector('#cpFullColorBack');
    el.fullColorBody   = el.overlay.querySelector('#cpFullColorBody');
    el.audienceModal   = el.overlay.querySelector('#cpAudienceModal');
    el.audienceOptions = el.overlay.querySelector('#cpAudienceOptions');
    el.audienceCancel  = el.overlay.querySelector('#cpAudienceCancel');
    el.audienceDone    = el.overlay.querySelector('#cpAudienceDone');
    el.audienceBack    = el.overlay.querySelector('#cpAudienceBack');
    el.setDefault      = el.overlay.querySelector('#cpSetDefault');
    el.tagModal        = el.overlay.querySelector('#cpTagModal');
    el.tagList         = el.overlay.querySelector('#cpTagList');
    el.tagSearch       = el.overlay.querySelector('#cpTagSearch');
    el.tagCancel       = el.overlay.querySelector('#cpTagCancel');
    el.tagDone         = el.overlay.querySelector('#cpTagDone');
    el.tagBack         = el.overlay.querySelector('#cpTagBack');
  }

  /* ── Build helpers ─────────────────────────────────────────── */
  function _buildColorGrids() {
    if (el.bgColorGrid) {
      el.bgColorGrid.innerHTML = '';
      BG_COLORS.forEach(c => el.bgColorGrid.appendChild(_makeBgSwatch(c)));
    }
    if (el.textColorGrid) {
      el.textColorGrid.innerHTML = '';
      TEXT_COLORS.forEach(hex => {
        const s = document.createElement('button');
        s.className = 'cp-text-swatch';
        s.style.background = hex;
        s.title = hex;
        if (hex === '#ffffff') s.style.border = '2px solid #ccc';
        s.addEventListener('click', () => _applyTextColor(hex, s));
        el.textColorGrid.appendChild(s);
      });
    }
  }

  function _makeBgSwatch(c) {
    const s = document.createElement('button');
    s.className = 'cp-bg-swatch';
    s.style.background = c.color;
    if (c.border) s.style.border = '2px solid #ccc';
    s.title = c.label || c.color;
    s.dataset.color = c.color;
    s.addEventListener('click', () => _applyBg(c.color, s));
    return s;
  }

  function _buildFullColorPicker() {
    if (!el.fullColorBody) return;
    el.fullColorBody.innerHTML = '';
    const solidSection = _colorSection('Solid', BG_COLORS);
    const gradSection = _colorSection('Gradient', BG_GRADIENTS);
    el.fullColorBody.appendChild(solidSection);
    el.fullColorBody.appendChild(gradSection);
  }

  function _colorSection(title, items) {
    const sec = document.createElement('div');
    sec.className = 'cp-color-section';
    const h = document.createElement('h3');
    h.textContent = title;
    sec.appendChild(h);
    const grid = document.createElement('div');
    grid.className = 'cp-color-grid';
    items.forEach(c => grid.appendChild(_makeBgSwatch(c)));
    sec.appendChild(grid);
    return sec;
  }

  function _buildAudienceOptions() {
    if (!el.audienceOptions) return;
    el.audienceOptions.innerHTML = '';
    AUDIENCE_OPTIONS.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'cp-audience-option' + (opt.value === state.selectedAudience ? ' active' : '');
      div.dataset.value = opt.value;
      div.innerHTML = `
        <span class="material-symbols-outlined">${opt.icon}</span>
        <div class="cp-audience-option-info">
          <span class="cp-audience-option-title">${opt.title}</span>
          <span class="cp-audience-option-desc">${opt.desc}</span>
        </div>
        <input type="radio" name="cpAudience" value="${opt.value}" ${opt.value === state.selectedAudience ? 'checked' : ''}>
      `;
      div.addEventListener('click', () => _selectAudienceOption(opt, div));
      el.audienceOptions.appendChild(div);
    });
  }

  function _buildEmojiPicker() {
    if (!el.emojiGrid) return;
    el.emojiGrid.innerHTML = '';
    EMOJIS.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'cp-emoji-btn';
      btn.textContent = emoji;
      btn.addEventListener('click', () => {
        _insertTextAtCursor(emoji);
        _togglePopup(el.emojiPicker, false);
        _updatePostBtn();
      });
      el.emojiGrid.appendChild(btn);
    });
  }

  function _buildSizeOptions() {
    if (!el.sizePopup) return;
    el.sizePopup.innerHTML = '';
    FONT_SIZES.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'cp-size-option' + (f.active ? ' active' : '');
      btn.textContent = f.label;
      btn.dataset.size = f.value;
      btn.addEventListener('click', () => {
        _applyFontSize(f.value, btn);
        _togglePopup(el.sizePopup, false);
      });
      el.sizePopup.appendChild(btn);
    });
  }

  function _buildTagList(filter = '') {
    if (!el.tagList) return;
    el.tagList.innerHTML = '';
    const filtered = PEOPLE.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(p => {
      const isSelected = state.selectedPeople.includes(p.id);
      const div = document.createElement('div');
      div.className = 'cp-tag-person' + (isSelected ? ' selected' : '');
      div.dataset.id = p.id;
      div.innerHTML = `
        <div class="cp-tag-person-avatar">${p.initial}</div>
        <div class="cp-tag-person-info">
          <span class="cp-tag-person-name">${p.name}</span>
          <span class="cp-tag-person-role">${p.role}</span>
        </div>
        <span class="cp-tag-check material-symbols-outlined">${isSelected ? 'check' : ''}</span>
      `;
      div.addEventListener('click', () => _togglePersonTag(p.id, div));
      el.tagList.appendChild(div);
    });
    if (!filtered.length) {
      el.tagList.innerHTML = `<p style="padding:16px;color:var(--text-secondary);font-size:13px;">No people found.</p>`;
    }
  }

  /* ── Event listeners ───────────────────────────────────────── */
  function _attachEventListeners() {
    el.backdrop.addEventListener('click', _handleClose);
    el.closeBtn.addEventListener('click', _handleClose);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.isOpen) _handleClose(); });

    el.editor.addEventListener('input', () => {
      el.editor.classList.toggle('show-placeholder', el.editor.textContent.trim() === '');
      _updatePostBtn();
    });
    el.editor.addEventListener('focus', () => el.editor.classList.toggle('show-placeholder', el.editor.textContent.trim() === ''));

    el.bgColorBtn.addEventListener('click', e => { e.stopPropagation(); _togglePopup(el.bgPopup); _closeAllExcept(el.bgPopup); });
    el.moreColorsBtn.addEventListener('click', e => { e.stopPropagation(); _togglePopup(el.bgPopup, false); _togglePopup(el.fullColor, true); });
    el.fullColorBack.addEventListener('click', () => _togglePopup(el.fullColor, false));
    el.textColorBtn.addEventListener('click', e => { e.stopPropagation(); _togglePopup(el.textPopup); _closeAllExcept(el.textPopup); });
    el.fontSizeBtn.addEventListener('click', e => { e.stopPropagation(); _togglePopup(el.sizePopup); _closeAllExcept(el.sizePopup); });
    el.boldBtn.addEventListener('click', () => { el.editor.focus(); document.execCommand('bold', false, null); el.boldBtn.classList.toggle('active'); });
    el.italicBtn.addEventListener('click', () => { el.editor.focus(); document.execCommand('italic', false, null); el.italicBtn.classList.toggle('active'); });

    el.photoBtn.addEventListener('click', () => { el.photoInput.accept = 'image/*,video/*'; el.photoInput.click(); });
    el.photoInput.addEventListener('change', e => {
      Array.from(e.target.files).forEach(file => _addMediaItem(file));
      e.target.value = '';
    });
    el.gifBtn.addEventListener('click', () => { el.gifInput.accept = 'image/gif'; el.gifInput.click(); });
    el.gifInput.addEventListener('change', e => {
      if (e.target.files[0]) _addMediaItem(e.target.files[0]);
      e.target.value = '';
    });

    el.emojiBtn.addEventListener('click', e => { e.stopPropagation(); _togglePopup(el.emojiPicker); _closeAllExcept(el.emojiPicker); });
    el.locationBtn.addEventListener('click', () => { if (!state.hasLocation) _addLocation('Lagos, Nigeria'); });
    el.tagBtn.addEventListener('click', () => _openTagModal());

    el.tagSearch.addEventListener('input', e => _buildTagList(e.target.value));
    el.tagCancel.addEventListener('click', () => { state.selectedPeople = [..._savedPeople]; _closeNestedModal(el.tagModal); });
    el.tagBack.addEventListener('click', () => { state.selectedPeople = [..._savedPeople]; _closeNestedModal(el.tagModal); });
    el.tagDone.addEventListener('click', () => { _savedPeople = [...state.selectedPeople]; _renderPeopleTags(); _closeNestedModal(el.tagModal); _updatePostBtn(); });

    el.audienceBtn.addEventListener('click', () => _openAudienceModal());
    el.audienceCancel.addEventListener('click', () => _closeNestedModal(el.audienceModal));
    el.audienceBack.addEventListener('click', () => _closeNestedModal(el.audienceModal));
    el.audienceDone.addEventListener('click', () => {
      const radio = el.audienceModal.querySelector('input[name="cpAudience"]:checked');
      if (radio) {
        const opt = AUDIENCE_OPTIONS.find(o => o.value === radio.value);
        if (opt) _applyAudience(opt);
      }
      if (el.setDefault.checked) localStorage.setItem('cp_defaultAudience', state.selectedAudience);
      _closeNestedModal(el.audienceModal);
    });

    el.postBtn.addEventListener('click', _submitPost);
    document.addEventListener('click', () => _closeAllPopups());
    el.overlay.addEventListener('click', e => e.stopPropagation());
  }

  let _savedPeople = [];

  /* ── Actions ───────────────────────────────────────────────── */
  function _applyBg(color, swatchEl) {
    state.selectedBg = color;
    const isGradient = color.includes('gradient');
    el.content.style.background = isGradient ? '' : color;
    el.content.style.backgroundImage = isGradient ? color : '';
    el.overlay.querySelectorAll('.cp-bg-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === color));
    _togglePopup(el.bgPopup, false);
    _togglePopup(el.fullColor, false);
  }

  function _applyTextColor(hex, swatchEl) {
    state.selectedTextColor = hex;
    el.editor.style.color = hex;
    el.textColorIcon.style.color = hex;
    el.overlay.querySelectorAll('.cp-text-swatch').forEach(s => s.classList.toggle('selected', s.style.background === hex));
    _togglePopup(el.textPopup, false);
  }

  function _applyFontSize(size, btnEl) {
    state.selectedFontSize = size;
    el.editor.style.fontSize = size;
    el.sizePopup.querySelectorAll('.cp-size-option').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }

  function _selectAudienceOption(opt, div) {
    el.audienceOptions.querySelectorAll('.cp-audience-option').forEach(o => o.classList.remove('active'));
    div.classList.add('active');
    div.querySelector('input').checked = true;
    el.audienceDone.disabled = false;
  }

  function _applyAudience(opt) {
    state.selectedAudience = opt.value;
    el.audienceIcon.textContent = opt.icon;
    el.audienceLabel.textContent = opt.title;
  }

  function _addMediaItem(file) {
    state.mediaFiles.push(file);
    const reader = new FileReader();
    const type = file.type.startsWith('video') ? 'video' : 'image';
    reader.onload = ev => {
      state.mediaPreviews.push({ url: ev.target.result, type, name: file.name });
      _renderMediaGrid();
      _updatePostBtn();
    };
    reader.readAsDataURL(file);
  }

  function _renderMediaGrid() {
    el.mediaGrid.innerHTML = '';
    state.mediaPreviews.forEach((file, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'cp-media-item';
      if (file.type === 'video') {
        const vid = document.createElement('video');
        vid.src = file.url;
        vid.muted = true;
        wrapper.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src = file.url;
        img.alt = file.name;
        wrapper.appendChild(img);
      }
      const removeBtn = document.createElement('button');
      removeBtn.className = 'cp-remove-media';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        state.mediaFiles.splice(index, 1);
        state.mediaPreviews.splice(index, 1);
        _renderMediaGrid();
        _updatePostBtn();
      });
      wrapper.appendChild(removeBtn);
      el.mediaGrid.appendChild(wrapper);
    });
    if (state.mediaFiles.length > 0 && state.mediaFiles.length < 10) {
      const addTile = document.createElement('div');
      addTile.className = 'cp-media-add-tile';
      addTile.innerHTML = '<span class="material-symbols-outlined">add</span>';
      addTile.addEventListener('click', () => el.photoBtn.click());
      el.mediaGrid.appendChild(addTile);
    }
  }

  function _addLocation(locationText) {
    state.hasLocation = true;
    state.locationText = locationText;
    el.locationTag.innerHTML = '';
    const chip = document.createElement('div');
    chip.className = 'cp-location-chip';
    chip.innerHTML = `<span class="material-symbols-outlined">location_on</span><span>${locationText}</span><span class="cp-remove-chip material-symbols-outlined" id="cpRemoveLocation">close</span>`;
    chip.querySelector('#cpRemoveLocation').addEventListener('click', () => {
      state.hasLocation = false;
      state.locationText = '';
      el.locationTag.innerHTML = '';
      _updatePostBtn();
    });
    el.locationTag.appendChild(chip);
    _updatePostBtn();
  }

  function _togglePersonTag(personId, div) {
    const idx = state.selectedPeople.indexOf(personId);
    if (idx > -1) {
      state.selectedPeople.splice(idx, 1);
      div.classList.remove('selected');
      div.querySelector('.cp-tag-check').textContent = '';
    } else {
      state.selectedPeople.push(personId);
      div.classList.add('selected');
      div.querySelector('.cp-tag-check').textContent = 'check';
    }
  }

  function _renderPeopleTags() {
    el.peopleTags.innerHTML = '';
    state.selectedPeople.forEach(id => {
      const person = PEOPLE.find(p => p.id === id);
      if (!person) return;
      const chip = document.createElement('div');
      chip.className = 'cp-tag-chip';
      chip.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px;color:var(--accent-color)">sell</span><span>${person.name}</span><span class="cp-remove-chip material-symbols-outlined" data-id="${id}">close</span>`;
      chip.querySelector('.cp-remove-chip').addEventListener('click', () => {
        state.selectedPeople = state.selectedPeople.filter(i => i !== id);
        _savedPeople = [...state.selectedPeople];
        _renderPeopleTags();
        _updatePostBtn();
      });
      el.peopleTags.appendChild(chip);
    });
  }

  function _openAudienceModal() { _buildAudienceOptions(); el.audienceDone.disabled = true; _openNestedModal(el.audienceModal); }
  function _openTagModal() { _savedPeople = [...state.selectedPeople]; _buildTagList(); el.tagSearch.value = ''; _openNestedModal(el.tagModal); }
  function _openNestedModal(modal) { modal.classList.remove('hidden'); }
  function _closeNestedModal(modal) { modal.classList.add('hidden'); }

  function _updatePostBtn() {
    const hasText = el.editor.textContent.trim().length > 0;
    const hasMedia = state.mediaFiles.length > 0;
    const hasTags = state.selectedPeople.length > 0;
    const hasLoc = state.hasLocation;
    el.postBtn.disabled = !(hasText || hasMedia || hasTags || hasLoc);
  }

  function _togglePopup(popupEl, forceState) {
    if (!popupEl) return;
    const show = forceState !== undefined ? forceState : popupEl.classList.contains('hidden');
    popupEl.classList.toggle('hidden', !show);
  }

  function _closeAllPopups() {
    [el.bgPopup, el.textPopup, el.sizePopup, el.emojiPicker].forEach(p => p?.classList.add('hidden'));
  }

  function _closeAllExcept(keepOpen) {
    [el.bgPopup, el.textPopup, el.sizePopup, el.emojiPicker].forEach(p => {
      if (p && p !== keepOpen) p.classList.add('hidden');
    });
  }

  function _insertTextAtCursor(text) {
    el.editor.focus();
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (el.editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        el.editor.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
    }
    el.editor.textContent += text;
    el.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function _hasContent() {
    return (el.editor.textContent.trim().length > 0 || state.mediaFiles.length > 0 || state.selectedPeople.length > 0 || state.hasLocation);
  }

  function _resetState() {
    state = {
      selectedBg: null,
      selectedTextColor: null,
      selectedFontSize: '18px',
      selectedAudience: 'Connections',
      selectedPeople: [],
      mediaFiles: [],
      mediaPreviews: [],
      hasLocation: false,
      locationText: '',
      isOpen: false,
    };
    _savedPeople = [];
    el.editor.innerHTML = '';
    el.editor.style.cssText = '';
    el.editor.classList.add('show-placeholder');
    el.content.style.cssText = '';
    el.mediaGrid.innerHTML = '';
    el.locationTag.innerHTML = '';
    el.peopleTags.innerHTML = '';
    el.textColorIcon.style.color = '';
    el.audienceIcon.textContent = 'groups';
    el.audienceLabel.textContent = 'Connections';
    el.postBtn.disabled = true;
    el.boldBtn.classList.remove('active');
    el.italicBtn.classList.remove('active');
    el.overlay.querySelectorAll('.cp-bg-swatch, .cp-text-swatch').forEach(s => s.classList.remove('selected'));
    if (el.sizePopup) {
      el.sizePopup.querySelectorAll('.cp-size-option').forEach(b => b.classList.toggle('active', b.dataset.size === '18px'));
    }
  }

  function open() {
    if (!el.overlay) return;
    el.overlay.classList.remove('hidden');
    state.isOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => el.editor?.focus(), 280);
    const saved = localStorage.getItem('cp_defaultAudience');
    if (saved) {
      const opt = AUDIENCE_OPTIONS.find(o => o.value === saved);
      if (opt) _applyAudience(opt);
    }
  }

  function close() {
    if (!el.overlay) return;
    el.overlay.classList.add('hidden');
    state.isOpen = false;
    document.body.style.overflow = '';
    _closeAllPopups();
    _closeNestedModal(el.audienceModal);
    _closeNestedModal(el.tagModal);
    if (el.fullColor) el.fullColor.classList.add('hidden');
    _resetState();
  }

  function _handleClose() {
    if (_hasContent()) {
      if (confirm('Discard this post? Your changes will be lost.')) close();
    } else {
      close();
    }
  }

  /* ── MAIN SUBMIT FUNCTION - COMPLETELY REWRITTEN ────────────────── */
  async function _submitPost() {
    if (el.postBtn.disabled) return;

    const originalText = el.postBtn.textContent;
    el.postBtn.disabled = true;
    el.postBtn.textContent = 'Posting...';

    try {
      // Get text content from the editor
      const textContent = el.editor.innerText.trim();
      
      // Validate
      if (!textContent && state.mediaFiles.length === 0) {
        _showToast('Please add some text or media to your post', 'error');
        return;
      }

      if (textContent.length > 300) {
        _showToast('Post text cannot exceed 300 characters', 'error');
        return;
      }
      
      // Extract hashtags from text
      const tagRegex = /#(\w+)/g;
      const tags = [];
      let match;
      while ((match = tagRegex.exec(textContent)) !== null) {
        tags.push(match[1]);
      }

      // Default tag if none found - IMPORTANT: Backend requires at least one tag
      if (tags.length === 0) {
        tags.push('general');
      }

      // Create FormData - EXACTLY like the working console test
      const formData = new FormData();
      formData.append('textContent', textContent);
      
      for (let i = 0; i < tags.length; i++) {
        formData.append('tags[]', tags[i]); 
      }

      // Append media files
      for (let i = 0; i < state.mediaFiles.length; i++) {
        formData.append('media', state.mediaFiles[i]);
      }

      // DEBUG - Log everything to verify
      console.log('========== CREATE POST DEBUG ==========');
      console.log('textContent:', textContent);
      console.log('tags array:', tags);
      console.log('media count:', state.mediaFiles.length);
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        const value = pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1];
        console.log(`  ${pair[0]}: ${value}`);
      }
      console.log('========================================');

      // Make the request - using the same URL that worked in console test
      const response = await fetch('http://localhost:3000/post/create', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server error response:', result);
        const errorMsg = result.errors?.[0]?.msg || result.message || 'Failed to create post';
        throw new Error(errorMsg);
      }

      console.log('Post created successfully:', result);
      _showToast('Post shared successfully!');
      
      // Close modal and reset
      close();
      
      // Refresh the feed
      setTimeout(() => {
        // Dispatch a custom event that feed module can listen to
        window.dispatchEvent(new CustomEvent('postCreated', { detail: result.post }));
        // Also try to reload feed if Feed module exists
        if (window.Feed && typeof window.Feed.loadFeed === 'function') {
          window.Feed.loadFeed(true);
        }
      }, 500);

    } catch (error) {
      console.error('Create post error:', error);
      _showToast(error.message || 'Failed to create post. Please try again.', 'error');
    } finally {
      el.postBtn.disabled = false;
      el.postBtn.textContent = originalText;
    }
  }

  function _showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'error' ? '#ef4444' : '#22c55e'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 100000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ── Public API ────────────────────────────────────────────── */
  return { init, open, close };
})();

export default CreatePost;