import { Router } from 'express';
import { download, getFiles, remove, upload } from '../controllers/file.controller.js';
import { downloadRateLimiter, uploadRateLimiter } from '../middleware/rate-limit.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

export const fileRouter = Router();

fileRouter.get('/', getFiles);
fileRouter.post('/', uploadRateLimiter, uploadMiddleware.single('file'), upload);
fileRouter.get('/:id/download', downloadRateLimiter, download);
fileRouter.delete('/:id', remove);
