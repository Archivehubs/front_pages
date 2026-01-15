document.addEventListener('DOMContentLoaded', function() {
    const fadeInElements = document.querySelectorAll('.fadeIn');

    const checkFadeIn = () => {
        const triggerBottom = (window.innerHeight || document.documentElement.clientHeight) * 0.8;
        fadeInElements.forEach (el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', checkFadeIn);
    window.addEventListener('resize',checkFadeIn);
    checkFadeIn();

    //learning solutions page
    const courseSection = document.getElementById('courseSection');
    const tabs = document.querySelectorAll('.tabButton');
    const tabContent = document.querySelectorAll('.tabContent');

    window.openTab = function(tabName) {
        
        tabContent.forEach(content => content.classList.remove('active'));

        tabs.forEach(button => button.classList.remove('active'));

        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
    }

});