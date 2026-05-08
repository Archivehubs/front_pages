/**
 * ARCHIVEHUBS — Create Story Modal Module
 * /js/modules/createStory.js
 *
 * Features:
 *   - Image / Video upload (click or drag-and-drop)
 *   - Phone-frame preview
 *   - Text overlay (draggable, editable in-place)
 *   - Text overlay styles: font family, size (slider), color, bold, italic, bg-pill
 *   - Background color / gradient (for text-only stories)
 *   - Discard with confirmation
 *   - Post Story → API hook
 *
 * Usage: import and call CreateStory.init() once in main.js
 */

const CreateStory = (() => {
  'use strict';

  /* ── Data ─────────────────────────────────────────────────── */

  const BG_GRADIENTS = [
    { color: 'linear-gradient(135deg,#f7d000,#1c1e21)',  label: 'Brand' },
    { color: 'linear-gradient(135deg,#ff4757,#ff6b81)',  label: 'Rose' },
    { color: 'linear-gradient(135deg,#2ed573,#1e90ff)',  label: 'Ocean' },
    { color: 'linear-gradient(135deg,#a29bfe,#fd79a8)',  label: 'Candy' },
    { color: 'linear-gradient(135deg,#fd79a8,#e17055)',  label: 'Flamingo' },
    { color: 'linear-gradient(135deg,#6c5ce7,#a29bfe)',  label: 'Violet' },
    { color: 'linear-gradient(135deg,#00b894,#00cec9)',  label: 'Teal' },
    { color: 'linear-gradient(135deg,#1c1e21,#636e72)',  label: 'Dark' },
    { color: '#f7d000',                                   label: 'Yellow' },
    { color: '#1c1e21',                                   label: 'Black' },
    { color: '#ffffff',                                   label: 'White', border: true },
    { color: '#ff4757',                                   label: 'Red' },
  ];

  const TEXT_COLORS = [
    '#ffffff', '#1c1e21', '#f7d000', '#ff4757',
    '#2ed573', '#1e90ff', '#fd79a8', '#a29bfe',
    '#fd9644', '#00cec9',
  ];

  const FONTS = [
    { label: 'Poppins (Default)',  value: "'Poppins', sans-serif" },
    { label: 'Playfair Display',   value: "'Playfair Display', serif" },
    { label: 'Georgia',            value: 'Georgia, serif' },
    { label: 'Arial',              value: 'Arial, sans-serif' },
    { label: 'Courier New',        value: "'Courier New', monospace" },
    { label: 'Impact',             value: 'Impact, sans-serif' },
  ];

  /* ── State ────────────────────────────────────────────────── */

  let state = {
    mediaUrl:       null,
    mediaType:      null,   // 'image' | 'video'
    mediaName:      '',
    selectedBg:     'linear-gradient(135deg,#f7d000,#1c1e21)',
    textContent:    '',
    textColor:      '#ffffff',
    textFont:       "'Poppins', sans-serif",
    textSize:       18,
    textBold:       false,
    textItalic:     false,
    textHasBg:      false,
    isOpen:         false,
    isDragging:     false,
    dragOffsetX:    0,
    dragOffsetY:    0,
  };

  let el = {};

  /* ── Init ─────────────────────────────────────────────────── */

  function init() {
    _cacheElements();
    if (!el.overlay) {
      console.warn('CreateStory: #createStoryModal not found in DOM.');
      return;
    }
    _buildBgSwatches();
    _buildTextColorSwatches();
    _buildFontOptions();
    _attachEventListeners();
  }

  /* ── DOM cache ─────────────────────────────────────────────── */

  function _cacheElements() {
    el.overlay          = document.getElementById('createStoryModal');
    if (!el.overlay) return;

    el.backdrop         = el.overlay.querySelector('.cs-backdrop');
    el.closeBtn         = el.overlay.querySelector('#csCloseBtn');

    // Preview panel
    el.previewContent   = el.overlay.querySelector('#csPreviewContent');
    el.previewBg        = el.overlay.querySelector('#csPreviewBg');
    el.previewImg       = el.overlay.querySelector('#csPreviewImg');
    el.previewVideo     = el.overlay.querySelector('#csPreviewVideo');
    el.uploadPlaceholder = el.overlay.querySelector('#csUploadPlaceholder');
    el.textOverlay      = el.overlay.querySelector('#csTextOverlay');

    // Controls
    el.fileInput        = el.overlay.querySelector('#csFileInput');
    el.uploadBtn        = el.overlay.querySelector('#csUploadBtn');
    el.bgSwatches       = el.overlay.querySelector('#csBgSwatches');
    el.textSwatches     = el.overlay.querySelector('#csTextSwatches');
    el.fontSelect       = el.overlay.querySelector('#csFontSelect');
    el.textSizeRange    = el.overlay.querySelector('#csTextSizeRange');
    el.textSizeValue    = el.overlay.querySelector('#csTextSizeValue');
    el.addTextBtn       = el.overlay.querySelector('#csAddTextBtn');
    el.boldBtn          = el.overlay.querySelector('#csBoldBtn');
    el.italicBtn        = el.overlay.querySelector('#csItalicBtn');
    el.textBgBtn        = el.overlay.querySelector('#csTextBgBtn');
    el.removeTextBtn    = el.overlay.querySelector('#csRemoveTextBtn');
    el.removeMediaBtn   = el.overlay.querySelector('#csRemoveMediaBtn');
    el.postBtn          = el.overlay.querySelector('#csPostBtn');
    el.discardBtn       = el.overlay.querySelector('#csDiscardBtn');

    // Drop zone is the whole preview panel
    el.dropZone         = el.overlay.querySelector('.cs-preview-panel');
  }

  /* ── Build helpers ─────────────────────────────────────────── */

  function _buildBgSwatches() {
    if (!el.bgSwatches) return;
    el.bgSwatches.innerHTML = '';
    BG_GRADIENTS.forEach(bg => {
      const btn = document.createElement('button');
      btn.className = 'cs-bg-swatch' + (bg.color === state.selectedBg ? ' selected' : '');
      btn.style.background = bg.color;
      if (bg.border) btn.style.border = '2px solid #ccc';
      btn.title = bg.label;
      btn.dataset.color = bg.color;
      btn.addEventListener('click', () => _applyBg(bg.color, btn));
      el.bgSwatches.appendChild(btn);
    });
  }

  function _buildTextColorSwatches() {
    if (!el.textSwatches) return;
    el.textSwatches.innerHTML = '';
    TEXT_COLORS.forEach(hex => {
      const btn = document.createElement('button');
      btn.className = 'cs-text-swatch' + (hex === state.textColor ? ' selected' : '');
      btn.style.background = hex;
      if (hex === '#ffffff') btn.style.border = '2px solid #ccc';
      btn.title = hex;
      btn.dataset.color = hex;
      btn.addEventListener('click', () => _applyTextColor(hex, btn));
      el.textSwatches.appendChild(btn);
    });
  }

  function _buildFontOptions() {
    if (!el.fontSelect) return;
    el.fontSelect.innerHTML = '';
    FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.value;
      opt.textContent = f.label;
      opt.style.fontFamily = f.value;
      if (f.value === state.textFont) opt.selected = true;
      el.fontSelect.appendChild(opt);
    });
  }

  /* ── Event listeners ───────────────────────────────────────── */

  function _attachEventListeners() {

    /* ── Open / Close ─────────────────────── */
    el.backdrop.addEventListener('click', _handleClose);
    el.closeBtn.addEventListener('click', _handleClose);
    el.discardBtn.addEventListener('click', _handleClose);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.isOpen) _handleClose();
    });

    /* ── File upload ──────────────────────── */
    el.uploadBtn.addEventListener('click', () => el.fileInput.click());
    el.uploadPlaceholder.addEventListener('click', () => el.fileInput.click());

    el.fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) _loadMediaFile(file);
      e.target.value = '';
    });

    // Remove media
    el.removeMediaBtn.addEventListener('click', () => {
      state.mediaUrl  = null;
      state.mediaType = null;
      state.mediaName = '';
      _renderPreview();
      _updatePostBtn();
    });

    /* ── Drag and drop on preview panel ───── */
    el.dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      el.dropZone.style.outline = '3px dashed var(--accent-color)';
    });

    el.dropZone.addEventListener('dragleave', () => {
      el.dropZone.style.outline = '';
    });

    el.dropZone.addEventListener('drop', e => {
      e.preventDefault();
      el.dropZone.style.outline = '';
      const file = e.dataTransfer.files[0];
      if (file) _loadMediaFile(file);
    });

    /* ── Background swatches ──────────────── */
    // (individual swatch listeners attached in _buildBgSwatches)

    /* ── Text overlay controls ────────────── */
    el.addTextBtn.addEventListener('click', () => {
      el.textOverlay.classList.remove('hidden');
      el.textOverlay.focus();

      // Position overlay selection
      el.removeTextBtn.classList.remove('hidden');
      _updateTextOverlayStyle();
    });

    el.removeTextBtn.addEventListener('click', () => {
      el.textOverlay.textContent = '';
      el.textOverlay.classList.add('hidden');
      el.removeTextBtn.classList.add('hidden');
      state.textContent = '';
      _updatePostBtn();
    });

    el.textOverlay.addEventListener('input', () => {
      state.textContent = el.textOverlay.textContent;
      _updatePostBtn();
    });

    el.textOverlay.addEventListener('blur', () => {
      state.textContent = el.textOverlay.textContent;
    });

    // Font select
    el.fontSelect.addEventListener('change', e => {
      state.textFont = e.target.value;
      _updateTextOverlayStyle();
    });

    // Size slider
    el.textSizeRange.addEventListener('input', e => {
      state.textSize = parseInt(e.target.value);
      el.textSizeValue.textContent = state.textSize + 'px';
      _updateTextOverlayStyle();
    });

    // Bold
    el.boldBtn.addEventListener('click', () => {
      state.textBold = !state.textBold;
      el.boldBtn.classList.toggle('active', state.textBold);
      _updateTextOverlayStyle();
    });

    // Italic
    el.italicBtn.addEventListener('click', () => {
      state.textItalic = !state.textItalic;
      el.italicBtn.classList.toggle('active', state.textItalic);
      _updateTextOverlayStyle();
    });

    // Text background pill
    el.textBgBtn.addEventListener('click', () => {
      state.textHasBg = !state.textHasBg;
      el.textBgBtn.classList.toggle('active', state.textHasBg);
      el.textOverlay.classList.toggle('has-bg', state.textHasBg);
      _updateTextOverlayStyle();
    });

    // Text color swatches (listeners attached in _buildTextColorSwatches)

    /* ── Drag text overlay ────────────────── */
    el.textOverlay.addEventListener('mousedown', _startDrag);
    el.textOverlay.addEventListener('touchstart', _startDragTouch, { passive: true });

    /* ── Post button ─────────────────────── */
    el.postBtn.addEventListener('click', _submitStory);
  }

  /* ── Drag logic ────────────────────────────────────────────── */

  function _startDrag(e) {
    if (e.target.isContentEditable) return;
    state.isDragging = true;
    const rect  = el.textOverlay.getBoundingClientRect();
    state.dragOffsetX = e.clientX - rect.left;
    state.dragOffsetY = e.clientY - rect.top;

    const onMove = ev => _moveDrag(ev.clientX, ev.clientY);
    const onUp   = () => {
      state.isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function _startDragTouch(e) {
    const t = e.touches[0];
    state.isDragging = true;
    const rect  = el.textOverlay.getBoundingClientRect();
    state.dragOffsetX = t.clientX - rect.left;
    state.dragOffsetY = t.clientY - rect.top;

    const onMove = ev => _moveDrag(ev.touches[0].clientX, ev.touches[0].clientY);
    const onEnd  = () => {
      state.isDragging = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }

  function _moveDrag(clientX, clientY) {
    if (!state.isDragging) return;
    const frame = el.previewContent.getBoundingClientRect();
    let x = clientX - frame.left - state.dragOffsetX;
    let y = clientY - frame.top  - state.dragOffsetY;

    // Keep within frame
    x = Math.max(0, Math.min(x, frame.width  - el.textOverlay.offsetWidth));
    y = Math.max(0, Math.min(y, frame.height - el.textOverlay.offsetHeight));

    el.textOverlay.style.transform = 'none';
    el.textOverlay.style.left = x + 'px';
    el.textOverlay.style.top  = y + 'px';
  }

  /* ── Apply helpers ─────────────────────────────────────────── */

  function _applyBg(color, btn) {
    state.selectedBg = color;
    el.bgSwatches.querySelectorAll('.cs-bg-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === color);
    });
    _renderPreview();
  }

  function _applyTextColor(hex, btn) {
    state.textColor = hex;
    el.textSwatches.querySelectorAll('.cs-text-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === hex);
    });
    _updateTextOverlayStyle();
  }

  function _updateTextOverlayStyle() {
    el.textOverlay.style.fontFamily   = state.textFont;
    el.textOverlay.style.fontSize     = state.textSize + 'px';
    el.textOverlay.style.color        = state.textColor;
    el.textOverlay.style.fontWeight   = state.textBold   ? '700' : '400';
    el.textOverlay.style.fontStyle    = state.textItalic ? 'italic' : 'normal';
  }

  /* ── Media loading ─────────────────────────────────────────── */

  function _loadMediaFile(file) {
    const validTypes = [
      'image/jpeg','image/png','image/gif','image/webp',
      'video/mp4','video/quicktime','video/webm',
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPG, PNG, GIF, WebP) or video (MP4, MOV, WebM).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be under 100 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      state.mediaUrl  = e.target.result;
      state.mediaType = file.type.startsWith('video') ? 'video' : 'image';
      state.mediaName = file.name;
      _renderPreview();
      _updatePostBtn();
    };
    reader.readAsDataURL(file);
  }

  /* ── Render preview ────────────────────────────────────────── */

  function _renderPreview() {
    const hasMedia = !!state.mediaUrl;

    // Background (always visible — sits behind media)
    const isGradient = state.selectedBg.includes('gradient');
    el.previewBg.style.background = isGradient ? '' : state.selectedBg;
    el.previewBg.style.backgroundImage = isGradient ? state.selectedBg : '';

    if (hasMedia) {
      el.uploadPlaceholder.classList.add('hidden');
      el.removeMediaBtn.classList.remove('hidden');

      if (state.mediaType === 'video') {
        el.previewImg.classList.add('hidden');
        el.previewVideo.classList.remove('hidden');
        el.previewVideo.src = state.mediaUrl;
        el.previewVideo.play().catch(() => {});
      } else {
        el.previewVideo.classList.add('hidden');
        el.previewVideo.src = '';
        el.previewImg.classList.remove('hidden');
        el.previewImg.src = state.mediaUrl;
      }
    } else {
      el.uploadPlaceholder.classList.remove('hidden');
      el.removeMediaBtn.classList.add('hidden');
      el.previewImg.classList.add('hidden');
      el.previewImg.src = '';
      el.previewVideo.classList.add('hidden');
      el.previewVideo.src = '';
    }
  }

  /* ── Post button state ─────────────────────────────────────── */

  function _updatePostBtn() {
    const hasMedia   = !!state.mediaUrl;
    const hasText    = state.textContent.trim().length > 0;
    el.postBtn.disabled = !(hasMedia || hasText);
  }

  /* ── Reset ─────────────────────────────────────────────────── */

  function _resetState() {
    state = {
      mediaUrl:    null,
      mediaType:   null,
      mediaName:   '',
      selectedBg:  'linear-gradient(135deg,#f7d000,#1c1e21)',
      textContent: '',
      textColor:   '#ffffff',
      textFont:    "'Poppins', sans-serif",
      textSize:    18,
      textBold:    false,
      textItalic:  false,
      textHasBg:   false,
      isOpen:      false,
      isDragging:  false,
      dragOffsetX: 0,
      dragOffsetY: 0,
    };

    el.textOverlay.textContent  = '';
    el.textOverlay.classList.add('hidden');
    el.textOverlay.style.cssText = '';
    el.textOverlay.style.transform = 'translate(-50%,-50%)';
    el.textOverlay.style.left = '50%';
    el.textOverlay.style.top  = '50%';

    el.removeTextBtn.classList.add('hidden');
    el.boldBtn.classList.remove('active');
    el.italicBtn.classList.remove('active');
    el.textBgBtn.classList.remove('active');

    if (el.textSizeRange) { el.textSizeRange.value = 18; }
    if (el.textSizeValue) { el.textSizeValue.textContent = '18px'; }

    el.bgSwatches.querySelectorAll('.cs-bg-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === state.selectedBg);
    });

    el.textSwatches.querySelectorAll('.cs-text-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === state.textColor);
    });

    if (el.fontSelect) el.fontSelect.value = state.textFont;

    _renderPreview();
    _updatePostBtn();
  }

  /* ── Open / Close ──────────────────────────────────────────── */

  function open() {
    if (!el.overlay) return;
    el.overlay.classList.remove('hidden');
    state.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!el.overlay) return;
    el.overlay.classList.add('hidden');
    state.isOpen = false;
    document.body.style.overflow = '';
    _resetState();
  }

  function _handleClose() {
    const hasSomething = state.mediaUrl || state.textContent.trim().length > 0;
    if (hasSomething) {
      if (confirm('Discard this story? Your changes will be lost.')) close();
    } else {
      close();
    }
  }

  /* ── Submit ────────────────────────────────────────────────── */

  function _submitStory() {
    if (el.postBtn.disabled) return;

    const payload = {
      mediaUrl:   state.mediaUrl,
      mediaType:  state.mediaType,
      mediaName:  state.mediaName,
      background: state.selectedBg,
      text:       state.textContent,
      textStyle: {
        color:      state.textColor,
        font:       state.textFont,
        size:       state.textSize,
        bold:       state.textBold,
        italic:     state.textItalic,
        hasBg:      state.textHasBg,
      },
      timestamp:  new Date().toISOString(),
    };

    console.log('[CreateStory] Submitting payload:', payload);

    /**
     * ── API HOOK (Phase 5) ──────────────────────────────────
     * fetch('/api/stories', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
     *   body: JSON.stringify(payload),
     * })
     * .then(res => res.json())
     * .then(data => {
     *   Stories.prepend(data.story);   // from feed.js
     *   close();
     * })
     * .catch(err => console.error('Story post failed:', err));
     * ──────────────────────────────────────────────────────── */

    close();
    _showToast('Story posted!');
  }

  function _showToast(message) {
    const t = document.createElement('div');
    t.className = 'story-success-message';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  /* ── Public API ────────────────────────────────────────────── */
  return { init, open, close };

})();

export default CreateStory;