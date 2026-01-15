
// Global variables
let fileCount = 0;
const maxFiles = 10;
let tags = [];
const maxTags = 20;
let reminders = [];
let imageDataUrls = []; // Array to store image data URLs

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Toggle between public and private
    document.getElementById('visibilityToggle').addEventListener('click', function() {
        const icon = this.querySelector('.visibility-icon');
        const text = this.querySelector('span:last-child');
        
        if (icon.classList.contains('fa-globe')) {
            icon.classList.remove('fa-globe');
            icon.classList.add('fa-lock');
            text.textContent = 'Private';
        } else {
            icon.classList.remove('fa-lock');
            icon.classList.add('fa-globe');
            text.textContent = 'Public';
        }
        
        // Update preview
        updatePreview();
    });

    // Save draft dropdown functionality
    const saveDraft = document.getElementById('saveDraft');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownIcon = document.getElementById('dropdownIcon');
    
    saveDraft.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        dropdownIcon.classList.toggle('rotate');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
        dropdownIcon.classList.remove('rotate');
        document.getElementById('licensingOptionDropdown').classList.remove('show');
        document.querySelectorAll('.nested-dropdown-options').forEach(menu => {
            menu.classList.remove('show');
        });
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle dropdown item clicks
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const destination = this.querySelector('span').textContent;
            alert(`Saving draft to: ${destination}`);
            dropdownMenu.classList.remove('show');
            dropdownIcon.classList.remove('rotate');
        });
    });

    // Setup file upload functionality
    setupFileUpload();
    
    // Setup tags input functionality
    setupTagsInput();
    
    // Setup renewal functionality
    setupRenewal();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup button functionality
    setupButtons();
    
    // Setup license dropdown functionality
    setupLicenseDropdown();

    // Setup scroll arrows for image gallery
    setupImageGalleryScroll();

    // Setup confirmation modal buttons
    document.getElementById('confirmationEditBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('confirmationModal').style.display = 'none';
    });

    document.getElementById('confirmationDashboardBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Redirect to dashboard or home page
        window.location.href = 'index.html';
    });

    // Menu icon functionality from first file
    document.getElementById('menu-icon').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Mobile menu would open here');
    });
    
    // Other icon functionality from first file
    document.querySelectorAll('.icon-link').forEach(icon => {
        if (icon.id !== 'menu-icon') {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                alert(icon.querySelector('i').className.split(' ')[1].replace('fa-', '') + ' clicked');
            });
        }
    });

    // Update preview functionality
    function updatePreview() {
        // Update title
        const titleInput = document.getElementById('titleInput').value;
        document.getElementById('preview-title').textContent = titleInput || 'Title';
        
        // Update price - format as N25,000
        const priceInput = document.getElementById('priceInput').value;
        const formattedPrice = priceInput ? '₦' + Number(priceInput).toLocaleString('en-US') : 'Price';
        document.getElementById('preview-price').textContent = formattedPrice;
        
        // Update location
        const locationInput = document.getElementById('locationInput').value;
        document.getElementById('preview-meta').textContent = `Listed a few seconds ago in ${locationInput || 'location'}`;
        
        // Update details (using category)
        const categorySelect = document.getElementById('categorySelect').value;
        document.getElementById('preview-details').textContent = categorySelect || 'Details';
        
        // Update description
        const descriptionTextarea = document.getElementById('descriptionTextarea').value;
        document.getElementById('preview-description').textContent = descriptionTextarea || 'Description will appear here';
        
        // Update seller name (you might want to get this from user profile)
        const profileName = 'Your Name'; // Replace with actual user name
        document.querySelector('.preview-profile-name').textContent = profileName;
        
        // Update tags
        const tagsContainer = document.getElementById('preview-tags');
        tagsContainer.innerHTML = '';
        if (tags.length > 0) {
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'preview-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        } else {
            tagsContainer.innerHTML = '<span class="preview-tag">No tags added</span>';
        }
        
        // Update location
        const locationElement = document.getElementById('preview-location');
        if (locationInput) {
            locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${locationInput}</span>`;
        } else {
            locationElement.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>No location specified</span>';
        }
        
        // Update visibility
        const visibilityIcon = document.querySelector('.visibility-icon');
        const visibilityText = visibilityIcon.classList.contains('fa-globe') ? 'Public' : 'Private';
        document.getElementById('confirmation-visibility').textContent = visibilityText;
        
        // Update image gallery preview
        updateImageGalleryPreview();
    }

    function setupImageGalleryScroll() {
        const gallery = document.getElementById('previewGallery');
        const scrollLeft = document.getElementById('scrollLeft');
        const scrollRight = document.getElementById('scrollRight');
        
        scrollLeft.addEventListener('click', function() {
            gallery.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        scrollRight.addEventListener('click', function() {
            gallery.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Show/hide arrows based on scroll position
        gallery.addEventListener('scroll', function() {
            if (gallery.scrollLeft > 0) {
                scrollLeft.style.display = 'flex';
            } else {
                scrollLeft.style.display = 'none';
            }
            
            if (gallery.scrollLeft < gallery.scrollWidth - gallery.clientWidth) {
                scrollRight.style.display = 'flex';
            } else {
                scrollRight.style.display = 'none';
            }
        });
    }
    
    function updateImageGalleryPreview() {
        const gallery = document.getElementById('previewGallery');
        gallery.innerHTML = '';
        
        if (imageDataUrls.length > 0) {
            imageDataUrls.forEach(dataUrl => {
                const img = document.createElement('img');
                img.src = dataUrl;
                img.className = 'gallery-image';
                img.alt = 'Service photo';
                gallery.appendChild(img);
            });
        } else {
            const noImagesMsg = document.createElement('div');
            noImagesMsg.className = 'no-images-message';
            noImagesMsg.textContent = 'No images uploaded yet';
            gallery.appendChild(noImagesMsg);
        }
    }

    function setupLicenseDropdown() {
        const licensingOptionContainer = document.getElementById('licensingOptionContainer');
        const licensingOptionInput = document.getElementById('licensingOption');
        const licensingOptionDropdown = document.getElementById('licensingOptionDropdown');
        const dropdownIcon = licensingOptionContainer.querySelector('.dropdown-icon');
        const outrightLicenseOption = document.getElementById('outrightLicenseOption');
        const outrightLicenseDropdown = document.getElementById('outrightLicenseDropdown');
        const nestedDropdownIcon = outrightLicenseOption.querySelector('.nested-dropdown-icon');
        const licenseInfoContainer = document.getElementById('licenseInfoContainer');
        const licenseDescription = document.getElementById('licenseDescription');
        const licenseAsterisk = document.getElementById('licenseAsterisk');

        // Toggle dropdown on input click
        licensingOptionInput.addEventListener('click', function(e) {
            e.stopPropagation();
            licensingOptionDropdown.classList.toggle('show');
            dropdownIcon.classList.toggle('rotate');
        });

        // Handle option selection
        licensingOptionDropdown.querySelectorAll('.dropdown-option:not(.has-nested)').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const description = this.getAttribute('data-description');
                
                licensingOptionInput.value = value;
                licenseDescription.textContent = description;
                licenseInfoContainer.style.display = 'block';
                
                licensingOptionDropdown.classList.remove('show');
                dropdownIcon.classList.remove('rotate');
                
                // Hide asterisk when value is selected
                licenseAsterisk.classList.add('hidden');
                
                validateForm();
                updatePreview();
            });
        });

        // Handle nested dropdowns
        outrightLicenseOption.addEventListener('click', function(e) {
            if (e.target !== nestedDropdownIcon) {
                e.stopPropagation();
                const isShowing = outrightLicenseDropdown.classList.contains('show');
                
                if (isShowing) {
                    outrightLicenseDropdown.classList.remove('show');
                    nestedDropdownIcon.textContent = '▶';
                } else {
                    outrightLicenseDropdown.classList.add('show');
                    nestedDropdownIcon.textContent = '▼';
                }
            }
        });

        // Handle nested option selection
        outrightLicenseDropdown.querySelectorAll('.dropdown-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const description = this.querySelector('.description').textContent;
                
                licensingOptionInput.value = value;
                licenseDescription.textContent = description;
                licenseInfoContainer.style.display = 'block';
                
                licensingOptionDropdown.classList.remove('show');
                outrightLicenseDropdown.classList.remove('show');
                dropdownIcon.classList.remove('rotate');
                nestedDropdownIcon.textContent = '▶';
                
                // Hide asterisk when value is selected
                licenseAsterisk.classList.add('hidden');
                
                validateForm();
                updatePreview();
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            licensingOptionDropdown.classList.remove('show');
            outrightLicenseDropdown.classList.remove('show');
            dropdownIcon.classList.remove('rotate');
            nestedDropdownIcon.textContent = '▶';
        });
    }

    function setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const photoCounter = document.getElementById('photoCounter');
        const previewContainer = document.getElementById('previewContainer');
        const photoError = document.getElementById('photoError');
        const photosAsterisk = document.getElementById('photosAsterisk');
        
        fileInput.addEventListener('change', function() {
            const remainingSlots = maxFiles - fileCount;
            const filesToAdd = Array.from(this.files).slice(0, remainingSlots);
            
            if (filesToAdd.length === 0) {
                alert(`You can only upload up to ${maxFiles} photos total.`);
                return;
            }
            
            filesToAdd.forEach(file => {
                if (!file.type.match('image.*')) {
                    alert(`File ${file.name} is not an image and was skipped.`);
                    return;
                }
                
                fileCount++;
                updatePhotoCounter();
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" class="preview-image" alt="Preview">
                        <div class="preview-remove" data-filename="${file.name}">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
                    
                    previewContainer.appendChild(previewItem);
                    
                    // Store the data URL
                    imageDataUrls.push(e.target.result);
                    
                    // Add remove event
                    previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                        removeFile(file.name);
                        previewItem.remove();
                    });
                    
                    // Update preview gallery
                    updatePreview();
                };
                reader.readAsDataURL(file);
            });
            
            if (this.files.length > filesToAdd.length) {
                alert(`Added ${filesToAdd.length} files (maximum ${maxFiles} allowed).`);
            }
            
            // Hide asterisk when files are uploaded
            if (fileCount > 0) {
                photosAsterisk.classList.add('hidden');
            }
            
            validateForm();
        });

        function removeFile(filename) {
            fileCount--;
            // Remove the corresponding data URL
            const previewItems = document.querySelectorAll('.preview-item');
            previewItems.forEach(item => {
                if (item.querySelector('.preview-remove').getAttribute('data-filename') === filename) {
                    const imgSrc = item.querySelector('img').src;
                    imageDataUrls = imageDataUrls.filter(url => url !== imgSrc);
                }
            });
            updatePhotoCounter();
            
            // Show asterisk if no files left
            if (fileCount === 0) {
                photosAsterisk.classList.remove('hidden');
            }
            
            validateForm();
            updatePreview();
        }

        function updatePhotoCounter() {
            photoCounter.textContent = `${fileCount}/${maxFiles} – you can add up to ${maxFiles} photos`;
            
            if (fileCount >= maxFiles) {
                photoCounter.style.color = '#e74c3c';
            } else {
                photoCounter.style.color = '#777';
            }
            
            // Show/hide error message
            if (fileCount > 0) {
                photoError.style.display = 'none';
                document.querySelector('.photo-upload').style.borderColor = '#ddd';
            } else {
                photoError.style.display = 'block';
                document.querySelector('.photo-upload').style.borderColor = '#e74c3c';
            }
        }
    }

    function setupTagsInput() {
        const tagsInput = document.getElementById('tagsInput');
        const tagsContainer = document.getElementById('tagsContainer');
        const tagsHidden = document.getElementById('tagsHidden');

        tagsInput.addEventListener('keydown', function(e) {
            if (e.key === ',' || e.key === 'Enter') {
                e.preventDefault();
                const tagText = this.value.trim();
                if (tagText && tags.length < maxTags) {
                    addTag(tagText);
                    this.value = '';
                }
            }
        });

        function addTag(text) {
            if (tags.length >= maxTags) return;
            
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${text}
                <span class="tag-remove" data-tag="${text}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            
            tagsContainer.insertBefore(tag, tagsInput);
            tags.push(text);
            updateHiddenTags();
            
            // Add remove event
            tag.querySelector('.tag-remove').addEventListener('click', function() {
                const tagToRemove = this.getAttribute('data-tag');
                tags = tags.filter(t => t !== tagToRemove);
                tag.remove();
                updateHiddenTags();
                updatePreview();
            });
        }

        function updateHiddenTags() {
            tagsHidden.value = JSON.stringify(tags);
        }
    }

    function setupRenewal() {
        const renewalInput = document.getElementById('renewalInput');
        const renewalModal = document.getElementById('renewalModal');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelRenewalBtn = document.getElementById('cancelRenewal');
        const saveRenewalBtn = document.getElementById('saveRenewal');
        const addReminderBtn = document.getElementById('addReminderBtn');
        const remindersContainer = document.getElementById('remindersContainer');
        const expirationDateHidden = document.getElementById('expirationDateHidden');
        const renewalDateHidden = document.getElementById('renewalDateHidden');
        const remindersHidden = document.getElementById('remindersHidden');

        // Setup select dropdown for renewal
        renewalInput.addEventListener('click', function() {
            document.getElementById('renewalDropdown').classList.toggle('show');
        });

        // Handle renewal option selection
        document.querySelectorAll('#renewalDropdown .dropdown-option').forEach(option => {
            option.addEventListener('click', function() {
                renewalInput.value = this.getAttribute('data-value');
                document.getElementById('renewalDropdown').classList.remove('show');
                
                if (renewalInput.value === 'Yes') {
                    showRenewalModal();
                } else {
                    // Clear any existing renewal data
                    document.getElementById('expirationDate').value = '';
                    document.getElementById('renewalDate').value = '';
                    reminders = [];
                    remindersContainer.innerHTML = '';
                    updateHiddenRenewalFields();
                }
                
                validateForm();
                updatePreview();
            });
        });

        // Show renewal modal
        function showRenewalModal() {
            renewalModal.style.display = 'flex';
        }

        // Close renewal modal
        function closeRenewalModal() {
            renewalModal.style.display = 'none';
            validateForm();
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === renewalModal) {
                closeRenewalModal();
            }
        });

        // Close modal buttons
        closeModalBtn.addEventListener('click', closeRenewalModal);
        cancelRenewalBtn.addEventListener('click', closeRenewalModal);

        // Save renewal details
        saveRenewalBtn.addEventListener('click', function() {
            const expirationDate = document.getElementById('expirationDate').value;
            const renewalDate = document.getElementById('renewalDate').value;
            const expirationDateError = document.getElementById('expirationDateError');
            const renewalDateError = document.getElementById('renewalDateError');
            
            // Reset errors
            expirationDateError.style.display = 'none';
            renewalDateError.style.display = 'none';
            document.getElementById('expirationDate').classList.remove('error-border');
            document.getElementById('renewalDate').classList.remove('error-border');
            
            // Validate
            let isValid = true;
            
            if (!expirationDate) {
                expirationDateError.style.display = 'block';
                document.getElementById('expirationDate').classList.add('error-border');
                isValid = false;
            }
            
            if (!renewalDate) {
                renewalDateError.style.display = 'block';
                document.getElementById('renewalDate').classList.add('error-border');
                isValid = false;
            }
            
            if (isValid && new Date(renewalDate) <= new Date(expirationDate)) {
                renewalDateError.textContent = 'Renewal date must be after expiration date';
                renewalDateError.style.display = 'block';
                document.getElementById('renewalDate').classList.add('error-border');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Update hidden fields
            expirationDateHidden.value = expirationDate;
            renewalDateHidden.value = renewalDate;
            remindersHidden.value = JSON.stringify(reminders);
            
            closeRenewalModal();
            updatePreview();
        });

        // Setup reminder option dropdown
        document.getElementById('reminderOption').addEventListener('click', function() {
            document.getElementById('reminderOptionDropdown').classList.toggle('show');
        });

        // Handle reminder option selection
        document.querySelectorAll('#reminderOptionDropdown .dropdown-option').forEach(option => {
            option.addEventListener('click', function() {
                document.getElementById('reminderOption').value = this.getAttribute('data-value');
                document.getElementById('reminderOptionDropdown').classList.remove('show');
            });
        });

        // Add reminder
        addReminderBtn.addEventListener('click', function() {
            const reminderOption = document.getElementById('reminderOption').value;
            const reminderDescription = document.getElementById('reminderDescription').value;
            
            if (!reminderOption) {
                alert('Please select a reminder option');
                return;
            }
            
            reminders.push({
                option: reminderOption,
                description: reminderDescription
            });
            
            displayReminders();
            
            // Clear the inputs
            document.getElementById('reminderOption').value = '';
            document.getElementById('reminderDescription').value = '';
        });

        // Display reminders
        function displayReminders() {
            remindersContainer.innerHTML = '';
            
            reminders.forEach((reminder, index) => {
                const reminderItem = document.createElement('div');
                reminderItem.className = 'reminder-item';
                reminderItem.innerHTML = `
                    <strong>${reminder.option}</strong>: ${reminder.description || 'No description'}
                    <span class="remove-reminder" data-index="${index}">×</span>
                `;
                
                remindersContainer.appendChild(reminderItem);
                
                // Add remove event
                reminderItem.querySelector('.remove-reminder').addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    reminders.splice(index, 1);
                    displayReminders();
                });
            });
        }

        function updateHiddenRenewalFields() {
            expirationDateHidden.value = '';
            renewalDateHidden.value = '';
            remindersHidden.value = '';
        }
    }

    function setupFormValidation() {
        // Add event listeners to all required fields
        const titleInput = document.getElementById('titleInput');
        const titleAsterisk = document.getElementById('titleAsterisk');
        titleInput.addEventListener('input', function() {
            validateField({ target: this });
            if (this.value.trim()) {
                titleAsterisk.classList.add('hidden');
            } else {
                titleAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        const priceInput = document.getElementById('priceInput');
        const priceAsterisk = document.getElementById('priceAsterisk');
        priceInput.addEventListener('input', function() {
            validateField({ target: this });
            if (this.value.trim()) {
                priceAsterisk.classList.add('hidden');
            } else {
                priceAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        const priceOptionSelect = document.getElementById('priceOptionSelect');
        const priceOptionAsterisk = document.getElementById('priceOptionAsterisk');
        priceOptionSelect.addEventListener('change', function() {
            validateField({ target: this });
            if (this.value) {
                priceOptionAsterisk.classList.add('hidden');
            } else {
                priceOptionAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        const licensingOption = document.getElementById('licensingOption');
        const licenseAsterisk = document.getElementById('licenseAsterisk');
        licensingOption.addEventListener('change', function() {
            validateField({ target: this });
            if (this.value.trim()) {
                licenseAsterisk.classList.add('hidden');
            } else {
                licenseAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        const categorySelect = document.getElementById('categorySelect');
        const categoryAsterisk = document.getElementById('categoryAsterisk');
        categorySelect.addEventListener('change', function() {
            validateField({ target: this });
            if (this.value) {
                categoryAsterisk.classList.add('hidden');
            } else {
                categoryAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        const descriptionTextarea = document.getElementById('descriptionTextarea');
        const descriptionAsterisk = document.getElementById('descriptionAsterisk');
        descriptionTextarea.addEventListener('input', function() {
            validateField({ target: this });
            if (this.value.trim()) {
                descriptionAsterisk.classList.add('hidden');
            } else {
                descriptionAsterisk.classList.remove('hidden');
            }
            updatePreview();
        });

        document.getElementById('renewalInput').addEventListener('change', function() {
            validateField({ target: this });
            updatePreview();
        });
        document.getElementById('expirationDate')?.addEventListener('change', function() {
            validateField({ target: this });
            updatePreview();
        });
        document.getElementById('renewalDate')?.addEventListener('change', function() {
            validateField({ target: this });
            updatePreview();
        });
        document.getElementById('fileInput').addEventListener('change', function() {
            setTimeout(function() {
                validateForm();
                updatePreview();
            }, 100);
        });

        // Location inputs
        document.getElementById('locationInput').addEventListener('input', updatePreview);
        document.getElementById('addressInput').addEventListener('input', updatePreview);

        // Initial validation
        validateForm();
    }

    function validateField(e) {
        const field = e.target;
        const errorId = field.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (field.required && !field.value.trim()) {
            if (errorElement) {
                errorElement.style.display = 'block';
                field.classList.add('error-border');
            }
        } else {
            if (errorElement) {
                errorElement.style.display = 'none';
                field.classList.remove('error-border');
            }
        }
        
        validateForm();
    }

    function validateForm() {
        // Check all required fields
        const isTitleFilled = document.getElementById('titleInput').value.trim() !== '';
        const isPriceFilled = document.getElementById('priceInput').value.trim() !== '';
        const isPriceOptionSelected = document.getElementById('priceOptionSelect').value !== '';
        const isLicenseSelected = document.getElementById('licensingOption').value.trim() !== '';
        const isCategorySelected = document.getElementById('categorySelect').value !== '';
        const isDescriptionFilled = document.getElementById('descriptionTextarea').value.trim() !== '';
        const hasPhotos = fileCount > 0;
        
        // Check renewal if "Yes" is selected
        let isRenewalValid = true;
        const renewalInput = document.getElementById('renewalInput');
        if (renewalInput.value === 'Yes') {
            const expirationDate = document.getElementById('expirationDate').value;
            const renewalDate = document.getElementById('renewalDate').value;
            isRenewalValid = expirationDate && renewalDate && new Date(renewalDate) > new Date(expirationDate);
        }

        // Enable/disable buttons based on validation
        const isValid = isTitleFilled && isPriceFilled && isPriceOptionSelected && isLicenseSelected && 
                      isCategorySelected && isDescriptionFilled && hasPhotos && isRenewalValid;
        
        document.getElementById('sendBtn').disabled = !isValid;
        document.getElementById('publishBtn').disabled = !isValid;

        return isValid;
    }

    function setupFormSubmission() {
        const form = document.getElementById('serviceForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                alert('Please fill in all required fields correctly');
                return;
            }
            
            // Prepare form data
            const formData = new FormData(form);
            
            // Add additional data that might not be in form inputs
            formData.append('visibility', document.querySelector('.visibility-icon').classList.contains('fa-globe') ? 'Public' : 'Private');
            formData.append('photoCount', fileCount);
            
            // Convert FormData to object
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            
            // Add image data URLs to the object
            formDataObject.imageDataUrls = imageDataUrls;
            
            // Show confirmation modal with the data
            showConfirmationModal(formDataObject);
        });
    }

    function showConfirmationModal(formData) {
        // Populate confirmation modal with the data
        document.getElementById('confirmation-title').textContent = formData.title || 'Not provided';
        document.getElementById('confirmation-description').textContent = formData.description || 'Not provided';
        document.getElementById('confirmation-visibility').textContent = formData.visibility || 'Public';
        
        // Format price as N25,000
        const price = formData.price ? '₦' + Number(formData.price).toLocaleString('en-US') : 'Not provided';
        document.getElementById('confirmation-price').textContent = price;
        
        document.getElementById('confirmation-price-option').textContent = formData.priceOption || 'Not provided';
        document.getElementById('confirmation-license').textContent = formData.licenseOption || 'Not provided';
        document.getElementById('confirmation-category').textContent = formData.category || 'Not provided';
        document.getElementById('confirmation-location').textContent = formData.location || 'Not provided';
        document.getElementById('confirmation-address').textContent = formData.address || 'Not provided';
        document.getElementById('confirmation-photo-count').textContent = formData.photoCount || '0';
        document.getElementById('confirmation-renewal').textContent = formData.renewalOption || 'No';
        
        // Display uploaded photos
        const photosContainer = document.getElementById('confirmation-photos');
        photosContainer.innerHTML = ''; // Clear any existing content
        
        if (formData.imageDataUrls && formData.imageDataUrls.length > 0) {
            formData.imageDataUrls.forEach(dataUrl => {
                const photoItem = document.createElement('div');
                photoItem.className = 'confirmation-photo-item';
                
                const img = document.createElement('img');
                img.src = dataUrl;
                img.alt = 'Service photo';
                
                photoItem.appendChild(img);
                photosContainer.appendChild(photoItem);
            });
        } else {
            photosContainer.innerHTML = '<p>No photos uploaded</p>';
        }
        
        // Handle tags
        if (formData.tagsHidden) {
            try {
                const tags = JSON.parse(formData.tagsHidden);
                const tagsContainer = document.getElementById('confirmation-tags');
                tagsContainer.innerHTML = ''; // Clear any existing content
                
                if (tags && tags.length > 0) {
                    tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'confirmation-tag';
                        tagElement.textContent = tag;
                        tagsContainer.appendChild(tagElement);
                    });
                } else {
                    tagsContainer.parentElement.textContent = 'No tags added';
                }
            } catch (e) {
                console.error('Error parsing tags:', e);
                document.getElementById('confirmation-tags').parentElement.textContent = 'No tags added';
            }
        } else {
            document.getElementById('confirmation-tags').parentElement.textContent = 'No tags added';
        }
        
        // Handle renewal details if applicable
        const renewalDetailsContainer = document.getElementById('confirmation-renewal-details');
        if (formData.renewalOption === 'Yes') {
            renewalDetailsContainer.style.display = 'block';
            document.getElementById('confirmation-expiration').textContent = formData.expirationDate || 'Not provided';
            document.getElementById('confirmation-renewal-date').textContent = formData.renewalDate || 'Not provided';
            
            // Handle reminders
            const remindersContainer = document.getElementById('confirmation-reminders');
            remindersContainer.innerHTML = ''; // Clear any existing content
            
            if (formData.reminders) {
                try {
                    const reminders = JSON.parse(formData.reminders);
                    
                    if (reminders && reminders.length > 0) {
                        const reminderList = document.createElement('ul');
                        reminderList.style.marginLeft = '20px';
                        
                        reminders.forEach(reminder => {
                            const item = document.createElement('li');
                            item.innerHTML = `<strong>${reminder.option}</strong>: ${reminder.description || 'No description'}`;
                            reminderList.appendChild(item);
                        });
                        
                        remindersContainer.appendChild(reminderList);
                    } else {
                        remindersContainer.textContent = 'No reminders set';
                    }
                } catch (e) {
                    console.error('Error parsing reminders:', e);
                    remindersContainer.textContent = 'No reminders set';
                }
            } else {
                remindersContainer.textContent = 'No reminders set';
            }
        } else {
            renewalDetailsContainer.style.display = 'none';
        }
        
        // Show the confirmation modal
        document.getElementById('confirmationModal').style.display = 'flex';
    }

    function setupButtons() {
        document.getElementById('sendBtn').addEventListener('click', function() {
            if (validateForm()) {
                alert('Form will be sent to selected recipients');
                // Implement actual send functionality here
            }
        });

        // Try it button functionality
        document.querySelector('.try-button').addEventListener('click', function() {
            alert('Phone upload functionality would be implemented here');
        });

        // Learn more link functionality
        document.querySelector('.learn-more').addEventListener('click', function(e) {
            e.preventDefault();
            alert('More information about phone uploads would be shown here');
        });
    }
});
