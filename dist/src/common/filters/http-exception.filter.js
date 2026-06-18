"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
let HttpExceptionFilter = class HttpExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const message = typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.message ??
                'Unexpected error';
        this.logger.warn({
            event: 'http.exception',
            statusCode: status,
            method: request.method,
            path: request.url,
            message,
        }, 'HTTP exception handled');
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Catch)(common_1.HttpException),
    __param(0, (0, nestjs_pino_1.InjectPinoLogger)(HttpExceptionFilter.name)),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], HttpExceptionFilter);
let AllExceptionsFilter = class AllExceptionsFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.message
            : 'Internal server error';
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error({
                event: 'http.unhandled_exception',
                statusCode: status,
                method: request.method,
                path: request.url,
                err: exception instanceof Error
                    ? { message: exception.message, stack: exception.stack }
                    : { message: String(exception) },
            }, 'Unhandled exception');
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Catch)(),
    __param(0, (0, nestjs_pino_1.InjectPinoLogger)(AllExceptionsFilter.name)),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map