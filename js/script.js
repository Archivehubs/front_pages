document.addEventListener('DOMContentLoaded', function() {
    // Initialize like functionality
    initializeLikeButtons();
    // Initialize comment functionality
    initializeCommentModal();

    // Create post modal
    const createPostButton = document.querySelector('.post-input button');
    createPostButton.addEventListener('click', function() {
        alert('Create post functionality coming soon!');
    });

    // Basic search functionality for Menu Page
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item, .menu-simple div');

        menuItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });



    // Add connect button functionality
    document.querySelectorAll('.connect-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.textContent = this.textContent === 'Connect' ? 'Pending' : 'Connect';
            this.classList.toggle('pending');
        });
    });
});

// Like Button Functionality
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    console.log(`Found ${likeButtons.length} like buttons`);
    
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLikeClick);
        
        // Check if user has previously liked this post (from localStorage)
        const postId = button.getAttribute('data-post-id');
        const isLiked = localStorage.getItem(`post_${postId}_liked`) === 'true';
        
        if (isLiked) {
            button.classList.add('liked');
            button.setAttribute('data-liked', 'true');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    });
}

function handleLikeClick(event) {
    const button = event.currentTarget;
    const postId = button.getAttribute('data-post-id');
    const isCurrentlyLiked = button.classList.contains('liked');
    const likeCountElement = button.closest('.post').querySelector('.metric-count[data-likes]');
    
    // Error handling
    if (!likeCountElement) {
        console.error('Like count element not found');
        return;
    }
    
    // Get current like count
    let currentLikes = parseInt(likeCountElement.getAttribute('data-likes')) || 0;
    
    if (isCurrentlyLiked) {
        // Unlike the post
        unlikePost(button, likeCountElement, currentLikes, postId);
    } else {
        // Like the post
        likePost(button, likeCountElement, currentLikes, postId);
    }
}

function likePost(button, likeCountElement, currentLikes, postId) {
    try {
        // Update button state
        button.classList.add('liked');
        button.setAttribute('data-liked', 'true');
        
        // Update icon
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        
        // Update like count
        const newLikes = currentLikes + 1;
        updateLikeCount(likeCountElement, currentLikes, newLikes);
        
        // Save to localStorage
        localStorage.setItem(`post_${postId}_liked`, 'true');
        
                       // Like animation removed as requested
    } catch (error) {
        console.error('Error in likePost:', error);
    }
}

function unlikePost(button, likeCountElement, currentLikes, postId) {
    try {
        // Update button state
        button.classList.remove('liked');
        button.setAttribute('data-liked', 'false');
        
        // Update icon
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        // Update like count
        const newLikes = Math.max(0, currentLikes - 1); // Prevent negative likes
        updateLikeCount(likeCountElement, currentLikes, newLikes);
        
        // Remove from localStorage
        localStorage.removeItem(`post_${postId}_liked`);
    } catch (error) {
        console.error('Error in unlikePost:', error);
    }
}

function updateLikeCount(likeCountElement, oldCount, newCount) {
    // Add updating class for animation
    likeCountElement.classList.add('updating');
    
    // Update the data attribute
    likeCountElement.setAttribute('data-likes', newCount);
    
    // Animate the count change
    animateLikeCount(likeCountElement, oldCount, newCount);
    
    // Remove updating class after animation
    setTimeout(() => {
        likeCountElement.classList.remove('updating');
    }, 300);
}

function animateLikeCount(element, start, end) {
    const duration = 300;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = 1 - Math.pow(1 - progress, 2);
        const current = Math.round(start + (end - start) * easeOutQuad);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    
    requestAnimationFrame(updateCount);
}





// Function to format numbers with commas
function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to animate number counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = 1 - Math.pow(1 - progress, 2);
        const current = start + (range * easeOutQuad);
        
        const statText = element.textContent.split(' ');
        statText.shift(); // Remove the old number
        element.textContent = `${formatNumber(current)} ${statText.join(' ')}`;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Function to update all stats with animation
function updateStats() {
    const stats = document.querySelectorAll('.stat-count');
    
    const ranges = [
        { min: 1000, max: 5000 },    // Profile Visitors
        { min: 500, max: 2000 },     // Insight Analysis
        { min: 200, max: 1000 },     // Archive Explorer
        { min: 50, max: 500 }        // Archive Lite
    ];

    stats.forEach((stat, index) => {
        const currentNum = parseInt(stat.textContent.split(' ')[0].replace(/,/g, '')) || 0;
        const newNum = getRandomNumber(ranges[index].min, ranges[index].max);
        animateValue(stat, currentNum, newNum, 1000); // 1000ms animation duration
    });
}

// Initial update
document.addEventListener('DOMContentLoaded', updateStats);

// Update every 5 seconds with animation
setInterval(updateStats, 5000);

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box');
    const searchTrigger = document.querySelector('.search-trigger');
    const searchInput = document.querySelector('.search-input');

    // Toggle search input on trigger click
    searchTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search input when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
        }
    });

    // Prevent search input from closing when clicking inside it
    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSuggestions);

// Add theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeSwitch.checked = currentTheme === 'dark';
    }
    
    // Theme toggle handler
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Theme toggle function
function toggleTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.checked = !themeSwitch.checked;
    
    // Trigger the change event
    const event = new Event('change');
    themeSwitch.dispatchEvent(event);
}

