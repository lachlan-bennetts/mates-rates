import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Bar } from './Bar.entity';
import { ScrapeDatum } from './ScrapeInfo';

export enum dealCategory {
  happyHour = 'HAPPY_HOUR',
  twoForOne = '2FOR1',
  event = 'EVENT',
  foodSpecial = 'FOODSPECIAL',
}

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: dealCategory })
  category!: dealCategory;

  @Column({ type: 'decimal', nullable: true })
  price!: number;

  @Column({ type: 'date', nullable: true })
  validTo!: Date;

  @Column({ type: 'varchar', length: 510 })
  sourceUrl?: string;

  @Column({ type: 'varchar', length: 510 })
  imageUrl?: string;

  @Column('text', { array: true })
  daysActive!: number[];

  @OneToOne(() => ScrapeDatum, (scrapeDatum) => scrapeDatum.deal, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn() // This sets the owning side and creates the foreign key
  scrapeDatum!: ScrapeDatum;

  @ManyToOne(() => Bar, (bar) => bar.deals)
  Bar!: Bar;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at!: Date;
}
