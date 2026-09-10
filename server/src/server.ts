import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { startCleanupJob } from './jobs/cleanup.job.js';

const start = async (): Promise<void> => {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => {
    console.info(JSON.stringify({ event: 'server_started', port: env.port, environment: env.nodeEnv }));
  });
  startCleanupJob();
};

start().catch((error: unknown) => {
  console.error(JSON.stringify({ event: 'server_start_failure', error: String(error) }));
  process.exit(1);
});