// Theme switch event listener
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeSwitch.checked = currentTheme === 'dark';
    }
    
    // Theme toggle handler
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Toggle menu on click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        dropdownMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Prevent menu from closing when clicking inside it
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    
    // Optional: Clear input on focus
    searchInput.addEventListener('focus', function() {
        this.placeholder = '';
    });
    
    // Optional: Restore placeholder on blur if empty
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'Search';
        }
    });
});

document.querySelector('.search-trigger').addEventListener('click', function() {
    const searchInput = document.querySelector('.search-input');
    searchInput.classList.remove('hidden');
    searchInput.focus();
  });
  
  // Optional: Hide search input when clicking outside
  document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');
    if (!searchBox.contains(e.target)) {
      searchInput.classList.add('hidden');
    }
  });

  // Add this to your script.js file or in a <script> tag at the bottom of your HTML
function toggleMessagingBox(event) {
    const messagingBox = document.querySelector('.messaging-box');
    const isExpanded = messagingBox.classList.contains('expanded');
    // If not expanded yet, always expand regardless of click origin
    if (!isExpanded) {
        messagingBox.classList.add('expanded');
    } else {
        // When already expanded, ignore clicks coming from actions area
        if (event && event.target && typeof event.target.closest === 'function') {
            const inActions = event.target.closest('.messaging-actions');
            if (inActions) {
                return;
            }
        }
        messagingBox.classList.toggle('expanded');
    }
    
    // Prevent click events on action icons from triggering the toggle
    const actionIcons = document.querySelectorAll('.messaging-actions i');
    actionIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    const actionsContainer = document.querySelector('.messaging-actions');
    if (actionsContainer) {
        actionsContainer.addEventListener('click', (e) => e.stopPropagation());
    }
}

// Close messaging box when clicking outside
document.addEventListener('click', (e) => {
    const messagingBox = document.querySelector('.messaging-box');
    const isClickInside = messagingBox.contains(e.target);
    
    if (!isClickInside && messagingBox.classList.contains('expanded')) {
        messagingBox.classList.remove('expanded');
    }
});

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
}



