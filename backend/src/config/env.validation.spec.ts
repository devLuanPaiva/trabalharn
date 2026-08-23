import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  function buildRawEnv(overrides: Record<string, string> = {}) {
    return {
      NODE_ENV: 'development',
      PORT: '3001',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_USERNAME: 'postgres',
      DB_PASSWORD: 'postgres',
      DB_NAME: 'postgres',
      DB_SSL: 'false',
      ...overrides,
    };
  }

  it('parses and coerces valid environment variables coming from .env as strings', () => {
    const result = validateEnv(buildRawEnv());

    expect(result.PORT).toBe(3001);
    expect(typeof result.PORT).toBe('number');
    expect(result.DB_PORT).toBe(5432);
    expect(typeof result.DB_PORT).toBe('number');
    expect(result.DB_HOST).toBe('localhost');
  });

  it('falls back to the default PORT when it is not provided', () => {
    const raw = buildRawEnv();
    delete (raw as Record<string, string | undefined>).PORT;

    const result = validateEnv(raw);

    expect(result.PORT).toBe(3001);
  });

  it('does not throw when DB_* variables are omitted in favor of DATABASE_URL', () => {
    const raw = buildRawEnv({ DATABASE_URL: 'postgres://user:pass@host:5432/db' });
    delete (raw as Record<string, string | undefined>).DB_HOST;
    delete (raw as Record<string, string | undefined>).DB_USERNAME;
    delete (raw as Record<string, string | undefined>).DB_PASSWORD;
    delete (raw as Record<string, string | undefined>).DB_NAME;

    expect(() => validateEnv(raw)).not.toThrow();
  });

  it('throws when DB_PORT is not a valid integer', () => {
    const raw = buildRawEnv({ DB_PORT: 'not-a-number' });

    expect(() => validateEnv(raw)).toThrow('Invalid environment variables');
  });

  it('throws when NODE_ENV is not one of the allowed values', () => {
    const raw = buildRawEnv({ NODE_ENV: 'staging' });

    expect(() => validateEnv(raw)).toThrow('Invalid environment variables');
  });
});
