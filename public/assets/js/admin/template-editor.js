// Template Editor for AmkyawDev Admin
(function() {
    // Editor state
    let currentTemplate = null;
    let unsavedChanges = false;

    // Initialize template editor
    function initTemplateEditor() {
        loadTemplateForEditing();
        setupEditorHandlers();
    }

    function loadTemplateForEditing() {
        // Check for template ID in URL
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('id');

        if (templateId) {
            // Load template data
            fetchTemplate(templateId);
        }
    }

    async function fetchTemplate(id) {
        // In real app, this would fetch from API
        const stored = localStorage.getItem('admin_templates');
        if (stored) {
            const templates = JSON.parse(stored);
            currentTemplate = templates.find(t => t.id === parseInt(id));
            
            if (currentTemplate) {
                populateEditor(currentTemplate);
            }
        }
    }

    function populateEditor(template) {
        // Fill form fields
        const fields = ['name', 'category', 'price', 'description', 'features', 'image', 'demoUrl'];
        
        fields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                if (field === 'features' && Array.isArray(template[field])) {
                    input.value = template[field].join(', ');
                } else {
                    input.value = template[field] || '';
                }
            }
        });

        // Mark as populated
        document.querySelector('.editor-container')?.classList.add('loaded');
    }

    function setupEditorHandlers() {
        // Auto-save indicator
        const form = document.querySelector('.template-editor-form');
        if (form) {
            form.addEventListener('input', () => {
                unsavedChanges = true;
                showUnsavedIndicator();
            });
        }

        // Preview button
        const previewBtn = document.querySelector('.preview-template');
        if (previewBtn) {
            previewBtn.addEventListener('click', previewTemplate);
        }

        // Save button
        const saveBtn = document.querySelector('.save-template');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveTemplate);
        }

        // Publish button
        const publishBtn = document.querySelector('.publish-template');
        if (publishBtn) {
            publishBtn.addEventListener('click', publishTemplate);
        }

        // Warn before leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    function showUnsavedIndicator() {
        let indicator = document.querySelector('.unsaved-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'unsaved-indicator';
            indicator.textContent = 'Unsaved changes';
            document.querySelector('.editor-header')?.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    function hideUnsavedIndicator() {
        const indicator = document.querySelector('.unsaved-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    function previewTemplate() {
        const formData = getFormData();
        
        // Open preview in new window
        const previewUrl = formData.demoUrl || '#';
        if (previewUrl !== '#') {
            window.open(previewUrl, '_blank');
        } else {
            window.auth?.showNotification('No demo URL set', 'error');
        }
    }

    async function saveTemplate() {
        const formData = getFormData();
        
        if (!validateForm(formData)) {
            window.auth?.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Save to localStorage
            const stored = localStorage.getItem('admin_templates');
            let templates = stored ? JSON.parse(stored) : [];

            const templateIndex = templates.findIndex(t => t.id === currentTemplate?.id);
            
            const templateData = {
                ...currentTemplate,
                ...formData,
                features: formData.features.split(',').map(f => f.trim()),
                updatedAt: new Date().toISOString()
            };

            if (templateIndex >= 0) {
                templates[templateIndex] = templateData;
            } else {
                templateData.id = Date.now();
                templateData.createdAt = new Date().toISOString();
                templateData.downloads = 0;
                templates.push(templateData);
            }

            localStorage.setItem('admin_templates', JSON.stringify(templates));
            
            unsavedChanges = false;
            hideUnsavedIndicator();
            
            window.auth?.showNotification('Template saved!', 'success');
            
            // Redirect after save
            setTimeout(() => {
                window.location.href = 'admin.html?tab=templates';
            }, 1500);
        } catch (error) {
            console.error('Save error:', error);
            window.auth?.showNotification('Error saving template', 'error');
        }
    }

    async function publishTemplate() {
        const formData = getFormData();
        
        if (!validateForm(formData)) {
            window.auth?.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Save first
            await saveTemplate();

            // Mark as published
            const stored = localStorage.getItem('admin_templates');
            let templates = JSON.parse(stored);
            
            const templateIndex = templates.findIndex(t => t.id === currentTemplate?.id);
            if (templateIndex >= 0) {
                templates[templateIndex].published = true;
                templates[templateIndex].publishedAt = new Date().toISOString();
                localStorage.setItem('admin_templates', JSON.stringify(templates));
            }

            window.auth?.showNotification('Template published!', 'success');
        } catch (error) {
            console.error('Publish error:', error);
            window.auth?.showNotification('Error publishing template', 'error');
        }
    }

    function getFormData() {
        const form = document.querySelector('.template-editor-form');
        if (!form) return {};

        const formData = new FormData(form);
        return {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')) || 0,
            description: formData.get('description'),
            features: formData.get('features') || '',
            image: formData.get('image') || 'assets/images/templates/p1.png',
            demoUrl: formData.get('demoUrl') || '#'
        };
    }

    function validateForm(data) {
        return data.name && data.category && data.price > 0 && data.description;
    }

    // Export functions
    window.templateEditor = {
        init: initTemplateEditor,
        saveTemplate,
        previewTemplate,
        publishTemplate
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTemplateEditor);
    } else {
        initTemplateEditor();
    }
})();