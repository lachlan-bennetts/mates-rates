import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigModule } from '@mates-rates/env-config';
import { LoggerModule } from '@mates-rates/logger';
import { ScraperService } from './scraper.service';

@Module({
  imports: [HttpModule, EnvConfigModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService, ScraperService],
})
export class AppModule {}
