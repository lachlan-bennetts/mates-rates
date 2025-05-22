import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from './request-context.service';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly context: RequestContext) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // Example: Skip for health checks
    if (req.path === '/health') {
      return next();
    }

    const existingCorrelationId = req.headers['x-correlation-id'];
    const correlationId =
      typeof existingCorrelationId === 'string'
        ? existingCorrelationId
        : uuidv4();

    this.context.run(correlationId, () => next());
  }
}