document.addEventListener('DOMContentLoaded', function() {
    // Messaging actions dropdown (ellipsis)
    const ellipsis = document.getElementById('messagingEllipsis');
    const menu = document.getElementById('messagingActionsMenu');
    const messagingHeader = document.querySelector('.messaging-header');

    if (ellipsis && menu && messagingHeader) {
        function positionMenu() {
            const iconRect = ellipsis.getBoundingClientRect();
            const menuWidth = menu.offsetWidth || 240;
            const menuHeight = menu.offsetHeight || 160;
            // Position to the LEFT of the ellipsis icon, vertically aligned to icon top
            let top = iconRect.top + window.scrollY;
            let left = iconRect.left - menuWidth - 8 + window.scrollX;
            // Keep within viewport vertically
            if (top + menuHeight > window.scrollY + window.innerHeight) {
                top = Math.max(window.scrollY + 8, window.scrollY + window.innerHeight - menuHeight - 8);
            }
            // Keep within viewport horizontally
            if (left < 8 + window.scrollX) {
                left = 8 + window.scrollX;
            }
            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
        }

        function openMenu() {
            // Only open if messaging box is expanded
            const messagingBox = document.querySelector('.messaging-box');
            if (!messagingBox || !messagingBox.classList.contains('expanded')) return;
            menu.style.display = 'block';
            positionMenu();
        }

        function closeMenu() {
            menu.style.display = 'none';
        }

        // Show on click (after header expanded). Hover-to-open disabled per requirement.
        ellipsis.addEventListener('click', function(e) {
            e.stopPropagation();
            if (menu.style.display === 'none' || menu.style.display === '') {
                openMenu();
            } else {
                closeMenu();
            }
        });

        // Ensure moving the mouse doesn't auto-open; we only close on outside-click below

        // Reposition on resize/scroll
        window.addEventListener('resize', function() { if (menu.style.display === 'block') positionMenu(); });
        window.addEventListener('scroll', function() { if (menu.style.display === 'block') positionMenu(); }, true);

        // Close on outside click
        document.addEventListener('mousedown', function(e) {
            if (menu.style.display !== 'none' && !menu.contains(e.target) && e.target !== ellipsis) {
                closeMenu();
            }
        });
    }
});
    // Company Type "Others" functionality
        const companyType = document.getElementById('companyType');
        const otherType = document.getElementById('otherTypeInput');
    
        companyTypeSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherTypeInput.style.display = 'block';
                otherTypeInput.required = true;
            } else {
                otherTypeInput.style.display = 'none';
                otherTypeInput.required = false;
                otherTypeInput.value = '';
            }
        });
    // File upload handling
    const logoUpload = document.getElementById('companyLogo');
    const uploadBox = document.querySelector('.upload-box');

    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png',];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            alert('Please upload only JPG, JPEG, PNG files');
            return;
        }

        if (file.size > maxSize) {
            alert('File size should be less than 5MB');
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadBox.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">`;
            }
            reader.readAsDataURL(file);
        }
    });

    class StoryHandler {
        constructor() {
            this.fileInput = document.getElementById('story-upload');
            this.initializeEventListeners();
        }
    
        initializeEventListeners() {
            this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
    
            // Check file type
            if (!this.isValidFileType(file)) {
                alert('Please upload only images or videos');
                return;
            }
    
            // Check file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
                alert('File size should be less than 100MB');
                return;
            }
    
            // Create FormData for upload
            const formData = new FormData();
            formData.append('story', file);
            formData.append('type', file.type.startsWith('image') ? 'image' : 'video');
            formData.append('timestamp', new Date().toISOString());
    
            // Upload the story
            this.uploadStory(formData);
        }
    
        isValidFileType(file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
            return validTypes.includes(file.type);
        }
    
        async uploadStory(formData) {
            try {
                // Show loading state
                this.showLoadingState();
    
                // In a real application, you would upload to your server
                // For now, we'll simulate an upload with a timeout
                await this.simulateUpload();
    
                // Create and insert the new story preview
                this.createStoryPreview(formData);
    
                // Reset the file input
                this.fileInput.value = '';
    
                // Show success message
                this.showSuccessMessage();
    
            } catch (error) {
                console.error('Error uploading story:', error);
                alert('Failed to upload story. Please try again.');
            } finally {
                this.hideLoadingState();
            }
        }
    
        showLoadingState() {
            const plusIcon = document.querySelector('.create-story-plus i');
            plusIcon.className = 'fas fa-spinner fa-spin';
        }
    
        hideLoadingState() {
            const plusIcon = document.querySelector('.create-story-plus i');
            plusIcon.className = 'fas fa-plus';
        }
    
        showSuccessMessage() {
            // You can implement a more sophisticated success message UI
            const message = document.createElement('div');
            message.className = 'story-success-message';
            message.textContent = 'Story uploaded successfully!';
            document.body.appendChild(message);
    
            // Remove the message after 3 seconds
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    
        createStoryPreview(formData) {
            const file = formData.get('story');
            const storiesContainer = document.querySelector('.stories-container');
            const createStoryCard = document.querySelector('.create-story');
    
            // Create new story card
            const newStoryCard = document.createElement('div');
            newStoryCard.className = 'story-card';
    
            // Create URL for preview
            const objectUrl = URL.createObjectURL(file);
    
            // Add the story content
            newStoryCard.innerHTML = `
                <div class="story-content">
                    <img src="${file.type.startsWith('image') ? objectUrl : 'images/video-thumbnail.jpg'}" 
                         alt="Story Preview" 
                         class="story-media">
                    <div class="story-user">
                        <img src="images/profile.jpg" alt="User Profile" class="story-avatar">
                        <span class="story-username">Your Story</span>
                    </div>
                </div>
            `;
    
            // Insert the new story card after the create story card
            storiesContainer.insertBefore(newStoryCard, createStoryCard.nextSibling);
        }
    
        async simulateUpload() {
            // Simulate network request
            return new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Initialize the story handler when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new StoryHandler();
    });

    document.addEventListener('DOMContentLoaded', function() {
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                mobileNavItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const searchTrigger = document.querySelector('.mobile-search-trigger');
        const searchInput = document.querySelector('.mobile-search-input');
        const searchClose = document.querySelector('.search-close');
        
        searchTrigger.addEventListener('click', function() {
            searchInput.classList.add('active');
            searchInput.querySelector('input').focus();
        });
        
        searchClose.addEventListener('click', function() {
            searchInput.classList.remove('active');
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mobile-search-container')) {
                searchInput.classList.remove('active');
            }
        });
    });

//    All tools
function openAllTools() {
    document.getElementById('all-tools-overlay').style.display = 'flex';
  }
  
  function closeAllTools() {
    document.getElementById('all-tools-overlay').style.display = 'none';
  }
  
  // Close overlay when clicking outside
  document.getElementById('all-tools-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      closeAllTools();
    }
  });
  
  // Close overlay when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllTools();
    }
  });



