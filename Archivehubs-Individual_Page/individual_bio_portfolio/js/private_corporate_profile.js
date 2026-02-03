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

    // Robust event listener attachment
    function safeAddEventListener(selector, event, handler, label) {
        const el = document.querySelector(selector);
        if (el) {
            el.addEventListener(event, handler);
        } else {
            console.warn('Modal trigger not found:', selector, label);
        }
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

    // Corporate Overview Modal
    safeAddEventListener('.corporate-overview-section .edit-btn', 'click', function() {
        const entryId = 'corporate-overview-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <input type="text" placeholder="Legal Name">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Registration Number e.g RC8096532">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Year Established">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Corporate / Business Type">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Nature of Business / Industry">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Headquarters Branch Locations">
                                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Corporate Overview', modalContent);
    }, 'Corporate Overview');

    // Vision Section Modal
    document.querySelector('.vision-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=VM" alt="Vision" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Vision Statement – Long-term aspirational goal"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Mission Statement – Purpose and how it operates"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Core Values – Beliefs guiding behavior and decision-making"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Vision, Mission, and Core Values', modalContent);
    });

    // Products Section Modal
    safeAddEventListener('.products-section .edit-btn', 'click', function() {
        const entryId = 'products-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <label>Product or Service Type</label>
                                <input type="text" placeholder="Enter product/service type">
                            </div>
                            <div class="form-group">
                                <label>Description of Key Products and/or service offerings</label>
                                <textarea placeholder="Enter description"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Features and benefits</label>
                                <textarea placeholder="Enter features and benefits"></textarea>
                                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                            </div>
                            <div class="form-group">
                                <label>Any Unique Selling Points (USPs)</label>
                                <textarea placeholder="Enter USPs"></textarea>
                                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Products and Services', modalContent);
    }, 'Products');

    // Organizational Structure Modal
    safeAddEventListener('.org-structure-section .edit-btn', 'click', function() {
        const entryId = 'org-structure-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <input type="text" placeholder="Management Team">
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Leadership Bios"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Attach Organization Chart</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Company Hierarchy/ or Organization Chart"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Organizational Structure', modalContent);
    }, 'Org Structure');

    // Market Section Modal
    safeAddEventListener('.market-section .edit-btn', 'click', function() {
        const entryId = 'market-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <input type="text" placeholder="Target Market / Industry Sectors">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Notable Clients or Partners">
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Client Description"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Market Segment</button>
            </form>
        `;
        createModal('Edit Market and Client Base', modalContent);
    }, 'Market');

    // Achievements Section Modal
    safeAddEventListener('.achievements-section .edit-btn', 'click', function() {
        const entryId = 'achievements-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <textarea placeholder="Key Accomplishments/ Major Projects"></textarea>
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Awards and Certifications">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Name of organization">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="date" placeholder="Issued Date">
                                </div>
                                <div class="form-group">
                                    <input type="text" placeholder="Credential ID">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Attach Certificate</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Achievement</button>
            </form>
        `;
        createModal('Edit Achievements and Milestones', modalContent);
    }, 'Achievements');

    // CSR Section Modal
    safeAddEventListener('.csr-section .edit-btn', 'click', function() {
        const entryId = 'csr-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <textarea placeholder="Environmental Sustainability Efforts"></textarea>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Community Engagement"></textarea>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Ethical Practices"></textarea>
                            </div>
                            <div class="form-group">
                                <textarea placeholder="Others"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another CSR Activity</button>
            </form>
        `;
        createModal('Edit Corporate Social Responsibility', modalContent);
    }, 'CSR');

    // Contact Section Modal
    safeAddEventListener('.contact-section .edit-btn', 'click', function() {
        const entryId = 'contact-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <h3>Corporate Data</h3>
                            <div class="form-group">
                                <input type="text" placeholder="Corporate Name">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="date" placeholder="Date of Registration">
                                </div>
                                <div class="form-group">
                                    <input type="text" placeholder="Registration ID / Number">
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Tax Identification Number (TIN)">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Postal Address">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Branch Address">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Corporate Address">
                            </div>
                            <div class="form-group">
                                <input type="email" placeholder="Corporate email">
                            </div>
                            <div class="form-group">
                                <input type="url" placeholder="Archivehubs Portfolio Link">
                            </div>
                            <div class="form-group">
                                <input type="url" placeholder="Corporate website or blog">
                            </div>
                            <div class="form-group">
                                <input type="tel" placeholder="Phone">
                                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                            </div>
                            <div class="form-group">
                                <input type="url" placeholder="GitHub, Behance, Dribbble, Medium, or other portfolio platforms link">
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        createModal('Edit Contact & Links', modalContent);
    }, 'Contact');

    // Appendices Section Modal
    safeAddEventListener('.appendices-section .edit-btn', 'click', function() {
        const entryId = 'appendices-1';
        const modalContent = `
            <form class="modal-form">
                <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                    ${createImageUploadBox(entryId)}
                    <div class="entry-fields" style="flex:1;">
                        <div class="form-section">
                            <div class="form-group">
                                <label>Attach Whitepapers or Brochure</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Attach Credentials</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Attach Charts</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Attach Legal Documents</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Attach Press Mentions</label>
                                <div class="file-upload">
                                    <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Appendix</button>
            </form>
        `;
        createModal('Edit Appendices', modalContent);
    }, 'Appendices');

    // Appendix Section Modal
    document.querySelector('.appendix-section .edit-btn').addEventListener('click', function() {
        const modalContent = `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Attach Resume</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Credentials</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Project timelines</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Detailed case studies</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Press features or publications</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Appendix Item</button>
                </div>
            </form>
        `;
        createModal('Edit Appendix', modalContent);
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