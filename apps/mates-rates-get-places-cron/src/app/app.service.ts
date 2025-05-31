import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EnvConfigService } from '@mates-rates/env-config';
import { Logger } from '@mates-rates/logger';

@Injectable()
export class AppService {
  constructor(private env: EnvConfigService, private logger: Logger) {}

  async fetchAndMapPlaces(): Promise<any> {
    try {
      console.log('Entering fetch map places');
      const sydneyBarsQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      node["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      way["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["website"](around:10000,-33.8688,151.2093);
      relation["amenity"~"bar|pub"]["contact:website"](around:10000,-33.8688,151.2093);
    );
    out center;
  `;

      const res = await axios.post(
        'https://overpass-api.de/api/interpreter',
        sydneyBarsQuery,
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );

      const elements = res.data.elements;

      const cleaned = elements.map((el: any) => ({
        id: el.id,
        name: el.tags?.name,
        website: el.tags?.website || el.tags?.['contact:website'],
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        tags: el.tags,
      }));

      this.logger.log(
        `Fetched ${cleaned.length} bars/pubs with websites in Sydney:`
      );

      return cleaned;
    } catch (err) {
      console.error('Error has occured', err);
      throw err;
    }
  }
}
