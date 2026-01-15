
    document.addEventListener('DOMContentLoaded', function() {
        // Handle sidebar tabs for mobile
        const sidebarTabs = document.querySelectorAll('.sidebar-tab');
        const sidebarSections = document.querySelectorAll('.sidebar-section');
        
        // Function to show a specific section and hide others
        function showSidebarSection(sectionId) {
            sidebarSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        }
        
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                
                // Update active tab
                sidebarTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show the corresponding section
                showSidebarSection(target + '-section');
            });
        });
        
        // Handle dropdown for Files menu item
        const filesDropdown = document.getElementById('files-dropdown');
        const filesSubmenu = document.getElementById('files-submenu');
        const dropdownIcon = filesDropdown.querySelector('.dropdown-icon');
        
        filesDropdown.addEventListener('click', () => {
            filesSubmenu.classList.toggle('active');
            dropdownIcon.classList.toggle('rotated');
        });
        
        // Cover photo upload functionality
        const coverUpload = document.getElementById('coverUpload');
        const uploadModal = document.getElementById('uploadModal');
        const closeModal = document.getElementById('closeModal');
        const uploadFromDevice = document.getElementById('uploadFromDevice');
        const takePhoto = document.getElementById('takePhoto');
        const coverPhoto = document.getElementById('coverPhoto');
        
        // Show modal when camera icon is clicked
        coverUpload.addEventListener('click', () => {
            uploadModal.style.display = 'flex';
        });
        
        // Close modal when cancel button is clicked
        closeModal.addEventListener('click', () => {
            uploadModal.style.display = 'none';
        });
        
        // Close modal when clicking outside the modal content
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.style.display = 'none';
            }
        });
        
        // Handle upload from device
        uploadFromDevice.addEventListener('click', () => {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // Create an image element for the new cover
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        
                        // Clear the current cover and add the new image
                        coverPhoto.innerHTML = '';
                        coverPhoto.appendChild(img);
                        
                        // Add the camera icon back
                        coverPhoto.appendChild(coverUpload);
                        
                        // Close the modal
                        uploadModal.style.display = 'none';
                    }
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
            
            // Trigger the file input click
            fileInput.click();
        });
        
        // Handle take photo option
        takePhoto.addEventListener('click', () => {
            alert('Camera functionality would be implemented here. In a real application, this would access your device camera.');
        });
        
        // Adjust layout on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                // Reset sidebar display on large screens - show all sections
                sidebarSections.forEach(section => {
                    section.classList.add('active');
                });
            } else {
                // Apply mobile view adjustments
                const activeTab = document.querySelector('.sidebar-tab.active');
                if (activeTab) {
                    const target = activeTab.getAttribute('data-target');
                    showSidebarSection(target + '-section');
                }
            }
        });
        
        // Initialize mobile view if needed
        if (window.innerWidth <= 992) {
            // Start with only the archived section visible on mobile
            showSidebarSection('archived-section');
        }
    });
