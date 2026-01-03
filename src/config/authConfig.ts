import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret:
    process.env.AUTH_SECRET || 'default-secret-key-change-in-production',
  jwtExpiresIn: process.env.AUTH_EXPIRES_IN || '1d',
}));
