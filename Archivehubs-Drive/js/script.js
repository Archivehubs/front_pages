document.addEventListener('DOMContentLoaded', function() {
    // Toggle like button
    document.querySelectorAll('.post-actions button').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

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
function toggleMessagingBox() {
    const messagingBox = document.querySelector('.messaging-box');
    messagingBox.classList.toggle('expanded');
    
    // Prevent click events on action icons from triggering the toggle
    const actionIcons = document.querySelectorAll('.messaging-actions i');
    actionIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
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

      

    

