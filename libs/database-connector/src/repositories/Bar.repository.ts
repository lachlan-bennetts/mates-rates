import { DeepPartial, Repository } from 'typeorm';
import { Bar } from '../entities/Bar.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BarRepository {
  constructor(
    @InjectRepository(Bar)
    private readonly repository: Repository<Bar>
  ) {}

  async findAll(): Promise<Bar[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Bar | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async findByMapId(mapId: string): Promise<boolean | null> {
    return this.repository.exists({
      where: {
        mapId: mapId,
      },
    });
  }

  async create(data: DeepPartial<Bar>): Promise<Bar> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<Bar>): Promise<Bar | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
