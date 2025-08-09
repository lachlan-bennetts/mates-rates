import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EnvConfigService } from '@mates-rates/env-config';
import { Logger } from '@mates-rates/logger';
import { BarRepository } from '@mates-rates/database';

@Injectable()
export class PlacesCronService {
  constructor(
    private env: EnvConfigService,
    private logger: Logger,
    private barRepository: BarRepository
  ) {}

  async fetchAndMapPlaces(): Promise<any> {
    try {
      console.log('Entering fetch map places');
      const sydneyBarsQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"bar|pub"]["website"](around:2000,-33.8688,151.2093);
      node["amenity"~"bar|pub"]["contact:website"](around:2000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["website"](around:2000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["contact:website"](around:2000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["website"](around:2000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["contact:website"](around:2000,-33.8688,151.2093);
    );
    out center;`;

      const res = await axios.post(
        'https://overpass-api.de/api/interpreter',
        sydneyBarsQuery,
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );

      const allBars = res.data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags?.name,
        website: el.tags?.website || el.tags?.['contact:website'],
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        tags: el.tags,
      }));

      this.logger.log(
        `Fetched ${allBars.length} bars/pubs with websites in Sydney:`
      );

      return allBars;
    } catch (err) {
      console.error('Error has occured', err);
      throw err;
    }
  }

  // Need method to
}
