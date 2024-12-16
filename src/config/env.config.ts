import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.RUNNING_IN_DOCKER === 'true'
    ? process.env.MONGO_URI_DOCKER
    : process.env.MONGO_URI_LOCAL,
  PORT: process.env.PORT || '3000',
};

if (!env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}
