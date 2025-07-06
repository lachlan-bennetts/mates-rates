import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/typeorm.config';
import { BarRepository } from './repositories/Bar.repository';
import { DealRepository } from './repositories/Deal.repository';
import { DbConnectionTester } from './test-db-connection';
import { EnvConfigModule } from '@mates-rates/env-config';
import { LoggerModule } from '@mates-rates/logger';

@Module({
  providers: [
    BarRepository,
    DealRepository,
    DbConnectionTester,
    EnvConfigModule,
    LoggerModule,
  ],
  imports: [TypeOrmModule.forRoot(ormConfig)],
  exports: [TypeOrmModule, BarRepository, DealRepository],
})
export class DbModule {}
