// Tab functionality for main navigation
document.addEventListener('DOMContentLoaded', function() {
    // Main tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const mainContents = document.querySelectorAll('.main-content');
    
    // About tab navigation
    const aboutButtons = document.querySelectorAll('.aboutBtn');
    const aboutContents = document.querySelectorAll('.aboutContent');
    
    // Dropdown functionality
    const connectionsBtn = document.getElementById('connectionsBtn');
    const connectionsDropdown = document.getElementById('connectionsDropdown');
    
    const moreBtn = document.getElementById('moreBtn');
    const moreDropdown = document.getElementById('moreDropdown');
    
    const dotsBtn = document.getElementById('dotsBtn');
    const dotsDropdown = document.getElementById('dotsDropdown');
    
    const mentionBtn = document.getElementById('mentionBtn');
    const mentionsDropdown = document.getElementById('mentionsDropdown');
    
    // Channels modal elements
    const channelsModal = document.getElementById('channelsModal');
    const closeChannelsModal = document.getElementById('closeChannelsModal');
    
    // Media Channels Post Modal elements
    const channelsPostModal = document.getElementById('channelsPostModal');
    const closeChannelsPostModal = document.getElementById('closeChannelsPostModal');
    const minimizeBtn = document.querySelector('.minimize-btn');
    
    // Reviews modal elements
    const reviewsModal = document.getElementById('reviewsModal');
    const closeReviewsModal = document.getElementById('closeReviewsModal');
    
    // ====================
    // MAIN TAB SWITCHING WITH CHANNELS AND REVIEWS MODAL SUPPORT
    // ====================
    
    // Main tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            
            // SPECIAL HANDLING FOR CHANNELS TAB: Show modal instead of tab content
            if (tabId === 'channels' && channelsModal) {
                // Open channels modal
                channelsModal.classList.add('show');
                document.body.classList.add('modal-open');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                mainContents.forEach(content => content.classList.remove('active'));
                
                // Don't proceed with normal tab switching
                return;
            }
            
            // SPECIAL HANDLING FOR REVIEWS TAB: Show modal instead of tab content
            if (tabId === 'reviews' && reviewsModal) {
                // Open reviews modal
                reviewsModal.classList.add('show');
                document.body.classList.add('modal-open');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                mainContents.forEach(content => content.classList.remove('active'));
                
                // Don't proceed with normal tab switching
                return;
            }
            
            // Normal tab switching for other tabs
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            mainContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const correspondingContent = document.getElementById(tabId);
            if (correspondingContent) {
                correspondingContent.classList.add('active');
            }
        });
    });
    
    // About tab switching
    aboutButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all about buttons and contents
            aboutButtons.forEach(btn => btn.classList.remove('active'));
            aboutContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            const correspondingContent = document.getElementById(tabId);
            if (correspondingContent) {
                correspondingContent.classList.add('active');
            }
        });
    });
    
    // ====================
    // CHANNELS MODAL FUNCTIONALITY
    // ====================
    
    // Close channels modal
    if (closeChannelsModal) {
        closeChannelsModal.addEventListener('click', () => {
            channelsModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close channels modal when clicking outside
    if (channelsModal) {
        channelsModal.addEventListener('click', (e) => {
            if (e.target === channelsModal) {
                channelsModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // ====================
    // REVIEWS MODAL FUNCTIONALITY
    // ====================
    
    // Close reviews modal
    if (closeReviewsModal) {
        closeReviewsModal.addEventListener('click', () => {
            reviewsModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close reviews modal when clicking outside
    if (reviewsModal) {
        reviewsModal.addEventListener('click', (e) => {
            if (e.target === reviewsModal) {
                reviewsModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // ====================
    // CHANNELS MODAL CONTENT FUNCTIONALITY
    // ====================
    
    // Media Channels button functionality
    const mediaChannelsBtn = document.getElementById('mediaChannelsBtn');
    const marketListings = document.getElementById('marketListings');
    const salesChannelsContentBtn = document.getElementById('salesChannelsContentBtn');
    const salesChannelsButtons = document.getElementById('salesChannelsButtons');
    
    // Media Channels button shows the Post Modal
    if (mediaChannelsBtn && channelsPostModal) {
        mediaChannelsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show the Post Modal (with the actual post content)
            channelsPostModal.classList.add('show');
            document.body.classList.add('modal-open');
        });
    }
    
    // Sales Channels button functionality
    if (salesChannelsContentBtn && salesChannelsButtons) {
        salesChannelsContentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            salesChannelsButtons.classList.toggle('show');
            
            // Toggle button text
            if (salesChannelsButtons.classList.contains('show')) {
                this.innerHTML = 'Sales Channels <i class="fas fa-chevron-up"></i>';
            } else {
                this.innerHTML = 'Sales Channels <i class="fas fa-chevron-down"></i>';
            }
        });
    }
    
    // Close channel sections when clicking outside in modal
    if (channelsModal) {
        channelsModal.addEventListener('click', function(event) {
            // Close market listings if clicking outside
            if (mediaChannelsBtn && marketListings && 
                !mediaChannelsBtn.contains(event.target) && 
                !marketListings.contains(event.target)) {
                marketListings.classList.remove('show');
                if (mediaChannelsBtn) {
                    mediaChannelsBtn.innerHTML = 'Media Channels <i class="fas fa-chevron-down"></i>';
                }
            }
            
            // Close sales channels if clicking outside
            if (salesChannelsContentBtn && salesChannelsButtons && 
                !salesChannelsContentBtn.contains(event.target) && 
                !salesChannelsButtons.contains(event.target)) {
                salesChannelsButtons.classList.remove('show');
                if (salesChannelsContentBtn) {
                    salesChannelsContentBtn.innerHTML = 'Sales Channels <i class="fas fa-chevron-down"></i>';
                }
            }
        });
    }
    
    // ====================
    // MEDIA CHANNELS POST MODAL FUNCTIONALITY
    // ====================
    
    // Close media channels post modal
    if (closeChannelsPostModal) {
        closeChannelsPostModal.addEventListener('click', () => {
            channelsPostModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Minimize button functionality
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            channelsPostModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close media channels post modal when clicking outside
    if (channelsPostModal) {
        channelsPostModal.addEventListener('click', (e) => {
            if (e.target === channelsPostModal) {
                channelsPostModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // ====================
    // ESCAPE KEY FUNCTIONALITY FOR ALL MODALS
    // ====================
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close reviews modal
            if (reviewsModal && reviewsModal.classList.contains('show')) {
                reviewsModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
            // Close channels modal
            if (channelsModal && channelsModal.classList.contains('show')) {
                channelsModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
            // Close channels post modal
            if (channelsPostModal && channelsPostModal.classList.contains('show')) {
                channelsPostModal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
            // Close connections modal
            if (connectionsModal && connectionsModal.classList.contains('active')) {
                connectionsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        }
    });
    
    // ====================
    // OTHER DROPDOWN FUNCTIONALITY
    // ====================
    
    // Connections dropdown toggle
    if (connectionsBtn && connectionsDropdown) {
        connectionsBtn.addEventListener('click', function() {
            connectionsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!connectionsBtn.contains(e.target) && !connectionsDropdown.contains(e.target)) {
                connectionsDropdown.classList.remove('show');
            }
        });
    }
    
    // More dropdown toggle
    if (moreBtn && moreDropdown) {
        moreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            moreDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            moreDropdown.classList.remove('show');
        });
    }
    
    // Dots dropdown toggle
    if (dotsBtn && dotsDropdown) {
        dotsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dotsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dotsDropdown.classList.remove('show');
        });
    }
    
    // Mentions functionality
    if (mentionBtn && mentionsDropdown) {
        mentionBtn.addEventListener('click', function() {
            mentionsDropdown.classList.toggle('hidden');
        });
        
        // Close mentions when clicking outside
        document.addEventListener('click', function(e) {
            if (!mentionBtn.contains(e.target) && !mentionsDropdown.contains(e.target)) {
                mentionsDropdown.classList.add('hidden');
            }
        });
    }
    
    // Additional dropdown functionality for mentions section
    const filterBtn = document.getElementById('filterBtn');
    const dropdownIteS = document.getElementById('dropdownIteS');
    const sortBtn = document.getElementById('sortBtn');
    const dropdownIteM = document.getElementById('dropdownIteM');
    const buut = document.getElementById('buut');
    const fourMoreDropdown = document.getElementById('fourMoreDropdown');
    
    // Filter dropdown
    if (filterBtn && dropdownIteS) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownIteS.classList.toggle('show');
        });
    }
    
    // Sort dropdown
    if (sortBtn && dropdownIteM) {
        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownIteM.classList.toggle('show');
        });
    }
    
    // Four more dropdown
    if (buut && fourMoreDropdown) {
        buut.addEventListener('click', function(e) {
            e.stopPropagation();
            fourMoreDropdown.classList.toggle('hidden');
        });
    }
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (dropdownIteS) dropdownIteS.classList.remove('show');
        if (dropdownIteM) dropdownIteM.classList.remove('show');
        if (fourMoreDropdown) fourMoreDropdown.classList.add('hidden');
    });
    
    // Cancel and Done buttons for dropdowns
    const cancelSort = document.getElementById('cancelSort');
    const doneBtn = document.getElementById('doneBtn');
    const cancelSortF = document.getElementById('cancelSortF');
    const doneBtnF = document.getElementById('doneBtnF');
    
    if (cancelSort && dropdownIteM) {
        cancelSort.addEventListener('click', function() {
            dropdownIteM.classList.remove('show');
        });
    }
    
    if (doneBtn && dropdownIteM) {
        doneBtn.addEventListener('click', function() {
            dropdownIteM.classList.remove('show');
        });
    }
    
    if (cancelSortF && dropdownIteS) {
        cancelSortF.addEventListener('click', function() {
            dropdownIteS.classList.remove('show');
        });
    }
    
    if (doneBtnF && dropdownIteS) {
        doneBtnF.addEventListener('click', function() {
            dropdownIteS.classList.remove('show');
        });
    }
    
    // ====================
    // CONNECTIONS MODAL FUNCTIONALITY
    // ====================
    
    const connectionsModal = document.getElementById('connectionsModal');
    const connectionsModalClose = document.getElementById('connectionsModalClose');
    
    // Connections modal functionality for connections tab
    if (connectionsModal) {
        // Update the tab switching to handle connections modal
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const tabId = this.getAttribute('data-tab');
                
                // Auto-show modal when connections tab is clicked
                if (tabId === 'connections' && connectionsModal) {
                    connectionsModal.classList.add('active');
                    document.body.classList.add('modal-open');
                } else if (connectionsModal.classList.contains('active')) {
                    connectionsModal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
        });
    }
    
    if (connectionsModalClose && connectionsModal) {
        connectionsModalClose.addEventListener('click', function() {
            connectionsModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
    }
    
    if (connectionsModal) {
        connectionsModal.addEventListener('click', function(e) {
            if (e.target === connectionsModal) {
                connectionsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // ====================
    // ADDITIONAL SALES CHANNELS FUNCTIONALITY
    // ====================
    
    // Add click functionality to sales channel items
    const salesChannelItems = document.querySelectorAll('.sales-channel-item');
    salesChannelItems.forEach(item => {
        item.addEventListener('click', function() {
            const channelName = this.querySelector('span').textContent;
            console.log(`Clicked on: ${channelName}`);
        });
    });
});