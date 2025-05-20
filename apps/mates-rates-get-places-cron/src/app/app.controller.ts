import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  saveSydneyBars() {
    return this.appService.fetchAndMapPlaces();
  }

  @Get('/test')
  GetConfig() {
    return this.appService.GetApiKey();
  }
}
