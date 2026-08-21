import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

let appPromise: Promise<NestExpressApplication> | undefined;

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Trabalharn API')
      .setDescription('Documentação dos endpoints da Trabalharn')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.init();
  return app;
}

function ensureBootstrapped(): Promise<NestExpressApplication> {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  return appPromise;
}

// `dist/main.js` is required (not executed as the entry script) by Vercel's
// @vercel/node runtime, which calls the exported handler per request instead
// of relying on a long-lived `app.listen()` server.
if (require.main === module) {
  ensureBootstrapped().then((app) => app.listen(process.env.PORT ?? 3001));
}

export default async function handler(req: Request, res: Response) {
  const app = await ensureBootstrapped();
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance(req, res);
}
