// app.js
const logger = require('./logger');

logger.log('This is the first log');
logger.printLogCount();  // 1 Logs

const anotherLogger = require('./logger');
anotherLogger.log('This is the second log');
anotherLogger.printLogCount();  // 2 Logs

console.log(logger === anotherLogger);  // true
