document.addEventListener('DOMContentLoaded', function () {
  // ———————————————————————————————————————————————
  // GRAB ELEMENTS
  // ———————————————————————————————————————————————
  const editor               = document.getElementById('createPost-content');
  const colorDecorationBtn   = document.getElementById('createPost-colorDecoration');
  const colorPopup           = document.getElementById('colorPopup');
  const audienceBtn          = document.getElementById('audience-btn');
  const audienceModal        = document.getElementById('audienceModal');
  const doneBtn              = document.querySelector('.done-btn');
  const cancelBtn            = document.querySelector('.cancel-btn');
  const gobackbtn            = document.querySelector('.goBack-btn');
  const postBtn              = document.getElementById('post');
  const expandBtn            = document.querySelector('.colorOption.expandOption')
  const moreColors           = document.getElementById('fullColor-popup');
  const closeColors          = document.getElementById('closeFull-color');
  const emojiBtn             = document.getElementById('emoji-btn');
  const emojiPicker          = document.getElementById('emojiPicker');
  const textSection          = document.getElementById('textSection');

  // ———————————————————————————————————————————————
  // UTILITY FUNCTIONS
  // ———————————————————————————————————————————————
  // 1) Save / restore selection for color‐picker
  let savedRange = null;
  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount) savedRange = sel.getRangeAt(0);
  }
  function restoreSelection() {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  // 2) Move the caret to the very end of the editor
  function moveCaretToEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // 3) Enable / disable “Post” based on content or media
  function checkPostEligibility() {
    const textDiv = editor.querySelector('.textSection');
    const text = textDiv ? textDiv.textContent.trim() : '';
    const hasText = text.length > 0;
    const hasMedia = !!editor.querySelector('img, video, span[contenteditable="false"]');
    postBtn.disabled = !(hasText || hasMedia);
  }

  // ———————————————————————————————————————————————
  // POST BUTTON: start disabled, watch for changes
  // ———————————————————————————————————————————————
 ensureSectionExist(); // Ensures textSection is added before listener

 textSection.addEventListener('input', checkPostEligibility);

checkPostEligibility(); // Run once on load

  // ———————————————————————————————————————————————
  // AUDIENCE MODAL
  // ———————————————————————————————————————————————
  doneBtn.disabled = true;
  audienceBtn.addEventListener('click', () => {
    audienceModal.style.display = 'block';
    doneBtn.disabled = true;
  });
  document.querySelectorAll('input[name="audience"]').forEach(radio => {
    radio.addEventListener('change', () => {
      doneBtn.disabled = false;
    });
  });
  doneBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name="audience"]:checked');
    if (sel) {
      const parent    = sel.closest('.audienceOption');
      const iconSpan   = parent.querySelector('span');
      const iconName = iconSpan.textContent.trim();
      const iconClass = iconSpan.className;
      const optionTxt = parent.querySelector('.optionTitle').textContent.trim();
      audienceBtn.innerHTML =
        `<span class = ${iconClass}>${iconName}</span> ${optionTxt} ▾`;
    }
    audienceModal.style.display = 'none';
  });
  gobackbtn.addEventListener('click', () => audienceModal.style.display = 'none');
  cancelBtn .addEventListener('click', () => audienceModal.style.display = 'none');

  // add emoji
  //show emoji picker
  emojiBtn.addEventListener('click', (e) => {
    /*emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';*/
    e.stopPropagation();
    emojiPicker.classList.toggle('hidden');
    // keeping text section in focus
    textSection.focus();
    if(textSection && !textSection.contains(document.getSelection().anchorNode)) {
      moveCaretToEnd(textSection);
    }
  });
  //add emoji  to input
  emojiPicker.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.tagName === 'BUTTON') {
      const emoji = e.target.textContent;
      const selection = window.getSelection();

      //control cursor pointer to guide emoji posting
      if (!textSection.contains(selection.anchorNode)) {
        textSection.focus();
        moveCaretToEnd(textSection);
        //get selection again
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(textSection);
        newRange.collapse(false);
        selection.addRange(newRange);
      }
  
      const range = selection.getRangeAt(0);
      range.deleteContents();
  
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
  
      // Move caret after the inserted emoji
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
  
      textSection.focus(); // Make sure the editable div stays focused
      checkPostEligibility();
      updatePlaceholderVisibility();
    }
  });
  
  //hide picker on outside click
  document.addEventListener('click', (e) => {
      if (!emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
        emojiPicker.classList.add('hidden');
      }
    });

  // BACKGROUND COLOR PICKER (“Aa”)

  colorDecorationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPopup.classList.toggle('hidden');
    moreColors.classList.add('hidden');
    textColorPopup.classList.add('hidden');
  });

  //close picker on outside click
  document.addEventListener('click', (e) => {
    const isClickInsidecolor = colorPopup.contains(e.target);
    const isClickInsideEditor = editor.contains(e.target);

    if (!isClickInsidecolor && !isClickInsideEditor) {
      colorPopup.classList.add('hidden');
    }
  });

  //MORE COLORS

  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    moreColors.classList.remove('hidden');
    colorPopup.classList.add('hidden');
  });

  closeColors.addEventListener('click', (e) => {
    e.stopPropagation();
    moreColors.classList.add('hidden');
  });

  //add color change to editor
  document.querySelectorAll('.colorSwatch').forEach(option => {
    option.addEventListener('click', () => {
      const bgColor = option.getAttribute('data-color');
      if (bgColor === null) {
        console.warn("Clicked colorOption has no 'data-color' attribute.", option);
        return; // Exit the function if no color data is found
      }

      // Clear previous background properties to avoid conflicts
      editor.style.backgroundColor = '';
      editor.style.backgroundImage = '';

      if (bgColor.includes('gradient')) {
        editor.style.backgroundImage = bgColor;
      } else {
        editor.style.backgroundColor = bgColor;
      }

      const icoN = document.querySelector('#createPost-colorDecoration .material-symbols-outlined');
      if (icoN) { // Always check if the element exists before trying to style it
        icoN.style.color = bgColor.includes('gradient') ? 'inherit' : bgColor; // Reset or choose a dominant color
        }
    });
});

  colorDecorationBtn.appendChild(moreColors);

  // ———————————————————————————————————————————————
