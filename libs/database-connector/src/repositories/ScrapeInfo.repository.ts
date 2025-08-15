import { DeepPartial, Repository } from 'typeorm';
import { ScrapeInfo } from '../entities/ScrapeInfo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScrapeInfoRepository {
  constructor(
    @InjectRepository(ScrapeInfo)
    private readonly repository: Repository<ScrapeInfo>
  ) {}

  async findAll(): Promise<ScrapeInfo[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<ScrapeInfo | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: DeepPartial<ScrapeInfo>): Promise<ScrapeInfo> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(
    id: number,
    data: DeepPartial<ScrapeInfo>
  ): Promise<ScrapeInfo | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
