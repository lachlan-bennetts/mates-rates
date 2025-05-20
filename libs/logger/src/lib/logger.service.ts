import { Injectable, LoggerService } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug?(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
