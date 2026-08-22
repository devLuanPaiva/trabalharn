import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { FindJobOpeningsQueryDto } from './dto/find-job-openings-query.dto';
import { UpdateJobOpeningDto } from './dto/update-job-opening.dto';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningRepository } from './job-opening.repository';
import { PaginatedResult } from './types/paginated-result.type';

@Injectable()
export class JobOpeningService {
  constructor(private readonly jobOpeningRepository: JobOpeningRepository) {}

  async create(dto: CreateJobOpeningDto): Promise<JobOpening> {
    const existingByHash = await this.jobOpeningRepository.findByHash(dto.hash);
    if (existingByHash) {
      throw new ConflictException(
        `Job opening with hash "${dto.hash}" already exists`,
      );
    }

    if (dto.externalId) {
      const existingByExternalId =
        await this.jobOpeningRepository.findBySourceAndExternalId(
          dto.source,
          dto.externalId,
        );
      if (existingByExternalId) {
        throw new ConflictException(
          `Job opening from source "${dto.source}" with externalId "${dto.externalId}" already exists`,
        );
      }
    }

    const jobOpening = this.jobOpeningRepository.create(dto);
    return this.jobOpeningRepository.save(jobOpening);
  }

  async findAll(
    query: FindJobOpeningsQueryDto,
  ): Promise<PaginatedResult<JobOpening>> {
    const { page, limit, source, contractType, search } = query;

    const where: FindOptionsWhere<JobOpening> = {};
    if (source) {
      where.source = source;
    }
    if (contractType) {
      where.contractType = contractType;
    }
    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const [items, total] = await this.jobOpeningRepository.findAndCount({
      where,
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  findNextUnpublished(): Promise<JobOpening | null> {
    return this.jobOpeningRepository.findNextUnpublished();
  }

  async findOne(id: string): Promise<JobOpening> {
    const jobOpening = await this.jobOpeningRepository.findById(id);
    if (!jobOpening) {
      throw new NotFoundException(`Job opening "${id}" not found`);
    }
    return jobOpening;
  }

  async update(id: string, dto: UpdateJobOpeningDto): Promise<JobOpening> {
    await this.findOne(id);
    const updated = await this.jobOpeningRepository.update(id, dto);
    return updated as JobOpening;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.jobOpeningRepository.delete(id);
  }
}
