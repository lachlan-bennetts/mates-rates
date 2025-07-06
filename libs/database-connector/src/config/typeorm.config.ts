import { EnvConfigService } from '@mates-rates/env-config';
import { DataSourceOptions } from 'typeorm';
import { Bar } from '../entities/Bar.entity';
import { Deal } from '../entities/Deal.entity';

const envConfig = new EnvConfigService();

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: String(envConfig.get('DB_HOST')),
  port: parseInt(envConfig.get('DB_PORT')),
  username: String(envConfig.get('DB_USER')),
  password: String(envConfig.get('DB_PASS')),
  database: String(envConfig.get('DB_NAME')),
  entities: [Bar, Deal],
  synchronize: false,
  logging: false,
};
