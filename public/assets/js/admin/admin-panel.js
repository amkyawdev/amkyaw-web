// Admin Panel for AmkyawDev
(function() {
    // Admin state
    let adminData = {
        templates: [],
        projects: [],
        users: [],
        messages: [],
        stats: {}
    };

    // Initialize admin panel
    function initAdmin() {
        loadAdminData();
        setupAdminHandlers();
    }

    function loadAdminData() {
        // Load from localStorage or API
        const templates = localStorage.getItem('admin_templates');
        const projects = localStorage.getItem('admin_projects');
        const users = localStorage.getItem('admin_users');
        const messages = localStorage.getItem('admin_messages');

        if (templates) adminData.templates = JSON.parse(templates);
        if (projects) adminData.projects = JSON.parse(projects);
        if (users) adminData.users = JSON.parse(users);
        if (messages) adminData.messages = JSON.parse(messages);
    }

    function saveAdminData() {
        localStorage.setItem('admin_templates', JSON.stringify(adminData.templates));
        localStorage.setItem('admin_projects', JSON.stringify(adminData.projects));
        localStorage.setItem('admin_users', JSON.stringify(adminData.users));
        localStorage.setItem('admin_messages', JSON.stringify(adminData.messages));
    }

    function setupAdminHandlers() {
        // Add template button
        const addTemplateBtn = document.querySelector('.add-template');
        if (addTemplateBtn) {
            addTemplateBtn.addEventListener('click', showAddTemplateModal);
        }

        // Add project button
        const addProjectBtn = document.querySelector('.add-project');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', showAddProjectModal);
        }

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });

        // Form submissions
        const templateForm = document.getElementById('template-form');
        if (templateForm) {
            templateForm.addEventListener('submit', handleTemplateSubmit);
        }

        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', handleProjectSubmit);
        }
    }

    // Template Management
    function showAddTemplateModal() {
        const modal = createModal('Add New Template', `
            <form id="template-form" class="admin-form">
                <div class="form-group">
                    <label>Template Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category" required>
                        <option value="portfolio">Portfolio</option>
                        <option value="ecommerce">Ecommerce</option>
                        <option value="blog">Blog</option>
                        <option value="business">Business</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Price ($)</label>
                    <input type="number" name="price" min="0" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Features (comma separated)</label>
                    <input type="text" name="features" placeholder="Responsive, 3D Animation, Dark Mode">
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="url" name="image" placeholder="assets/images/templates/p1.png">
                </div>
                <div class="form-group">
                    <label>Demo URL</label>
                    <input type="url" name="demoUrl" placeholder="https://demo.example.com">
                </div>
                <button type="submit" class="btn btn-primary">Add Template</button>
            </form>
        `);
        document.body.appendChild(modal);
    }

    function handleTemplateSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const template = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            features: formData.get('features').split(',').map(f => f.trim()),
            image: formData.get('image') || 'assets/images/templates/p1.png',
            demoUrl: formData.get('demoUrl') || '#',
            createdAt: new Date().toISOString(),
            downloads: 0
        };

        adminData.templates.push(template);
        saveAdminData();
        closeModal();
        
        // Refresh table
        renderTemplatesTable();
        
        window.auth?.showNotification('Template added successfully!', 'success');
    }

    function renderTemplatesTable() {
        const tbody = document.querySelector('.templates-table tbody');
        if (!tbody) return;

        tbody.innerHTML = adminData.templates.map(template => `
            <tr>
                <td>${template.id}</td>
                <td>${template.name}</td>
                <td>${template.category}</td>
                <td>$${template.price}</td>
                <td>${template.downloads}</td>
                <td>
                    <button class="btn-icon" onclick="editTemplate(${template.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteTemplate(${template.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function editTemplate(id) {
        const template = adminData.templates.find(t => t.id === id);
        if (!template) return;

        // Similar to add but pre-filled
        window.auth?.showNotification('Edit functionality coming soon', 'info');
    }

    function deleteTemplate(id) {
        if (!confirm('Are you sure you want to delete this template?')) return;

        adminData.templates = adminData.templates.filter(t => t.id !== id);
        saveAdminData();
        renderTemplatesTable();
        window.auth?.showNotification('Template deleted', 'success');
    }

    // Project Management
    function showAddProjectModal() {
        const modal = createModal('Add New Project', `
            <form id="project-form" class="admin-form">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Client</label>
                    <input type="text" name="client" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category" required>
                        <option value="web development">Web Development</option>
                        <option value="design">Design</option>
                        <option value="consulting">Consulting</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Price ($)</label>
                    <input type="number" name="price" min="0" required>
                </div>
                <div class="form-group">
                    <label>Technologies (comma separated)</label>
                    <input type="text" name="technologies" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" required>
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Completion Date</label>
                    <input type="date" name="completionDate">
                </div>
                <button type="submit" class="btn btn-primary">Add Project</button>
            </form>
        `);
        document.body.appendChild(modal);
    }

    function handleProjectSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const project = {
            id: Date.now(),
            name: formData.get('name'),
            client: formData.get('client'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            technologies: formData.get('technologies').split(',').map(t => t.trim()),
            status: formData.get('status'),
            completionDate: formData.get('completionDate') || new Date().toISOString().split('T')[0],
            image: 'assets/images/projects/project1.png'
        };

        adminData.projects.push(project);
        saveAdminData();
        closeModal();
        renderProjectsTable();
        
        window.auth?.showNotification('Project added successfully!', 'success');
    }

    function renderProjectsTable() {
        const tbody = document.querySelector('.projects-table tbody');
        if (!tbody) return;

        tbody.innerHTML = adminData.projects.map(project => `
            <tr>
                <td>${project.id}</td>
                <td>${project.name}</td>
                <td>${project.client}</td>
                <td><span class="status ${project.status}">${project.status}</span></td>
                <td>$${project.price}</td>
                <td>
                    <button class="btn-icon" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function editProject(id) {
        window.auth?.showNotification('Edit functionality coming soon', 'info');
    }

    function deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        adminData.projects = adminData.projects.filter(p => p.id !== id);
        saveAdminData();
        renderProjectsTable();
        window.auth?.showNotification('Project deleted', 'success');
    }

    // User Management
    function renderUsersTable() {
        const tbody = document.querySelector('.users-table tbody');
        if (!tbody) return;

        tbody.innerHTML = adminData.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role ${user.role}">${user.role}</span></td>
                <td>${formatDate(user.joinedAt)}</td>
                <td>
                    <button class="btn-icon" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        adminData.users = adminData.users.filter(u => u.id !== id);
        saveAdminData();
        renderUsersTable();
        window.auth?.showNotification('User deleted', 'success');
    }

    // Message Management
    function renderMessagesList() {
        const container = document.querySelector('.messages-list');
        if (!container) return;

        container.innerHTML = adminData.messages.map(msg => `
            <div class="message-item">
                <div class="message-header">
                    <h4>${msg.name}</h4>
                    <span class="date">${formatDate(msg.date)}</span>
                </div>
                <p>${msg.message}</p>
                <button class="btn btn-small" onclick="replyToMessage(${msg.id})">Reply</button>
            </div>
        `).join('');
    }

    function replyToMessage(id) {
        window.auth?.showNotification('Reply functionality coming soon', 'info');
    }

    // Utility functions
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        return modal;
    }

    function closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    function formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    }

    // Export functions
    window.adminPanel = {
        init: initAdmin,
        editTemplate,
        deleteTemplate,
        editProject,
        deleteProject,
        deleteUser,
        replyToMessage
    };

    // Make functions globally available
    window.editTemplate = editTemplate;
    window.deleteTemplate = deleteTemplate;
    window.editProject = editProject;
    window.deleteProject = deleteProject;
    window.deleteUser = deleteUser;
    window.replyToMessage = replyToMessage;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdmin);
    } else {
        initAdmin();
    }
})();