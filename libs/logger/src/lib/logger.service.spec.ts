import { Logger } from './logger.service';

describe('Logger', () => {
  let logger: Logger;
  let mockWinstonLogger: any;
  let mockRequestContext: any;

  beforeEach(() => {
    mockWinstonLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockRequestContext = {
      getCorrelationId: jest.fn().mockReturnValue(undefined),
    };

    jest
      .spyOn(require('winston'), 'createLogger')
      .mockReturnValue(mockWinstonLogger);

    logger = new Logger(mockRequestContext);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call info on log()', () => {
    logger.log('test message', 'ctx');
    expect(mockWinstonLogger.info).toHaveBeenCalledWith('test message', {
      furtherContext: 'ctx',
    });
  });

  it('should call error on error()', () => {
    logger.error('err message', 'trace', 'ctx');
    expect(mockWinstonLogger.error).toHaveBeenCalledWith(
      'err message',
      { trace: 'trace' },
      { furtherContext: 'ctx' }
    );
  });

  it('should call warn on warn()', () => {
    logger.warn('warn message', 'ctx');
    expect(mockWinstonLogger.warn).toHaveBeenCalledWith('warn message', {
      furtherContext: 'ctx',
    });
  });

  it('should call debug on debug()', () => {
    logger.debug('debug message', 'ctx');
    expect(mockWinstonLogger.debug).toHaveBeenCalledWith('debug message', {
      furtherContext: 'ctx',
    });
  });

  it('should append correlation id if present', () => {
    mockRequestContext.getCorrelationId.mockReturnValue('abc-123');
    logger = new Logger(mockRequestContext);
    logger.log('msg');
    expect(mockWinstonLogger.info).toHaveBeenCalledWith('msg | abc-123', {
      furtherContext: undefined,
    });
  });
});
