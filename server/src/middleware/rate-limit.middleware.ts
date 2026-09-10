import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const requestRateLimiter = rateLimit({
  windowMs: env.requestRateLimitWindowMs,
  limit: env.requestRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});

export const uploadRateLimiter = rateLimit({
  windowMs: env.uploadRateLimitWindowMs,
  limit: env.uploadRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Upload limit reached for this network. Please try again later.' },
});

export const downloadRateLimiter = rateLimit({
  windowMs: env.downloadRateLimitWindowMs,
  limit: env.downloadRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Download limit reached for this network. Please try again later.' },
});
