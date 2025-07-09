import { Injectable, LoggerService } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { RequestContext } from './request-context.service';

@Injectable()
export class Logger implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor(private readonly context: RequestContext) {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
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

  private format(message: string): string {
    const id = this.context.getCorrelationId();
    return id ? `${message} | ${id}` : message;
  }

  log(message: string, furtherContext?: string) {
    this.logger.info(this.format(message), { furtherContext });
  }

  error(message: string, trace?: any, furtherContext?: string) {
    this.logger.error(this.format(message), { trace }, { furtherContext });
  }

  warn(message: string, furtherContext?: string) {
    this.logger.warn(this.format(message), { furtherContext });
  }

  debug(message: string, furtherContext?: string) {
    this.logger.debug(this.format(message), { furtherContext });
  }
}
