const cds = require('@sap/cds');
const logger = require('./logger');

/**
 * Global error handler middleware for CAP
 * Catches all errors and returns consistent error responses
 */
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    logger.error({
        statusCode,
        message,
        path: req.path,
        method: req.method,
        user: req.user?.id || 'ANONYMOUS',
        timestamp: new Date().toISOString(),
        stack: err.stack
    });

    // Return standardized error response
    res.status(statusCode).json({
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            timestamp: new Date().toISOString(),
            path: req.path
        }
    });
};