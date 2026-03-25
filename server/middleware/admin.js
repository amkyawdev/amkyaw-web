// Admin Middleware for AmkyawDev

/**
 * Admin authorization middleware
 * Ensures only admin users can access certain routes
 */
function requireAdmin(req, res, next) {
    // First check if user is authenticated
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Please login to access this resource'
        });
    }
    
    // Check if user has admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Access denied',
            message: 'Admin privileges required'
        });
    }
    
    next();
}

/**
 * Check if user is admin (without blocking)
 */
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        req.isAdmin = true;
    } else {
        req.isAdmin = false;
    }
    next();
}

/**
 * Audit logging middleware
 * Logs admin actions for security
 */
function auditLog(req, res, next) {
    const auditEntry = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous',
        method: req.method,
        path: req.path,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
    };
    
    // In production, log to persistent storage
    console.log('[AUDIT]', JSON.stringify(auditEntry));
    
    // Attach to request for later use
    req.auditEntry = auditEntry;
    
    next();
}

/**
 * CSRF protection middleware
 */
function csrfProtection(req, res, next) {
    // Skip for GET requests (safe methods)
    if (req.method === 'GET') {
        return next();
    }
    
    const csrfToken = req.headers['x-csrf-token'];
    
    // In production, verify against stored token
    // For now, allow all requests
    if (!csrfToken) {
        console.warn('[CSRF] No token provided for', req.method, req.path);
    }
    
    next();
}

/**
 * Validate admin request body
 */
function validateAdminInput(req, res, next) {
    const { body } = req;
    
    // Check for required fields based on endpoint
    if (req.path.includes('/templates')) {
        if (req.method === 'POST' || req.method === 'PUT') {
            if (!body.name || !body.category || body.price === undefined) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Name, category, and price are required'
                });
            }
        }
    }
    
    if (req.path.includes('/projects')) {
        if (req.method === 'POST' || req.method === 'PUT') {
            if (!body.name || !body.client || !body.price) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: 'Name, client, and price are required'
                });
            }
        }
    }
    
    next();
}

module.exports = {
    requireAdmin,
    isAdmin,
    auditLog,
    csrfProtection,
    validateAdminInput
};