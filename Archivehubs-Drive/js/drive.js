
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.sidebar-tab');
    const sidebarSections = document.querySelectorAll('.sidebar-section');
    const sidebar = document.getElementById('sidebar-container'); // Get the main sidebar container

    function showSection(sectionId) {
        sidebarSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showSection(target + '-section');
        });
    });

    const filesDropdown = document.getElementById('files-dropdown');
    const filesSubmenu = document.getElementById('files-submenu');
    const dropdownIcon = filesDropdown.querySelector('.dropdown-icon');

    filesDropdown.addEventListener('click', () => {
        filesSubmenu.classList.toggle('active');
        dropdownIcon.classList.toggle('rotated');
    });

    // Function to handle layout based on screen size
    function handleLayout() {
        if (window.innerWidth > 992) {
            // Desktop view: show all sections and the sidebar container
            sidebar.style.display = 'block'; // Ensure the sidebar container is visible
            sidebarSections.forEach(section => {
                section.classList.add('active'); // Show all sections
            });
        } else {
            // Mobile view: hide the main sidebar container, show only the active section via the tabs
            sidebar.style.display = 'none';
            const activeTab = document.querySelector('.sidebar-tab.active');
            if (activeTab) {
                const target = activeTab.getAttribute('data-target');
                showSection(target + '-section');
                sidebar.style.display = 'block'; // Make the sidebar visible to show the active section
            }
        }
    }

    // Initial check on page load
    handleLayout();

    // Re-check on window resize
    window.addEventListener('resize', handleLayout);
});
