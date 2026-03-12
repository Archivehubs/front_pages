// script.js - Shared for toggles, modals, dropdowns
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

sidebar.addEventListener('click', (e) => {
    if (sidebar.classList.contains('collapsed') && !e.target.closest('.nav-item')) {
        expand();
    }
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

document.querySelectorAll('.dropdown').forEach(drop => {
    drop.addEventListener('click', (e) => {
        if (e.target.classList.contains('trigger')) {
            drop.querySelector('.dropdown-content').style.display = 'block';
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => content.style.display = 'none');
    }
});

function showARLModal() {
    document.getElementById('arl-modal').style.display = 'flex';
}