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
               const authHeader = req.headers.authorization || '';
                const testUser = authHeader.split(' ')[1] || 'employee';

                const mockUsers = {
                    employee: {
                        id: 'emp-001',
                        name: 'John Employee',
                        role: 'Employee',
                        email: 'john@company.com',
                        scopes: ['ramp-itil.employee']
                    },
                    agent: {
                        id: 'agt-001',
                        name: 'Alice Agent',
                        role: 'SupportAgent',
                        email: 'alice@company.com',
                        scopes: ['ramp-itil.support_agent']
                    },
                    manager: {
                        id: 'mgr-001',
                        name: 'Bob Manager',
                        role: 'AssetManager',
                        email: 'bob@company.com',
                        scopes: ['ramp-itil.asset_manager']
                    },
                    admin: {
                        id: 'adm-001',
                        name: 'Admin User',
                        role: 'Admin',
                        email: 'admin@company.com',
                        scopes: ['ramp-itil.admin']
                    }
                };

                req.user = mockUsers[testUser] || mockUsers.employee;

                logger.debug({
                    message: 'Development mode: Mock user',
                    user: req.user
                });
            }

            // Production: XSUAA middleware automatically sets req.user
            if (req.user) {
                // Extract roles from XSUAA scopes
                const scopes = req.user.scopes || [];
                req.user.roles = extractRolesFromScopes(scopes);

                logger.debug({
                    message: 'User authenticated',
                    userId: req.user.id,
                    userName: req.user.name,
                    roles: req.user.roles,
                    scopes: scopes
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

/**
 * Extract role-templates from XSUAA scopes
 */
function extractRolesFromScopes(scopes = []) {
    const roles = [];

    const scopeToRole = {
        'admin': 'Admin',
        'support_agent': 'SupportAgent',
        'asset_manager': 'AssetManager',
        'employee': 'Employee'
    };

    scopes.forEach(scope => {
        Object.entries(scopeToRole).forEach(([key, role]) => {
            if (scope.includes(key) && !roles.includes(role)) {
                roles.push(role);
            }
        });
    });

    return roles.length > 0 ? roles : ['Employee']; // Default to Employee
}