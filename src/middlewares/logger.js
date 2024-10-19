const winston = require('winston');
// eslint-disable-next-line import/no-extraneous-dependencies
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const logDir = 'logs';
const errorLogDir = path.join(logDir, 'error');
const requestLogDir = path.join(logDir, 'request');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir);
}

if (!fs.existsSync(requestLogDir)) {
  fs.mkdirSync(requestLogDir);
}

const errorTransport = new DailyRotateFile({
  filename: path.join(errorLogDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '2k',
  maxFiles: '14d',
  auditFile: path.join(logDir, 'winston-error.json'),
});

const requestTransport = new DailyRotateFile({
  filename: path.join(requestLogDir, 'request-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '2k',
  maxFiles: '14d',
  auditFile: path.join(logDir, 'winston-request.json'),
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    errorTransport,
  ],
});

const errorLogger = (error) => {
  logger.error(`Error: ${error.message}`);
};

const reqLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    requestTransport,
  ],
});

const requestLogger = (req, res, next) => {
  const start = Date.now();
  reqLogger.info(`Incoming request: ${req.method} ${req.url}.`);
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    reqLogger.info(`Session ID: ${req.sessionID} | Response: ${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`);
  });

  next();
};

module.exports = {
  logger, requestLogger, errorLogger, reqLogger,
};
