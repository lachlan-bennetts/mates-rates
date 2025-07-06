import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Logger } from './logger.service';
import { RequestContext } from './request-context.service';
import { CorrelationIdMiddleware } from './correlation-id.middleware';

@Module({
  providers: [Logger, RequestContext],
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
