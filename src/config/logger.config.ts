import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export function getLoggerConfig(configService: ConfigService): Params {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const logLevel = configService.get<string>('LOG_LEVEL', 'info');

  return {
    pinoHttp: {
      level: logLevel,
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.passwordHash',
        ],
        remove: true,
      },
      customProps: () => ({
        context: 'HTTP',
      }),
      serializers: {
        req(req: {
          id?: string;
          method?: string;
          url?: string;
          remoteAddress?: string;
        }) {
          return {
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
          };
        },
        res(res: { statusCode?: number }) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
      autoLogging: {
        ignore: (req) => req.url?.includes('/api/docs') ?? false,
      },
    },
  };
}