//   Archivehubs Community
    // Simple search functionality that filters menu items as you type
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.querySelector('.search-input');
        const menuItems = document.querySelectorAll('.menu-item, .social-item');
        const dividers = document.querySelectorAll('.divider');
        const sectionTitles = document.querySelectorAll('.section-title');
        
        searchInput.addEventListener('input', function() {
            const filter = this.value.toLowerCase();
            let hasVisibleItems = false;
            
            // Filter menu items
            menuItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(filter)) {
                    item.style.display = 'flex';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide dividers based on visible items
            dividers.forEach(divider => {
                const prevVisible = divider.previousElementSibling && 
                                 divider.previousElementSibling.style.display !== 'none';
                const nextVisible = divider.nextElementSibling && 
                                 divider.nextElementSibling.style.display !== 'none';
                
                divider.style.display = (prevVisible && nextVisible) ? 'block' : 'none';
            });
            
            // Show/hide section titles if they have visible items after them
            sectionTitles.forEach(title => {
                let hasVisibleAfter = false;
                let next = title.nextElementSibling;
                
                while (next) {
                    if ((next.classList.contains('menu-item') || 
                         next.classList.contains('social-item')) && 
                         next.style.display !== 'none') {
                        hasVisibleAfter = true;
                        break;
                    }
                    next = next.nextElementSibling;
                }
                
                title.style.display = hasVisibleAfter ? 'flex' : 'none';
            });
        });
    });


    // Archivehubs Article

    document.addEventListener('DOMContentLoaded', () => {

        //image uploader from laptop
              function selectLocalImage() {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');
                  input.click();
      
                  input.onchange = function(){
                      const file = input.files[0];
                      if (file && /^image\//.test(file.type)) {
                          const reader = new FileReader();
                          reader.onload = function(e) {
                              const range = quill.getSelection();
                              quill.insertEmbed(range ? range.index : 0, 'image', e.target.result, 'user');
                          };
                          reader.readAsDataURL(file)
                      }   else {
                          console.warn('Please select an image.')
                      }
                  };
              }
      
      
              //initialize Quill with custom toolbar settings
              var quill = new Quill ('#editor-cont',{
                  theme : 'snow',
                  modules: {
                      toolbar:{
                          container: "#toolbar",
                          handlers : {
                              image: selectLocalImage
                          }
                      }
                  }
              });
      
              // Custom button that wraps selected text in square brackets.
              document.getElementById('bracket-btn').addEventListener('click', function() {
              let range = quill.getSelection();
              if (range && range.length > 0) {
                  let selectedText = quill.getText(range.index, range.length).trim();
                  quill.deleteText(range.index, range.length);
                  quill.insertText(range.index, '[' + selectedText + ']');
              } else {
                  alert('Please select some text to wrap with brackets.');
              }
              });
      
              //initialize Quill with custom toolbar2 settings
              var quill2 = new Quill ('#editor-container',{
                  theme : 'snow',
                  modules: {
                      toolbar:{
                          container: "#toolbar2",
                          handlers : {
                              image: selectLocalImage
                          }
                      }
                  }
              });
      
      
      
        // === 1. Modal (Manage Modal) Handling ===
        const modal = document.getElementById('manageModal');
        const closeBtn = document.getElementById('modalClose');
        const backdrop = modal.querySelector('.modalBackdrop');
        const tabs = modal.querySelectorAll('.nav-btn');
        const contents = modal.querySelectorAll('.tab-content');
      
        // === 2. Settings Section Handling ===
        const settingsModal = document.getElementById('settingsModal')
        const settingsSection = document.querySelector('.articleSettings');
        const openSettingsBtn = document.getElementById('settings-btn');
        const closeSettingsBtn = document.getElementById('settingsCloseBtn');
      
      
        //display the settings modal from the help button
        if(openSettingsBtn) { 
          openSettingsBtn.addEventListener ('click', (e) => {
            e.stopPropagation();
            settingsModal.style.display = 'flex' //show the help modal
          });
        }
      
        //close the modal when we click the close button
      
        closeSettingsBtn.addEventListener('click', () => {
          settingsModal.style.display = 'none';
        });
      
        // Initially hide settings section
        if (settingsSection) {
          settingsSection.style.display = 'none';
        }
        
        // Show settings when the settings button is clicked
        if (openSettingsBtn) {
          openSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsSection.style.display = 'block';
          });
        }
      
        // Hide settings when the close button is clicked
        if (closeSettingsBtn) {
          closeSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsSection.style.display = 'none';
          });
        }
      
        // Hide settings if the user clicks outside of it
       // document.addEventListener('click', (event) => {
         // if (settingsSection &&
           //   !settingsSection.contains(event.target) &&
             // event.target !== openSettingsBtn) {
           // settingsSection.style.display = 'none';
          //}
        //});
      
        // === 3. Modal Open Buttons (Draft, Schedule, Publish) ===
        const openButtons = {
          'draft-btn': 'draftArticle',
          'schedule-btn': 'scheduleArticle',
          'publish-btn': 'publishedArticle'
        };
      
        Object.keys(openButtons).forEach(id => {
          const btn = document.getElementById(id);
          if (btn) {
            btn.addEventListener('click', () => {
              modal.style.display = 'block';
              // Reset all tabs and contents
              tabs.forEach(tab => tab.classList.remove('active'));
              contents.forEach(content => content.classList.remove('active'));
      
              const tabId = openButtons[id];
              const targetTab = Array.from(tabs).find(tab => tab.dataset.tab === tabId);
              const targetContent = document.getElementById(tabId);
              if (targetTab && targetContent) {
                targetTab.classList.add('active');
                targetContent.classList.add('active');
              }
            });
          }
        });
      
        // === 4. Close Modal Handlers ===
        [closeBtn, backdrop].forEach(el =>
          el.addEventListener('click', () => { modal.style.display = 'none'; })
        );
      
        // Close the article modal via the closeArticle button (inside modal)
        const closeArticleBtn = modal.querySelector('.closeArticle');
        if (closeArticleBtn) {
          closeArticleBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        }
      
        // === 5. Tab Switching inside Modal ===
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetContent = modal.querySelector(`#${tab.dataset.tab}`);
            if (targetContent) {
              targetContent.classList.add('active');
            }
          });
        });
      
        // === 6. Per-Card Menu Toggle within Modal ===
        modal.querySelectorAll('.menu-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const opts = btn.nextElementSibling;
            opts.style.display = opts.style.display === 'block' ? 'none' : 'block';
          });
        });
      
        // === 7. Account Popup Handling ===
        const accountPopup = document.getElementById("accountPopup");
        const usernameDisplay = document.querySelector(".usernameDisplay");
        if (usernameDisplay) {
          usernameDisplay.addEventListener("click", function(e) {
            e.stopPropagation();
            if (accountPopup) {
              accountPopup.style.display = "block";
            }
          });
        }
        document.addEventListener("click", function(e) {
          if (accountPopup &&
              !accountPopup.contains(e.target) &&
              e.target !== usernameDisplay) {
            accountPopup.style.display = "none";
          }
        });
      
        // === 8. Manage Dropdown Handling ===
        const manageBtn = document.querySelector(".manage-btn");
        const manageArticle = document.querySelector(".manageArticle");
        if (manageArticle) {
          manageArticle.style.display = "none";
        }
        if (manageBtn) {
          manageBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            manageArticle.style.display =
              manageArticle.style.display === "block" ? "none" : "block";
          });
        }
        if (manageArticle) {
          manageArticle.addEventListener("click", function (e) {
            e.stopPropagation();
          });
        }
        document.addEventListener("click", function (e) {
          if (manageArticle &&
              !manageArticle.contains(e.target) &&
              e.target !== manageBtn) {
            manageArticle.style.display = "none";
          }
        });
        if (manageArticle) {
          const submenuButtons = manageArticle.querySelectorAll("button");
          submenuButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
              manageArticle.style.display = "none";
            });
          });
        }
      
        // === 9. Next Section Handling ===
        const nextBtn = document.querySelector(".next-btn");
        const nextSection = document.querySelector(".nextSection");
        if (nextSection) {
          nextSection.style.display = "none";
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            nextSection.style.display =
              nextSection.style.display === "block" ? "none" : "block";
          });
        }
        if (nextSection) {
          nextSection.addEventListener("click", function (e) {
            e.stopPropagation();
          });
        }
        document.addEventListener("click", function (e) {
          if (nextSection &&
              !nextSection.contains(e.target) &&
              e.target !== manageBtn) {
            nextSection.style.display = "none";
          }
        });
        if (nextSection) {
          const subnextButtons = nextSection.querySelectorAll("button");
          subnextButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
              nextSection.style.display = "none";
            });
          });
        }
      
      
        // Help menu handling
        const helpModal = document.getElementById('helpModal');
        const helpCloseBtn = document.getElementById('helpCloseBtn');
        const helpTopArchiveSelect = document.getElementById('helpTopArchiveSelect');
        const helpContentItem = document.querySelectorAll('.helpContentItem');
        const helpSearchBtn = document.getElementById('helpSearchBtn');
        const helpSearchInput = document.querySelector('.helpSearchInput');
      
      
        //display the help modal from the help button
        const helpBtn = document.getElementById('help-btn');
        if(helpBtn) { 
          helpBtn.addEventListener ('click', (e) => {
            e.stopPropagation();
            helpModal.style.display = 'flex' //show the help modal
          });
        }
      
        //close the modal when we click the close button
      
        helpCloseBtn.addEventListener('click', () => {
          helpModal.style.display = 'none';
        });
        
      
      // update help content based on dropdown selection
      helpTopArchiveSelect.addEventListener('change', (e) => {
        const selected = e.target.value; // 'faq' 'article', 'ticket'
        helpContentItem.forEach(item => {
          if(item.dataset.type === selected){
            item.style.display = 'block';
          } else{
            item.style.display = 'none';
          }
        });
      });
      
      // setting FAQ as the defult view
      helpContentItem.forEach(item => {
        if(item.dataset.type === helpTopArchiveSelect.value){
          item.style.display = 'block';
        } else{
          item.style.display = 'none';
        }
      });
      
      
      
      //slide in 
      document.getElementById('start-btn').addEventListener('click', function() {
        // Slide the startArticle up and fade it out.
        document.querySelector('.startArticle').classList.add('slide-up');
        
        // After the transition duration, slide the getStartedClick section into view.
        setTimeout(function() {
          document.querySelector('.getStartedClick').classList.add('slide-in');
        }, 300);
      });
      
      //reverse the slide
      document.querySelector('.back-arrow').addEventListener('click', function() {
        // Remove the slide-in class for the second section,
        // making it slide out down off the screen.
        document.querySelector('.getStartedClick').classList.remove('slide-in');
        
        // Wait for the transition duration before reversing the first section.
        setTimeout(function(){
          document.querySelector('.startArticle').classList.remove('slide-up');
        }, 300);  //  the timing is in milliseconds to match my CSS transition duration.
      
      
      
      
      //placeholder visibility contenteditable
      const editor = document.getElementById('editor-container');
      
      // Create a custom placeholder element
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = editor.getAttribute('data-placeholder');
      editor.parentElement.insertBefore(placeholder, editor);
      
      // Function to update placeholder visibility
      function updatePlaceholder() {
        // Consider the editor empty if it contains only a <br> or nothing at all.
        const html = editor.innerHTML.trim();
        if (html === "" || html === "<br>") {
          placeholder.style.display = 'block';
        } else {
          placeholder.style.display = 'none';
        }
      }
      
      // Update placeholder on focus, blur, and input
      editor.addEventListener('input', updatePlaceholder);
      editor.addEventListener('focus', updatePlaceholder);
      editor.addEventListener('blur', updatePlaceholder);
      
      // Initial check
      updatePlaceholder();
        });
      
      });


      // Navigation Account Pop up page
      
    function changeProfile(event) {
      const input = event.target;
      const reader = new FileReader();
      reader.onload = function (e) {
        const profile = document.getElementById("profileImage");
        profile.style.backgroundImage = `url(${e.target.result})`;
        profile.textContent = "";
      };
      if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }
    }

    function changeBanner(event) {
      const input = event.target;
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("banner").style.backgroundImage = `url(${e.target.result})`;
      };
      if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }
    }
  

      

    


