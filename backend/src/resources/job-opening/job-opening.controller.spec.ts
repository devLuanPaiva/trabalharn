import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { FindJobOpeningsQueryDto } from './dto/find-job-openings-query.dto';
import { UpdateJobOpeningDto } from './dto/update-job-opening.dto';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningController } from './job-opening.controller';
import { JobOpeningService } from './job-opening.service';
import { PaginatedResult } from './types/paginated-result.type';

describe('JobOpeningController', () => {
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

  function buildServiceMock() {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findNextUnpublished: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<JobOpeningService>;
  }

  it('delegates creation to the service', async () => {
    const service = buildServiceMock();
    const jobOpening = buildJobOpening();
    service.create.mockResolvedValue(jobOpening);
    const controller = new JobOpeningController(service);
    const dto = new CreateJobOpeningDto();

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(jobOpening);
  });

  it('delegates listing to the service', async () => {
    const service = buildServiceMock();
    const paginated: PaginatedResult<JobOpening> = {
      items: [buildJobOpening()],
      total: 1,
      page: 1,
      limit: 20,
    };
    service.findAll.mockResolvedValue(paginated);
    const controller = new JobOpeningController(service);
    const query: FindJobOpeningsQueryDto = { page: 1, limit: 20 };

    const result = await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toBe(paginated);
  });

  it('wraps the next unpublished job opening from the service', async () => {
    const service = buildServiceMock();
    const jobOpening = buildJobOpening();
    service.findNextUnpublished.mockResolvedValue(jobOpening);
    const controller = new JobOpeningController(service);

    const result = await controller.findNextUnpublished();

    expect(result).toEqual({ jobOpening });
  });

  it('wraps null when there is nothing left to publish', async () => {
    const service = buildServiceMock();
    service.findNextUnpublished.mockResolvedValue(null);
    const controller = new JobOpeningController(service);

    const result = await controller.findNextUnpublished();

    expect(result).toEqual({ jobOpening: null });
  });

  it('delegates find by id to the service', async () => {
    const service = buildServiceMock();
    const jobOpening = buildJobOpening();
    service.findOne.mockResolvedValue(jobOpening);
    const controller = new JobOpeningController(service);

    const result = await controller.findOne(jobOpening.id);

    expect(service.findOne).toHaveBeenCalledWith(jobOpening.id);
    expect(result).toBe(jobOpening);
  });

  it('delegates update to the service', async () => {
    const service = buildServiceMock();
    const jobOpening = buildJobOpening({ wage: 'R$ 1.800,00' });
    service.update.mockResolvedValue(jobOpening);
    const controller = new JobOpeningController(service);
    const dto: UpdateJobOpeningDto = { wage: 'R$ 1.800,00' };

    const result = await controller.update(jobOpening.id, dto);

    expect(service.update).toHaveBeenCalledWith(jobOpening.id, dto);
    expect(result).toBe(jobOpening);
  });

  it('delegates removal to the service', async () => {
    const service = buildServiceMock();
    service.remove.mockResolvedValue(undefined);
    const controller = new JobOpeningController(service);

    await controller.remove('some-id');

    expect(service.remove).toHaveBeenCalledWith('some-id');
  });
});
