import { Controller, Get } from '@nestjs/common';
import { Logger } from '@mates-rates/logger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: Logger
  ) {}

  @Get()
  saveSydneyBars() {
    try {
      this.logger.log('Beginning cronJob at saveSydneyBars.');
      return this.appService.fetchAndMapPlaces();
    } catch (err) {
      this.logger.error('Error has occured at the controller level.');
    }
  }
}