// Event Creation Modal Logic
window.addEventListener('DOMContentLoaded', function() {
  const openModalBtn = document.getElementById('openCreateEventModal');
  const modal = document.getElementById('createEventModal');
  const closeModalBtn = document.getElementById('closeEventModal');

  if (openModalBtn && modal && closeModalBtn) {
    openModalBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
    });
    closeModalBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    // Close modal when clicking outside the modal box
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});

// Account Popup Logic
window.addEventListener('DOMContentLoaded', function() {
  const accountNavLink = document.getElementById('accountPopup');
  const accountPopupPanel = document.getElementById('accountPopupPanel');

  if (accountNavLink && accountPopupPanel) {
    accountNavLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Position the popup under the nav-link
      const rect = accountNavLink.getBoundingClientRect();
      accountPopupPanel.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      accountPopupPanel.style.right = (window.innerWidth - rect.right - 8) + 'px';
      accountPopupPanel.style.display = (accountPopupPanel.style.display === 'none' || accountPopupPanel.style.display === '') ? 'block' : 'none';
    });
    // Hide popup when clicking outside
    document.addEventListener('mousedown', function(e) {
      if (accountPopupPanel.style.display !== 'none' && !accountPopupPanel.contains(e.target) && !accountNavLink.contains(e.target)) {
        accountPopupPanel.style.display = 'none';
      }
    });
  }
});

