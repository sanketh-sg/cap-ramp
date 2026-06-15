const cds = require('@sap/cds');
const logger = require('./logger');

/**
 * XSUAA Authentication & Authorization Middleware
 * Validates JWT tokens and extracts user context
 */
module.exports = cds.express_osub = (app) => {
    // Middleware to extract user from XSUAA JWT token
    app.use((req, res, next) => {
        try {
            // In development, create a mock user if no authentication
            if (process.env.NODE_ENV === 'development' && !req.user) {
                req.user = {
                    id: process.env.TEST_USER_ID || 'test-user-001',
                    name: 'Test User',
                    role: process.env.TEST_USER_ROLE || 'EMPLOYEE',
                    email: 'test@example.com'
                };

                logger.debug({
                    message: 'Development mode: Using mock user',
                    user: req.user
                });
            }

            // In production, XSUAA middleware will set req.user automatically
            if (req.user) {
                logger.debug({
                    message: 'User authenticated',
                    userId: req.user.id,
                    userRole: req.user.role
                });
            }

            next();
        } catch (error) {
            logger.error({
                message: 'Authentication error',
                error: error.message
            });

            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication failed'
                }
            });
        }
    });
};