import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { ApiResponse, HttpEnum, AlertEnum } from '../api-response'

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception.getResponse instanceof Function
        ? exception.getResponse()
        : exception.message

    const apiResponse = new ApiResponse(
      status as HttpEnum,
      typeof message === 'object' ? message['message'] || 'Error' : message,
      AlertEnum.ERROR,
      null
    )

    response.status(status).json(apiResponse)
  }
}
