import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildPostgresConnectionOptions } from './typeorm-options.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildPostgresConnectionOptions({
          DB_HOST: configService.getOrThrow<string>('DB_HOST'),
          DB_PORT: configService.getOrThrow<number>('DB_PORT'),
          DB_USERNAME: configService.getOrThrow<string>('DB_USERNAME'),
          DB_PASSWORD: configService.getOrThrow<string>('DB_PASSWORD'),
          DB_NAME: configService.getOrThrow<string>('DB_NAME'),
          DB_SSL: configService.get<string>('DB_SSL'),
        }),
    }),
  ],
})
export class DatabaseModule {}
