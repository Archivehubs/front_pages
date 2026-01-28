document.addEventListener('DOMContentLoaded', function() {
    // Open To Dropdown functionality
    const openToMainBtn = document.getElementById('openToMainBtn');
    const openToDropdown = document.getElementById('openToDropdown');
    
    function toggleOpenToDropdown() {
        openToDropdown.classList.toggle('show');
    }
    
    if (openToMainBtn) {
        openToMainBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleOpenToDropdown();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (openToDropdown && !openToDropdown.contains(e.target) && e.target !== openToMainBtn) {
            openToDropdown.classList.remove('show');
        }
    });

    // Create modal container with proper styling
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    modalContainer.style.display = 'none';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modalContainer.style.zIndex = '1000';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
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

    // Function to create modal
    function createModal(title, content) {
        modalContainer.innerHTML = `
            <div class="modal-overlay" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
                <div class="modal-content" style="background:white; padding:20px; border-radius:8px; width:80%; max-width:600px; max-height:80vh; overflow-y:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h2 style="margin:0;">${title}</h2>
                        <span class="close-modal" style="cursor:pointer; font-size:24px;">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer" style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
                        <button class="cancel-btn" style="padding:8px 16px; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
                        <button class="save-btn" style="padding:8px 16px; background:#0073b1; color:white; border:none; border-radius:4px; cursor:pointer;">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        addImageUploadLogic(modalContainer);
        
        // Add event listeners
        modalContainer.querySelector('.close-modal').addEventListener('click', closeModal);
        modalContainer.querySelector('.cancel-btn').addEventListener('click', closeModal);
        modalContainer.querySelector('.save-btn').addEventListener('click', saveModal);
        
        modalContainer.style.display = 'flex';
    }

    function closeModal() {
        modalContainer.style.display = 'none';
    }

    function saveModal() {
        alert('Changes saved!');
        closeModal();
    }

    // Improved helper function to attach modal events to edit buttons
    function addEditButtonListeners(sectionSelector, modalContentFn, modalTitle) {
        // Handle existing elements
        document.querySelectorAll(`${sectionSelector} .edit-btn`).forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                createModal(modalTitle, modalContentFn());
            });
        });

        // Set up MutationObserver for dynamically added elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const editBtns = node.querySelectorAll ? node.querySelectorAll(`${sectionSelector} .edit-btn`) : [];
                        editBtns.forEach(btn => {
                            btn.addEventListener('click', function(e) {
                                e.preventDefault();
                                createModal(modalTitle, modalContentFn());
                            });
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // About Section Modal
    addEditButtonListeners('.about-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <h3>Basic Information</h3>
                    <div class="form-group">
                        <label>Official Name of the Government Organization</label>
                        <input type="text" placeholder="Enter official name">
                    </div>
                    <div class="form-group">
                        <label>Tagline (if applicable)</label>
                        <input type="text" placeholder="Enter tagline">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Portfolio Title</label>
                            <input type="text" placeholder="e.g., Program & Project Portfolio 2025">
                        </div>
                        <div class="form-group">
                            <label>Date of Publication</label>
                            <input type="date">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Contact Information</h3>
                    <div class="form-group">
                        <label>Headquarters Address</label>
                        <input type="text" placeholder="Enter address">
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Regional Address</button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Website</label>
                            <input type="url" placeholder="Enter website URL">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter email">
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone Number 1</label>
                            <input type="tel" placeholder="Enter phone number">
                        </div>
                        <div class="form-group">
                            <label>Phone Number 2</label>
                            <input type="tel" placeholder="Enter alternate phone number">
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Social Media Links</label>
                        <input type="url" placeholder="Enter social media URL">
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit About Section');

    // Introduction / Executive Message Modal
    addEditButtonListeners('.introduction-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Message from the head of the organization</label>
                        <textarea placeholder="Enter message from Minister, Director-General, etc." rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Brief description of the portfolio's purpose</label>
                        <textarea placeholder="Describe the portfolio's purpose" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Strategic relevance or alignment with national goals</label>
                        <textarea placeholder="Explain alignment with national goals" rows="3"></textarea>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Introduction / Executive Message');

    // Strategic Focus Areas Modal
    addEditButtonListeners('.strategic-focus-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Core thematic or operational areas</label>
                        <textarea placeholder="e.g., Health, Infrastructure, Youth Empowerment, Environment"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Goals and objectives for each area</label>
                        <textarea placeholder="Enter goals and objectives"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Linkages to national development plans, SDGs, or policy frameworks</label>
                        <textarea placeholder="Describe linkages"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Strategic Focus Areas');

    // Organizational Overview Modal
    addEditButtonListeners('.org-overview-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Full Name and Acronym</label>
                        <input type="text" placeholder="Enter full name and acronym">
                    </div>
                    <div class="form-group">
                        <label>Mandate or Legal Foundation</label>
                        <textarea placeholder="Describe mandate or legal foundation"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Jurisdiction</label>
                        <select>
                            <option>National</option>
                            <option>State</option>
                            <option>Regional</option>
                            <option>Local</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Organizational structure and key divisions (summary)</label>
                        <textarea placeholder="Describe organizational structure"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Attach File</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Organizational Overview');

    // Portfolio of Programs and Projects Modal
    addEditButtonListeners('.portfolio-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Project Title</label>
                            <input type="text" placeholder="Enter project title">
                        </div>
                        <div class="form-group">
                            <label>Implementing Department/Unit</label>
                            <input type="text" placeholder="Enter department/unit">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Location(s)</label>
                            <input type="text" placeholder="Enter locations">
                        </div>
                        <div class="form-group">
                            <label>Duration</label>
                            <input type="text" placeholder="Enter duration">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date">
                        </div>
                        <div class="form-group">
                            <label>Timeline</label>
                            <input type="text" placeholder="Start–end date or ongoing">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Budget / Funding Source</label>
                        <input type="text" placeholder="Enter budget and funding source">
                    </div>
                    <div class="form-group">
                        <label>Upload File</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-group">
                        <label>Objective / Purpose</label>
                        <textarea placeholder="Describe objectives"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Activities / Components</label>
                        <textarea placeholder="Describe activities"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Stakeholders / Partners</label>
                        <textarea placeholder="List stakeholders/partners"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Upload File</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Outcomes / Results</label>
                        <textarea placeholder="Describe outcomes/results"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Visuals (photos, charts, maps)</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Portfolio of Programs and Projects');

    // Key Performance Highlights Modal
    addEditButtonListeners('.performance-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Summary of measurable results</label>
                        <textarea placeholder="Quantitative and qualitative results"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Indicators and targets achieved</label>
                        <textarea placeholder="List indicators and targets"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Beneficiary data</label>
                        <input type="text" placeholder="e.g., number of citizens served, schools built">
                    </div>
                    <div class="form-group">
                        <label>Year-over-year comparisons (if available)</label>
                        <textarea placeholder="Enter comparisons"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Infographics and data visualizations</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Upload File</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Key Performance Highlights');

    // Innovations and Best Practices Modal
    addEditButtonListeners('.innovations-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Successful implementation approaches</label>
                        <textarea placeholder="Describe successful approaches"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Digital tools, community engagement methods, or inclusive practices</label>
                        <textarea placeholder="Describe tools and methods"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Lessons learned from program execution</label>
                        <textarea placeholder="Describe lessons learned"></textarea>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Innovations and Best Practices');

    // Awards and Recognitions Modal
    addEditButtonListeners('.awards-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Key Accomplishments/ Major Projects</label>
                        <textarea placeholder="Describe accomplishments/projects"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Awards and Certifications</label>
                        <input type="text" placeholder="List awards and certifications">
                    </div>
                    <div class="form-group">
                        <label>Attach Certificate</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Issued Date</label>
                            <input type="date">
                        </div>
                        <div class="form-group">
                            <label>Credential ID</label>
                            <input type="text" placeholder="Enter credential ID">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-group">
                        <label>Membership in Professional Association</label>
                        <input type="text" placeholder="List professional associations">
                    </div>
                    <div class="form-group">
                        <label>Attach Certificate</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Issued Date</label>
                            <input type="date">
                        </div>
                        <div class="form-group">
                            <label>Credential ID</label>
                            <input type="text" placeholder="Enter credential ID">
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Awards and Recognitions');

    // Collaborations and Partnerships Modal
    addEditButtonListeners('.collaborations-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>National, regional, and international partners</label>
                        <textarea placeholder="List partners"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Donor-funded initiatives</label>
                        <textarea placeholder="Describe donor-funded initiatives"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Joint ventures with private sector, NGOs, or other public agencies</label>
                        <textarea placeholder="Describe joint ventures"></textarea>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Collaborations and Partnerships');

    // Monitoring, Evaluation, and Learning Modal
    addEditButtonListeners('.monitoring-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Overview of monitoring frameworks</label>
                        <textarea placeholder="Describe monitoring frameworks"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Evaluation processes and impact assessment methods</label>
                        <textarea placeholder="Describe evaluation processes"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Adaptive learning approaches used for future planning</label>
                        <textarea placeholder="Describe learning approaches"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Upload Supporting Files</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Monitoring, Evaluation, and Learning');

    // Challenges and Mitigation Strategies Modal
    addEditButtonListeners('.challenges-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Operational, financial, or political challenges</label>
                        <textarea placeholder="Describe challenges"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Response and mitigation mechanisms</label>
                        <textarea placeholder="Describe mitigation strategies"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Challenges and Mitigation Strategies');

    // Outlook and Strategic Plans Modal
    addEditButtonListeners('.outlook-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Future projects in the pipeline</label>
                        <textarea placeholder="Describe future projects"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Policy reform efforts or expansion plans</label>
                        <textarea placeholder="Describe policy reforms/expansion"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <label>Innovation and digitization strategies</label>
                        <textarea placeholder="Describe innovation strategies"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Outlook and Strategic Plans');

    // Case Studies Modal
    addEditButtonListeners('.case-studies-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Detailed breakdown of 1-3 landmark projects</label>
                        <textarea placeholder="Describe landmark projects" rows="5"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Success metrics, timelines, budgets (If sharable)</label>
                        <textarea placeholder="Provide project details"></textarea>
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
    }, 'Edit Case Studies');

    // Testimonials Modal
    addEditButtonListeners('.testimonials-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Quotes or feedback from beneficiaries or partners</label>
                        <textarea placeholder="Enter testimonials" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Context or reference to the project they relate to</label>
                        <textarea placeholder="Provide context"></textarea>
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
    }, 'Edit Testimonials');

    // Publications Modal
    addEditButtonListeners('.publications-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" placeholder="Enter publication title">
                        </div>
                        <div class="form-group">
                            <label>Author</label>
                            <input type="text" placeholder="Enter author name">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Status</label>
                            <select>
                                <option>Published</option>
                                <option>Draft</option>
                                <option>In Progress</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date of Publication</label>
                            <input type="date">
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Publications');

    // Contact & Links Modal
    addEditButtonListeners('.contact-links-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <h3>Corporate Information</h3>
                    <div class="form-group">
                        <label>Corporate Name</label>
                        <input type="text" placeholder="Enter corporate name">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date of Registration</label>
                            <input type="date">
                        </div>
                        <div class="form-group">
                            <label>Registration ID / Number</label>
                            <input type="text" placeholder="Enter registration ID">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Tax Identification Number (TIN)</label>
                        <input type="text" placeholder="Enter TIN">
                    </div>
                    <div class="form-group">
                        <label>Postal Address</label>
                        <input type="text" placeholder="Enter postal address">
                    </div>
                    <div class="form-group">
                        <label>Branch Address</label>
                        <input type="text" placeholder="Enter branch address">
                    </div>
                    <div class="form-group">
                        <label>Corporate Address</label>
                        <input type="text" placeholder="Enter corporate address">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Contact Details</h3>
                    <div class="form-group">
                        <label>Corporate email</label>
                        <input type="email" placeholder="Enter corporate email">
                    </div>
                    <div class="form-group">
                        <label>Archivehubs Profile Link</label>
                        <input type="url" placeholder="Enter profile URL">
                    </div>
                    <div class="form-group">
                        <label>Corporate website or blog</label>
                        <input type="url" placeholder="Enter website URL">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="Enter phone number">
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="Enter alternate phone number">
                            <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>GitHub, Behance, Dribbble, Medium, or other portfolio platforms link</label>
                        <input type="url" placeholder="Enter portfolio URL">
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Contact & Links');

    // Appendices Modal
    addEditButtonListeners('.appendices-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <label>Attach Whitepapers or Brochure</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Licenses & Certifications</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Reports, photos, or charts</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Legal References</label>
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
                        <label>Maps of project locations</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Maps</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Attach Budget breakdowns</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Appendices');
});

function previewBanner(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('bannerImage').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}