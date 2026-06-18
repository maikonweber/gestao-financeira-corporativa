import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: PinoLogger);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: PinoLogger);
    catch(exception: unknown, host: ArgumentsHost): void;
}
