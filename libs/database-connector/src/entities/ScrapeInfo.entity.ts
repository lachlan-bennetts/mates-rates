import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Deal } from './Deal.entity';

@Entity('scrape_infos')
export class ScrapeInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { array: true })
  selector!: string[];

  @Column({ type: 'jsonb' })
  selectorMetadata!: {
    tagName: string;
    classList: string[];
    parentClass?: string[];
    textContent?: string;
  };

  @OneToOne(() => Deal, (deal) => deal.scrapeDatum)
  deal!: Deal;

  @Column({ type: 'jsonb', nullable: true })
  evidenceSnippet?: { text?: string; html?: string };

  @Column({ type: 'varchar', length: 64, nullable: true })
  pageChecksum?: string; // e.g., SHA256 of raw HTML

  @Column({ type: 'varchar', length: 64, nullable: true })
  extractionEngine?: string;

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public lastScraped!: Date;
}
