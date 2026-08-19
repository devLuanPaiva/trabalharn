import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          const url = new URL(databaseUrl);
          return {
            type: 'postgres' as const,
            host: url.hostname,
            port: Number.parseInt(url.port || '5432', 10),
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            schema: 'public',
            autoLoadEntities: true,
            entities: [__dirname + '/../**/*.entity.{ts,js}'],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: false,
            ssl: url.searchParams.get('sslmode') === 'require',
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          schema: 'public',
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity.{ts,js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: false,
          ssl: configService.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }