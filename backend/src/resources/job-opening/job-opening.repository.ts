import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, IsNull, Repository } from 'typeorm';
import { JobOpening } from './entities/job-opening.entity';

@Injectable()
export class JobOpeningRepository {
  constructor(
    @InjectRepository(JobOpening)
    private readonly repository: Repository<JobOpening>,
  ) {}

  create(data: DeepPartial<JobOpening>): JobOpening {
    return this.repository.create(data);
  }

  save(jobOpening: JobOpening): Promise<JobOpening> {
    return this.repository.save(jobOpening);
  }

  findById(id: string): Promise<JobOpening | null> {
    return this.repository.findOneBy({ id });
  }

  findByHash(hash: string): Promise<JobOpening | null> {
    return this.repository.findOneBy({ hash });
  }

  findBySourceAndExternalId(
    source: string,
    externalId: string,
  ): Promise<JobOpening | null> {
    return this.repository.findOneBy({ source, externalId });
  }

  findNextUnpublished(): Promise<JobOpening | null> {
    return this.repository.findOne({
      where: [
        { facebookPostId: IsNull() },
        { instagramMediaId: IsNull() },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  findAndCount(
    options: FindManyOptions<JobOpening>,
  ): Promise<[JobOpening[], number]> {
    return this.repository.findAndCount(options);
  }

  async update(
    id: string,
    data: DeepPartial<JobOpening>,
  ): Promise<JobOpening | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
}
