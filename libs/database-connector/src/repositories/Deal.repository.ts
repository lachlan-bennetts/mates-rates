import { DeepPartial, Repository } from 'typeorm';
import { Deal } from '../entities/Deal.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DealRepository {
  constructor(
    @InjectRepository(Deal)
    private readonly repository: Repository<Deal>
  ) {}

  async findAll(): Promise<Deal[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Deal | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: DeepPartial<Deal>): Promise<Deal> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: DeepPartial<Deal>): Promise<Deal | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
