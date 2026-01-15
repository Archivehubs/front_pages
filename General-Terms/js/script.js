document.addEventListener('DOMContentLoaded', function() {

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


    //user agreement
    const agreementQuestions = document.querySelectorAll('.agreementQuestion');

    agreementQuestions.forEach(question => {
        question.addEventListener('click', () => {
            //toggle active class
            question.classList.toggle('active');

            //find the sibling element
            const answer = question.nextElementSibling;

            //open it
            answer.classList.toggle('open');
        });
    });
});