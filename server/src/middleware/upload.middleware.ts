import multer from 'multer';
import { maxFileSizeBytes } from '../config/env.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSizeBytes, files: 1 },
});
