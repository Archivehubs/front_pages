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

    // For each modal, add error handling/logging for event listener attachment and refactor to use image upload beside content
    function safeAddEventListener(selector, event, handler, label) {
        const el = document.querySelector(selector);
        if (el) {
            el.addEventListener(event, handler);
        } else {
            console.warn('Modal trigger not found:', selector, label);
        }
    }
    // About Section Modal (no image)
    safeAddEventListener('.about-section .edit-btn', 'click', function() {
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
    }, 'About Section');


   

    // Interests Modal
    safeAddEventListener('.interests-section .edit-btn', 'click', function() {
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
    }, 'Interests');

  

// Corporate Snapshot Modal
safeAddEventListener('.corporate-snapshot-section .edit-btn', 'click', function() {
    const entryId = 'corporate-snapshot-1';
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
                            <input type="text" placeholder="Nature of Business / Industry (Brief Overview)">
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
    createModal('Edit Corporate Snapshot', modalContent);
}, 'Corporate Snapshot');

// Core Services / Capability Modal
safeAddEventListener('.core-services-section .edit-btn', 'click', function() {
    const entryId = 'core-services-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <textarea placeholder="Description of main services or areas of expertise"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Technical or Specialized Skills"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Tools, Platforms, or Methodologies used"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Industry focus or Sector-specific capabilities"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;
    createModal('Edit Core Services / Capability', modalContent);
}, 'Core Services');

// Portfolio of Work / Project Modal
safeAddEventListener('.portfolio-section .edit-btn', 'click', function() {
    const entryId = 'portfolio-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <input type="text" placeholder="Project Title">
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Client Name (If not under NDA)">
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Industry / Sector">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input type="date" placeholder="Date">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Duration">
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Objectives / Client Brief"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Scope of work / Services Delivered"></textarea>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Challenges and Solutions"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Results / Achievements (Preferably with metrics or KPIs)"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="form-group">
                            <label>Images / Visuals (Mockups, Photos, Diagrams)</label>
                            <div class="file-upload">
                                <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Project</button>
        </form>
    `;
    createModal('Edit Portfolio of Work / Project', modalContent);
}, 'Portfolio');

// Team / Expertise Highlights Modal
safeAddEventListener('.team-expertise-section .edit-btn', 'click', function() {
    const entryId = 'team-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <input type="text" placeholder="Profile of Key Personnel (Optional)">
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Certifications and Qualifications">
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Team Capabilities or Departmental Strengths (Optional)"></textarea>
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;
    createModal('Edit Team / Expertise Highlights', modalContent);
}, 'Team');

// Key Clients / Partners Modal
safeAddEventListener('.key-clients-section .edit-btn', 'click', function() {
    const entryId = 'clients-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <input type="text" placeholder="Names of Notable Clients">
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Testimonials (If Available)"></textarea>
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Repeat Clients or long-term Partnerships">
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Client</button>
        </form>
    `;
    createModal('Edit Key Clients / Partners', modalContent);
}, 'Key Clients');

// Awards, Certifications, and Recognitions Modal
safeAddEventListener('.awards-section .edit-btn', 'click', function() {
    const entryId = 'awards-1';
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
                            <label>Attach Certificate</label>
                            <div class="file-upload">
                                <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                            </div>
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
                            <input type="text" placeholder="Membership in Professional Association">
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
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Award</button>
        </form>
    `;
    createModal('Edit Awards, Certifications, and Recognitions', modalContent);
}, 'Awards');

// Tools, Technologies and Methodologies Modal
safeAddEventListener('.tools-section .edit-btn', 'click', function() {
    const entryId = 'tools-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <textarea placeholder="Software / tools regularly used"></textarea>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Proprietary Processes or Innovation Approaches"></textarea>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Tech Stacks, Design Frameworks, or Logistic Systems (If relevant)"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Tool</button>
        </form>
    `;
    createModal('Edit Tools, Technologies and Methodologies', modalContent);
}, 'Tools');

// Financial Highlights Modal
safeAddEventListener('.financial-section .edit-btn', 'click', function() {
    const modalContent = `
        <form class="modal-form">
            <div class="form-section">
                <div class="form-group">
                    <input type="text" placeholder="Revenue Trend">
                </div>
                <div class="form-group">
                    <label>Upload Files</label>
                    <div class="file-upload">
                        <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Profitability (If applicable)">
                </div>
                <div class="form-group">
                    <label>Upload Files</label>
                    <div class="file-upload">
                        <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Key Financial Ratios or Performance Indicators">
                </div>
                <div class="form-group">
                    <label>Upload Files</label>
                    <div class="file-upload">
                        <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                    </div>
                </div>
            </div>
        </form>
    `;
    createModal('Edit Financial Highlights', modalContent);
}, 'Financial');

// Future plans / Strategic Goals Modal
safeAddEventListener('.future-plans-section .edit-btn', 'click', function() {
    const modalContent = `
        <form class="modal-form">
            <div class="form-section">
                <div class="form-group">
                    <textarea placeholder="Short and long-term growth strategies"></textarea>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                </div>
                <div class="form-group">
                    <textarea placeholder="Innovation Plans or Expansion Goals"></textarea>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                </div>
            </div>
        </form>
    `;
    createModal('Edit Future plans / Strategic Goals', modalContent);
}, 'Future Plans');

// Case Studies or Deep Dives Modal
safeAddEventListener('.case-studies-section .edit-btn', 'click', function() {
    const modalContent = `
        <form class="modal-form">
            <div class="form-section">
                <div class="form-group">
                    <textarea placeholder="More detailed breakdown of 1-3 landmark projects"></textarea>
                </div>
                <div class="form-group">
                    <textarea placeholder="Success metrics, timelines, budgets (If sharable)"></textarea>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                </div>
                <div class="form-group">
                    <label>Upload Files</label>
                    <div class="file-upload">
                        <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                    </div>
                </div>
            </div>
        </form>
    `;
    createModal('Edit Case Studies or Deep Dives', modalContent);
}, 'Case Studies');

// Client Testimonials Modal
safeAddEventListener('.testimonials-section .edit-btn', 'click', function() {
    const entryId = 'testimonials-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-group">
                            <textarea placeholder="Quotes from satisfied clients"></textarea>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Context or reference to the project they relate to"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Upload Files</label>
                            <div class="file-upload">
                                <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Testimonial</button>
        </form>
    `;
    createModal('Edit Client Testimonials', modalContent);
}, 'Testimonials');

// Publications Modal
safeAddEventListener('.publications-section .edit-btn', 'click', function() {
    const entryId = 'publications-1';
    const modalContent = `
        <form class="modal-form">
            <div class="entry-row" style="display:flex; align-items:flex-start; gap:16px;">
                ${createImageUploadBox(entryId)}
                <div class="entry-fields" style="flex:1;">
                    <div class="form-section">
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" placeholder="Title">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Author">
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Description of Topic"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <select placeholder="Status">
                                    <option>Published</option>
                                    <option>Draft</option>
                                    <option>In Progress</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <input type="date" placeholder="Date of Publication">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Publication</button>
        </form>
    `;
    createModal('Edit Publications', modalContent);
}, 'Publications');

// Contact & Links Modal
safeAddEventListener('.contact-links-section .edit-btn', 'click', function() {
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
                            <input type="url" placeholder="Archivehubs Profile Link">
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
}, 'Contact & Links');

// Appendices Modal
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
                            <label>Attach Press Mentions</label>
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
                            <label>Attach Credentials</label>
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