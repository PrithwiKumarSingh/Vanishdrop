import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  console.info(JSON.stringify({ event: 'database_connected', database: mongoose.connection.name }));
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
