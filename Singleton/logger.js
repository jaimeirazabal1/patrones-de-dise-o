// logger.js
class Logger {
    constructor() {
        if (Logger.instance == null) {
            this.logs = [];
            Logger.instance = this;
        }
        return Logger.instance;
    }

    log(message) {
        this.logs.push(message);
        console.log(`Log: ${message}`);
    }

    printLogCount() {
        console.log(`${this.logs.length} Logs`);
    }
}

const logger = new Logger();
Object.freeze(logger);  // Previene modificaciones a la instancia

module.exports = logger;
