import winston from 'winston';
import config from './config.js';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
  },
};

winston.addColors(customLevels.colors);

export let logger;

if (config.environment === 'production') {
  logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ filename: './errors.log', level: 'error' }), 
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({ level: 'debug' }), 
    ],
  });
}

export default logger;