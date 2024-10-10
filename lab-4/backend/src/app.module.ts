import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env';
import { AllExceptionFilter } from './common/exception-filters/all-exception.filter';
import { PrismaExceptionFilter } from './common/exception-filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ColumnModule } from './column/column.module';
import { ImageBackgroundModule } from './image-background/image-background.module';
import { UserModule } from './user/user.module';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: EnvSchema.parse,
      load: [appConfig],
    }),
    AuthModule,
    ColumnModule,
    ImageBackgroundModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
