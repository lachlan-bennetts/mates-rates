import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EnvConfigModule } from '@mates-rates/env-config';

@Global()
@Module({
  imports: [EnvConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
