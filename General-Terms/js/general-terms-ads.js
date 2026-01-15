document.addEventListener('DOMContentLoaded', function() {
    const featureSections = document.querySelectorAll('.featureSection h2');

    featureSections.forEach(header => {
        header.addEventListener('click', function() {
            const section = this.closest('.featureSection');
            section.classList.toggle('active');
        });
    });


    //pricing strategy fadein
    const fadeInElements = document.querySelectorAll('.fadeIn');

    const checkFadeIn = () => {
        fadeInElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            //check if the top of the element is visible
            if (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', checkFadeIn);
    window.addEventListener('resize', checkFadeIn);
    checkFadeIn(); //initial check on page load
});