import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  success!: false;
  statusCode!: number;
  message!: string | string[];
  timestamp!: string;
  path!: string;
}

export function ApiStandardErrors(
  ...statusCodes: Array<400 | 401 | 404 | 409 | 422 | 500>
): MethodDecorator {
  const defaults: Array<400 | 401 | 404 | 409 | 500> = [
    400, 401, 404, 409, 500,
  ];
  const codes = statusCodes.length > 0 ? statusCodes : defaults;

  const descriptions: Record<number, string> = {
    400: 'Requisição inválida — payload ou parâmetros incorretos',
    401: 'Não autenticado — token JWT ausente, inválido ou expirado',
    404: 'Recurso não encontrado ou não pertence ao usuário autenticado',
    409: 'Conflito — recurso já existe (ex.: e-mail duplicado)',
    422: 'Entidade não processável — falha de validação',
    500: 'Erro interno do servidor',
  };

  return applyDecorators(
    ...codes.map((status) =>
      ApiResponse({
        status,
        description: descriptions[status],
        schema: {
          example: {
            success: false,
            statusCode: status,
            message: descriptions[status],
            timestamp: '2024-06-18T12:00:00.000Z',
            path: '/api/v1/resource',
          },
        },
      }),
    ),
  );
}

export function ApiPublicErrors(): MethodDecorator {
  return ApiStandardErrors(400, 409, 422, 500);
}