// Text color picker
  const textColorBtn = document.getElementById('colorText-btn');
  const textColorPopup = document.getElementById('text-colorPopup');


  textColorBtn.addEventListener('click', () => {
    textColorPopup.classList.toggle('hidden');
    colorPopup.classList.add('hidden');
    moreColors.classList.add('hidden');
  });
  //remove on outside click
  document.addEventListener('click', (e) => {
    const clickInsidePopup = textColorPopup.contains(e.target);
    const clickInsideEditor = editor.contains(e.target);
    const clickOnButton = textColorBtn.contains(e.target);

    if (!clickInsidePopup && !clickInsideEditor && !clickOnButton) {
      textColorPopup.classList.add('hidden');
    }
  });
  //connect color to text
  document.querySelectorAll('.textColorOption').forEach(option  => {
    option.addEventListener('click', () => {
      const textColor = option.getAttribute('data-color');
      textSection.style.color = textColor;

    // Set icon color
    const icon = document.querySelector('#colorText-btn .material-symbols-outlined');
    icon.style.color = textColor;
    });
  });

  // HIDDEN FILE INPUTS
  // ———————————————————————————————————————————————
//Placeholder text toggle
  function updatePlaceholderVisibility() {
    const textDiv = editor.querySelector('.textSection');
    if (!textDiv) return;

    const isEmpty = textDiv.innerText.trim() === '';
  textDiv.classList.toggle('show-placeholder', isEmpty);
  }

