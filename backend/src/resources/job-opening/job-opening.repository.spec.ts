import { IsNull, Repository } from 'typeorm';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningRepository } from './job-opening.repository';

describe('JobOpeningRepository', () => {
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

  function buildTypeOrmRepositoryMock() {
    return {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<JobOpening>>;
  }

  it('delegates create to the underlying repository', () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening();
    typeOrmRepository.create.mockReturnValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = repository.create({ title: 'Auxiliar Administrativo' });

    expect(typeOrmRepository.create).toHaveBeenCalledWith({
      title: 'Auxiliar Administrativo',
    });
    expect(result).toBe(jobOpening);
  });

  it('delegates save to the underlying repository', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening();
    typeOrmRepository.save.mockResolvedValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.save(jobOpening);

    expect(typeOrmRepository.save).toHaveBeenCalledWith(jobOpening);
    expect(result).toBe(jobOpening);
  });

  it('finds a job opening by id', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening();
    typeOrmRepository.findOneBy.mockResolvedValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findById(jobOpening.id);

    expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({
      id: jobOpening.id,
    });
    expect(result).toBe(jobOpening);
  });

  it('returns null when a job opening cannot be found by id', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    typeOrmRepository.findOneBy.mockResolvedValue(null);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findById('missing-id');

    expect(result).toBeNull();
  });

  it('finds a job opening by hash', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening({ hash: 'unique-hash' });
    typeOrmRepository.findOneBy.mockResolvedValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findByHash('unique-hash');

    expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({
      hash: 'unique-hash',
    });
    expect(result).toBe(jobOpening);
  });

  it('finds a job opening by source and externalId', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening({ externalId: '908125' });
    typeOrmRepository.findOneBy.mockResolvedValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findBySourceAndExternalId(
      'solides',
      '908125',
    );

    expect(typeOrmRepository.findOneBy).toHaveBeenCalledWith({
      source: 'solides',
      externalId: '908125',
    });
    expect(result).toBe(jobOpening);
  });

  it('returns null when no job opening matches source and externalId', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    typeOrmRepository.findOneBy.mockResolvedValue(null);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findBySourceAndExternalId(
      'solides',
      'missing',
    );

    expect(result).toBeNull();
  });

  it('finds the oldest job opening without a facebookPostId', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening();
    typeOrmRepository.findOne.mockResolvedValue(jobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findNextUnpublished();

    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
      where: [{ facebookPostId: IsNull() }, { instagramMediaId: IsNull() }],
      order: { createdAt: 'ASC' },
    });
    expect(result).toBe(jobOpening);
  });

  it('returns null when there is nothing pending to publish', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    typeOrmRepository.findOne.mockResolvedValue(null);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.findNextUnpublished();

    expect(result).toBeNull();
  });

  it('delegates findAndCount to the underlying repository', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const jobOpening = buildJobOpening();
    typeOrmRepository.findAndCount.mockResolvedValue([[jobOpening], 1]);
    const repository = new JobOpeningRepository(typeOrmRepository);
    const options = { where: { source: 'gupy' } };

    const [items, total] = await repository.findAndCount(options);

    expect(typeOrmRepository.findAndCount).toHaveBeenCalledWith(options);
    expect(items).toEqual([jobOpening]);
    expect(total).toBe(1);
  });

  it('updates a job opening and returns the refreshed entity', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    const updatedJobOpening = buildJobOpening({ wage: 'R$ 1.800,00' });
    typeOrmRepository.update.mockResolvedValue({ affected: 1 } as never);
    typeOrmRepository.findOneBy.mockResolvedValue(updatedJobOpening);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.update(updatedJobOpening.id, {
      wage: 'R$ 1.800,00',
    });

    expect(typeOrmRepository.update).toHaveBeenCalledWith(
      updatedJobOpening.id,
      { wage: 'R$ 1.800,00' },
    );
    expect(result).toBe(updatedJobOpening);
  });

  it('returns true when delete affects at least one row', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    typeOrmRepository.delete.mockResolvedValue({ affected: 1 } as never);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.delete('some-id');

    expect(typeOrmRepository.delete).toHaveBeenCalledWith('some-id');
    expect(result).toBe(true);
  });

  it('returns false when delete affects no rows', async () => {
    const typeOrmRepository = buildTypeOrmRepositoryMock();
    typeOrmRepository.delete.mockResolvedValue({ affected: 0 } as never);
    const repository = new JobOpeningRepository(typeOrmRepository);

    const result = await repository.delete('missing-id');

    expect(result).toBe(false);
  });
});
