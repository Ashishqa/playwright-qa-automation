// ─── src/utils/logger.js ────────────────────────────

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

let loggerInstance = null;

const createLogger = (testName = 'default') => {
  if (!loggerInstance) {
    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${level.toUpperCase()}] [${testName}] ${message}`;
      })
    );

    loggerInstance = winston.createLogger({
      format,
      transports: [
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] [${level}] [${testName}] ${message}`;
            })
          )
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'test.log'),
          level: process.env.LOG_LEVEL || 'info'
        })
      ]
    });
  }

  return loggerInstance;
};

export { createLogger };
