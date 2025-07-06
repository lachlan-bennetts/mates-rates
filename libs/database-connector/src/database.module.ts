import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
  exports: [TypeOrmModule],
})
export class DbModule {}
