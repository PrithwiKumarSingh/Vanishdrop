import 'dotenv/config';
import path from 'node:path';

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numberFromEnv(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/VanishDrop',
  maxFileSizeMb: numberFromEnv(process.env.MAX_FILE_SIZE_MB, 10),
  expirationHours: numberFromEnv(process.env.FILE_EXPIRATION_HOURS, 12),
  deleteLockMinutes: numberFromEnv(process.env.DELETE_LOCK_MINUTES, 5),
  uploadRateLimit: numberFromEnv(process.env.UPLOAD_RATE_LIMIT, 10),
  uploadRateLimitWindowMs: numberFromEnv(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS, 3_600_000),
  requestRateLimit: numberFromEnv(process.env.REQUEST_RATE_LIMIT, 240),
  requestRateLimitWindowMs: numberFromEnv(process.env.REQUEST_RATE_LIMIT_WINDOW_MS, 900_000),
  downloadRateLimit: numberFromEnv(process.env.DOWNLOAD_RATE_LIMIT, 120),
  downloadRateLimitWindowMs: numberFromEnv(process.env.DOWNLOAD_RATE_LIMIT_WINDOW_MS, 3_600_000),
  storageProvider: process.env.STORAGE_PROVIDER ?? 'supabase',
  localStoragePath: path.resolve(process.cwd(), process.env.LOCAL_STORAGE_PATH ?? './uploads'),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  supabaseBucket: process.env.SUPABASE_BUCKET ?? 'VanishDrop-files',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  tokenSecret: process.env.TOKEN_SECRET ?? 'development-only-change-me',
};

export const maxFileSizeBytes = env.maxFileSizeMb * 1024 * 1024;
