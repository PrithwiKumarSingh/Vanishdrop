import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { requestRateLimiter } from './middleware/rate-limit.middleware.js';
import { fileRouter } from './routes/file.routes.js';

export const createApp = () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'tiny'));
  app.use('/api', requestRateLimiter);

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  app.use('/api/files', fileRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};
