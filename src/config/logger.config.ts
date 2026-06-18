import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import type { TransportTargetOptions } from 'pino';

function getPrettyTransport(): TransportTargetOptions | undefined {
  if (process.env.NODE_ENV === 'development') {
    try {
      require.resolve('pino-pretty');
      return {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function getLoggerConfig(configService: ConfigService): Params {
  const logLevel = configService.get<string>('LOG_LEVEL', 'info');
  const transport = getPrettyTransport();

  return {
    pinoHttp: {
      level: logLevel,
      ...(transport ? { transport } : {}),
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
