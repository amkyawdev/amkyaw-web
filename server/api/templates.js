// Templates API for AmkyawDev
const express = require('express');
const router = express.Router();

// In-memory storage (would be database in production)
let templates = [
    {
        id: 1,
        name: "Portfolio Pro",
        price: 10,
        image: "assets/images/templates/p1.png",
        category: "portfolio",
        description: "Modern portfolio template with 3D effects",
        features: ["Responsive", "3D Animation", "Dark Mode"],
        demoUrl: "https://demo.portfolio-pro.com",
        createdAt: "2024-01-01",
        downloads: 150
    },
    {
        id: 2,
        name: "Ecommerce Elite",
        price: 25,
        image: "assets/images/templates/p2.png",
        category: "ecommerce",
        description: "Powerful ecommerce template with admin panel",
        features: ["Shopping Cart", "Payment Gateway", "Admin Dashboard"],
        demoUrl: "https://demo.ecommerce-elite.com",
        createdAt: "2024-01-15",
        downloads: 89
    }
];

// GET all templates
router.get('/', (req, res) => {
    res.json(templates);
});

// GET template by ID
router.get('/:id', (req, res) => {
    const template = templates.find(t => t.id === parseInt(req.params.id));
    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
});

// GET templates by category
router.get('/category/:category', (req, res) => {
    const filtered = templates.filter(t => t.category === req.params.category);
    res.json(filtered);
});

// POST new template
router.post('/', (req, res) => {
    const newTemplate = {
        id: templates.length + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        downloads: 0
    };
    templates.push(newTemplate);
    res.status(201).json(newTemplate);
});

// PUT update template
router.put('/:id', (req, res) => {
    const index = templates.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Template not found' });
    }
    templates[index] = { ...templates[index], ...req.body };
    res.json(templates[index]);
});

// DELETE template
router.delete('/:id', (req, res) => {
    const index = templates.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Template not found' });
    }
    templates.splice(index, 1);
    res.status(204).send();
});

// POST download template
router.post('/:id/download', (req, res) => {
    const template = templates.find(t => t.id === parseInt(req.params.id));
    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }
    template.downloads++;
    res.json({ success: true, downloads: template.downloads });
});

module.exports = router;