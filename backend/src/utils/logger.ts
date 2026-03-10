import config from '../config/environment.js';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private currentLevel: LogLevel = (config.logLevel as LogLevel) || 'info';

  private log(level: LogLevel, message: string, meta?: any) {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.currentLevel]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (meta) {
      console.log(`${prefix} ${message}`, meta);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
export default logger;
