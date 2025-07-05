import { databaseConnector } from './database-connector';

describe('databaseConnector', () => {
  it('should work', () => {
    expect(databaseConnector()).toEqual('database-connector');
  });
});
