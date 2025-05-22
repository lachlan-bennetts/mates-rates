import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class RequestContext {
  private readonly als = new AsyncLocalStorage<{ correlationId: string }>();

  run(correlationId: string, callback: () => void) {
    this.als.run({ correlationId }, callback);
  }

  getCorrelationId(): string | undefined {
    return this.als.getStore()?.correlationId;
  }
}
