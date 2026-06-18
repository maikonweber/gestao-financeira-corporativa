import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Corporate Finance API')
    .setDescription(
      [
        'API REST para **Gestão Financeira Corporativa**.',
        '',
        '## Autenticação',
        'Rotas protegidas exigem header `Authorization: Bearer <token>`.',
        'Obtenha o token via `POST /auth/login` ou `POST /auth/register`.',
        '',
        '## Isolamento de dados',
        'Cada usuário acessa exclusivamente suas categorias, transações e dashboard.',
        '',
        '## Formato de resposta',
        'Sucesso: `{ success, data, timestamp }`',
        'Erro: `{ success, statusCode, message, timestamp, path }`',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .setContact(
      'Engenharia de Software',
      'https://github.com/maikonweber',
      'maikonweber@gmail.com',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Informe o accessToken retornado no login ou registro',
      },
      'JWT-auth',
    )
    .addTag(
      'Auth',
      'Registro e autenticação de usuários. Endpoints públicos — não exigem JWT.',
    )
    .addTag(
      'Categories',
      'CRUD de categorias financeiras. Cada categoria pertence ao usuário autenticado.',
    )
    .addTag(
      'Transactions',
      'CRUD de transações (receitas e despesas) com paginação e filtros avançados.',
    )
    .addTag(
      'Dashboard',
      'Resumo financeiro consolidado calculado no backend.',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Corporate Finance API — Docs',
  });
}