// Initialize comment functionality
initializeCommentModal();

function initializeCommentModal() {
    const commentTriggers = document.querySelectorAll('.comment-trigger');
    const commentButtons = document.querySelectorAll('.post-actions .action-btn');
    console.log('All action buttons found:', commentButtons.length);
    
    const commentButtonsFiltered = Array.from(commentButtons).filter(btn => {
        const icon = btn.querySelector('i');
        const hasCommentIcon = icon && (icon.classList.contains('fa-comment') || icon.classList.contains('far') && icon.classList.contains('fa-comment'));
        if (hasCommentIcon) {
            console.log('Found comment button:', btn);
        }
        return hasCommentIcon;
    });
    const commentModal = document.getElementById('commentModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    console.log('Initializing comment modal...');
    console.log('Found comment triggers:', commentTriggers.length);
    console.log('Found comment buttons:', commentButtons.length);
    console.log('Found filtered comment buttons:', commentButtonsFiltered.length);
    console.log('Found comment modal:', commentModal);
    
    // Add click event to comment triggers (metric-count for comments)
    commentTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            console.log('Comment trigger clicked!');
            const post = this.closest('.post');
            console.log('Found post:', post);
            openCommentModal(post);
        });
    });
    
    // Add click event to comment buttons (post-actions comment button)
    commentButtonsFiltered.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            console.log('Comment button clicked!');
            const post = this.closest('.post');
            console.log('Found post:', post);
            openCommentModal(post);
        });
    });
    
    // Close modal functionality
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCommentModal);
    }
    
    // Close modal when clicking outside
    if (commentModal) {
        commentModal.addEventListener('click', function(e) {
            if (e.target === commentModal) {
                closeCommentModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && commentModal.classList.contains('active')) {
            closeCommentModal();
        }
    });
    
    // Handle comment input Enter key (Shift+Enter for new line, Enter to post)
    const commentInput = document.querySelector('.comment-input');
    if (commentInput) {
        commentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNewComment();
            }
        });
    }
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            filterComments(filterType);
        });
    });
    
    // Add comment functionality
    const postCommentBtn = document.querySelector('.post-comment-btn');
    if (postCommentBtn) {
        postCommentBtn.addEventListener('click', addNewComment);
    }
}

function openCommentModal(post) {
    console.log('Opening comment modal for post:', post);
    const modal = document.getElementById('commentModal');
    console.log('Found modal:', modal);
    
    if (!modal) {
        console.error('Comment modal not found!');
        return;
    }
    
    const postPreview = modal.querySelector('.post-preview');
    const commentsContainer = modal.querySelector('.comments-container');
    
    console.log('Post preview element:', postPreview);
    console.log('Comments container:', commentsContainer);
    
    // Get post ID for loading specific comments
    const postId = parseInt(post.getAttribute('data-post-id')) || 1;
    console.log('Post ID:', postId);
    
    // Populate post preview
    populatePostPreview(post, postPreview);
    
    // Load comments for this specific post
    loadComments(commentsContainer, postId);
    
    // Show modal
    console.log('Adding active class to modal');
    modal.classList.add('active');
    console.log('Modal classes after adding active:', modal.className);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus on comment input for better user experience
    setTimeout(() => {
        const commentInput = modal.querySelector('.comment-input');
        if (commentInput) {
            commentInput.focus();
            console.log('Focused on comment input');
        }
    }, 100); // Small delay to ensure modal is fully visible
}

