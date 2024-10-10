import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { ValidationFailException } from '@/common/exceptions/validation-fail.exception';
import { Env } from '@/env';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('NestApplication');
  const config = app.get(ConfigService<Env, true>);

  app.enableCors();
  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      transformOptions: {
        exposeDefaultValues: true,
      },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => new ValidationFailException(errors),
    }),
  );

  const swaggerEnabled = config.get('SWAGGER_ENABLED');

  if (swaggerEnabled) {
    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('datnt aws')
          .setDescription('')
          .setVersion('1.0')
          .addBearerAuth()
          .build(),
      ),
    );
  }

  await app.listen(config.get('PORT'), config.get('HOST'));
  logger.log(`Server is running at ${await app.getUrl()}`);

  if (swaggerEnabled) {
    logger.log(`Swagger is serving at ${await app.getUrl()}/docs`);
  }
})();