function ensureSectionExist() {
    if (!editor.querySelector('.textSection')) {
      const textDiv = document.createElement('div');
      textDiv.className = 'textSection show-placeholder';
      textDiv.setAttribute('contenteditable', 'true');
      textDiv.innerHTML = `<span class="placeholder">What's on your mind, Name?</span><br>`;
      editor.appendChild(textDiv);

      textDiv.addEventListener('input', updatePlaceholderVisibility);
      textDiv.addEventListener('focus', updatePlaceholder);
      textDiv.addEventListener('blur', updatePlaceholder);
    }

    if (!editor.querySelector('.mediaSection')) {
      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'mediaSection';
      editor.appendChild(mediaDiv);
    }

    if (!editor.querySelector('.locationSection')) {
      const  locDiv = document.createElement('div');
      locDiv.className = 'locationSection';
      editor.appendChild(locDiv);
    }
  }

  //
  const photoInput = document.createElement('input');
  photoInput.type    = 'file';
  photoInput.accept  = 'image/*';
  photoInput.style.display = 'none';
  document.body.appendChild(photoInput);

  const gifInput = document.createElement('input');
  gifInput.type    = 'file';
  gifInput.accept  = 'image/gif';
  gifInput.style.display = 'none';
  document.body.appendChild(gifInput);

  const videoInput = document.createElement('input');
  videoInput.type    = 'file';
  videoInput.accept  = 'video/*';
  videoInput.style.display = 'none';
  document.body.appendChild(videoInput);

  // Helper to insert at end + re-check Post button
  function appendMedia(html, target = '.mediaSection') {
    ensureSectionExist();
    const placeholder = editor.querySelector('.textSection .placeholder');
    if (placeholder) placeholder.style.display = 'none';

    const targetSection = editor.querySelector(target);
    if (!targetSection) return;

    let wrapper;
    
    if (target === '.mediaSection') {
      wrapper = document.createElement('div');
      wrapper.className = 'mediaItem';
      wrapper.innerHTML =`${html}
        <button class="imgCancel-btn">&times;</button>`;
    } else {
      wrapper = document.createElement('div');
      wrapper.innerHTML = html;
    }

    targetSection.appendChild(wrapper);
    checkPostEligibility();
  }

  // ———————————————————————————————————————————————
  // BIND .addIcons CLICK BEHAVIOR
  // ———————————————————————————————————————————————
  editor.querySelector('.textSection').addEventListener('input',updatePlaceholderVisibility);

  document.querySelectorAll('.addIcons').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (!action) return;

      if (action === 'Add Photo') {
        photoInput.click();

      } else if (action === 'Add Gif') {
        gifInput.click();

      } else if (action === 'Add Video') {
        videoInput.click();

      } else if (action === 'Add Location') {
        if (!navigator.geolocation) {
          return alert('Geolocation not supported');
        }
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            // reverse-geocode via OpenStreetMap Nominatim
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
              .then(r => r.json())
              .then(data => {
                const addr   = data.address || {};
                const city   = addr.city || addr.town || addr.village || addr.county || '';
                const region = addr.state || addr.region || '';
                const name   = [city, region].filter(Boolean).join(', ');
                if (!name) throw new Error('no location name');
                appendMedia(
                  `<span contenteditable="false">
                    @  ${name}
                   </span>`,
                   '.locationSection'
                );
              })
              .catch(() => alert('Location not found'));
          },
          () => alert('Unable to retrieve your location')
        );
      }
    });
  });

  //delete media
  editor.addEventListener('click', function(e) {
    if (e.target.classList.contains('imgCancel-btn')) {
      const mediaitem = e.target.closest('.mediaItem');
      if (mediaitem) mediaitem.remove();
    }
  });

  // ———————————————————————————————————————————————
  // FILE-CHANGE HANDLERS
  // ———————————————————————————————————————————————

  photoInput.multiple= true;

  photoInput.addEventListener('change', function () {
  const files = Array.from(this.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      appendMedia(`
          <img src="${e.target.result}" class="editor-media" alt="Photo" contenteditable="false">
      `);
    };
    reader.readAsDataURL(file);
  });
});

  gifInput.addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
      appendMedia(
        `<img src="${e.target.result}" class="editor-media" alt="Gif" contenteditable="false">`
      );
    };
    reader.readAsDataURL(this.files[0]);
  });

  videoInput.addEventListener('change', function () {
    if (!this.files[0]) return;
    const file   = this.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      appendMedia(
        `<video controls class="editor-media" contenteditable="false">
           <source src="${e.target.result}" type="${file.type}">
           Your browser does not support the video tag.
         </video>`
      );
    };
    reader.readAsDataURL(file);
  });
  editor.addEventListener('input', updatePlaceholderVisibility);
  editor.addEventListener('blur', updatePlaceholderVisibility, true);
});