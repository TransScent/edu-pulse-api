'use strict';

const path = require('path')
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

var util = require('util'),
  winston = require('winston'),
  production = (process.env.NODE_ENV || '').toLowerCase() === 'production';
var logger;

module.exports = {
  middleware: function (req, res, next) {
    console.info(req.method, req.url, res.statusCode);
    next();
  },
  production: production
};

var transport = new (winston.transports.DailyRotateFile)({
  filename: 'application-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '14d'
});
// Override the built-in console methods with winston hooks
switch ((process.env.NODE_ENV || '').toLowerCase()) {
  case 'production':
    production = true;
    logger = winston.createLogger({
      transports: [
        transport
      ],
      format: combine(
        label({ label: 'UTILITY_SERVICE' }),
        timestamp(),
        myFormat
      ),
      exitOnError: false, // do not exit on handled exceptions
    })
    break;
  case 'test':
    // Don't set up the logger overrides
    return;
  default:
    logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        transport
      ],
      format: combine(
        label({ label: 'UTILITY_SERVICE' }),
        timestamp(),
        myFormat
      ),
      exitOnError: false, // do not exit on handled exceptions
    })
    break;
}

function formatArgs(args) {
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function () {
  logger.info.apply(logger, formatArgs(arguments));
};
console.info = function () {
  logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function () {
  logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function () {
  logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function () {
  logger.debug.apply(logger, formatArgs(arguments));
};