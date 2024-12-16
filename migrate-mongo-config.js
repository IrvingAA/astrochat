const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

console.log('RUNNING_IN_DOCKER:', process.env.RUNNING_IN_DOCKER);
console.log('MONGO_URI_LOCAL:', process.env.MONGO_URI_LOCAL);
console.log('MONGO_URI_DOCKER:', process.env.MONGO_URI_DOCKER);

const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';

const config = {
  mongodb: {
    url: isRunningInDocker
      ? process.env.MONGO_URI_DOCKER
      : process.env.MONGO_URI_LOCAL,
    databaseName: 'astrochat',
    options: {},
  },
  migrationsDir: 'src/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

console.log('MongoDB URL:', config.mongodb.url); // Confirmar URL cargada
module.exports = config;
