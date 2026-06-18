import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: ConflictException | NotFoundException;

    switch (exception.code) {
      case 'P2002':
        httpException = new ConflictException('Resource already exists');
        break;
      case 'P2025':
        httpException = new NotFoundException('Resource not found');
        break;
      default:
        this.logger.error(`Prisma error ${exception.code}`, exception.message);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          timestamp: new Date().toISOString(),
        });
        return;
    }

    const status = httpException.getStatus();
    response.status(status).json({
      success: false,
      statusCode: status,
      message: httpException.message,
      timestamp: new Date().toISOString(),
    });
  }
}
