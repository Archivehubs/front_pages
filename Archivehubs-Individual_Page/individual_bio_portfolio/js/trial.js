document.addEventListener("DOMContentLoaded", () => {
    const moreBtn = document.getElementById('moreBtn');
    const moreDropdown = document.getElementById('moreDropdown');
    const dotsBtn = document.getElementById('dotsBtn');
    const dotsDropdown = document.getElementById('dotsDropdown');

    // get buttons and content for the pages
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.main-content');

    // buttons for the about page
    const aboutTabButtons = document.querySelectorAll('.aboutBtn');
    const aboutTabContents = document.querySelectorAll('.aboutContent');

    
    //sort menu buttons
    const sortMenuBtn = document.getElementById('sortBtn');
    const sortMenuDropdown = document.getElementById('dropdownIteM');
    const cancelSortMenu = document.getElementById('cancelSort');

    //buttons for mention dropdown
     //button on mention post
    const mentionPostBtn = document.getElementById('buut');
    const mentionPostDropdown = document.getElementById('fourMoreDropdown');

    //filter enu bttons
    const filterMenuBtn = document.getElementById('filterBtn');
    const filterMenuDropdown = document.getElementById('dropdownIteS');
    const cancelFilterMenu = document.getElementById('cancelSortF');
    const closeFilterMenu = document.querySelector('.filterHeader button');





    // dropdown toggles
    moreBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        moreDropdown?.classList.toggle('show');
        dotsDropdown?.classList.remove('show'); 
    });

    dotsBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dotsDropdown?.classList.toggle('show');
        moreDropdown?.classList.remove('show'); 
    });

    document.addEventListener('click', (event) => {
        if (!moreBtn?.contains(event.target) && !moreDropdown?.contains(event.target)) {
            moreDropdown?.classList.remove('show');
        }
        if (!dotsBtn?.contains(event.target) && !dotsDropdown?.contains(event.target)) {
            dotsDropdown?.classList.remove('show');
        }
    });

    // main tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.scrollTop = 0;
            }
        });
    });

    // about tab switching
// about tab switching
aboutTabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;
    console.log("Clicked:", targetId); // always logs

    // Remove all active classes
    aboutTabButtons.forEach(btn => btn.classList.remove('active'));
    aboutTabContents.forEach(content => content.classList.remove('active'));

    // Activate clicked button
    button.classList.add('active');

    // Find target content
    const targetContent = document.getElementById(targetId);
    console.log("Found element:", targetContent); // show what’s found

    if (targetContent) {
      targetContent.classList.add('active');
      targetContent.style.display = 'block'; // force visible
      targetContent.scrollTop = 0;
      console.log("Activated:", targetContent.id);
    } else {
      console.warn("No matching content for:", targetId);
    }
  });
});


   //logic for the sort menu
   sortMenuBtn.addEventListener('click', () => {
    filterMenuDropdown.classList.remove('show')
    mentionPostDropdown.classList.remove('show')
    sortMenuDropdown.classList.toggle('show');
    });


    cancelSortMenu.addEventListener('click', (e) => {
        e.stopPropagation(); 
        sortMenuDropdown.classList.remove('show');
    });


    //filter menu logic
    filterMenuBtn.addEventListener('click', () => {
        sortMenuDropdown.classList.remove('show')
        mentionPostDropdown.classList.remove('show')
        filterMenuDropdown.classList.toggle('show');
    });


    cancelFilterMenu.addEventListener('click', (e) => {
        e.stopPropagation(); 
        filterMenuDropdown.classList.remove('show');
    });

    closeFilterMenu.addEventListener('click', (e) => {
        e.stopPropagation(); 
        filterMenuDropdown.classList.remove('show');
    });


    //open and close the mention post dropdown
    if (mentionPostBtn && mentionPostDropdown){
        mentionPostBtn.addEventListener('click',(e) => {
            e.stopPropagation();

            sortMenuDropdown.classList.remove('show')
            filterMenuDropdown.classList.remove('show')
            mentionPostDropdown.classList.toggle('hidden');
        });

        //close when click ouside
        document.addEventListener('click', (event) => {
                mentionPostDropdown.classList.add('hidden');
        });
    }





    //read in an image file
const fileInput = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');

// Listen for when a file is selected
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Set the image source to the selected file
            imagePreview.src = e.target.result;
            // Make the preview visible
            imagePreview.classList.add('visible');
        };
            reader.readAsDataURL(file);
            }
    });


});
