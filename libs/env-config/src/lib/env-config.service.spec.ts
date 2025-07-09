import { EnvConfigService } from './env-config.service';

// Mock z.object by replacing the whole module
jest.mock('zod', () => ({
  z: {
    object: jest.fn().mockReturnValue({
      parse: jest.fn().mockReturnValue({
        DB_PORT: '9999',
        DB_HOST: 'mocked-host',
        DB_PASS: 'pass',
        DB_NAME: 'mocked-name',
        REDIS_HOST: 'mocked-red-host',
        REDIS_PORT: '0000',
        OPENAI_API_KEY: 'mocked-key',
      }),
    }),
    string: jest.fn().mockReturnValue({
      default: jest.fn().mockReturnThis(),
    }),
  },
}));

describe('EnvConfigService', () => {
  let envConfigService: EnvConfigService;

  beforeEach(() => {
    envConfigService = new EnvConfigService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return mocked DB_HOST', () => {
    expect(envConfigService.get('DB_HOST')).toBe('mocked-host');
  });

  it('should return mocked DB_PORT', () => {
    expect(envConfigService.get('DB_PORT')).toBe('9999');
  });

  it('should return mocked REDIS_HOST', () => {
    expect(envConfigService.get('REDIS_HOST')).toBe('mocked-red-host');
  });

  it('should return mocked OPENAI_API_KEY', () => {
    expect(envConfigService.get('OPENAI_API_KEY')).toBe('mocked-key');
  });

  it('should return undefined for unknown key', () => {
    // @ts-expect-error: Test required for edge case.
    expect(envConfigService.get('UNKNOWN_KEY')).toBeUndefined();
  });
});
