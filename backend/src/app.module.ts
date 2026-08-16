import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostGeneratorModule } from './post-generator/post-generator.module';

@Module({
  imports: [PostGeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
