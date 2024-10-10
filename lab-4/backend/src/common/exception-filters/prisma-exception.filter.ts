import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientKnownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logger.error(exception);

    const responseBody = {
      timestamp: new Date().toISOString(),
      message:
        'We encountered an unexpected error while processing your request. Please try again later.',
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