function closeCommentModal() {
    console.log('Closing comment modal...');
    
    const modal = document.getElementById('commentModal');
    console.log('Found modal to close:', modal);
    
    modal.classList.remove('active');
    console.log('Removed active class, modal classes:', modal.className);
    
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear comment input
    const commentInput = modal.querySelector('.comment-input');
    if (commentInput) {
        commentInput.value = '';
        console.log('Cleared comment input');
    }
    
    console.log('Modal closed');
}

function populatePostPreview(post, postPreview) {
    console.log('Populating post preview for post:', post);
    console.log('Post preview element:', postPreview);
    
    const postHeader = post.querySelector('.post-header');
    const postContent = post.querySelector('.post-content');
    
    console.log('Found post header:', postHeader);
    console.log('Found post content:', postContent);
    
    postPreview.innerHTML = `
        <div class="post-header">
            ${postHeader.innerHTML}
        </div>
        <div class="post-content">
            ${postContent.innerHTML}
        </div>
    `;
    
    console.log('Post preview populated');
}

function loadComments(container, postId = 1) {
    console.log('Loading comments for post ID:', postId);
    console.log('Container element:', container);
    
    // Sample comment data for different posts - in a real app, this would come from an API
    const commentsByPost = {
        1: [
            {
                id: 1,
                author: "Alex Rodriguez",
                avatar: "images/profile.jpg",
                text: "This is really interesting! I've been working on similar AI implementations.",
                time: "2 hours ago",
                likes: 12,
                replies: 3
            },
            {
                id: 2,
                author: "Maria Garcia",
                avatar: "images/profile.jpg",
                text: "Great insights! AI is definitely transforming how we approach development.",
                time: "1 hour ago",
                likes: 8,
                replies: 1
            },
            {
                id: 3,
                author: "David Kim",
                avatar: "images/profile.jpg",
                text: "I completely agree. The possibilities are endless with machine learning.",
                time: "45 minutes ago",
                likes: 15,
                replies: 0
            },
            {
                id: 4,
                author: "Sarah Wilson",
                avatar: "images/profile.jpg",
                text: "What framework are you using for this implementation?",
                time: "30 minutes ago",
                likes: 6,
                replies: 2
            },
            {
                id: 5,
                author: "Mike Johnson",
                avatar: "images/profile.jpg",
                text: "This reminds me of a project I worked on last year. Very similar approach!",
                time: "15 minutes ago",
                likes: 4,
                replies: 0
            }
        ],
        2: [
            {
                id: 6,
                author: "Jennifer Lee",
                avatar: "images/profile.jpg",
                text: "This platform looks amazing! Can't wait to try it out.",
                time: "3 hours ago",
                likes: 18,
                replies: 2
            },
            {
                id: 7,
                author: "Robert Chen",
                avatar: "images/profile.jpg",
                text: "Finally, a solution for digital asset management! This is exactly what we needed.",
                time: "2 hours ago",
                likes: 14,
                replies: 1
            },
            {
                id: 8,
                author: "Amanda Foster",
                avatar: "images/profile.jpg",
                text: "The interface looks so clean and professional. Great job team!",
                time: "1 hour ago",
                likes: 9,
                replies: 0
            },
            {
                id: 9,
                author: "Carlos Mendez",
                avatar: "images/profile.jpg",
                text: "How does this compare to other solutions in the market?",
                time: "45 minutes ago",
                likes: 7,
                replies: 3
            },
            {
                id: 10,
                author: "Lisa Thompson",
                avatar: "images/profile.jpg",
                text: "This is going to revolutionize how we handle our archives!",
                time: "20 minutes ago",
                likes: 11,
                replies: 0
            }
        ]
    };
    
    const comments = commentsByPost[postId] || commentsByPost[1];
    
    // Render comments
    renderComments(container, comments);
}

