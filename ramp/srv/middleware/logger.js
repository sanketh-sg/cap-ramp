const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

const logger = {
    log: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [INFO] ${JSON.stringify(message)}\n`;
        console.log(logMessage);
        fs.appendFileSync(logFile, logMessage);
    },

    error: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [ERROR] ${JSON.stringify(message)}\n`;
        console.error(logMessage);
        fs.appendFileSync(logFile, logMessage);
    },

    warn: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [WARN] ${JSON.stringify(message)}\n`;
        console.warn(logMessage);
        fs.appendFileSync(logFile, logMessage);
    },

    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [DEBUG] ${JSON.stringify(message)}\n`;
            console.log(logMessage);
            fs.appendFileSync(logFile, logMessage);
        }
    }
};

module.exports = logger;