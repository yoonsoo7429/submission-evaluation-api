import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'total_count' })
  totalCount: number;

  @Column({ name: 'success_count' })
  successCount: number;

  @Column({ name: 'fail_count' })
  failCount: number;
}
