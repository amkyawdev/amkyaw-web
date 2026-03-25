// Docs API for AmkyawDev
const express = require('express');
const router = express.Router();

// In-memory storage
let docs = [
    {
        id: 1,
        title: "Getting Started with Templates",
        category: "tutorial",
        content: "Step by step guide to install and customize templates...",
        author: "AmkyawDev",
        date: "2024-01-10",
        tags: ["tutorial", "beginner"],
        readTime: 5
    }
];

// GET all docs
router.get('/', (req, res) => {
    res.json(docs);
});

// GET doc by ID
router.get('/:id', (req, res) => {
    const doc = docs.find(d => d.id === parseInt(req.params.id));
    if (!doc) {
        return res.status(404).json({ error: 'Doc not found' });
    }
    res.json(doc);
});

// GET docs by category
router.get('/category/:category', (req, res) => {
    const filtered = docs.filter(d => d.category === req.params.category);
    res.json(filtered);
});

// POST new doc
router.post('/', (req, res) => {
    const newDoc = {
        id: docs.length + 1,
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    docs.push(newDoc);
    res.status(201).json(newDoc);
});

// PUT update doc
router.put('/:id', (req, res) => {
    const index = docs.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Doc not found' });
    }
    docs[index] = { ...docs[index], ...req.body };
    res.json(docs[index]);
});

// DELETE doc
router.delete('/:id', (req, res) => {
    const index = docs.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Doc not found' });
    }
    docs.splice(index, 1);
    res.status(204).send();
});

module.exports = router;