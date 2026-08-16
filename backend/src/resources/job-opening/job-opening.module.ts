import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOpening } from './entities/job-opening.entity';
import { JobOpeningController } from './job-opening.controller';
import { JobOpeningRepository } from './job-opening.repository';
import { JobOpeningService } from './job-opening.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobOpening])],
  controllers: [JobOpeningController],
  providers: [JobOpeningService, JobOpeningRepository],
  exports: [JobOpeningService],
})
export class JobOpeningModule {}
