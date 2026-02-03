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
    
    // Main tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            mainContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
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
});