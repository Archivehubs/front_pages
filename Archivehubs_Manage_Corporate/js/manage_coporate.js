 
        // Sidebar Toggle
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleBtn');

        function collapse() {
            sidebar.classList.add('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }

        function expand() {
            sidebar.classList.remove('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.contains('collapsed') ? expand() : collapse();
        });

        // Click collapsed sidebar to expand
        sidebar.addEventListener('click', (e) => {
            if (sidebar.classList.contains('collapsed') && !e.target.closest('.nav-item')) {
                expand();
            }
        });

        // Sub Tab Switching
        const subLinks = {
            'views-link': 'views',
            'earnings-link': 'earnings',
            'interactions-link': 'interactions',
            'audience-link': 'audience',
            'ad-center-link': 'ad-center',
            'all-ads-link': 'all-ads',
            'ad-credits-link': 'ad-credits'
        };

        Object.keys(subLinks).forEach(linkId => {
            const link = document.getElementById(linkId);
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Remove active from all sub-nav
                    document.querySelectorAll('.sub-nav-item').forEach(item => item.classList.remove('active'));
                    // Add active to clicked
                    link.classList.add('active');
                    // Hide all sections
                    document.querySelectorAll('.insight-section').forEach(sec => sec.style.display = 'none');
                    // Show selected
                    document.getElementById(subLinks[linkId]).style.display = 'block';
                });
            }
        });

        // Charts
        const chartLabels = ['14-Aug', '19-Aug', '24-Aug', '29-Aug', '3-Sep', '8-Sep'];

        // Views Chart
        new Chart(document.getElementById('viewsChart'), {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Views',
                    data: [0, 3, 6, 9, 12, 15],
                    borderColor: '#673ab7',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // Followers Pie
        new Chart(document.getElementById('followersPie'), {
            type: 'doughnut',
            data: {
                labels: ['Non-followers', 'Followers'],
                datasets: [{
                    data: [100, 0],
                    backgroundColor: ['#795548', '#ff9800']
                }]
            }
        });

        // Organic Pie
        new Chart(document.getElementById('organicPie'), {
            type: 'doughnut',
            data: {
                labels: ['Organic', 'Ads'],
                datasets: [{
                    data: [100, 0],
                    backgroundColor: ['#795548', '#ff9800']
                }]
            }
        });

        // Earnings Chart (zero)
        new Chart(document.getElementById('earningsChart'), {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Earnings',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#673ab7',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // Interactions Chart (zero)
        new Chart(document.getElementById('interactionsChart'), {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Interactions',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#673ab7',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // Audience Chart
        new Chart(document.getElementById('audienceChart'), {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Followers',
                    data: [0, 2, 4, 6, 8, 10],
                    borderColor: '#673ab7',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // Image Upload (original)
        document.querySelectorAll('.add-cover-photo-btn input, .edit-profile-photo input').forEach(input => {
            input.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        const container = this.closest('.cover-photo-section') || this.closest('.profile-photo-container');
                        const img = container.querySelector('img');
                        if (img) img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Close Health Section
        document.querySelector('.health-section .close-btn')?.addEventListener('click', function () {
            this.closest('.health-section').style.display = 'none';
        });
