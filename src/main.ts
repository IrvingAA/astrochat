import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ApiExceptionFilter } from './common/filters/api-exception.filter'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { AllExceptionsFilter } from './filters/all-exceptions.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api', {
    exclude: ['/', 'graphql']
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(
    new ApiExceptionFilter(),
    new GlobalExceptionFilter(),
    new AllExceptionsFilter(),
    new HttpExceptionFilter()
  )

  app.enableCors()

  await app.listen(3000)
  console.log('Application is running on http://localhost:3000')
}
bootstrap()
