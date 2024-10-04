import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

import { ValidationFailException } from '@/common/exceptions/validation-fail.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof ValidationFailException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    return response.status(status).json({
      timestamp: new Date().toISOString(),
      message: this.formatMessage(exception.message),
    });
  }

  private formatMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.map((msg) => this.formatMessage(msg)).join(`\n`);
    }

    if (message?.constructor === Object) {
      return Object.values(message as { [key: string]: unknown })
        .map((msg) => this.formatMessage(msg))
        .join(`\n`);
    }

    return '';
  }
}
