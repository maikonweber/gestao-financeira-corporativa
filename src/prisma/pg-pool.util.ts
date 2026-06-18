import { Pool, PoolConfig } from 'pg';

function stripSslParams(connectionString: string): string {
  return connectionString
    .replace(/([?&])sslmode=[^&]*/g, (_, prefix) => (prefix === '?' ? '?' : ''))
    .replace(/([?&])ssl=[^&]*/g, (_, prefix) => (prefix === '?' ? '?' : ''))
    .replace(/\?&/, '?')
    .replace(/\?$/, '');
}

export function createPgPool(connectionString: string): Pool {
  const sanitized = stripSslParams(connectionString);
  const requiresSsl =
    !sanitized.includes('localhost') &&
    !sanitized.includes('127.0.0.1');

  const poolConfig: PoolConfig = { connectionString: sanitized };

  if (requiresSsl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return new Pool(poolConfig);
}
