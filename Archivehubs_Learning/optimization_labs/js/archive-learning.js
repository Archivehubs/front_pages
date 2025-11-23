// Archive Learning JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality for navigation menu
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const content = accordionItem.querySelector('.accordion-content');
            const icon = this.querySelector('.accordion-icon');
            
            // Close all other accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherItem = otherHeader.parentElement;
                    const otherContent = otherItem.querySelector('.accordion-content');
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    otherContent.style.maxHeight = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                    otherHeader.style.backgroundColor = '#f9f9f9';
                }
            });
            
            // Toggle current accordion item
            if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
                this.style.backgroundColor = '#e8f4fd';
            } else {
                content.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
                this.style.backgroundColor = '#f9f9f9';
            }
        });
    });

    // Submenu functionality - Fixed to work with all submenu toggles
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            const parentItem = this.parentElement;
            const submenu = parentItem.querySelector('.submenu');
            const icon = this.querySelector('.submenu-icon');
            
            // Toggle expanded class
            parentItem.classList.toggle('expanded');
            
            // Toggle submenu visibility
            if (parentItem.classList.contains('expanded')) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            } else {
                submenu.style.maxHeight = '0';
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Submenu item click handlers
    const submenuItems = document.querySelectorAll('.submenu-item a');
    submenuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Remove active class from all submenu items
            submenuItems.forEach(subItem => subItem.parentElement.classList.remove('active'));
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            // Navigate to the link's href
            window.location.href = this.href;
        });
    });

    // Lesson list item click handlers (without pop-ups)
    const lessonListItems = document.querySelectorAll('.lesson-list-item a:not(.submenu-toggle)');
    lessonListItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Update active lesson styling
            lessonListItems.forEach(li => li.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            // Navigate to the link's href
            window.location.href = this.href;
        });
    });

    // Sidebar close functionality
    const sidebarClose = document.querySelector('.sidebar-close');
    const menuIcon = document.querySelector('.menu-icon');
    const lessonSidebar = document.querySelector('.lesson-sidebar');
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            lessonSidebar.classList.remove('active');
        });
    }
    
    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            lessonSidebar.classList.toggle('active');
        });
    }

    // Completion Checkmark Logic
    // Map lesson/quiz keys to sidebar selectors
    const completionMap = {
        'introduction': 'archive_learning_2.html',
        'assessment': 'archive_learning_assessment.html',
        'overview-purpose': 'overview_purpose.html',
        'overview-benefits': 'overview_benefits.html',
        'overview-knowledge-check': 'quiz_results.html', // quiz flow
        'kc-knowledge-check': 'kc_results.html', // knowledge check flow
    };

    // Helper: get completion from localStorage
    function isCompleted(key) {
        return localStorage.getItem('archivehubs_completed_' + key) === 'true';
    }
    // Helper: set completion in localStorage
    function setCompleted(key) {
        localStorage.setItem('archivehubs_completed_' + key, 'true');
    }

    // On results pages, mark as completed
    const path = window.location.pathname.split('/').pop();
    if (path === 'quiz_results.html') {
        setCompleted('overview-knowledge-check');
    }
    if (path === 'kc_results.html') {
        setCompleted('kc-knowledge-check');
    }
    if (path === 'archive_learning_2.html') {
        setCompleted('introduction');
    }
    if (path === 'archive_learning_assessment.html') {
        setCompleted('assessment');
    }
    if (path === 'overview_purpose.html') {
        setCompleted('overview-purpose');
    }
    if (path === 'overview_benefits.html') {
        setCompleted('overview-benefits');
    }

    // Update sidebar checkmarks
    Object.entries(completionMap).forEach(([key, file]) => {
        if (isCompleted(key)) {
            // Find the sidebar link for this file
            const link = document.querySelector(`.lesson-list-item a[href$='${file}'], .submenu-item a[href$='${file}']`);
            if (link) {
                let icon = link.querySelector('.lesson-status-icon');
                if (!icon) {
                    // Add checkmark if not present
                    icon = document.createElement('i');
                    icon.className = 'fas fa-check-circle lesson-status-icon';
                    link.appendChild(icon);
                }
                icon.style.color = '#10b981'; // Green
                icon.style.display = 'inline';
            }
        }
    });
}); 
