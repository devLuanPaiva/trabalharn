import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'job_openings' })
export class JobOpening {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'requirements', type: 'text', nullable: true })
  requirements: string | null;

  @Column({ name: 'wage', type: 'varchar', length: 120, nullable: true })
  wage: string | null;

  @Column({
    name: 'working_hours',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  workingHours: string | null;

  @Index()
  @Column({
    name: 'contract_type',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  contractType: string | null;

  @Index()
  @Column({ name: 'location', type: 'varchar', length: 160, nullable: true })
  location: string | null;

  @Column({
    name: 'company_name',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  companyName: string | null;

  @Column({
    name: 'company_email',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  companyEmail: string | null;

  @Column({
    name: 'company_contact',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  companyContact: string | null;

  @Index()
  @Column({ name: 'source', type: 'varchar', length: 80 })
  source: string;

  @Column({ name: 'external_id', type: 'varchar', length: 120, nullable: true })
  externalId: string | null;

  @Column({ name: 'post_url', type: 'varchar', length: 2048 })
  postUrl: string;

  @Column({ name: 'hash', type: 'varchar', length: 64, unique: true })
  hash: string;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  @Column({
    name: 'facebook_post_id',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  facebookPostId: string | null;

  @Column({
    name: 'instagram_media_id',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  instagramMediaId: string | null;

  /**
   * Snapshot of the JobPostingDto sent to /post-generator/generate at
   * ingestion time, replayed by the publish queue — which can run hours
   * after ingestion — so the art/caption stay reproducible without
   * re-deriving them from the (possibly since-changed) source portal data.
   */
  @Column({
    name: 'post_generator_payload',
    type: 'jsonb',
    nullable: true,
  })
  postGeneratorPayload: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
