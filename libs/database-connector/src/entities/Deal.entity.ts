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
import { ScrapeInfo } from './ScrapeInfo.entity';

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
  description!: string;

  @Column({ type: 'enum', enum: dealCategory })
  category!: dealCategory;

  @Column({
    type: 'decimal',
    nullable: true,
    transformer: {
      to: (v?: number) => v,
      from: (v?: string) => (v == null ? null : Number(v)),
    },
  })
  price!: number | null;

  @Column({ type: 'date', nullable: true })
  validTo!: Date;

  @Column({ type: 'varchar', length: 510 })
  sourceUrl?: string;

  @Column({ type: 'varchar', length: 510 })
  imageUrl?: string;

  @Column('int', { array: true })
  daysActive!: number[];

  @OneToOne(() => ScrapeInfo, (scrapeInfo) => scrapeInfo.deal, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn() // This sets the owning side and creates the foreign key
  scrapeDatum!: ScrapeInfo;

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