function renderComments(container, comments) {
    console.log('Rendering comments:', comments);
    console.log('Container for rendering:', container);
    
    container.innerHTML = comments.map(comment => `
        <div class="comment-item" data-comment-id="${comment.id}">
            <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-action like-comment" data-likes="${comment.likes}">Like (${comment.likes})</button>
                    <button class="comment-action">Reply</button>
                    <span class="comment-time">${comment.time}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('Comments HTML added to container');
    // Add event listeners for comment actions
    addCommentActionListeners(container);
}

function addCommentActionListeners(container) {
    console.log('Adding comment action listeners to container:', container);
    
    // Handle comment likes
    const likeButtons = container.querySelectorAll('.like-comment');
    console.log('Found like buttons:', likeButtons.length);
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Like button clicked for comment');
            const currentLikes = parseInt(this.getAttribute('data-likes'));
            const isLiked = this.classList.contains('liked');
            
            if (isLiked) {
                // Unlike
                this.classList.remove('liked');
                this.setAttribute('data-likes', currentLikes - 1);
                this.textContent = `Like (${currentLikes - 1})`;
            } else {
                // Like
                this.classList.add('liked');
                this.setAttribute('data-likes', currentLikes + 1);
                this.textContent = `Like (${currentLikes + 1})`;
            }
        });
    });
    
    // Handle reply buttons (placeholder for future functionality)
    const replyButtons = container.querySelectorAll('.comment-action:not(.like-comment)');
    console.log('Found reply buttons:', replyButtons.length);
    
    replyButtons.forEach(button => {
        if (button.textContent === 'Reply') {
            button.addEventListener('click', function() {
                console.log('Reply button clicked');
                // Focus on comment input and add @username
                const commentInput = document.querySelector('.comment-input');
                const commentAuthor = this.closest('.comment-item').querySelector('.comment-author').textContent;
                commentInput.value = `@${commentAuthor} `;
                commentInput.focus();
                console.log('Added @username to input:', commentInput.value);
            });
        }
    });
    
    console.log('Comment action listeners added');
}

function filterComments(filterType) {
    console.log('Filtering comments by:', filterType);
    
    const commentsContainer = document.querySelector('.comments-container');
    const comments = Array.from(commentsContainer.querySelectorAll('.comment-item'));
    
    console.log('Found comments to filter:', comments.length);
    
    // In a real app, you would filter based on actual data
    // For now, we'll just reorder the existing comments
    switch(filterType) {
        case 'relevant':
            // Sort by likes (most relevant)
            comments.sort((a, b) => {
                const likesA = parseInt(a.querySelector('.comment-action').textContent.match(/\d+/)[0]);
                const likesB = parseInt(b.querySelector('.comment-action').textContent.match(/\d+/)[0]);
                return likesB - likesA;
            });
            break;
        case 'newest':
            // Sort by time (newest first) - simplified for demo
            comments.reverse();
            break;
        case 'all':
            // Show all comments in original order
            loadComments(commentsContainer);
            return;
    }
    
    // Re-render with new order
    const reorderedComments = comments.map(comment => comment.outerHTML);
    commentsContainer.innerHTML = reorderedComments.join('');
    
    console.log('Comments filtered and reordered');
}

function addNewComment() {
    console.log('Adding new comment...');
    
    const commentInput = document.querySelector('.comment-input');
    const commentText = commentInput.value.trim();
    
    console.log('Comment text:', commentText);
    
    if (!commentText) {
        console.log('Empty comment, not adding');
        return; // Don't add empty comments
    }
    
    const commentsContainer = document.querySelector('.comments-container');
    console.log('Comments container:', commentsContainer);
    const newComment = {
        id: Date.now(), // Simple ID generation
        author: "You",
        avatar: "images/profile.jpg",
        text: commentText,
        time: "Just now",
        likes: 0,
        replies: 0
    };
    
    // Add new comment to the top
    const newCommentHTML = `
        <div class="comment-item" data-comment-id="${newComment.id}">
            <img src="${newComment.avatar}" alt="${newComment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${newComment.author}</div>
                <div class="comment-text">${newComment.text}</div>
                <div class="comment-actions">
                    <button class="comment-action like-comment" data-likes="${newComment.likes}">Like (${newComment.likes})</button>
                    <button class="comment-action">Reply</button>
                    <span class="comment-time">${newComment.time}</span>
                </div>
            </div>
        </div>
    `;
    
    console.log('Adding new comment HTML:', newCommentHTML);
    commentsContainer.insertAdjacentHTML('afterbegin', newCommentHTML);
    
    console.log('New comment added to container');
    
    // Clear input
    commentInput.value = '';
    
    // Update comment count in the post
    updateCommentCount();
    
    console.log('New comment process completed');
}

function updateCommentCount() {
    console.log('Updating comment count...');
    
    const commentsContainer = document.querySelector('.comments-container');
    const commentCount = commentsContainer.querySelectorAll('.comment-item').length;
    
    console.log('Total comments in container:', commentCount);
    
    // Update the comment count in the original post
    // We need to find the comment trigger that's currently open
    const modal = document.getElementById('commentModal');
    if (modal && modal.classList.contains('active')) {
        console.log('Modal is active, updating comment count');
        
        // Find the post preview to get the post content
        const postPreview = modal.querySelector('.post-preview');
        if (postPreview) {
            console.log('Found post preview');
            
            // Extract the post author name to identify which post this is
            const authorName = postPreview.querySelector('.post-author-name');
            if (authorName) {
                const authorText = authorName.textContent;
                console.log('Author name from preview:', authorText);
                
                // Find the corresponding post in the main page
                const posts = document.querySelectorAll('.post');
                posts.forEach(post => {
                    const postAuthor = post.querySelector('.post-author-name');
                    if (postAuthor && postAuthor.textContent === authorText) {
                        const commentTrigger = post.querySelector('.comment-trigger');
                        if (commentTrigger) {
                            console.log('Updating comment count for post:', post);
                            commentTrigger.textContent = `${commentCount} comments`;
                            commentTrigger.setAttribute('data-comments', commentCount);
                        }
                    }
                });
            } else {
                console.log('No author name found in post preview');
            }
        } else {
            console.log('No post preview found');
        }
    } else {
        console.log('Modal is not active');
    }
}


// Messaging Box Logic

