// Projects API for AmkyawDev
const express = require('express');
const router = express.Router();

// In-memory storage
let projects = [
    {
        id: 1,
        name: "Corporate Website Redesign",
        client: "Tech Corp",
        price: 500,
        image: "assets/images/projects/project1.png",
        category: "web development",
        description: "Complete redesign of corporate website",
        technologies: ["React", "Node.js", "MongoDB"],
        completionDate: "2024-02-01",
        status: "completed"
    }
];

// GET all projects
router.get('/', (req, res) => {
    res.json(projects);
});

// GET project by ID
router.get('/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

// GET projects by status
router.get('/status/:status', (req, res) => {
    const filtered = projects.filter(p => p.status === req.params.status);
    res.json(filtered);
});

// POST new project
router.post('/', (req, res) => {
    const newProject = {
        id: projects.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    res.status(201).json(newProject);
});

// PUT update project
router.put('/:id', (req, res) => {
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
});

// DELETE project
router.delete('/:id', (req, res) => {
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    projects.splice(index, 1);
    res.status(204).send();
});

module.exports = router;