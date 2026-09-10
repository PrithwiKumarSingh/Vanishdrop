import crypto from 'node:crypto';
import { env } from '../config/env.js';

export const createDeleteToken = (): string => crypto.randomBytes(32).toString('base64url');

export const hashDeleteToken = (token: string): string =>
  crypto.createHmac('sha256', env.tokenSecret).update(token).digest('hex');

export const tokensMatch = (providedToken: string, storedHash: string): boolean => {
  const providedHash = hashDeleteToken(providedToken);
  const providedBuffer = Buffer.from(providedHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  return providedBuffer.length === storedBuffer.length && crypto.timingSafeEqual(providedBuffer, storedBuffer);
};
