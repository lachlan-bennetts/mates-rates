import { redis } from './redis.service';

describe('redis', () => {
  it('should work', () => {
    expect(redis()).toEqual('redis');
  });
});
