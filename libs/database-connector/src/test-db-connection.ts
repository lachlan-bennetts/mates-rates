import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from '@mates-rates/logger';

@Injectable()
export class DbConnectionTester implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private logger: Logger
  ) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Database connection successful.');
    } catch (error) {
      this.logger.error('❌ Failed to connect to the database.', error);
      throw error;
    }
  }
}
