import { Test } from '@nestjs/testing';
import { PlacesCronService } from './placesCron.service';
import { EnvConfigService } from '@mates-rates/env-config';
import { Logger } from '@mates-rates/logger';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PlacesCronService', () => {
  let service: PlacesCronService;
  let logger: Logger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlacesCronService,
        {
          provide: EnvConfigService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get<PlacesCronService>(PlacesCronService);
    logger = moduleRef.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and map places correctly', async () => {
    const mockElements = [
      {
        id: 1,
        tags: { name: 'Bar One', website: 'https://barone.com' },
        lat: -33.87,
        lon: 151.21,
      },
      {
        id: 2,
        tags: { name: 'Pub Two', 'contact:website': 'https://pubtwo.com' },
        center: { lat: -33.88, lon: 151.22 },
      },
    ];
    mockedAxios.post.mockResolvedValueOnce({
      data: { elements: mockElements },
    });

    const result = await service.fetchAndMapPlaces();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://overpass-api.de/api/interpreter',
      expect.stringContaining('[out:json][timeout:25];'),
      { headers: { 'Content-Type': 'text/plain' } }
    );
    expect(result).toEqual([
      {
        id: 1,
        name: 'Bar One',
        website: 'https://barone.com',
        lat: -33.87,
        lon: 151.21,
        tags: { name: 'Bar One', website: 'https://barone.com' },
      },
      {
        id: 2,
        name: 'Pub Two',
        website: 'https://pubtwo.com',
        lat: -33.88,
        lon: 151.22,
        tags: { name: 'Pub Two', 'contact:website': 'https://pubtwo.com' },
      },
    ]);
  });

  it('should throw and log error if axios fails', async () => {
    const error = new Error('Network error');
    mockedAxios.post.mockRejectedValueOnce(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(service.fetchAndMapPlaces()).rejects.toThrow('Network error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error has occured', error);

    consoleErrorSpy.mockRestore();
  });
});
