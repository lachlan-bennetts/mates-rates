import { Controller, Get } from '@nestjs/common';
import { Logger } from '@mates-rates/logger';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scraperService: ScraperService,
    private logger: Logger
  ) {}

  @Get()
  saveSydneyBars() {
    try {
      this.logger.log('Beginning cronJob at saveSydneyBars.');
      return this.appService.fetchAndMapPlaces();
    } catch (err) {
      return this.logger.error(
        'Error has occured at the controller level.',
        err
      );
    }
  }

  @Get('/test')
  test() {
    try {
      this.logger.log('Testing...');
      return this.scraperService.scraper('Test');
    } catch (err) {
      return this.logger.error(
        'Error has occured at the controller level.',
        err
      );
    }
  }
}
