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
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nestjs_pino_1 = require("nestjs-pino");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let httpException;
        switch (exception.code) {
            case 'P2002':
                httpException = new common_1.ConflictException('Resource already exists');
                break;
            case 'P2025':
                httpException = new common_1.NotFoundException('Resource not found');
                break;
            default:
                this.logger.error({
                    event: 'prisma.unhandled_error',
                    code: exception.code,
                    meta: exception.meta,
                    message: exception.message,
                }, 'Unhandled Prisma error');
                response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database error',
                    timestamp: new Date().toISOString(),
                });
                return;
        }
        const status = httpException.getStatus();
        this.logger.warn({
            event: 'prisma.known_error',
            code: exception.code,
            statusCode: status,
            message: httpException.message,
        }, 'Prisma known error handled');
        response.status(status).json({
            success: false,
            statusCode: status,
            message: httpException.message,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError),
    __param(0, (0, nestjs_pino_1.InjectPinoLogger)(PrismaExceptionFilter.name)),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map