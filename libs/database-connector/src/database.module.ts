import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/typeorm.config';
import { BarRepository } from './repositories/Bar.repository';
import { DealRepository } from './repositories/Deal.repository';
// import { DbConnectionTester } from './test-db-connection';
import { EnvConfigModule } from '@mates-rates/env-config';
import { LoggerModule } from '@mates-rates/logger';
import { Bar } from './entities/Bar.entity';
import { Deal } from './entities/Deal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([Bar, Deal]),
    EnvConfigModule,
    LoggerModule,
  ],
  providers: [BarRepository, DealRepository],
  exports: [TypeOrmModule, BarRepository, DealRepository],
})
export class DbModule {}
