import { Module } from '@nestjs/common';
import { PlacesCronController } from './placesCron.controller';
import { PlacesCronService } from './placesCron.service';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigModule } from '@mates-rates/env-config';
import { LoggerModule } from '@mates-rates/logger';
import { ScraperService } from './scraper.service';
import { DbModule } from '@mates-rates/database';

@Module({
  imports: [HttpModule, EnvConfigModule, LoggerModule, DbModule],
  controllers: [PlacesCronController],
  providers: [PlacesCronService, ScraperService],
})
export class AppModule {}
