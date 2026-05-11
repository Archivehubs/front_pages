/**
 * ARCHIVEHUBS — Messaging Module
 * /js/modules/messaging.js
 *
 * This is the LinkedIn-style fixed messaging panel from home.html.
 * Cleaned up from the inline <script> in home.html:
 *   - Null guard on every single DOM query (was crashing silently)
 *   - Dead old .messaging-box / toggleMessagingBox code removed entirely
 *   - allMessages / chats data extracted to top (Phase 4 → api.js)
 *   - localStorage for message delete removed (replaced with UI-only deletion)
 *   - setInterval for time updates kept (runs every 60s)
 *   - All console.log removed
 *   - Emoji picker repositioning moved to proper absolute positioning
 *
 * Replaces:
 *   - The large inline <script> messaging block at bottom of home.html
 *   - js/message.js (old separate file)
 *   - toggleMessagingBox / .messaging-box dead code in script.js
 */

const Messaging = (() => {
  'use strict';

  /* ── Hardcoded data (Phase 4 → api.js) ────────────────────── */

  const CHATS = {
    focused: [
      { id: 'chat1', name: 'John Doe',     profilePic: 'images/profile.jpg', preview: 'Hey, how are you?',        timestamp: '2025-07-28T10:00:00Z' },
      { id: 'chat2', name: 'Jane Smith',   profilePic: 'images/profile.jpg', preview: "Let's catch up soon!",     timestamp: '2025-07-28T09:30:00Z' },
    ],
    others: [
      { id: 'chat3', name: 'Alice Johnson',profilePic: 'images/profile.jpg', preview: 'Are we still on tomorrow?',timestamp: '2025-07-27T10:00:00Z' },
      { id: 'chat4', name: 'Bob Brown',    profilePic: 'images/profile.jpg', preview: 'Can you send the files?',  timestamp: '2025-07-26T09:00:00Z' },
    ],
  };

  const ALL_MESSAGES = {
    chat1: [
      { sender: 'John Doe', content: [{ type: 'text', value: 'Hey, how are you?' }],                       isSent: false, timestamp: '2025-07-28T10:01:00Z' },
      { sender: 'You',      content: [{ type: 'text', value: "I'm doing great, thanks! What's up?" }],      isSent: true,  timestamp: '2025-07-28T10:02:00Z' },
      { sender: 'John Doe', content: [{ type: 'text', value: 'Just wanted to check in. Been a while!' }],  isSent: false, timestamp: '2025-07-28T14:05:00Z' },
    ],
    chat2: [
      { sender: 'Jane Smith', content: [{ type: 'text', value: "Let's catch up soon!" }], isSent: false, timestamp: '2025-07-28T09:30:00Z' },
    ],
    chat3: [
      { sender: 'Alice Johnson', content: [{ type: 'text', value: 'Are we still on for tomorrow?' }], isSent: false, timestamp: '2025-07-27T10:00:00Z' },
      { sender: 'You',           content: [{ type: 'text', value: 'Yes! Looking forward to it.' }],   isSent: true,  timestamp: '2025-07-27T10:05:00Z' },
    ],
    chat4: [
      { sender: 'Bob Brown', content: [{ type: 'text', value: 'Can you send me the files?' }], isSent: false, timestamp: '2025-07-26T09:00:00Z' },
      { sender: 'You',       content: [{ type: 'text', value: 'Sure, check your inbox now.' }], isSent: true,  timestamp: '2025-07-26T09:05:00Z' },
    ],
  };

  /* ── State ─────────────────────────────────────────────────── */

  let _currentChat    = null;   // current chat item DOM element
  let _pendingMedia   = [];     // pending attachments before send
  let _lastMsgDates   = new Map();

  /* ── DOM helpers ────────────────────────────────────────────── */

  const _g = id => document.getElementById(id);
  const _q = s  => document.querySelector(s);

  /* ── Utilities ─────────────────────────────────────────────── */

  function _formatTimeAgo(ts) {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60)   return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 604800)return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function _toggle(el, cls) { el?.classList.toggle(cls); }
  function _hide(el)        { el?.classList.add('hidden'); }
  function _show(el)        { el?.classList.remove('hidden'); }

  /* ── Render chat list ───────────────────────────────────────── */

  function _renderChatList(chats, container) {
    if (!container) return;
    container.innerHTML = '';
    if (!chats?.length) {
      container.innerHTML = '<div style="padding:16px;font-size:13px;color:var(--text-secondary)">No conversations</div>';
      return;
    }
    chats.forEach(chat => {
      const item = document.createElement('div');
      item.className = 'chat-item';
      item.dataset.contactId  = chat.id;
      item.dataset.profilePic = chat.profilePic;
      item.dataset.timestamp  = chat.timestamp;
      item.innerHTML = `
        <img src="${chat.profilePic}" alt="${chat.name}" class="chat-item-avatar">
        <div class="chat-item-details">
          <div class="chat-item-header">
            <span class="chat-item-name">${chat.name}</span>
            <span class="chat-item-time">${_formatTimeAgo(chat.timestamp)}</span>
          </div>
          <div class="chat-item-preview">${chat.preview}</div>
        </div>
      `;
      item.addEventListener('click', () => _openThread(item));
      container.appendChild(item);
    });
  }

  /* ── Message rendering ──────────────────────────────────────── */

  function _addMessage(senderName, contentArr, isSent, avatarSrc, timestamp) {
    const messagesEl = _g('chatMessages');
    if (!messagesEl) return;

    const msgDate   = new Date(timestamp);
    const dateKey   = msgDate.toISOString().split('T')[0];
    const lastDate  = _lastMsgDates.get(senderName);

    if (lastDate !== dateKey) {
      _lastMsgDates.set(senderName, dateKey);
      const sep = document.createElement('div');
      sep.className   = 'date-separator';
      sep.textContent = msgDate.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      messagesEl.appendChild(sep);
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = `message-bubble ${isSent ? 'sent' : 'received'}`;

    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'message-bubble-content';

    contentArr.forEach(item => {
      if (item.type === 'text') {
        const p = document.createElement('p');
        p.textContent = item.value;
        bubbleContent.appendChild(p);
      } else if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.value.url; img.alt = item.value.name;
        img.style.cssText = 'max-width:180px;border-radius:8px;margin-top:4px;display:block';
        bubbleContent.appendChild(img);
      } else if (item.type === 'file') {
        const fb = document.createElement('div');
        fb.className = 'file-block';
        fb.innerHTML = `<span class="material-symbols-outlined">description</span><span>${item.value.name}</span>`;
        bubbleContent.appendChild(fb);
      }
    });

    const timeSpan = document.createElement('span');
    timeSpan.className   = 'message-time';
    timeSpan.textContent = msgDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    bubbleContent.appendChild(timeSpan);

    // Sent messages get a 3-dot menu
    if (isSent) {
      const menu = _buildMessageMenu(msgDiv);
      msgDiv.appendChild(menu);
    } else if (avatarSrc) {
      const av = document.createElement('img');
      av.src = avatarSrc; av.alt = senderName; av.className = 'thread-contact-img';
      av.style.cssText = 'width:28px;height:28px;margin-right:6px;flex-shrink:0';
      msgDiv.appendChild(av);
    }

    msgDiv.appendChild(bubbleContent);
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function _buildMessageMenu(msgDiv) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;align-self:center;margin:0 4px;flex-shrink:0';
    wrap.innerHTML = `
      <button style="background:none;border:none;cursor:pointer;color:var(--text-secondary);padding:4px;border-radius:50%;display:flex;align-items:center;justify-content:center" class="msg-menu-btn">
        <span class="material-symbols-outlined" style="font-size:18px">more_vert</span>
      </button>
      <div class="thread-dropdown hidden" style="min-width:150px">
        <button class="dropdown-item msg-delete-btn"><span class="material-symbols-outlined">delete</span><span>Delete</span></button>
      </div>
    `;

    const menuBtn  = wrap.querySelector('.msg-menu-btn');
    const dropdown = wrap.querySelector('.thread-dropdown');
    const deleteBtn= wrap.querySelector('.msg-delete-btn');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.thread-dropdown').forEach(d => { if (d !== dropdown) d.classList.add('hidden'); });
      _toggle(dropdown, 'hidden');
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.add('hidden');
      if (confirm('Delete this message?')) {
        const bubbleContent = msgDiv.querySelector('.message-bubble-content');
        if (bubbleContent) {
          bubbleContent.innerHTML = '<p style="color:var(--text-secondary);font-style:italic">Message deleted</p>';
        }
        wrap.remove();
      }
    });

    return wrap;
  }

  /* ── Thread open / close ────────────────────────────────────── */

  function _openThread(chatItem) {
    _currentChat = chatItem;
    const contactId  = chatItem.dataset.contactId;
    const contactPic = chatItem.dataset.profilePic || 'images/profile.jpg';
    const contactName= chatItem.querySelector('.chat-item-name')?.textContent || '';

    const nameEl = _g('threadContactName');
    const imgEl  = _g('threadContactImg');
    if (nameEl) nameEl.textContent = contactName;
    if (imgEl)  imgEl.src = contactPic;

    // Hide list, show thread
    const msgPanel    = _g('messagingPanel');
    const threadPanel = _g('chatThreadContainer');
    _hide(msgPanel);
    _show(threadPanel);

    // Render messages
    const messagesEl = _g('chatMessages');
    if (messagesEl) messagesEl.innerHTML = '';
    _lastMsgDates.clear();

    const msgs = ALL_MESSAGES[contactId] || [];
    if (!msgs.length) {
      if (messagesEl) messagesEl.innerHTML = '<div style="text-align:center;padding:20px;font-size:13px;color:var(--text-secondary)">No messages yet. Say hello! 👋</div>';
    } else {
      msgs.forEach(m => _addMessage(m.sender, m.content, m.isSent, m.isSent ? '' : contactPic, m.timestamp));
    }

    // Reset compose
    const msgInput = _g('messageInput');
    if (msgInput) { msgInput.innerHTML = ''; }
    _pendingMedia = [];
    _updateSendBtn();
  }

  function _closeThread() {
    _show(_g('messagingPanel'));
    _hide(_g('chatThreadContainer'));

    // Update chat list preview from last message
    if (_currentChat) {
      const contactId = _currentChat.dataset.contactId;
      const msgs      = ALL_MESSAGES[contactId] || [];
      const last      = msgs[msgs.length - 1];
      if (last) {
        const preview = _currentChat.querySelector('.chat-item-preview');
        const time    = _currentChat.querySelector('.chat-item-time');
        if (preview) {
          const txt = last.content.find(c => c.type === 'text')?.value || '[Attachment]';
          preview.textContent = txt.length > 40 ? txt.slice(0, 37) + '…' : txt;
        }
        if (time) time.textContent = _formatTimeAgo(last.timestamp);
      }
    }
    _currentChat = null;
  }

  /* ── Send message ───────────────────────────────────────────── */

  function _sendMessage() {
    const msgInput = _g('messageInput');
    if (!msgInput || !_currentChat) return;

    const text    = msgInput.textContent.trim();
    const content = [];
    if (text) content.push({ type: 'text', value: text });
    _pendingMedia.forEach(a => content.push(a));

    if (!content.length) return;

    const contactId = _currentChat.dataset.contactId;
    const now       = new Date().toISOString();

    // ── API HOOK (Phase 5) ────────────────────────────────────
    // fetch(`/api/messages/${contactId}`, { method:'POST', body: JSON.stringify({ content }) })
    //   .then(r => r.json())
    //   .then(data => _addMessage('You', data.content, true, '', data.timestamp));

    // Local optimistic update
    if (!ALL_MESSAGES[contactId]) ALL_MESSAGES[contactId] = [];
    ALL_MESSAGES[contactId].push({ sender: 'You', content, isSent: true, timestamp: now });
    _addMessage('You', content, true, '', now);

    msgInput.innerHTML = '';
    _pendingMedia = [];
    _updateSendBtn();
  }

  /* ── Attachments ────────────────────────────────────────────── */

  function _handleAttachment(file, type) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = type === 'image'
        ? { type: 'image', value: { url: e.target.result, name: file.name } }
        : { type: 'file',  value: { url: e.target.result, name: file.name, size: file.size } };

      _pendingMedia.push(data);
      _showAttachmentPreview(data);
      _updateSendBtn();
    };
    reader.readAsDataURL(file);
  }

  function _showAttachmentPreview(data) {
    const msgInput = _g('messageInput');
    if (!msgInput) return;

    const preview = document.createElement('span');
    preview.className = 'attachment-preview-container';

    if (data.type === 'image') {
      const img = document.createElement('img');
      img.src = data.value.url; img.className = 'input-image-preview';
      preview.appendChild(img);
    } else {
      preview.innerHTML = `<span class="material-symbols-outlined" style="font-size:16px">description</span> ${data.value.name}`;
    }

    const rm = document.createElement('span');
    rm.className   = 'attachment-remove-btn';
    rm.textContent = '×';
    rm.onclick = () => {
      const idx = _pendingMedia.indexOf(data);
      if (idx > -1) _pendingMedia.splice(idx, 1);
      preview.remove();
      _updateSendBtn();
    };
    preview.appendChild(rm);
    msgInput.appendChild(preview);
  }

  /* ── Send button state ──────────────────────────────────────── */

  function _updateSendBtn() {
    const sendBtn  = _g('sendMessageBtn');
    const msgInput = _g('messageInput');
    if (!sendBtn) return;
    const hasText  = msgInput ? msgInput.textContent.trim().length > 0 : false;
    sendBtn.disabled = !(hasText || _pendingMedia.length > 0);
  }

  /* ── Dropdown helpers ───────────────────────────────────────── */

  function _bindDropdown(btnId, dropdownId) {
    const btn  = _g(btnId);
    const drop = _g(dropdownId);
    if (!btn || !drop) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      _toggle(drop, 'hidden');
    });
  }

  /* ── Update all chat timestamps ─────────────────────────────── */

  function _updateAllTimes() {
    document.querySelectorAll('.chat-item').forEach(item => {
      const ts   = item.dataset.timestamp;
      const el   = item.querySelector('.chat-item-time');
      if (ts && el) el.textContent = _formatTimeAgo(ts);
    });
  }

  /* ── Tabs ───────────────────────────────────────────────────── */

  function _initTabs() {
    const focusedTab    = _g('focusedTab');
    const othersTab     = _g('othersTab');
    const focusedChats  = _g('focusedChats');
    const otherChats    = _g('otherChats');
    const searchInput   = _g('messagingSearchInput');

    if (!focusedTab || !othersTab) return;

    let activeTab = 'focused';

    function switchTab(tab) {
      activeTab = tab;
      focusedTab.classList.toggle('active', tab === 'focused');
      othersTab.classList.toggle('active',  tab === 'others');
      focusedChats?.classList.toggle('active', tab === 'focused');
      otherChats?.classList.toggle('active',   tab === 'others');
      if (searchInput) _doSearch(searchInput.value, tab);
    }

    focusedTab.addEventListener('click', () => switchTab('focused'));
    othersTab.addEventListener('click',  () => switchTab('others'));

    // Search
    searchInput?.addEventListener('input', (e) => _doSearch(e.target.value, activeTab));

    function _doSearch(query, tab) {
      const container = tab === 'focused' ? focusedChats : otherChats;
      if (!container) return;
      const q = query.toLowerCase().trim();
      container.querySelectorAll('.chat-item').forEach(item => {
        const name    = item.querySelector('.chat-item-name')?.textContent.toLowerCase() || '';
        const preview = item.querySelector('.chat-item-preview')?.textContent.toLowerCase() || '';
        item.style.display = (!q || name.includes(q) || preview.includes(q)) ? 'flex' : 'none';
      });
    }
  }

  /* ── New message panel ──────────────────────────────────────── */

  function _initNewMessagePanel() {
    const newMsgBtn   = _g('newMessageBtn');
    const panel       = _g('newMessagePanel');
    const closeNewMsg = _g('closeNewMessageBtn');

    newMsgBtn?.addEventListener('click',   () => _show(panel));
    closeNewMsg?.addEventListener('click', () => _hide(panel));
  }

  /* ── Messaging settings modal ───────────────────────────────── */

  function _initModals() {
    // Away message
    _g('awayMessageBtn')?.addEventListener('click',     () => _show(_g('awayMessageModal')));
    _g('awayModalCloseBtn')?.addEventListener('click',  () => _hide(_g('awayMessageModal')));

    // Settings
    _g('messagingSettingsBtn')?.addEventListener('click',  () => _show(_g('messagingSettingsModal')));
    _g('settingsModalCloseBtn')?.addEventListener('click', () => _hide(_g('messagingSettingsModal')));

    // Word counter for away message
    const awayInput = _g('awayMessageText');
    const counter   = _g('wordCounter');
    if (awayInput && counter) {
      awayInput.addEventListener('input', () => {
        const words = awayInput.textContent.trim().split(/\s+/).filter(Boolean).length;
        counter.textContent = `${Math.min(words, 300)}/300`;
      });
    }

    // Set away message button
    _g('setAwayMessageBtn')?.addEventListener('click', () => {
      _hide(_g('awayMessageModal'));
      // ── API HOOK: POST /api/user/away-message { text, startDate, endDate }
    });
  }

  /* ── Toggle collapse panel ──────────────────────────────────── */

  function _initTogglePanel() {
    const toggleBtn  = _g('toggleMessagingBtn');
    const toggleIcon = _g('toggleMessagingIcon');
    const panel      = _g('messagingPanel');

    toggleBtn?.addEventListener('click', () => {
      panel?.classList.toggle('collapsed');
      if (toggleIcon) {
        toggleIcon.textContent = panel?.classList.contains('collapsed') ? 'expand_less' : 'expand_more';
      }
    });
  }

  /* ── Thread dropdown (archive, delete, block, report) ───────── */

  function _initThreadDropdown() {
    _bindDropdown('threadMoreBtn', 'threadDropdown');

    _g('archiveThreadBtn')?.addEventListener('click', () => {
      _hide(_g('threadDropdown'));
      _closeThread();
      // ── API HOOK: POST /api/conversations/:id/archive
    });

    _g('deleteThreadBtn')?.addEventListener('click', () => {
      if (confirm('Delete this conversation?')) {
        _hide(_g('threadDropdown'));
        _closeThread();
        // ── API HOOK: DELETE /api/conversations/:id
      }
    });

    _g('blockThreadBtn')?.addEventListener('click', () => {
      _hide(_g('threadDropdown'));
      // ── API HOOK: POST /api/users/:id/block
    });

    _g('reportThreadBtn')?.addEventListener('click', () => {
      _hide(_g('threadDropdown'));
      // ── API HOOK: POST /api/users/:id/report
    });
  }

  /* ── Main messaging panel dropdown ─────────────────────────── */

  function _initMessagingDropdown() {
    _bindDropdown('messagingMenuBtn', 'messagingDropdown');
    _g('manageConversationsBtn')?.addEventListener('click', () => _hide(_g('messagingDropdown')));
  }

  /* ── Close on outside click ─────────────────────────────────── */

  function _initOutsideClick() {
    document.addEventListener('click', () => {
      document.querySelectorAll('.thread-dropdown, .messaging-dropdown').forEach(d => {
        if (!d.classList.contains('hidden')) d.classList.add('hidden');
      });
    });

    document.querySelectorAll('.thread-dropdown, .messaging-dropdown').forEach(d => {
      d.addEventListener('click', e => e.stopPropagation());
    });
  }

  /* ── Main init ──────────────────────────────────────────────── */

  function init() {
    const messagingContainer = document.querySelector('.messaging-container');
    if (!messagingContainer) return;  // Not on home.html, exit cleanly

    // Render chat lists
    _renderChatList(CHATS.focused, _g('focusedChats'));
    _renderChatList(CHATS.others,  _g('otherChats'));

    // Activate focused tab by default
    _g('focusedChats')?.classList.add('active');
    _g('focusedTab')?.classList.add('active');

    // Wire all sub-features
    _initTabs();
    _initNewMessagePanel();
    _initModals();
    _initTogglePanel();
    _initThreadDropdown();
    _initMessagingDropdown();
    _initOutsideClick();

    // Thread close button
    _g('backToInboxThreadBtn')?.addEventListener('click', _closeThread);
    _g('closeThreadBtn')?.addEventListener('click',       _closeThread);

    // Send message
    _g('sendMessageBtn')?.addEventListener('click', _sendMessage);

    const msgInput = _g('messageInput');
    msgInput?.addEventListener('input', _updateSendBtn);

    msgInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        _sendMessage();
      }
    });

    // Attach image
    _g('attachImageBtn')?.addEventListener('click', () => {
      const fi = _g('attachmentInput');
      if (fi) { fi.accept = 'image/*'; fi.click(); }
    });

    // Attach file
    _g('attachFileBtn')?.addEventListener('click', () => {
      const fi = _g('attachmentInput');
      if (fi) { fi.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'; fi.click(); }
    });

    _g('attachmentInput')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      _handleAttachment(file, type);
      e.target.value = '';
    });

    // Update timestamps every 60s
    setInterval(_updateAllTimes, 60_000);

    _updateSendBtn();
  }

  return { init };

})();

export default Messaging;