"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Corporate Finance API')
        .setDescription('REST API for Corporate Financial Management — users, categories, transactions and dashboard.')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth')
        .addTag('Categories')
        .addTag('Transactions')
        .addTag('Dashboard')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
//# sourceMappingURL=swagger.config.js.map