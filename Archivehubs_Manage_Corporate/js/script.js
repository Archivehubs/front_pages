// script.js - Shared script, extended for new functionality
// Sidebar Toggle (same as reference)
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

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.contains('collapsed') ? expand() : collapse();
    });
}

// Click collapsed sidebar to expand
if (sidebar) {
    sidebar.addEventListener('click', (e) => {
        if (sidebar.classList.contains('collapsed') && !e.target.closest('.nav-item')) {
            expand();
        }
    });
}

// Tab switching for sections like Published/Scheduled, Comments/Mentions
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Update content based on tab, e.g., show/hide divs
        const target = document.getElementById(tab.dataset.target);
        if (target) {
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            target.style.display = 'block';
        }
    });
});

// Date dropdown
document.querySelectorAll('.date-dropdown .trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const list = trigger.nextElementSibling;
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
    });
});

// Filter dropdowns
document.querySelectorAll('.filter-dropdown .trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const list = trigger.nextElementSibling;
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
    });
});

// Calendar (simple implementation for Sep 2025 as per PDF)
function renderCalendar(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    calendar.innerHTML = '';
    // Header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `<span>${new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })} ${year}</span><div><i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></div>`;
    calendar.appendChild(header);
    // Days header
    const daysHeader = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<div class="calendar-day">${day}</div>`).join('');
    calendar.innerHTML += daysHeader;
    // Days
    let day = 1;
    for (let i = 0; i < 42; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        if (i < firstDay || day > daysInMonth) {
            div.classList.add('other-month');
            div.textContent = i < firstDay ? '' : day - daysInMonth;
        } else {
            div.textContent = day++;
        }
        calendar.appendChild(div);
    }
}

// Init calendar on custom date click
document.getElementById('custom-date')?.addEventListener('click', () => {
    renderCalendar(2025, 9); // Sep 2025
    document.getElementById('calendar-modal').style.display = 'flex';
});

// Close modal
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Charts (extend for new pages, same config)
if (document.getElementById('viewsChart')) {
    new Chart(document.getElementById('viewsChart'), {
        type: 'line',
        data: {
            labels: ['14-Aug', '19-Aug', '24-Aug', '29-Aug', '3-Sep', '8-Sep'],
            datasets: [{ label: 'Views', data: [0, 3, 6, 9, 12, 15], borderColor: '#673ab7', tension: 0.1 }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}
// Similar for other charts...