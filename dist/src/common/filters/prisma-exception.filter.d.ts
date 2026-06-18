import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
export declare class PrismaExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
