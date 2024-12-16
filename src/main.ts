import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ApiExceptionFilter } from './common/filters/api-exception.filter'
import * as dotenv from 'dotenv'
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new ApiExceptionFilter())
  await app.listen(3000)
  console.log('Application is running on http://localhost:3000')
}
bootstrap()
