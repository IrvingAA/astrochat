declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      MONGO_URI_LOCAL: string;
      MONGO_URI_DOCKER: string;
      RUNNING_IN_DOCKER?: 'true' | 'false';
      PORT?: string;
      JWT_SECRET: string;
    }
  }
  