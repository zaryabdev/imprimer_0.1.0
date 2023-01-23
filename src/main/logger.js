const { format, createLogger, transports } = require('winston');

const { combine, timestamp, label, printf } = format;
const CATEGORY = ' ';
const DATE_TIME_FORMAT = 'MMM-DD-YYYY HH:mm:ss';
//Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
  // return `${timestamp} [${label}] ${level}: ${message}`;
  return `${message}`;
});

// transports: [new transports.Console()],
const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: 'mm:ss',
    }),
    customFormat
  ),
  transports: [
    new transports.File({
      level: 'debug',
      filename: 'logs/debug.log',
    }),
    new transports.File({
      level: 'error',
      filename: 'logs/error.log',
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
