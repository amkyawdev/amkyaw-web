// Main Server Entry Point for AmkyawDev
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import API routes
const templatesRouter = require('./api/templates');
const projectsRouter = require('./api/projects');
const docsRouter = require('./api/docs');
const chatRouter = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/templates', templatesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/docs', docsRouter);
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`AmkyawDev server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;