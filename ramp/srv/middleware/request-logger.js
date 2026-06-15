const logger = require('./logger');

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, user, and query parameters
 */
module.exports = (req, res, next) => {
    const start = Date.now();

    // Intercept response.end to log response details
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - start;

        logger.log({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            user: req.user?.id || 'ANONYMOUS',
            userRole: req.user?.role || 'UNKNOWN',
            duration: `${duration}ms`,
            query: req.query,
            timestamp: new Date().toISOString()
        });

        originalEnd.call(this, chunk, encoding);
    };

    next();
};