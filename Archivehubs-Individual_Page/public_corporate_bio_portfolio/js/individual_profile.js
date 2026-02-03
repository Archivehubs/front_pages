document.addEventListener('DOMContentLoaded', function() {
    // Open To Dropdown functionality
    const openToBtn = document.getElementById('openToBtn');
    const openToMainBtn = document.getElementById('openToMainBtn');
    const openToDropdown = document.getElementById('openToDropdown');
    
    function toggleOpenToDropdown() {
        openToDropdown.classList.toggle('show');
    }
    
    if (openToBtn) {
        openToBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleOpenToDropdown();
        });
    }
    
    if (openToMainBtn) {
        openToMainBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleOpenToDropdown();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!openToDropdown.contains(e.target)) {
            openToDropdown.classList.remove('show');
        }
    });

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    document.body.appendChild(modalContainer);

    // Function to create an image upload box for an entry
    function createImageUploadBox(entryId) {
        return `
            <div class="modal-image-upload" data-entry-id="${entryId}" style="width:100px; height:100px; display:flex; align-items:center; justify-content:center; border:1px dashed #ccc; border-radius:8px; cursor:pointer; overflow:hidden; background:#fafbfc;">
                <img src="https://via.placeholder.com/100x100?text=Image" alt="Upload" style="max-width:100%; max-height:100%; object-fit:cover; display:none;" id="modalImagePreview-${entryId}">
                <span style="color:#888; font-size:12px;">Click to upload</span>
                <input type="file" accept="image/*" style="display:none;" id="modalImageInput-${entryId}">
            </div>
        `;
    }

    // Helper to add image upload logic for all image upload boxes in a modal
    function addImageUploadLogic(modalRoot) {
        modalRoot.querySelectorAll('.modal-image-upload').forEach(function(imageBox) {
            const entryId = imageBox.getAttribute('data-entry-id');
            const imageInput = imageBox.querySelector('input[type="file"]');
            const imagePreview = imageBox.querySelector('img');
            const span = imageBox.querySelector('span');
            imageBox.addEventListener('click', function(e) {
                if (e.target !== imageInput) imageInput.click();
            });
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        imagePreview.src = ev.target.result;
                        imagePreview.style.display = 'block';
                        span.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Function to create modal (remove duplicate heading and header image)
    function createModal(title, content) {
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-header" style="display:flex; align-items:center; gap:16px;">
                        <div style="flex:1;">
                            <div style="font-size:1.5em; font-weight:bold;">${title}</div>
                        </div>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="cancel-btn">Cancel</button>
                        <button class="save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;
        addImageUploadLogic(modalContainer);
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.cancel-btn').addEventListener('click', closeModal);
        document.querySelector('.save-btn').addEventListener('click', saveModal);
        modalContainer.style.display = 'block';
    }

    function closeModal() {
        modalContainer.style.display = 'none';
    }

    function saveModal() {
        // In a real implementation, this would save the form data
        alert('Changes saved!');
        closeModal();
    }

    // About Section Modal
    document.querySelector('.about-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <div class="form-section">
                    <h3>Personal Information</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your full name">
                    </div>
                    <div class="form-group">
                        <label>Professional Title or Designation</label>
                        <input type="text" placeholder="e.g., Software Engineer, Author, Consultant">
                    </div>
                    <div class="form-group">
                        <label>Tagline or Personal Brand Statement (optional)</label>
                        <input type="text" placeholder="Enter your tagline">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Contact Information</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Country</label>
                            <input type="text" placeholder="Enter country">
                        </div>
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" placeholder="Enter city">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Residential Address</label>
                        <input type="text" placeholder="Enter address">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter email">
                        </div>
                        <div class="form-group">
                            <label>Phone Number 1</label>
                            <input type="tel" placeholder="Enter phone number">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Phone Number 2</label>
                        <input type="tel" placeholder="Enter alternate phone number">
                    </div>
                    <div class="form-group">
                        <label>Date of Portfolio or Version</label>
                        <input type="date">
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Social Media Links</button>
                </div>

                <div class="form-section">
                    <h3>Professional Summary / Bio</h3>
                    <div class="form-group">
                        <label>Brief bio (3–6 sentences)</label>
                        <textarea placeholder="Summarize who you are professionally, your expertise and experience, what makes you unique or valuable, and your career or creative goals"></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Areas of Expertise / Skills</h3>
                    <div class="form-group">
                        <label>Key skills or knowledge areas</label>
                        <textarea placeholder="List your skills (bulleted or comma-separated)"></textarea>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit About Section', modalContent);
    });

    // Activity Section Modal
    document.querySelector('.activity-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Create a Post</label>
                        <textarea placeholder="What do you want to talk about?"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Add Media</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Create Post', modalContent);
    });

    // Experience Section Modal
    document.querySelector('.experience-section .edit-btn').addEventListener('click', function() {
        const entryId = 'workexp-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-group">
                            <label>Job Title</label>
                            <input type="text" placeholder="Enter job title">
                        </div>
                        <div class="form-group">
                            <label>Company/Organization</label>
                            <input type="text" placeholder="Enter company name">
                        </div>
                        <div class="form-group">
                            <label>Tools or platforms used</label>
                            <input type="text" placeholder="List tools/platforms">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="date">
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input type="date">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Key Responsibilities</label>
                            <textarea placeholder="Describe your responsibilities"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Achievements/Projects handled</label>
                            <textarea placeholder="List your achievements"></textarea>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Position</button>
            </form>
        `;
        createModal('Edit Work Experience', modalContent);
    });

    // Education Section Modal
    document.querySelector('.education-section .edit-btn').addEventListener('click', function() {
        const entryId = 'education-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-group">
                            <label>Degree / Qualification</label>
                            <input type="text" placeholder="Enter degree/qualification">
                        </div>
                        <div class="form-group">
                            <label>Institution Name</label>
                            <input type="text" placeholder="Enter institution name">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Year</label>
                                <input type="number" placeholder="YYYY">
                            </div>
                            <div class="form-group">
                                <label>End Year</label>
                                <input type="number" placeholder="YYYY">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Major subjects or areas of focus</label>
                            <input type="text" placeholder="Enter major subjects">
                        </div>
                        <div class="form-group">
                            <label>Honors or distinctions (if any)</label>
                            <input type="text" placeholder="Enter honors/distinctions">
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Education</button>
            </form>
        `;
        createModal('Edit Education', modalContent);
    });

    // Licenses Section Modal
    document.querySelector('.licenses-section .edit-btn').addEventListener('click', function() {
        const entryId = 'licenses-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-group">
                            <label>License or Certification Name</label>
                            <input type="text" placeholder="Enter license/certification name">
                        </div>
                        <div class="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" placeholder="Enter issuing organization">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Issue Date</label>
                                <input type="date">
                            </div>
                            <div class="form-group">
                                <label>Expiration Date</label>
                                <input type="date">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Credential ID</label>
                            <input type="text" placeholder="Enter credential ID">
                        </div>
                        <div class="form-group">
                            <label>Attach Certificate</label>
                            <div class="file-upload">
                                <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another License</button>
            </form>
        `;
        createModal('Edit Licenses & Certifications', modalContent);
    });

    // Affiliations Section Modal
    document.querySelector('.affiliations-section .edit-btn').addEventListener('click', function() {
        const entryId = 'affiliations-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-group">
                            <label>Organization Name</label>
                            <input type="text" placeholder="Enter organization name">
                        </div>
                        <div class="form-group">
                            <label>Role/Position</label>
                            <input type="text" placeholder="Enter your role/position">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="date">
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input type="date">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea placeholder="Describe your involvement"></textarea>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Affiliation</button>
            </form>
        `;
        createModal('Edit Affiliations', modalContent);
    });

    // Volunteer Section Modal
    document.querySelector('.volunteer-section .edit-btn').addEventListener('click', function() {
        const entryId = 'volunteer-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-group">
                            <label>Organization Name</label>
                            <input type="text" placeholder="Enter organization name">
                        </div>
                        <div class="form-group">
                            <label>Role/Position</label>
                            <input type="text" placeholder="Enter your role/position">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="date">
                            </div>
                            <div class="form-group">
                                <label>End Date</label>
                                <input type="date">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea placeholder="Describe your volunteer work"></textarea>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Volunteer Experience</button>
            </form>
        `;
        createModal('Edit Volunteer Experience', modalContent);
    });

    // Languages Section Modal
    document.querySelector('.languages-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Language</label>
                        <input type="text" placeholder="Enter language name">
                    </div>
                    <div class="form-group">
                        <label>Proficiency Level</label>
                        <select>
                            <option>Native</option>
                            <option>Fluent</option>
                            <option>Advanced</option>
                            <option>Intermediate</option>
                            <option>Basic</option>
                        </select>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Language</button>
                </div>
            </form>
        `;
        createModal('Edit Languages', modalContent);
    });

    // Skills Section Modal
    document.querySelector('.skills-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Skill Name</label>
                        <input type="text" placeholder="Enter skill name">
                    </div>
                    <div class="form-group">
                        <label>Proficiency Level</label>
                        <select>
                            <option>Expert</option>
                            <option>Advanced</option>
                            <option>Intermediate</option>
                            <option>Beginner</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea placeholder="Describe your proficiency level"></textarea>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Skill</button>
                </div>
            </form>
        `;
        createModal('Edit Skills', modalContent);
    });

    // Contact Section Modal
    document.querySelector('.contact-section .edit-btn').addEventListener('click', function() {
        const entryId = 'contact-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <h3>Personal Data</h3>
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="Enter full name">
                            </div>
                            <div class="form-group">
                                <label>Residential Address</label>
                                <input type="text" placeholder="Enter residential address">
                            </div>
                            <div class="form-group">
                                <label>Postal Address</label>
                                <input type="text" placeholder="Enter postal address">
                            </div>
                            <div class="form-group">
                                <label>Date of Birth</label>
                                <input type="date">
                            </div>
                            <div class="form-group">
                                <label>Home Address</label>
                                <input type="text" placeholder="Enter home address">
                            </div>
                            <div class="form-group">
                                <label>Place of Birth</label>
                                <input type="text" placeholder="Enter place of birth">
                            </div>
                            <div class="form-group">
                                <label>Nationality</label>
                                <input type="text" placeholder="Enter nationality">
                            </div>
                            <div class="form-group">
                                <label>Marital Status</label>
                                <select>
                                    <option>Single</option>
                                    <option>Married</option>
                                    <option>Divorced</option>
                                    <option>Widowed</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-section">
                            <h3>Contact Information</h3>
                            <div class="form-group">
                                <label>Professional email</label>
                                <input type="email" placeholder="Enter professional email">
                            </div>
                            <div class="form-group">
                                <label>Archivehubs Profile link</label>
                                <input type="url" placeholder="Enter profile URL">
                            </div>
                            <div class="form-group">
                                <label>Personal website or blog</label>
                                <input type="url" placeholder="Enter website URL">
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" placeholder="Enter phone number">
                            </div>
                            <div class="form-group">
                                <label>GitHub, Behance, Dribble, Medium, or other portfolio platforms link</label>
                                <input type="url" placeholder="Enter portfolio URL">
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Contact & Links', modalContent);
    });

    // References Section Modal
    document.querySelector('.references-section .edit-btn').addEventListener('click', function() {
        const entryId = 'references-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <h3>References (Optional)</h3>
                            <p class="form-note">Include contact details with permission</p>
                            <div class="form-group">
                                <label>Referee Name</label>
                                <input type="text" placeholder="Enter referee name">
                            </div>
                            <div class="form-group">
                                <label>Referee Designation</label>
                                <input type="text" placeholder="Enter referee designation">
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea placeholder="Enter reference description"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Referee Organization</label>
                                <input type="text" placeholder="Enter organization">
                            </div>
                            <div class="form-group">
                                <label>Reference Date</label>
                                <input type="date">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Enter email">
                                </div>
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input type="tel" placeholder="Enter phone">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Upload File</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Reference</button>
            </form>
        `;
        createModal('Edit References & Links', modalContent);
    });

    // Interests Section Modal
    document.querySelector('.interests-section .edit-btn').addEventListener('click', function() {
    const modalContent = `
        <form class="modal-form">
            <div class="form-section">
                <div class="form-group">
                        <label>Personal Interests / Hobbies</label>
                        <textarea placeholder="One-liners that humanize the profile (e.g., 'Passionate about photography and sustainable living.')"></textarea>
                </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Interest</button>
            </div>
        </form>
    `;
        createModal('Edit Interests', modalContent);
    });
});

function previewBanner(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('bannerImage').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };