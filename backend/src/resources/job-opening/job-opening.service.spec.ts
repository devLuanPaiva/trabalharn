import { ConflictException, NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { FindJobOpeningsQueryDto } from './dto/find-job-openings-query.dto';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningRepository } from './job-opening.repository';
import { JobOpeningService } from './job-opening.service';

describe('JobOpeningService', () => {
  function buildJobOpening(overrides: Partial<JobOpening> = {}): JobOpening {
    return {
      id: 'a3f0c2f0-1111-4a2b-9c3d-000000000001',
      title: 'Auxiliar Administrativo',
      description: null,
      requirements: null,
      wage: null,
      workingHours: null,
      contractType: null,
      location: null,
      companyName: null,
      companyEmail: null,
      companyContact: null,
      source: 'gupy',
      externalId: null,
      postUrl: 'https://exemplo.com/vaga/1',
      hash: 'hash-1',
      publishedAt: null,
      facebookPostId: null,
      instagramMediaId: null,
      postGeneratorPayload: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      ...overrides,
    };
  }

  function buildCreateDto(
    overrides: Partial<CreateJobOpeningDto> = {},
  ): CreateJobOpeningDto {
    const dto = new CreateJobOpeningDto();
    dto.title = 'Auxiliar Administrativo';
    dto.source = 'gupy';
    dto.hash = 'hash-1';
    dto.postUrl = 'https://exemplo.com/vaga/1';
    return Object.assign(dto, overrides);
  }

  function buildRepositoryMock() {
    return {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByHash: jest.fn(),
      findBySourceAndExternalId: jest.fn(),
      findNextUnpublished: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<JobOpeningRepository>;
  }

  describe('create', () => {
    it('creates a job opening when the hash is not already taken', async () => {
      const repository = buildRepositoryMock();
      const dto = buildCreateDto();
      const created = buildJobOpening();
      repository.findByHash.mockResolvedValue(null);
      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);
      const service = new JobOpeningService(repository);

      const result = await service.create(dto);

      expect(repository.findByHash).toHaveBeenCalledWith(dto.hash);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });

    it('throws ConflictException when a job opening with the same hash exists', async () => {
      const repository = buildRepositoryMock();
      const dto = buildCreateDto();
      repository.findByHash.mockResolvedValue(buildJobOpening());
      const service = new JobOpeningService(repository);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('creates a job opening when externalId is provided and not already taken', async () => {
      const repository = buildRepositoryMock();
      const dto = buildCreateDto({ externalId: '908125' });
      const created = buildJobOpening({ externalId: '908125' });
      repository.findByHash.mockResolvedValue(null);
      repository.findBySourceAndExternalId.mockResolvedValue(null);
      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);
      const service = new JobOpeningService(repository);

      const result = await service.create(dto);

      expect(repository.findBySourceAndExternalId).toHaveBeenCalledWith(
        'gupy',
        '908125',
      );
      expect(result).toBe(created);
    });

    it('throws ConflictException when the (source, externalId) pair already exists', async () => {
      const repository = buildRepositoryMock();
      const dto = buildCreateDto({ externalId: '908125' });
      repository.findByHash.mockResolvedValue(null);
      repository.findBySourceAndExternalId.mockResolvedValue(
        buildJobOpening({ externalId: '908125' }),
      );
      const service = new JobOpeningService(repository);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('skips the externalId check when externalId is not provided', async () => {
      const repository = buildRepositoryMock();
      const dto = buildCreateDto();
      const created = buildJobOpening();
      repository.findByHash.mockResolvedValue(null);
      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);
      const service = new JobOpeningService(repository);

      await service.create(dto);

      expect(repository.findBySourceAndExternalId).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('paginates and builds the where clause from the provided filters', async () => {
      const repository = buildRepositoryMock();
      const jobOpening = buildJobOpening();
      repository.findAndCount.mockResolvedValue([[jobOpening], 1]);
      const service = new JobOpeningService(repository);
      const query: FindJobOpeningsQueryDto = {
        page: 2,
        limit: 10,
        source: 'gupy',
        contractType: 'CLT',
        search: 'auxiliar',
      };

      const result = await service.findAll(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {
          source: 'gupy',
          contractType: 'CLT',
          title: ILike('%auxiliar%'),
        },
        order: { publishedAt: 'DESC', createdAt: 'DESC' },
        skip: 10,
        take: 10,
      });
      expect(result).toEqual({
        items: [jobOpening],
        total: 1,
        page: 2,
        limit: 10,
      });
    });

    it('builds an empty where clause when no filters are provided', async () => {
      const repository = buildRepositoryMock();
      repository.findAndCount.mockResolvedValue([[], 0]);
      const service = new JobOpeningService(repository);
      const query: FindJobOpeningsQueryDto = { page: 1, limit: 20 };

      await service.findAll(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { publishedAt: 'DESC', createdAt: 'DESC' },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('findNextUnpublished', () => {
    it('returns the job opening from the repository', async () => {
      const repository = buildRepositoryMock();
      const jobOpening = buildJobOpening();
      repository.findNextUnpublished.mockResolvedValue(jobOpening);
      const service = new JobOpeningService(repository);

      const result = await service.findNextUnpublished();

      expect(result).toBe(jobOpening);
    });

    it('returns null when nothing is pending', async () => {
      const repository = buildRepositoryMock();
      repository.findNextUnpublished.mockResolvedValue(null);
      const service = new JobOpeningService(repository);

      const result = await service.findNextUnpublished();

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('returns the job opening when found', async () => {
      const repository = buildRepositoryMock();
      const jobOpening = buildJobOpening();
      repository.findById.mockResolvedValue(jobOpening);
      const service = new JobOpeningService(repository);

      const result = await service.findOne(jobOpening.id);

      expect(result).toBe(jobOpening);
    });

    it('throws NotFoundException when the job opening does not exist', async () => {
      const repository = buildRepositoryMock();
      repository.findById.mockResolvedValue(null);
      const service = new JobOpeningService(repository);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates and returns the job opening when it exists', async () => {
      const repository = buildRepositoryMock();
      const jobOpening = buildJobOpening();
      const updated = buildJobOpening({ wage: 'R$ 1.800,00' });
      repository.findById.mockResolvedValue(jobOpening);
      repository.update.mockResolvedValue(updated);
      const service = new JobOpeningService(repository);

      const result = await service.update(jobOpening.id, {
        wage: 'R$ 1.800,00',
      });

      expect(repository.update).toHaveBeenCalledWith(jobOpening.id, {
        wage: 'R$ 1.800,00',
      });
      expect(result).toBe(updated);
    });

    it('throws NotFoundException when updating a job opening that does not exist', async () => {
      const repository = buildRepositoryMock();
      repository.findById.mockResolvedValue(null);
      const service = new JobOpeningService(repository);

      await expect(
        service.update('missing-id', { wage: 'R$ 1.800,00' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the job opening when it exists', async () => {
      const repository = buildRepositoryMock();
      const jobOpening = buildJobOpening();
      repository.findById.mockResolvedValue(jobOpening);
      const service = new JobOpeningService(repository);

      await service.remove(jobOpening.id);

      expect(repository.delete).toHaveBeenCalledWith(jobOpening.id);
    });

    it('throws NotFoundException when removing a job opening that does not exist', async () => {
      const repository = buildRepositoryMock();
      repository.findById.mockResolvedValue(null);
      const service = new JobOpeningService(repository);

      await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
