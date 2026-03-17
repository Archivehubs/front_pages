document.addEventListener('DOMContentLoaded', function() {
    // ========== DATA ==========
    // Mock data based on screenshot
    const contactsData = {
        suggested: [
            { id: 's1', name: 'Matthew Katung', title: 'Sales Operation Manager Afex Nigeria', avatar: 'images/profile.jpg', lastActive: '2h ago' },
            { id: 's2', name: 'Abdulkarim Shuaibu', title: 'Professional VIP Driver | 15+ Years Experience', avatar: 'images/profile.jpg', lastActive: '1d ago' },
            { id: 's3', name: 'Samson Amu', title: 'Director, Transformation - Global business process', avatar: 'images/profile.jpg', lastActive: '3h ago' },
            { id: 's4', name: 'Wilfred Eseoghene Praise', title: 'Results-Driven Social Media Manager and SEO Expert', avatar: 'images/profile.jpg', lastActive: '5h ago' },
            { id: 's5', name: 'Gokop Goteng', title: 'Senior Lecturer/Associate Professor of IoT', avatar: 'images/profile.jpg', lastActive: '1d ago' },
            { id: 's6', name: 'Gloria Peter', title: 'M365 Support Engineer | Exchange Engineer', avatar: 'images/profile.jpg', lastActive: '2h ago' },
            { id: 's7', name: 'Paras Mayur', title: 'Helped 50+ accounts reach 1,000,000 impressions', avatar: 'images/profile.jpg', lastActive: '4h ago' },
            { id: 's8', name: 'Stellamaris Nwafor', title: 'Software Engineer | JavaScript | TypeScript', avatar: 'images/profile.jpg', lastActive: '6h ago' }
        ],
        recent: [
            { id: 'r1', name: 'Esther Oluseye', title: 'Senior .NET Full Stack Developer', avatar: 'images/profile.jpg', lastMessage: 'I\'m a financial consultant...', time: '2h ago', unread: true },
            { id: 'r2', name: 'Melissa Torres', title: 'LinkedIn Offer | Find your next job', avatar: 'images/profile.jpg', lastMessage: 'LinkedIn Offer | Find your next job on LinkedIn', time: '5h ago', unread: false },
            { id: 'r3', name: 'Samson Amu', title: 'Director, Transformation', avatar: 'images/profile.jpg', lastMessage: 'You\'re welcome', time: '1d ago', unread: false },
            { id: 'r4', name: 'Matthew Katung', title: 'Sales Operation Manager', avatar: 'images/profile.jpg', lastMessage: 'Thank you', time: '2d ago', unread: false },
            { id: 'r5', name: 'Abdulkarim Shuaibu', title: 'Professional VIP Driver', avatar: 'images/profile.jpg', lastMessage: 'Thank you', time: '2d ago', unread: false },
            { id: 'r6', name: 'Jared D. Clark', title: 'Sales Professional', avatar: 'images/profile.jpg', lastMessage: 'Hey, just circling back...', time: '3d ago', unread: true },
            { id: 'r7', name: 'Marc-Andre Dar...', title: 'Business Development', avatar: 'images/profile.jpg', lastMessage: 'Glad to pass the friend request...', time: '4d ago', unread: false },
            { id: 'r8', name: 'Henry Atherton, III', title: 'Executive', avatar: 'images/profile.jpg', lastMessage: 'Good morning, I bring you...', time: '5d ago', unread: false },
            { id: 'r9', name: 'Del Nelson', title: 'Consultant', avatar: 'images/profile.jpg', lastMessage: 'Hi Del, nice to meet you', time: '1w ago', unread: false }
        ],
        messages: {
            'r1': [
                { sender: 'Esther Oluseye', content: [{ type: 'text', value: 'I\'m a financial consultant. I help people plan for their future.' }], time: '2025-03-12T10:30:00', isSent: false },
                { sender: 'You', content: [{ type: 'text', value: 'That sounds interesting! How long have you been consulting?' }], time: '2025-03-12T10:32:00', isSent: true },
                { sender: 'Esther Oluseye', content: [{ type: 'text', value: 'Over 8 years now. Specializing in retirement planning and investments.' }], time: '2025-03-12T10:35:00', isSent: false }
            ],
            'r2': [
                { sender: 'Melissa Torres', content: [{ type: 'text', value: 'LinkedIn Offer | Find your next job on LinkedIn Premium' }], time: '2025-03-12T09:15:00', isSent: false }
            ],
            'r3': [
                { sender: 'Samson Amu', content: [{ type: 'text', value: 'Thanks for connecting!' }], time: '2025-03-11T16:20:00', isSent: false },
                { sender: 'You', content: [{ type: 'text', value: 'You\'re welcome! Great to connect.' }], time: '2025-03-11T16:25:00', isSent: true }
            ],
            'r4': [
                { sender: 'Matthew Katung', content: [{ type: 'text', value: 'Thanks for the connection request.' }], time: '2025-03-10T14:10:00', isSent: false },
                { sender: 'You', content: [{ type: 'text', value: 'Thank you for accepting!' }], time: '2025-03-10T14:15:00', isSent: true }
            ]
        }
    };

    // ========== DOM ELEMENTS ==========
    // Main elements
    const messagingPanel = document.getElementById('messagingPanel');
    const newMessagePanel = document.getElementById('newMessagePanel');
    const chatThreadContainer = document.getElementById('chatThreadContainer');
    
    // Header buttons
    const messagingMenuBtn = document.getElementById('messagingMenuBtn');
    const messagingDropdown = document.getElementById('messagingDropdown');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const toggleMessagingBtn = document.getElementById('toggleMessagingBtn');
    const toggleMessagingIcon = document.getElementById('toggleMessagingIcon');
    
    // New message panel elements
    const closeNewMessageBtn = document.getElementById('closeNewMessageBtn');
    const newMessageSearchInput = document.getElementById('newMessageSearchInput');
    const suggestedContactsList = document.getElementById('suggestedContactsList');
    
    // Inbox elements
    const messagingSearchInput = document.getElementById('messagingSearchInput');
    
    // Tabs
    const focusedTab = document.getElementById('focusedTab');
    const othersTab = document.getElementById('othersTab');
    const focusedChats = document.getElementById('focusedChats');
    const otherChats = document.getElementById('otherChats');
    
    // Thread elements
    const backToInboxThreadBtn = document.getElementById('backToInboxThreadBtn');
    const threadContactImg = document.getElementById('threadContactImg');
    const threadContactName = document.getElementById('threadContactName');
    const threadContactTitle = document.getElementById('threadContactTitle');
    const threadMoreBtn = document.getElementById('threadMoreBtn');
    const threadDropdown = document.getElementById('threadDropdown');
    const closeThreadBtn = document.getElementById('closeThreadBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    // Composer elements
    const messageInput = document.getElementById('messageInput');
    const attachImageBtn = document.getElementById('attachImageBtn');
    const attachFileBtn = document.getElementById('attachFileBtn');
    const attachGifBtn = document.getElementById('attachGifBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    const attachmentInput = document.getElementById('attachmentInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // Modals
    const awayMessageModal = document.getElementById('awayMessageModal');
    const messagingSettingsModal = document.getElementById('messagingSettingsModal');
    const awayModalCloseBtn = document.getElementById('awayModalCloseBtn');
    const settingsModalCloseBtn = document.getElementById('settingsModalCloseBtn');
    const manageConversationsBtn = document.getElementById('manageConversationsBtn');
    const messagingSettingsBtn = document.getElementById('messagingSettingsBtn');
    const awayMessageBtn = document.getElementById('awayMessageBtn');
    const setAwayMessageBtn = document.getElementById('setAwayMessageBtn');
    const tryPremiumBtn = document.getElementById('tryPremiumBtn');
    const awayMessageText = document.getElementById('awayMessageText');
    const wordCounter = document.getElementById('wordCounter');
    
    // State variables
    let isPanelCollapsed = false;
    let currentChatId = null;
    let pendingAttachments = [];

    // ========== INITIALIZATION ==========
    function initializeMessaging() {
        renderSuggestedContacts();
        renderFocusedChats();
        renderOtherChats();
        setupEventListeners();
    }

    // ========== RENDERING FUNCTIONS ==========
    function renderSuggestedContacts() {
        if (!suggestedContactsList) return;
        
        suggestedContactsList.innerHTML = '';
        contactsData.suggested.forEach(contact => {
            const contactEl = document.createElement('div');
            contactEl.className = 'suggested-contact-item';
            contactEl.dataset.contactId = contact.id;
            contactEl.innerHTML = `
                <img src="${contact.avatar}" alt="${contact.name}" class="suggested-contact-avatar">
                <div class="suggested-contact-info">
                    <div class="suggested-contact-name">${contact.name}</div>
                    <div class="suggested-contact-title">${contact.title}</div>
                </div>
            `;
            contactEl.addEventListener('click', () => {
                openChatThread(contact);
                closeNewMessagePanel();
            });
            suggestedContactsList.appendChild(contactEl);
        });
    }

    function renderFocusedChats() {
        if (!focusedChats) return;
        
        focusedChats.innerHTML = '';
        contactsData.recent.slice(0, 5).forEach(chat => {
            const chatEl = createChatItem(chat);
            focusedChats.appendChild(chatEl);
        });
    }

    function renderOtherChats() {
        if (!otherChats) return;
        
        otherChats.innerHTML = '';
        contactsData.recent.slice(5).forEach(chat => {
            const chatEl = createChatItem(chat);
            otherChats.appendChild(chatEl);
        });
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
        div.addEventListener('click', () => {
            openChatThread(chat);
        });
        return div;
    }

    function renderChatThread(contact) {
        if (!chatMessages || !contact) return;
        
        threadContactImg.src = contact.avatar || 'images/profile.jpg';
        threadContactName.textContent = contact.name;
        threadContactTitle.textContent = contact.title || '';
        
        const messages = contactsData.messages[contact.id] || [];
        chatMessages.innerHTML = '';
        
        if (messages.length === 0) {
            chatMessages.innerHTML = '<div class="no-messages-yet">Start a conversation!</div>';
            return;
        }
        
        let lastDate = '';
        messages.forEach(msg => {
            const msgDate = new Date(msg.time).toLocaleDateString();
            
            // Add date separator if new day
            if (msgDate !== lastDate) {
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'date-separator';
                dateSeparator.textContent = new Date(msg.time).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                });
                chatMessages.appendChild(dateSeparator);
                lastDate = msgDate;
            }
            
            const messageEl = document.createElement('div');
            messageEl.className = `message-bubble ${msg.isSent ? 'sent' : 'received'}`;
            
            let contentHtml = '';
            msg.content.forEach(item => {
                if (item.type === 'text') {
                    contentHtml += `<p>${item.value}</p>`;
                } else if (item.type === 'image') {
                    contentHtml += `<img src="${item.value.url}" alt="Image" class="message-image" style="max-width: 200px; border-radius: 8px; margin: 4px 0;">`;
                }
            });
            
            const msgTime = new Date(msg.time).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messageEl.innerHTML = `
                <div class="message-bubble-content">
                    ${contentHtml}
                    <span class="message-time">${msgTime}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageEl);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ========== PANEL MANAGEMENT FUNCTIONS ==========
    function openNewMessagePanel() {
        newMessagePanel.classList.remove('hidden');
        // Ensure other panels are in correct state
        if (chatThreadContainer) chatThreadContainer.classList.add('hidden');
        // Focus the search input
        setTimeout(() => {
            if (newMessageSearchInput) newMessageSearchInput.focus();
        }, 100);
    }

    function closeNewMessagePanel() {
        newMessagePanel.classList.add('hidden');
        if (newMessageSearchInput) newMessageSearchInput.value = '';
    }

    function openChatThread(contact) {
        // Update thread with contact info
        threadContactImg.src = contact.avatar || 'images/profile.jpg';
        threadContactName.textContent = contact.name;
        threadContactTitle.textContent = contact.title || '';
        
        // Show thread, hide other panels
        chatThreadContainer.classList.remove('hidden');
        newMessagePanel.classList.add('hidden');
        messagingPanel.classList.remove('hidden'); // Keep main panel visible
        currentChatId = contact.id;
        
        // Load messages
        renderChatThread(contact);
    }

    function backToInbox() {
        chatThreadContainer.classList.add('hidden');
        currentChatId = null;
        if (messageInput) {
            messageInput.innerHTML = '';
        }
        pendingAttachments = [];
        updateSendButtonState();
    }

    // ========== MESSAGING FUNCTIONS ==========
    function sendMessage() {
        if (!currentChatId) return;
        
        // Get text content
        let messageText = '';
        const textNodes = [];
        if (messageInput) {
            messageInput.childNodes.forEach(node => {
                if (node.nodeType === 3) { // Text node
                    textNodes.push(node.textContent);
                }
            });
        }
        messageText = textNodes.join('').trim();
        
        // Prepare content array
        const content = [];
        if (messageText) {
            content.push({ type: 'text', value: messageText });
        }
        pendingAttachments.forEach(att => {
            content.push(att);
        });
        
        if (content.length === 0) return;
        
        // Create new message
        const newMessage = {
            sender: 'You',
            content: content,
            time: new Date().toISOString(),
            isSent: true
        };
        
        // Add to data
        if (!contactsData.messages[currentChatId]) {
            contactsData.messages[currentChatId] = [];
        }
        contactsData.messages[currentChatId].push(newMessage);
        
        // Update UI
        const currentContact = {
            id: currentChatId,
            name: threadContactName.textContent,
            title: threadContactTitle.textContent,
            avatar: threadContactImg.src
        };
        renderChatThread(currentContact);
        
        // Clear input
        if (messageInput) {
            messageInput.innerHTML = '';
        }
        pendingAttachments = [];
        updateSendButtonState();
    }

    function handleAttachment(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            let attachmentData;
            let previewElement;
            
            if (file.type.startsWith('image/')) {
                attachmentData = { 
                    type: 'image', 
                    value: { 
                        url: e.target.result, 
                        name: file.name,
                        size: file.size 
                    } 
                };
                
                previewElement = document.createElement('img');
                previewElement.src = e.target.result;
                previewElement.classList.add('input-image-preview');
            } else {
                attachmentData = { 
                    type: 'file', 
                    value: { 
                        url: e.target.result, 
                        name: file.name,
                        size: file.size,
                        type: file.type
                    } 
                };
                
                previewElement = document.createElement('span');
                previewElement.innerHTML = `
                    <span class="material-symbols-outlined" style="font-size: 16px;">description</span>
                    ${file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                `;
            }
            
            // Create preview container
            const previewContainer = document.createElement('span');
            previewContainer.className = 'attachment-preview-container';
            previewContainer.dataset.filename = file.name;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'attachment-remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                const container = e.target.closest('.attachment-preview-container');
                const filename = container.dataset.filename;
                container.remove();
                pendingAttachments = pendingAttachments.filter(att => 
                    att.value.name !== filename
                );
                updateSendButtonState();
            };
            
            previewContainer.appendChild(previewElement);
            previewContainer.appendChild(removeBtn);
            
            // Insert at cursor position or at end
            if (messageInput) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && messageInput.contains(selection.anchorNode)) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(previewContainer);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    messageInput.appendChild(document.createTextNode(' '));
                    messageInput.appendChild(previewContainer);
                }
            }
            
            pendingAttachments.push(attachmentData);
            updateSendButtonState();
        };
        
        reader.readAsDataURL(file);
    }

    function insertEmoji(emoji) {
        if (!messageInput) return;
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Check if cursor is in messageInput
        if (messageInput.contains(selection.anchorNode)) {
            const emojiNode = document.createTextNode(emoji);
            range.deleteContents();
            range.insertNode(emojiNode);
            range.setStartAfter(emojiNode);
            range.setEndAfter(emojiNode);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // If cursor is elsewhere, append to end
            messageInput.appendChild(document.createTextNode(emoji));
        }
        
        updateSendButtonState();
    }

    function updateSendButtonState() {
        if (!sendMessageBtn || !messageInput) return;
        const hasText = messageInput.textContent.trim().length > 0;
        const hasAttachments = pendingAttachments.length > 0;
        sendMessageBtn.disabled = !(hasText || hasAttachments);
    }

    // ========== SEARCH FUNCTIONS ==========
    function searchMessages(query) {
        const items = document.querySelectorAll('.chat-item');
        query = query.toLowerCase().trim();
        
        items.forEach(item => {
            const name = item.querySelector('.chat-item-name')?.textContent.toLowerCase() || '';
            const preview = item.querySelector('.chat-item-preview')?.textContent.toLowerCase() || '';
            const matches = name.includes(query) || preview.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    function searchSuggestedContacts(query) {
        const items = document.querySelectorAll('.suggested-contact-item');
        query = query.toLowerCase().trim();
        
        items.forEach(item => {
            const name = item.querySelector('.suggested-contact-name')?.textContent.toLowerCase() || '';
            const title = item.querySelector('.suggested-contact-title')?.textContent.toLowerCase() || '';
            const matches = name.includes(query) || title.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    // ========== DROPDOWN MANAGEMENT ==========
    function closeAllDropdowns() {
        if (messagingDropdown) messagingDropdown.classList.add('hidden');
        if (threadDropdown) threadDropdown.classList.add('hidden');
        if (emojiPicker) emojiPicker.classList.add('hidden');
    }

    // ========== MODAL FUNCTIONS ==========
    function openAwayMessageModal() {
        if (awayMessageModal) awayMessageModal.classList.remove('hidden');
        closeAllDropdowns();
    }

    function openMessagingSettingsModal() {
        if (messagingSettingsModal) messagingSettingsModal.classList.remove('hidden');
        closeAllDropdowns();
    }

    function closeAllModals() {
        if (awayMessageModal) awayMessageModal.classList.add('hidden');
        if (messagingSettingsModal) messagingSettingsModal.classList.add('hidden');
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Header buttons
        if (messagingMenuBtn) {
            messagingMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (messagingDropdown) messagingDropdown.classList.toggle('hidden');
            });
        }

        if (newMessageBtn) {
            newMessageBtn.addEventListener('click', openNewMessagePanel);
        }
        
        if (toggleMessagingBtn) {
            toggleMessagingBtn.addEventListener('click', () => {
                isPanelCollapsed = !isPanelCollapsed;
                if (messagingPanel) messagingPanel.classList.toggle('collapsed', isPanelCollapsed);
                if (toggleMessagingIcon) {
                    toggleMessagingIcon.textContent = isPanelCollapsed ? 'expand_less' : 'expand_more';
                }
            });
        }

        // New message panel navigation
        if (closeNewMessageBtn) {
            closeNewMessageBtn.addEventListener('click', closeNewMessagePanel);
        }

        // Thread navigation
        if (backToInboxThreadBtn) {
            backToInboxThreadBtn.addEventListener('click', backToInbox);
        }
        
        if (closeThreadBtn) {
            closeThreadBtn.addEventListener('click', backToInbox);
        }

        // Thread actions
        if (threadMoreBtn) {
            threadMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (threadDropdown) threadDropdown.classList.toggle('hidden');
            });
        }

        // Search
        if (messagingSearchInput) {
            messagingSearchInput.addEventListener('input', (e) => {
                searchMessages(e.target.value);
            });
        }

        if (newMessageSearchInput) {
            newMessageSearchInput.addEventListener('input', (e) => {
                searchSuggestedContacts(e.target.value);
            });
        }

        // Tabs
        if (focusedTab) {
            focusedTab.addEventListener('click', () => {
                focusedTab.classList.add('active');
                if (othersTab) othersTab.classList.remove('active');
                if (focusedChats) focusedChats.classList.add('active');
                if (otherChats) otherChats.classList.remove('active');
            });
        }

        if (othersTab) {
            othersTab.addEventListener('click', () => {
                othersTab.classList.add('active');
                if (focusedTab) focusedTab.classList.remove('active');
                if (otherChats) otherChats.classList.add('active');
                if (focusedChats) focusedChats.classList.remove('active');
            });
        }

        // Composer
        if (messageInput) {
            messageInput.addEventListener('input', updateSendButtonState);
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', sendMessage);
        }

        // Attachments
        if (attachImageBtn) {
            attachImageBtn.addEventListener('click', () => {
                if (attachmentInput) {
                    attachmentInput.accept = 'image/*';
                    attachmentInput.click();
                }
            });
        }

        if (attachFileBtn) {
            attachFileBtn.addEventListener('click', () => {
                if (attachmentInput) {
                    attachmentInput.accept = '.pdf,.doc,.docx,.txt,.xlsx,.zip';
                    attachmentInput.click();
                }
            });
        }

        if (attachmentInput) {
            attachmentInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => handleAttachment(file));
                attachmentInput.value = '';
            });
        }

        // Emoji
        if (emojiBtn && emojiPicker) {
            emojiBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                emojiPicker.classList.toggle('hidden');
                
                // Position emoji picker
                if (!emojiPicker.classList.contains('hidden')) {
                    const rect = emojiBtn.getBoundingClientRect();
                    emojiPicker.style.position = 'fixed';
                    emojiPicker.style.bottom = (window.innerHeight - rect.top + 10) + 'px';
                    emojiPicker.style.left = rect.left + 'px';
                }
            });

            emojiPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (btn) {
                    insertEmoji(btn.textContent);
                    emojiPicker.classList.add('hidden');
                }
            });
        }

        // Dropdown menu items
        if (manageConversationsBtn) {
            manageConversationsBtn.addEventListener('click', () => {
                alert('Manage conversations feature coming soon!');
                closeAllDropdowns();
            });
        }

        if (messagingSettingsBtn) {
            messagingSettingsBtn.addEventListener('click', openMessagingSettingsModal);
        }

        if (awayMessageBtn) {
            awayMessageBtn.addEventListener('click', openAwayMessageModal);
        }

        // Modal close buttons
        if (awayModalCloseBtn) {
            awayModalCloseBtn.addEventListener('click', closeAllModals);
        }

        if (settingsModalCloseBtn) {
            settingsModalCloseBtn.addEventListener('click', closeAllModals);
        }

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

        // Word counter
        if (awayMessageText && wordCounter) {
            awayMessageText.addEventListener('input', () => {
                const text = awayMessageText.textContent || '';
                const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
                wordCounter.textContent = `${Math.min(words, 300)}/300`;
            });
        }

        // Archive thread
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

        // Settings toggles
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

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (messagingMenuBtn && messagingDropdown && 
                !messagingMenuBtn.contains(e.target) && 
                !messagingDropdown.contains(e.target)) {
                messagingDropdown.classList.add('hidden');
            }
            if (threadMoreBtn && threadDropdown && 
                !threadMoreBtn.contains(e.target) && 
                !threadDropdown.contains(e.target)) {
                threadDropdown.classList.add('hidden');
            }
            if (emojiBtn && emojiPicker && 
                !emojiBtn.contains(e.target) && 
                !emojiPicker.contains(e.target)) {
                emojiPicker.classList.add('hidden');
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
                closeAllDropdowns();
                if (newMessagePanel && !newMessagePanel.classList.contains('hidden')) {
                    closeNewMessagePanel();
                }
            }
        });

        // Click outside new message panel to close (optional)
        if (newMessagePanel) {
            document.addEventListener('click', (e) => {
                if (!newMessagePanel.classList.contains('hidden') && 
                    !newMessagePanel.contains(e.target) && 
                    newMessageBtn && !newMessageBtn.contains(e.target)) {
                    closeNewMessagePanel();
                }
            });
        }
    }

    // ========== START ==========
    initializeMessaging();
});