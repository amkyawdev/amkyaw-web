// Authentication Middleware for AmkyawDev

/**
 * Authentication middleware
 * Protects routes that require user authentication
 */
function authenticate(req, res, next) {
    // Check for auth token in headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'Please provide authentication credentials'
        });
    }
    
    // In production, verify the token with Firebase
    // For now, we'll accept a simple check
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;
    
    // Simple token validation (replace with real Firebase validation in production)
    if (!token || token.length < 10) {
        return res.status(401).json({ 
            error: 'Invalid token',
            message: 'The provided authentication token is invalid'
        });
    }
    
    // Attach user info to request
    req.user = {
        id: 'user-id-from-token',
        email: 'user@example.com',
        role: 'user'
    };
    
    next();
}

/**
 * Optional authentication middleware
 * Attaches user if token provided, but doesn't require it
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;
        
        if (token && token.length >= 10) {
            req.user = {
                id: 'user-id-from-token',
                email: 'user@example.com',
                role: 'user'
            };
        }
    }
    
    next();
}

/**
 * Rate limiting middleware
 * Simple rate limiting for auth endpoints
 */
function rateLimitAuth(req, res, next) {
    // In production, use a proper rate limiting solution
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Simple in-memory rate limiting
    if (!rateLimitAuth.cache) {
        rateLimitAuth.cache = new Map();
    }
    
    const attempts = rateLimitAuth.cache.get(ip) || { count: 0, firstAttempt: now };
    
    // Reset after 15 minutes
    if (now - attempts.firstAttempt > 15 * 60 * 1000) {
        attempts.count = 0;
        attempts.firstAttempt = now;
    }
    
    attempts.count++;
    rateLimitAuth.cache.set(ip, attempts);
    
    // Allow 5 attempts per 15 minutes
    if (attempts.count > 5) {
        return res.status(429).json({
            error: 'Too many attempts',
            message: 'Please try again later'
        });
    }
    
    next();
}

module.exports = {
    authenticate,
    optionalAuth,
    rateLimitAuth
};