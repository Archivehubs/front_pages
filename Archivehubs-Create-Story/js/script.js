document.addEventListener('DOMContentLoaded', () => {

    const landing = document.getElementById('landingPage');
    const photoPage = document.getElementById('photoStory-page');
    const textPage = document.getElementById('textStory-page');
    const discardModal = document.getElementById('discardModal');
    //photostory elements
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadImage-btn');
    const dropZone = document.getElementById('dropZone');
    const imagePreview = document.getElementById('imagepreview');
    const imageControls = document.getElementById('imageControls');
    const changeBtn = document.getElementById('changeImage-btn');
    const deleteBtn = document.getElementById('deleteImage-btn');
    const container = document.getElementById('imageUploadArea');

   function showPage(page) {
    [landing, photoPage, textPage].forEach(p => {
        if (p !== page) p.classList.add('hidden');
        else p.classList.remove('hidden');
    });
}


    //get photostory page
    document.getElementById("photoStory-btn").onclick = () => {
        showPage(photoPage);
    };
    //photostory response

    function loadImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        dropZone.style.display = 'none';
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imageControls.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }

    function resetImage() {
      imagePreview.src = '';
      imagePreview.style.display   = 'none';
      imageControls.style.display  = 'none';
      dropZone.style.display       = 'flex';
      imageInput.value             =  '';
    }
    //1. upload an image button
    uploadBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', () => {
      if (imageInput.files[0]) loadImage(imageInput.files[0]);
    });

    //2. change image selection
    changeBtn.addEventListener('click', () => imageInput.click());
    deleteBtn.addEventListener('click', resetImage);





    // Text story flow: clicking "Create a text story" shows the text story page
    document.getElementById("textStory-btn").onclick = () => {
        showPage(textPage);
    };

    const editor = document.getElementById("editor");
    const preview = document.getElementById("livePreview");

    // Set default background color to green on the preview
    preview.style.backgroundColor = "#556B2F";

    editor.addEventListener("input", () => {
        preview.innerText = editor.innerText || "Start typing...";
    });

    //font logic
    const select = document.querySelector('.fontStyle select');

    //remove existing style
    function clearOldStyles(el) {
      el.classList.forEach (c => {
        if (c.startsWith('style-')) el.classList.remove(c);
      });
    }

    select.addEventListener('change', () => {
      const choice = select.value.toLowerCase();
      const cls = `style-${choice}`;

      clearOldStyles(editor);
      clearOldStyles(preview);

      editor.classList.add(cls);
      preview.classList.add(cls);
    });

    // Background color selection logic
    const colorButtons = document.querySelectorAll('.colorBtn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedColor = btn.dataset.color;
            preview.style.backgroundColor = selectedColor;
        });
    });

    // Scroll arrow behavior: scroll the .colorGrid down when the button is clicked
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const colorGrid = document.querySelector('.colorGrid');

    if (scrollDownBtn && colorGrid) {
        scrollDownBtn.addEventListener('click', () => {
            // Scroll down by the height of two rows (adjust the value as needed)
            colorGrid.scrollTop += 90;
        });
    }

    //discard button menu
    document.getElementById("discard-btn").onclick = () => {
        discardModal.style.display = 'flex';
    };

    document.getElementById("continueEditing-btn").onclick = () => {
        discardModal.style.display = 'none';
    };

    document.getElementById("confirmDiscard-btn").onclick = () => {
        editor.value = "";
        discardModal.style.display = "none";
        showPage(landing);
    };

    document.getElementById('cancel-btn').onclick = () =>{
      discardModal.style.display = "none"
    }

    document.getElementById('editor').addEventListener('input', function () {
  const maxWords = 100;   // Set your desired word limit
  const maxHeight = 150;  // Maximum height (in pixels)
  
  // Get the current text and split into words
  const text = this.innerText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  
  // Update the counter below the editor
  const counter = document.getElementById('wordCounter');
  counter.innerText = `${words.length} / ${maxWords}`;
  
  // If word count or height exceeds the limit, revert to the last valid content
  if (words.length > maxWords || this.scrollHeight > maxHeight) {
    this.innerHTML = this.lastValid || '';
    // Update counter again with the valid content
    const validText = this.innerText.trim();
    const validWords = validText.split(/\s+/).filter(Boolean);
    counter.innerText = `${validWords.length} / ${maxWords}`;
    return;
  }
  
  // Save the current valid content for future reversion if needed
  this.lastValid = this.innerHTML;
});

//enforce editable area placeholder
    function restorePlaceholderIfEmpty() {
      if (!editor.textContent.trim()) {
        editor.innerHTML = '';
      }
    }

    editor.addEventListener('blur', restorePlaceholderIfEmpty);

    //photostory discard
    document.getElementById("discard-btn1").onclick = () => {
        discardModal.style.display = 'flex';
    };

    document.getElementById("continueEditing-btn").onclick = () => {
        discardModal.style.display = 'none';
    };

    document.getElementById("confirmDiscard-btn").onclick = () => {
        editor.value = "";
        discardModal.style.display = "none";
        showPage(landing);
    };

    document.getElementById('cancel-btn').onclick = () =>{
      discardModal.style.display = "none"
    }

    

});