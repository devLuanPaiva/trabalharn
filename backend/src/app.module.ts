import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { JobOpeningModule } from './resources/job-opening/job-opening.module';
import { PostGeneratorModule } from './resources/post-generator/post-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    DatabaseModule,
    PostGeneratorModule,
    JobOpeningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
