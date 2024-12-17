const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true'

const config = {
  mongodb: {
    url: isRunningInDocker
      ? process.env.MONGO_URI_DOCKER
      : process.env.MONGO_URI_LOCAL,
    databaseName: 'astrochat',
    options: {}
  },
  migrationsDir: 'src/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs'
}

console.info('MongoDB URL:', config.mongodb.url)
module.exports = config
