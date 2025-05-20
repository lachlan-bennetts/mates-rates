import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigModule } from '@mates-rates/env-config';

@Module({
  imports: [HttpModule, EnvConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
