import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Deal } from './Deal.entity';

@Entity()
export class ScrapeDatum {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { array: true })
  selector!: string;

  @Column('text')
  mapId!: string;

  @Column({ type: 'jsonb' })
  selectorMetadata!: {
    tagName: string;
    classList: string[];
    parentClass?: string[];
    textContent?: string;
  };

  @Column()
  sourceUrl!: string;

  @Column()
  imageUrl?: string;

  @OneToOne(() => Deal, (deal) => deal.scrapeDatum)
  deal!: Deal;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public lastScraped!: Date;
}
