document.addEventListener('DOMContentLoaded', function() {
    // ========== DATA ==========
    const contactsData = {
        suggested: [
            { id: 's1', name: 'John Omofaye', title: 'Software Engineer | Java | Python | Spring Boot | Django', avatar: 'images/profile.jpg' },
            { id: 's2', name: 'Akwasi Emmanuel', title: 'Full Stack Developer | React | Node.js | MongoDB', avatar: 'images/profile.jpg' },
            { id: 's3', name: 'Jenrade Lawal', title: 'Product Manager | CSPO | Agile Specialist', avatar: 'images/profile.jpg' },
            { id: 's4', name: 'Bada Adetoyin', title: 'UI/UX Designer | Figma | Adobe XD', avatar: 'images/profile.jpg' },
            { id: 's5', name: 'John Oche', title: 'Software Engineer | Java | Python | Spring Boot | Django', avatar: 'images/profile.jpg' },
            { id: 's6', name: 'Esther Oluseye', title: 'Senior .NET Full Stack Developer', avatar: 'images/profile.jpg' },
            { id: 's7', name: 'Melissa Torres', title: 'LinkedIn Offer | Find your next job', avatar: 'images/profile.jpg' },
            { id: 's8', name: 'Samson Amu', title: 'Director, Transformation', avatar: 'images/profile.jpg' },
            { id: 's9', name: 'Matthew Katung', title: 'Sales Operation Manager Afex Nigeria', avatar: 'images/profile.jpg' },
            { id: 's10', name: 'Abdulkarim Shuaibu', title: 'Professional VIP Driver', avatar: 'images/profile.jpg' }
        ],
        recent: [
            { id: 'r1', name: 'John Omofaye', title: 'Software Engineer', avatar: 'images/profile.jpg', lastMessage: 'John: Hi, I\'d like to introduce you to DRUPRR...', time: 'Dec 30, 2022' },
            { id: 'r2', name: 'Akwasi Emmanuel', title: 'Full Stack Developer', avatar: 'images/profile.jpg', lastMessage: 'Akwasi: Hi, I\'d like to introduce you to DRUPRR...', time: 'Dec 30, 2022' },
            { id: 'r3', name: 'Jenrade Lawal', title: 'Product Manager', avatar: 'images/profile.jpg', lastMessage: 'Jenrade: Hi, I\'d like to introduce you to DRUPRR...', time: 'Dec 30, 2022' },
            { id: 'r4', name: 'Bada Adetoyin', title: 'UI/UX Designer', avatar: 'images/profile.jpg', lastMessage: 'Bada: Hi, I\'d like to introduce you to DRUPRR...', time: 'Dec 28, 2022' }
        ],
        messages: {
            'r1': [
                { sender: 'John Omofaye', content: [{ type: 'text', value: 'Hi, I\'d like to introduce you to DRUPRR: It\'s a platform that helps developers showcase their work.' }], time: '2022-12-30T10:30:00', isSent: false },
                { sender: 'You', content: [{ type: 'text', value: 'Thanks for the introduction! I\'ll check it out.' }], time: '2022-12-30T10:32:00', isSent: true }
            ]
        }
    };

    // ========== DOM ELEMENTS ==========
    const messagingPanel         = document.getElementById('messagingPanel');
    const newMessagePanel        = document.getElementById('newMessagePanel');
    const chatThreadContainer    = document.getElementById('chatThreadContainer');

    const messagingMenuBtn       = document.getElementById('messagingMenuBtn');
    const messagingDropdown      = document.getElementById('messagingDropdown');
    const newMessageBtn          = document.getElementById('newMessageBtn');
    const toggleMessagingBtn     = document.getElementById('toggleMessagingBtn');
    const toggleMessagingIcon    = document.getElementById('toggleMessagingIcon');

    const closeNewMessageBtn     = document.getElementById('closeNewMessageBtn');
    const recipientSearchInput   = document.getElementById('recipientSearchInput');
    const recipientContainer     = document.getElementById('recipientContainer');
    const selectedContacts       = document.getElementById('selectedContacts');
    const contactSuggestions     = document.getElementById('contactSuggestions');
    const suggestionsList        = document.getElementById('suggestionsList');
    const messageComposeArea     = document.getElementById('messageComposeArea');
    const initialSuggestedSection = document.getElementById('initialSuggestedSection');
    const suggestedContactsList  = document.getElementById('suggestedContactsList');
    const composeMessageTextarea = document.getElementById('composeMessageTextarea');
    const composeSendBtn         = document.getElementById('composeSendBtn');

    const focusedTab             = document.getElementById('focusedTab');
    const othersTab              = document.getElementById('othersTab');
    const focusedChats           = document.getElementById('focusedChats');
    const otherChats             = document.getElementById('otherChats');
    const messagingSearchInput   = document.getElementById('messagingSearchInput');

    const backToInboxThreadBtn   = document.getElementById('backToInboxThreadBtn');
    const closeThreadBtn         = document.getElementById('closeThreadBtn');
    const threadContactImg       = document.getElementById('threadContactImg');
    const threadContactName      = document.getElementById('threadContactName');
    const threadContactTitle     = document.getElementById('threadContactTitle');
    const threadMoreBtn          = document.getElementById('threadMoreBtn');
    const threadDropdown         = document.getElementById('threadDropdown');
    const chatMessages           = document.getElementById('chatMessages');

    const messageInput           = document.getElementById('messageInput');
    const emojiBtn               = document.getElementById('emojiBtn');
    const emojiPicker            = document.getElementById('emojiPicker');
    const attachmentInput        = document.getElementById('attachmentInput');
    const sendMessageBtn         = document.getElementById('sendMessageBtn');

    const composeEmojiBtn        = document.getElementById('composeEmojiBtn');
    const composeEmojiPicker     = document.getElementById('composeEmojiPicker');
    const composeAttachmentInput = document.getElementById('composeAttachmentInput');

    const awayMessageModal       = document.getElementById('awayMessageModal');
    const messagingSettingsModal = document.getElementById('messagingSettingsModal');
    const awayModalCloseBtn      = document.getElementById('awayModalCloseBtn');
    const settingsModalCloseBtn  = document.getElementById('settingsModalCloseBtn');
    const manageConversationsBtn = document.getElementById('manageConversationsBtn');
    const messagingSettingsBtn   = document.getElementById('messagingSettingsBtn');
    const awayMessageBtn         = document.getElementById('awayMessageBtn');
    const setAwayMessageBtn      = document.getElementById('setAwayMessageBtn');
    const tryPremiumBtn          = document.getElementById('tryPremiumBtn');
    const awayMessageText        = document.getElementById('awayMessageText');
    const wordCounter            = document.getElementById('wordCounter');

    // ========== STATE ==========
    let isPanelCollapsed        = false;
    let currentChatId           = null;
    let pendingAttachments      = [];
    let composePendingAttachments = [];
    let selectedRecipients      = [];

    // ========== INITIALIZATION ==========
    function initializeMessaging() {
        renderSuggestedContacts();
        renderFocusedChats();
        renderOtherChats();
        renderSuggestionsList();
        setupEventListeners();
    }

    // ========== RENDER — SUGGESTED CONTACTS (initial panel list) ==========
    function renderSuggestedContacts() {
        if (!suggestedContactsList) return;

        suggestedContactsList.innerHTML = '';
        contactsData.suggested.slice(0, 8).forEach(contact => {
            const el = document.createElement('div');
            el.className = 'suggested-contact-item';
            el.innerHTML = `
                <img src="${contact.avatar}" alt="${contact.name}" class="suggested-contact-avatar">
                <div class="suggested-contact-info">
                    <div class="suggested-contact-name">${contact.name}</div>
                    <div class="suggested-contact-title">${contact.title}</div>
                </div>
            `;
            el.addEventListener('click', () => addRecipient(contact));
            suggestedContactsList.appendChild(el);
        });
    }

    // ========== RENDER — DROPDOWN SUGGESTIONS LIST ==========
    function renderSuggestionsList() {
        if (!suggestionsList) return;

        suggestionsList.innerHTML = '';
        contactsData.suggested.forEach(contact => {
            const el = document.createElement('div');
            el.className = 'suggestion-item';
            el.innerHTML = `
                <div class="suggestion-info">
                    <img src="${contact.avatar}" alt="${contact.name}" class="suggestion-avatar">
                    <div class="suggestion-details">
                        <div class="suggestion-name">${contact.name}</div>
                        <div class="suggestion-title">${contact.title}</div>
                    </div>
                </div>
                <button class="add-contact-btn">+</button>
            `;

            const addBtn = el.querySelector('.add-contact-btn');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addRecipient(contact);
            });

            el.addEventListener('click', (e) => {
                if (!e.target.closest('.add-contact-btn')) addRecipient(contact);
            });

            suggestionsList.appendChild(el);
        });
    }

    // ========== RENDER — INBOX CHAT LISTS ==========
    function renderFocusedChats() {
        if (!focusedChats) return;
        focusedChats.innerHTML = '';
        contactsData.recent.forEach(chat => focusedChats.appendChild(createChatItem(chat)));
    }

    function renderOtherChats() {
        if (!otherChats) return;
        otherChats.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No other conversations</div>';
    }

    function createChatItem(chat) {
        const div = document.createElement('div');
        div.className = 'chat-item';
        div.dataset.chatId = chat.id;
        div.innerHTML = `
            <img src="${chat.avatar}" alt="${chat.name}" class="chat-item-avatar">
            <div class="chat-item-details">
                <div class="chat-item-header">
                    <span class="chat-item-name">${chat.name}</span>
                    <span class="chat-item-time">${chat.time}</span>
                </div>
                <div class="chat-item-preview">${chat.lastMessage}</div>
            </div>
        `;
        div.addEventListener('click', () => openChatThread(chat));
        return div;
    }

    // ========== RENDER — CHAT THREAD MESSAGES ==========
    function renderChatThread(contact) {
        if (!chatMessages || !contact) return;

        threadContactImg.src      = contact.avatar || 'images/profile.jpg';
        threadContactName.textContent  = contact.name;
        threadContactTitle.textContent = contact.title || '';

        const messages = contactsData.messages[contact.id] || [];
        chatMessages.innerHTML = '';

        if (messages.length === 0) {
            chatMessages.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No messages yet. Start a conversation!</div>';
            return;
        }

        messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = `message-bubble ${msg.isSent ? 'sent' : 'received'}`;

            let contentHtml = '';
            msg.content.forEach(item => {
                if (item.type === 'text') contentHtml += `<p>${item.value}</p>`;
            });

            const msgTime = new Date(msg.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            messageEl.innerHTML = `
                <div class="message-bubble-content">
                    ${contentHtml}
                    <span class="message-time">${msgTime}</span>
                </div>
            `;
            chatMessages.appendChild(messageEl);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ========== RECIPIENT MANAGEMENT ==========
    function addRecipient(contact) {
        if (selectedRecipients.some(r => r.id === contact.id)) return;

        selectedRecipients.push(contact);
        renderSelectedContacts();

        // Clear search + hide dropdown immediately after pick
        if (recipientSearchInput) {
            recipientSearchInput.value = '';
            recipientSearchInput.focus();
        }
        contactSuggestions.classList.add('hidden');

        syncComposeUI();

        // Auto-focus textarea so user can start typing right away
        if (composeMessageTextarea) {
            setTimeout(() => composeMessageTextarea.focus(), 50);
        }
    }

    function removeRecipient(contactId) {
        selectedRecipients = selectedRecipients.filter(r => r.id !== contactId);
        renderSelectedContacts();
        syncComposeUI();
    }

    function renderSelectedContacts() {
        if (!selectedContacts) return;

        selectedContacts.innerHTML = '';
        selectedRecipients.forEach(contact => {
            const pill = document.createElement('span');
            pill.className = 'contact-pill';
            pill.innerHTML = `
                <span class="pill-name">${contact.name}</span>
                <button class="remove-contact" data-contact-id="${contact.id}">✖</button>
            `;
            selectedContacts.appendChild(pill);
        });

        selectedContacts.querySelectorAll('.remove-contact').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeRecipient(btn.dataset.contactId);
            });
        });
    }

    // Single source of truth for compose panel visibility state
    function syncComposeUI() {
        const hasRecipients = selectedRecipients.length > 0;

        if (hasRecipients) {
            messageComposeArea.classList.remove('hidden');
            initialSuggestedSection.classList.add('hidden');
        } else {
            messageComposeArea.classList.add('hidden');
            initialSuggestedSection.classList.remove('hidden');
        }

        updateComposeSendButton();
    }

    // ========== PANEL MANAGEMENT ==========
    function openNewMessagePanel() {
        newMessagePanel.classList.remove('hidden');
        chatThreadContainer.classList.add('hidden');

        // Full reset
        selectedRecipients = [];
        composePendingAttachments = [];
        renderSelectedContacts();

        if (recipientSearchInput)   recipientSearchInput.value = '';
        if (composeMessageTextarea) composeMessageTextarea.value = '';

        // Initial state: show suggested list, hide compose area and dropdown
        initialSuggestedSection.classList.remove('hidden');
        messageComposeArea.classList.add('hidden');
        contactSuggestions.classList.add('hidden');

        updateComposeSendButton();

        setTimeout(() => { if (recipientSearchInput) recipientSearchInput.focus(); }, 100);
    }

    function closeNewMessagePanel() {
        newMessagePanel.classList.add('hidden');
    }

    function openChatThread(contact) {
        threadContactImg.src           = contact.avatar;
        threadContactName.textContent  = contact.name;
        threadContactTitle.textContent = contact.title;

        chatThreadContainer.classList.remove('hidden');
        newMessagePanel.classList.add('hidden');
        currentChatId = contact.id;

        renderChatThread(contact);
    }

    function backToInbox() {
        chatThreadContainer.classList.add('hidden');
        currentChatId = null;
        if (messageInput) messageInput.innerHTML = '';
        pendingAttachments = [];
        updateSendButtonState();
    }

    // ========== COMPOSE FUNCTIONS ==========
    function sendComposeMessage() {
        if (selectedRecipients.length === 0) return;
        const message = composeMessageTextarea.value.trim();
        if (!message) return;

        const recipientNames = selectedRecipients.map(r => r.name).join(', ');
        alert(`Message sent to: ${recipientNames}\n\nMessage: ${message}`);

        closeNewMessagePanel();
    }

    function updateComposeSendButton() {
        if (!composeSendBtn || !composeMessageTextarea) return;
        const hasRecipients = selectedRecipients.length > 0;
        const hasMessage    = composeMessageTextarea.value.trim().length > 0;
        composeSendBtn.disabled = !(hasRecipients && hasMessage);
    }

    // ========== SEARCH ==========
    function filterContactSuggestions(query) {
        const items = document.querySelectorAll('#suggestionsList .suggestion-item');
        query = query.toLowerCase().trim();

        items.forEach(item => {
            const name  = item.querySelector('.suggestion-name')?.textContent.toLowerCase()  || '';
            const title = item.querySelector('.suggestion-title')?.textContent.toLowerCase() || '';
            item.style.display = (name.includes(query) || title.includes(query)) ? 'flex' : 'none';
        });
    }

    function searchMessages(query) {
        const items = document.querySelectorAll('.chat-item');
        query = query.toLowerCase().trim();

        items.forEach(item => {
            const name    = item.querySelector('.chat-item-name')?.textContent.toLowerCase()    || '';
            const preview = item.querySelector('.chat-item-preview')?.textContent.toLowerCase() || '';
            item.style.display = (name.includes(query) || preview.includes(query)) ? 'flex' : 'none';
        });
    }

    // ========== CHAT COMPOSER ==========
    function updateSendButtonState() {
        if (!sendMessageBtn || !messageInput) return;
        const hasText        = messageInput.textContent.trim().length > 0;
        const hasAttachments = pendingAttachments.length > 0;
        sendMessageBtn.disabled = !(hasText || hasAttachments);
    }

    function insertEmoji(emoji, targetInput) {
        if (!targetInput) return;

        if (targetInput.isContentEditable) {
            const selection = window.getSelection();
            if (targetInput.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                const emojiNode = document.createTextNode(emoji);
                range.deleteContents();
                range.insertNode(emojiNode);
                range.setStartAfter(emojiNode);
                range.setEndAfter(emojiNode);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                targetInput.appendChild(document.createTextNode(emoji));
            }
            updateSendButtonState();
        } else {
            // textarea
            const start = targetInput.selectionStart;
            const end   = targetInput.selectionEnd;
            targetInput.value = targetInput.value.slice(0, start) + emoji + targetInput.value.slice(end);
            targetInput.selectionStart = targetInput.selectionEnd = start + emoji.length;
            updateComposeSendButton();
        }
    }

    // ========== MODAL FUNCTIONS ==========
    function openAwayMessageModal() {
        awayMessageModal.classList.remove('hidden');
        closeAllDropdowns();
    }

    function openMessagingSettingsModal() {
        messagingSettingsModal.classList.remove('hidden');
        closeAllDropdowns();
    }

    function closeAllModals() {
        awayMessageModal.classList.add('hidden');
        messagingSettingsModal.classList.add('hidden');
    }

    function closeAllDropdowns() {
        messagingDropdown?.classList.add('hidden');
        threadDropdown?.classList.add('hidden');
        emojiPicker?.classList.add('hidden');
        composeEmojiPicker?.classList.add('hidden');
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {

        // ── New message button ──────────────────────────────────────────────
        if (newMessageBtn) newMessageBtn.addEventListener('click', openNewMessagePanel);

        // ── Close new message panel ─────────────────────────────────────────
        if (closeNewMessageBtn) closeNewMessageBtn.addEventListener('click', closeNewMessagePanel);

        // ── Recipient container click → focus input ─────────────────────────
        if (recipientContainer) {
            recipientContainer.addEventListener('click', () => recipientSearchInput.focus());
        }

        // ── Recipient search input ──────────────────────────────────────────
        if (recipientSearchInput) {
            recipientSearchInput.addEventListener('focus', () => {
                renderSuggestionsList();
                filterContactSuggestions(recipientSearchInput.value);
                contactSuggestions.classList.remove('hidden');
            });

            recipientSearchInput.addEventListener('input', (e) => {
                filterContactSuggestions(e.target.value);
                contactSuggestions.classList.remove('hidden');
            });

            recipientSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    contactSuggestions.classList.add('hidden');
                }
                // Backspace on empty input removes last recipient pill
                if (e.key === 'Backspace' && recipientSearchInput.value === '' && selectedRecipients.length > 0) {
                    removeRecipient(selectedRecipients[selectedRecipients.length - 1].id);
                }
            });
        }

        // ── Compose textarea ────────────────────────────────────────────────
        if (composeMessageTextarea) {
            composeMessageTextarea.addEventListener('input', updateComposeSendButton);
            composeMessageTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && !composeSendBtn.disabled) {
                    e.preventDefault();
                    sendComposeMessage();
                }
            });
        }

        // ── Compose send button ─────────────────────────────────────────────
        if (composeSendBtn) composeSendBtn.addEventListener('click', sendComposeMessage);

        // ── Thread navigation ───────────────────────────────────────────────
        if (backToInboxThreadBtn) backToInboxThreadBtn.addEventListener('click', backToInbox);
        if (closeThreadBtn)       closeThreadBtn.addEventListener('click', backToInbox);

        // ── Header buttons ──────────────────────────────────────────────────
        if (messagingMenuBtn) {
            messagingMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                messagingDropdown.classList.toggle('hidden');
            });
        }

        if (toggleMessagingBtn) {
            toggleMessagingBtn.addEventListener('click', () => {
                isPanelCollapsed = !isPanelCollapsed;
                messagingPanel.classList.toggle('collapsed', isPanelCollapsed);
                toggleMessagingIcon.textContent = isPanelCollapsed ? 'expand_less' : 'expand_more';
            });
        }

        // ── Thread more button ──────────────────────────────────────────────
        if (threadMoreBtn) {
            threadMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                threadDropdown.classList.toggle('hidden');
            });
        }

        // ── Inbox search ────────────────────────────────────────────────────
        if (messagingSearchInput) {
            messagingSearchInput.addEventListener('input', (e) => searchMessages(e.target.value));
        }

        // ── Tabs ────────────────────────────────────────────────────────────
        if (focusedTab) {
            focusedTab.addEventListener('click', () => {
                focusedTab.classList.add('active');
                othersTab.classList.remove('active');
                focusedChats.classList.add('active');
                otherChats.classList.remove('active');
            });
        }

        if (othersTab) {
            othersTab.addEventListener('click', () => {
                othersTab.classList.add('active');
                focusedTab.classList.remove('active');
                otherChats.classList.add('active');
                focusedChats.classList.remove('active');
            });
        }

        // ── Chat thread composer ────────────────────────────────────────────
        if (messageInput) {
            messageInput.addEventListener('input', updateSendButtonState);
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Wire up real send logic here when needed
                }
            });
        }

        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => {
                alert('Message sent! (Demo)');
            });
        }

        // ── Thread emoji picker ─────────────────────────────────────────────
        if (emojiBtn && emojiPicker) {
            emojiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                emojiPicker.classList.toggle('hidden');

                if (!emojiPicker.classList.contains('hidden')) {
                    const rect = emojiBtn.getBoundingClientRect();
                    emojiPicker.style.position = 'fixed';
                    emojiPicker.style.bottom   = (window.innerHeight - rect.top + 10) + 'px';
                    emojiPicker.style.left      = rect.left + 'px';
                }
            });

            emojiPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (btn) {
                    insertEmoji(btn.textContent, messageInput);
                    emojiPicker.classList.add('hidden');
                }
            });
        }

        // ── Compose emoji picker ────────────────────────────────────────────
        if (composeEmojiBtn && composeEmojiPicker) {
            composeEmojiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                composeEmojiPicker.classList.toggle('hidden');

                if (!composeEmojiPicker.classList.contains('hidden')) {
                    const rect = composeEmojiBtn.getBoundingClientRect();
                    composeEmojiPicker.style.position = 'fixed';
                    composeEmojiPicker.style.bottom   = (window.innerHeight - rect.top + 10) + 'px';
                    composeEmojiPicker.style.left      = rect.left + 'px';
                }
            });

            composeEmojiPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (btn) {
                    insertEmoji(btn.textContent, composeMessageTextarea);
                    composeEmojiPicker.classList.add('hidden');
                }
            });
        }

        // ── Dropdown menu items ─────────────────────────────────────────────
        if (manageConversationsBtn) {
            manageConversationsBtn.addEventListener('click', () => {
                alert('Manage conversations feature coming soon!');
                closeAllDropdowns();
            });
        }

        if (messagingSettingsBtn) messagingSettingsBtn.addEventListener('click', openMessagingSettingsModal);
        if (awayMessageBtn)       awayMessageBtn.addEventListener('click', openAwayMessageModal);

        // ── Modal close buttons ─────────────────────────────────────────────
        if (awayModalCloseBtn)    awayModalCloseBtn.addEventListener('click', closeAllModals);
        if (settingsModalCloseBtn) settingsModalCloseBtn.addEventListener('click', closeAllModals);

        if (setAwayMessageBtn) {
            setAwayMessageBtn.addEventListener('click', () => {
                alert('Away message set successfully!');
                closeAllModals();
            });
        }

        if (tryPremiumBtn) {
            tryPremiumBtn.addEventListener('click', () => {
                alert('Premium trial feature coming soon!');
            });
        }

        // ── Word counter (away message modal) ──────────────────────────────
        if (awayMessageText && wordCounter) {
            awayMessageText.addEventListener('input', () => {
                const text  = awayMessageText.textContent || '';
                const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
                wordCounter.textContent = `${Math.min(words, 300)}/300`;
            });
        }

        // ── Thread dropdown actions ─────────────────────────────────────────
        const archiveThreadBtn = document.getElementById('archiveThreadBtn');
        if (archiveThreadBtn) {
            archiveThreadBtn.addEventListener('click', () => {
                alert('Thread archived');
                backToInbox();
            });
        }

        const deleteThreadBtn = document.getElementById('deleteThreadBtn');
        if (deleteThreadBtn) {
            deleteThreadBtn.addEventListener('click', () => {
                if (confirm('Delete this conversation?')) {
                    alert('Thread deleted');
                    backToInbox();
                }
            });
        }

        const blockThreadBtn = document.getElementById('blockThreadBtn');
        if (blockThreadBtn) {
            blockThreadBtn.addEventListener('click', () => {
                if (confirm('Block this user?')) {
                    alert('User blocked');
                    backToInbox();
                }
            });
        }

        const reportThreadBtn = document.getElementById('reportThreadBtn');
        if (reportThreadBtn) {
            reportThreadBtn.addEventListener('click', () => {
                alert('Report submitted');
            });
        }

        // ── Settings toggles ────────────────────────────────────────────────
        const alwaysOpenMessages = document.getElementById('alwaysOpenMessages');
        if (alwaysOpenMessages) {
            alwaysOpenMessages.addEventListener('change', (e) => {
                console.log('Always open messages:', e.target.checked);
            });
        }

        const playMessageSound = document.getElementById('playMessageSound');
        if (playMessageSound) {
            playMessageSound.addEventListener('change', (e) => {
                console.log('Play sound:', e.target.checked);
            });
        }

        const focusedInboxBtn = document.getElementById('focusedInboxBtn');
        if (focusedInboxBtn) {
            focusedInboxBtn.addEventListener('click', () => {
                alert('Focused inbox settings coming soon!');
            });
        }

        const activeStatusBtn = document.getElementById('activeStatusBtn');
        if (activeStatusBtn) {
            activeStatusBtn.addEventListener('click', () => {
                alert('Active status settings coming soon!');
            });
        }

        // ── Global click — close dropdowns & suggestions when clicking outside ──
        document.addEventListener('click', (e) => {
            // Messaging header dropdown
            if (messagingMenuBtn && messagingDropdown &&
                !messagingMenuBtn.contains(e.target) &&
                !messagingDropdown.contains(e.target)) {
                messagingDropdown.classList.add('hidden');
            }

            // Thread dropdown
            if (threadMoreBtn && threadDropdown &&
                !threadMoreBtn.contains(e.target) &&
                !threadDropdown.contains(e.target)) {
                threadDropdown.classList.add('hidden');
            }

            // Thread emoji picker
            if (emojiBtn && emojiPicker &&
                !emojiBtn.contains(e.target) &&
                !emojiPicker.contains(e.target)) {
                emojiPicker.classList.add('hidden');
            }

            // Compose emoji picker
            if (composeEmojiBtn && composeEmojiPicker &&
                !composeEmojiBtn.contains(e.target) &&
                !composeEmojiPicker.contains(e.target)) {
                composeEmojiPicker.classList.add('hidden');
            }

            // Recipient suggestions dropdown
            if (recipientSearchInput && contactSuggestions &&
                !recipientContainer?.contains(e.target) &&
                !contactSuggestions.contains(e.target)) {
                contactSuggestions.classList.add('hidden');
            }
        });

        // ── Global keydown — Escape closes everything ───────────────────────
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
                closeAllDropdowns();
                contactSuggestions?.classList.add('hidden');
                if (newMessagePanel && !newMessagePanel.classList.contains('hidden')) {
                    closeNewMessagePanel();
                }
            }
        });
    }

    // ========== START ==========
    initializeMessaging();
});