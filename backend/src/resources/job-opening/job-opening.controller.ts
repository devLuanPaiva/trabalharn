import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { FindJobOpeningsQueryDto } from './dto/find-job-openings-query.dto';
import { UpdateJobOpeningDto } from './dto/update-job-opening.dto';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningService } from './job-opening.service';
import { PaginatedResult } from './types/paginated-result.type';

@ApiTags('job-openings')
@Controller('job-openings')
export class JobOpeningController {
  constructor(private readonly jobOpeningService: JobOpeningService) {}

  @Post()
  @ApiOperation({ summary: 'Create a job opening' })
  create(
    @Body() createJobOpeningDto: CreateJobOpeningDto,
  ): Promise<JobOpening> {
    return this.jobOpeningService.create(createJobOpeningDto);
  }

  @Get()
  @ApiOperation({ summary: 'List job openings' })
  findAll(
    @Query() query: FindJobOpeningsQueryDto,
  ): Promise<PaginatedResult<JobOpening>> {
    return this.jobOpeningService.findAll(query);
  }

  @Get('next-to-publish')
  @ApiOperation({
    summary:
      'Get the oldest job opening not yet posted to Facebook/Instagram, wrapped as { jobOpening: null } when the queue is empty',
  })
  async findNextUnpublished(): Promise<{ jobOpening: JobOpening | null }> {
    const jobOpening = await this.jobOpeningService.findNextUnpublished();
    return { jobOpening };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job opening by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<JobOpening> {
    return this.jobOpeningService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job opening' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobOpeningDto: UpdateJobOpeningDto,
  ): Promise<JobOpening> {
    return this.jobOpeningService.update(id, updateJobOpeningDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a job opening' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.jobOpeningService.remove(id);
  }
}
