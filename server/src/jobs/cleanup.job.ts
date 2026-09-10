import cron from 'node-cron';
import { cleanupExpiredFiles } from '../services/file.service.js';

export const startCleanupJob = (): void => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await cleanupExpiredFiles();
      console.info(JSON.stringify({ event: 'cleanup_completed', ...result }));
    } catch (error) {
      console.error(JSON.stringify({ event: 'cleanup_job_failure', error: String(error) }));
    }
  });
};
