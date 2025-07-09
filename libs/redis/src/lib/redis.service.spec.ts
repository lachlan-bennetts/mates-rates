import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { EnvConfigService } from '@mates-rates/env-config';
import Redis from 'ioredis';

// Mock ioredis
jest.mock('ioredis');

describe('RedisService', () => {
  let service: RedisService;
  let redisMock: jest.Mocked<Redis>;
  let quitMock: jest.Mock;

  beforeEach(async () => {
    // Setup Redis mock
    quitMock = jest.fn();
    (Redis as unknown as jest.Mock).mockImplementation(() => ({
      on: jest.fn(),
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue('mocked-value'),
      del: jest.fn().mockResolvedValue(1),
      quit: quitMock,
    }));

    const envMock = {
      get: jest.fn((key: string) => {
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return '6379';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: EnvConfigService, useValue: envMock },
      ],
    }).compile();

    service = module.get(RedisService);
    await service.onModuleInit(); // manually trigger lifecycle
    redisMock = service.getRawClient() as jest.Mocked<Redis>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to Redis with env vars', () => {
    expect(Redis).toHaveBeenCalledWith({
      host: 'localhost',
      port: 6379,
    });
  });

  it('should call set without TTL', async () => {
    await service.set('key1', 'value1');
    expect(redisMock.set).toHaveBeenCalledWith('key1', 'value1');
  });

  it('should call set with TTL', async () => {
    await service.set('key2', 'value2', 60);
    expect(redisMock.set).toHaveBeenCalledWith('key2', 'value2', 'EX', 60);
  });

  it('should call get', async () => {
    const value = await service.get('key1');
    expect(value).toBe('mocked-value');
    expect(redisMock.get).toHaveBeenCalledWith('key1');
  });

  it('should call del', async () => {
    const result = await service.del('key1');
    expect(result).toBe(1);
    expect(redisMock.del).toHaveBeenCalledWith('key1');
  });

  it('should call quit on destroy', async () => {
    await service.onModuleDestroy();
    expect(redisMock.quit).toHaveBeenCalled();
  });
});
