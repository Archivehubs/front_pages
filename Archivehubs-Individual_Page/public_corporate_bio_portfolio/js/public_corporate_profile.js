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

    // Function to create modal
    function createModal(title, content) {
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <img src="https://via.placeholder.com/800x200/0077B5/FFFFFF?text=${encodeURIComponent(title)}" alt="${title}" class="modal-header-image">
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

        // Add event listeners
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.cancel-btn').addEventListener('click', closeModal);
        document.querySelector('.save-btn').addEventListener('click', saveModal);

        // Show modal
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

    // Improved helper function to attach modal events
    function addEditButtonListeners(sectionSelector, modalContentFn, modalTitle) {
        document.querySelectorAll(sectionSelector).forEach(section => {
            const editBtn = section.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    createModal(modalTitle, modalContentFn());
                });
            }
        });
    }

    // About Section Modal
    addEditButtonListeners('.about-section', function() {
        return `
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
    }, 'Edit About Section');

    // Activity Section Modal
    addEditButtonListeners('.activity-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <h3>Activity Settings</h3>
                    <div class="form-group">
                        <label>Post Visibility</label>
                        <select>
                            <option>Public</option>
                            <option>Connections Only</option>
                            <option>Private</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Comment Preferences</label>
                        <select>
                            <option>Allow comments</option>
                            <option>Moderate comments</option>
                            <option>Disable comments</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notification Settings</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox"> Email notifications</label>
                            <label><input type="checkbox"> Push notifications</label>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Activity Settings');

    // Corporate Overview Modal
    addEditButtonListeners('.corporate-overview-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=CO" alt="Corporate" class="modal-header-image">
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
                    <div class="form-group">
                        <input type="text" placeholder="Founder(s) and Key Personnel">
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Brief Profile"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Key Personnel">
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Corporate Overview');

    // Vision, Mission, and Core Values Modal (First Set)
    addEditButtonListeners('.vision-mission-section:not(.org-profile)', function() {
        return `
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
    }, 'Edit Vision, Mission, and Core Values');

    // Products and Services Modal
    addEditButtonListeners('.products-services-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=PS" alt="Products" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <input type="text" placeholder="Product or Service Type">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Description of Key Products and/or service offerings"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Features and benefits"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Any Unique Selling Points (USPs)"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Products and Services');

    // Organizational Structure Modal
    addEditButtonListeners('.org-structure-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=OS" alt="Structure" class="modal-header-image">
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
            </form>
        `;
    }, 'Edit Organizational Structure');

    // Market and Client Base Modal
    addEditButtonListeners('.market-client-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=MC" alt="Market" class="modal-header-image">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Market Segment</button>
                </div>
            </form>
        `;
    }, 'Edit Market and Client Base');

    // Achievements and Milestones Modal
    addEditButtonListeners('.achievements-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=AM" alt="Achievements" class="modal-header-image">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Achievement</button>
                </div>
            </form>
        `;
    }, 'Edit Achievements and Milestones');

    // Corporate Social Responsibility Modal
    addEditButtonListeners('.csr-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=CS" alt="CSR" class="modal-header-image">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another CSR Activity</button>
                </div>
            </form>
        `;
    }, 'Edit Corporate Social Responsibility');

    // Contact & Links Modal
    addEditButtonListeners('.contact-links-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=CL" alt="Contact" class="modal-header-image">
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
            </form>
        `;
    }, 'Edit Contact & Links');

    // Appendices Modal
    addEditButtonListeners('.appendices-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=AP" alt="Appendices" class="modal-header-image">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Appendix</button>
                </div>
            </form>
        `;
    }, 'Edit Appendices');

    // Organizational Overview Modal (Second Set)
    addEditButtonListeners('.org-overview-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=OO" alt="Org Overview" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <input type="text" placeholder="Full Name and Acronym">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Registration Number e.g RC8096532 (If applicable)">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Year of Establishment">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Mandate or Legal Foundation"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Parent Ministry or Supervisory Authority">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Jurisdiction e.g National, State, Regional, Local, International">
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Organizational Overview');

    // Vision, Mission, and Core Values Modal (Second Set)
    addEditButtonListeners('.org-profile .vision-mission-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=VM" alt="Vision" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Vision Statement – Future-focused aspiration"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Mission Statement – Purpose and operational focus"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Core Values – Guiding Principles and Public Service Ethics"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Vision, Mission, and Core Values');

    // Organizational Structure Modal (Second Set)
    addEditButtonListeners('.org-profile .org-structure-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=OS" alt="Structure" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <input type="text" placeholder="Leadership (Director General, Minister, Head, etc)">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Key Departments / Units">
                    </div>
                    <div class="form-group">
                        <label>Attach Organization Chart</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Company Hierarchy / or Organization Chart"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Staffing Overview (Number of employee, distribution, etc)"></textarea>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Organizational Structure');

    // Functions and Mandates Modal
    addEditButtonListeners('.functions-mandates-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=FM" alt="Functions" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Primary Responsibilities and legal mandates"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Scope of Authority (Policy-making, Implementation, Regulation, Service Delivery, etc)"></textarea>
                        <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Functions and Mandates');

    // Key Programs and Services Modal
    addEditButtonListeners('.key-programs-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=KP" alt="Programs" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Ongoing Initiatives, Public Services, or Policy Programs"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Target Populations or Beneficiaries">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Delivery Mechanisms (Offices, Digital Platforms, Partnerships)"></textarea>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Program</button>
                </div>
            </form>
        `;
    }, 'Edit Key Programs and Services');

    // Strategic Goals and Objectives Modal
    addEditButtonListeners('.strategic-goals-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=SG" alt="Goals" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Medium-to long-term Plans"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Performance Indicators (If applicable)">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Alignment with National Development Frameworks, SDGs, etc"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Delivery Mechanisms (Offices, Digital Platforms, Partnerships)"></textarea>
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
    }, 'Edit Strategic Goals and Objectives');

    // Major Achievements Modal (Second Set)
    addEditButtonListeners('.major-achievements-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=MA" alt="Achievements" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Key Accomplishments in Recent Years"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Impact Summaries with data or success stories"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Recognition, Awards, or Major Milestones">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Achievement</button>
                </div>
            </form>
        `;
    }, 'Edit Major Achievements');

    // Budget and Funding Sources Modal
    addEditButtonListeners('.budget-funding-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=BF" alt="Budget" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Annual Budget Summary (Expenditures and Allocations)"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Sources of Funding (Government Appropriation, Donors, Support, Grants)">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Financial Accountability and Audit Practices"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Attach Report</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Budget and Funding Sources');

    // Partnerships and Stakeholders Modal
    addEditButtonListeners('.partnerships-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=PS" alt="Partnerships" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Collaborations with other Government Bodies, NGOs, International Agencies, or Private Sector"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Community Engagement Mechanisms">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Public-Private Partnership (If any)">
                    </div>
                    <div class="form-group">
                        <label>Attach Photo</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach File</button>
                        </div>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Partnership</button>
                </div>
            </form>
        `;
    }, 'Edit Partnerships and Stakeholders');

    // Policy and Regulatory Framework Modal
    addEditButtonListeners('.policy-framework-section', function() {
        return `
            <form class="modal-form">
                <img src="images/company-logo.jpg" alt="Policy" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="Relevant laws, Regulations, or Policy Documents"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Oversight Mechanisms and Accountability Structures">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Compliance with National and International Standards"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Attach Files</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Policy and Regulatory Framework');

    // Monitoring, Evaluation, and Reporting Modal
    addEditButtonListeners('.monitoring-section', function() {
        return `
            <form class="modal-form">
                <div class="form-section">
                    <div class="form-group">
                        <textarea placeholder="How the Organization measures performance"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Monitoring tools or Dashboards">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Reporting Procedures and Public Disclosure"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Attach Files</label>
                        <div class="file-upload">
                            <button type="button" class="attach-btn"><i class="fas fa-thumbtack"></i> Attach Files</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }, 'Edit Monitoring, Evaluation, and Reporting');

    // Contact Information Modal
    addEditButtonListeners('.contact-info-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/0077B5/FFFFFF?text=CI" alt="Contact" class="modal-header-image">
                <div class="form-section">
                    <div class="form-group">
                        <input type="text" placeholder="Headquarters Address">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Regional Offices">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Official emails, helplines, websites, and social media handles"></textarea>
                    </div>
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Contact</button>
                </div>
            </form>
        `;
    }, 'Edit Contact Information');

    // Appendices Modal (Second Set)
    addEditButtonListeners('.org-profile .appendices-section', function() {
        return `
            <form class="modal-form">
                <img src="https://via.placeholder.com/100x100/800000/FFFFFF?text=AP" alt="Appendix" class="modal-header-image">
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
                    <button type="button" class="add-more-btn"><i class="fas fa-plus"></i> Add Another Appendix</button>
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