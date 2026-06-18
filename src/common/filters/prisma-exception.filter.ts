import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Response } from 'express';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(PrismaExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException:
      | BadRequestException
      | ConflictException
      | NotFoundException;

    switch (exception.code) {
      case 'P2002':
        httpException = new ConflictException('Resource already exists');
        break;
      case 'P2003':
        httpException = new ConflictException(
          'Cannot delete or update resource because it is referenced by other records',
        );
        break;
      case 'P2020':
        httpException = new BadRequestException(
          'Value is out of range for one or more fields',
        );
        break;
      case 'P2025':
        httpException = new NotFoundException('Resource not found');
        break;
      default:
        this.logger.error(
          {
            event: 'prisma.unhandled_error',
            code: exception.code,
            meta: exception.meta,
            message: exception.message,
          },
          'Unhandled Prisma error',
        );
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          timestamp: new Date().toISOString(),
        });
        return;
    }

    const status = httpException.getStatus();

    this.logger.warn(
      {
        event: 'prisma.known_error',
        code: exception.code,
        statusCode: status,
        message: httpException.message,
      },
      'Prisma known error handled',
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message: httpException.message,
      timestamp: new Date().toISOString(),
    });
  }
}
