import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnController } from './controllers/column.controller';
import { ColumnService } from './services/column.service';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env';
import { AllExceptionFilter } from './common/exception-filters/all-exception.filter';
import { PrismaExceptionFilter } from './common/exception-filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: EnvSchema.parse,
    }),
  ],
  controllers: [AppController, ColumnController],
  providers: [
    AppService,
    PrismaService,
    ColumnService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
