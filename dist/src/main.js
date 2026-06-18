"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
const cors_config_1 = require("./config/cors.config");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const configService = app.get(config_1.ConfigService);
    const logger = app.get(nestjs_pino_1.Logger);
    app.useLogger(logger);
    app.enableCors((0, cors_config_1.getCorsConfig)(configService));
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    (0, swagger_config_1.setupSwagger)(app);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log({
        event: 'app.bootstrap.success',
        port,
        environment: configService.get('NODE_ENV', 'development'),
        swagger: `http://localhost:${port}/api/docs`,
        apiPrefix: '/api/v1',
    }, 'Application started');
}
bootstrap();
//# sourceMappingURL=main.js.map